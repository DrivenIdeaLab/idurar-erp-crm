/**
 * Get reorder suggestions for parts
 * @route GET /part/reorder
 */
const reorder = async (Model, req, res) => {
  try {
    const { category, supplier } = req.query;

    // Build filter for parts that need reordering
    const filter = {
      removed: false,
      isActive: true,
      isDiscontinued: false,
      $or: [{ outOfStock: true }, { lowStockAlert: true }],
    };

    if (category) {
      filter.category = category;
    }

    if (supplier) {
      filter.supplier = supplier;
    }

    // Find parts that need reordering
    const parts = await Model.find(filter)
      .populate('supplier', 'companyName contactPerson phone email paymentTerms')
      .sort({ quantityOnHand: 1 });

    // Group by supplier for easier ordering
    const bySupplier = {};
    let totalParts = 0;
    let totalEstimatedCost = 0;

    parts.forEach((part) => {
      const supplierId = part.supplier?._id?.toString() || 'no_supplier';
      const supplierName = part.supplier?.companyName || 'No Supplier';

      if (!bySupplier[supplierId]) {
        bySupplier[supplierId] = {
          supplier: part.supplier || { companyName: 'No Supplier' },
          parts: [],
          totalCost: 0,
          totalParts: 0,
        };
      }

      const quantityToOrder = part.reorderQuantity || part.reorderPoint * 2;
      const estimatedCost = quantityToOrder * part.costPrice;

      bySupplier[supplierId].parts.push({
        _id: part._id,
        partNumber: part.partNumber,
        name: part.name,
        description: part.description,
        category: part.category,
        quantityOnHand: part.quantityOnHand,
        quantityReserved: part.quantityReserved,
        quantityAvailable: part.quantityAvailable,
        reorderPoint: part.reorderPoint,
        reorderQuantity: part.reorderQuantity,
        recommendedOrderQuantity: quantityToOrder,
        unitCost: part.costPrice,
        estimatedCost: estimatedCost,
        outOfStock: part.outOfStock,
        lowStockAlert: part.lowStockAlert,
        supplierPartNumber: part.supplierPartNumber,
      });

      bySupplier[supplierId].totalCost += estimatedCost;
      bySupplier[supplierId].totalParts += 1;
      totalParts += 1;
      totalEstimatedCost += estimatedCost;
    });

    // Convert to array
    const supplierGroups = Object.values(bySupplier).sort((a, b) => {
      // Sort by total cost descending
      return b.totalCost - a.totalCost;
    });

    return res.status(200).json({
      success: true,
      result: {
        summary: {
          totalParts: totalParts,
          totalEstimatedCost: totalEstimatedCost,
          totalSuppliers: supplierGroups.length,
          outOfStock: parts.filter((p) => p.outOfStock).length,
          lowStock: parts.filter((p) => !p.outOfStock && p.lowStockAlert).length,
        },
        bySupplier: supplierGroups,
        allParts: parts.map((part) => ({
          _id: part._id,
          partNumber: part.partNumber,
          name: part.name,
          category: part.category,
          supplier: part.supplier?.companyName,
          quantityOnHand: part.quantityOnHand,
          reorderPoint: part.reorderPoint,
          recommendedOrderQuantity: part.reorderQuantity || part.reorderPoint * 2,
          estimatedCost: (part.reorderQuantity || part.reorderPoint * 2) * part.costPrice,
          status: part.outOfStock ? 'out_of_stock' : 'low_stock',
        })),
      },
      message: 'Reorder suggestions retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error generating reorder suggestions',
    });
  }
};

module.exports = reorder;
