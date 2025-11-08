/**
 * Get part inventory summary statistics
 * @route GET /part/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { category, supplier } = req.query;

    const filter = { removed: false, isActive: true };
    if (category) {
      filter.category = category;
    }
    if (supplier) {
      filter.supplier = supplier;
    }

    // Total parts
    const totalParts = await Model.countDocuments(filter);

    // Active vs discontinued
    const activeParts = await Model.countDocuments({ ...filter, isDiscontinued: false });
    const discontinuedParts = await Model.countDocuments({ ...filter, isDiscontinued: true });

    // Stock status counts
    const outOfStockCount = await Model.countDocuments({ ...filter, outOfStock: true });
    const lowStockCount = await Model.countDocuments({
      ...filter,
      outOfStock: false,
      lowStockAlert: true,
    });
    const inStockCount = totalParts - outOfStockCount - lowStockCount;

    // Parts by category
    const partsByCategory = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: {
            $sum: { $multiply: ['$quantityOnHand', '$costPrice'] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Parts by supplier
    const partsBySupplier = await Model.aggregate([
      { $match: { ...filter, supplier: { $ne: null } } },
      {
        $group: {
          _id: '$supplier',
          count: { $sum: 1 },
          totalValue: {
            $sum: { $multiply: ['$quantityOnHand', '$costPrice'] },
          },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplierDetails',
        },
      },
      {
        $unwind: {
          path: '$supplierDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          supplier: {
            _id: '$_id',
            companyName: '$supplierDetails.companyName',
          },
          count: 1,
          totalValue: 1,
        },
      },
    ]);

    // Total inventory value
    const inventoryValue = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCostValue: {
            $sum: { $multiply: ['$quantityOnHand', '$costPrice'] },
          },
          totalSellValue: {
            $sum: { $multiply: ['$quantityOnHand', '$sellPrice'] },
          },
          totalPotentialProfit: {
            $sum: {
              $multiply: ['$quantityOnHand', { $subtract: ['$sellPrice', '$costPrice'] }],
            },
          },
        },
      },
    ]);

    // Top parts by quantity
    const topPartsByQuantity = await Model.find(filter)
      .sort({ quantityOnHand: -1 })
      .limit(10)
      .select('partNumber name category quantityOnHand costPrice')
      .populate('supplier', 'companyName');

    // Top parts by value
    const topPartsByValue = await Model.aggregate([
      { $match: filter },
      {
        $addFields: {
          totalValue: { $multiply: ['$quantityOnHand', '$costPrice'] },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: 10 },
      {
        $project: {
          partNumber: 1,
          name: 1,
          category: 1,
          quantityOnHand: 1,
          costPrice: 1,
          totalValue: 1,
        },
      },
    ]);

    // Recently added parts
    const recentParts = await Model.find(filter)
      .sort({ created: -1 })
      .limit(5)
      .select('partNumber name category quantityOnHand costPrice created')
      .populate('supplier', 'companyName');

    // Low stock alerts
    const lowStockParts = await Model.find({
      ...filter,
      $or: [{ outOfStock: true }, { lowStockAlert: true }],
    })
      .sort({ quantityOnHand: 1 })
      .limit(10)
      .select('partNumber name quantityOnHand reorderPoint reorderQuantity')
      .populate('supplier', 'companyName');

    return res.status(200).json({
      success: true,
      result: {
        overview: {
          totalParts,
          activeParts,
          discontinuedParts,
          inStock: inStockCount,
          lowStock: lowStockCount,
          outOfStock: outOfStockCount,
        },
        inventoryValue: inventoryValue[0] || {
          totalCostValue: 0,
          totalSellValue: 0,
          totalPotentialProfit: 0,
        },
        partsByCategory,
        partsBySupplier,
        topPartsByQuantity,
        topPartsByValue,
        recentParts,
        lowStockAlerts: lowStockParts,
      },
      message: 'Part inventory summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving part summary',
    });
  }
};

module.exports = summary;
