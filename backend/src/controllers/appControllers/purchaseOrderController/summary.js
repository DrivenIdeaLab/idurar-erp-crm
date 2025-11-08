/**
 * Get purchase order summary statistics
 * @route GET /purchaseorder/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { supplier, status, startDate, endDate } = req.query;

    // Build filter
    const filter = { removed: false };

    if (supplier) {
      filter.supplier = supplier;
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.orderDate = {};
      if (startDate) {
        filter.orderDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.orderDate.$lte = new Date(endDate);
      }
    }

    // Total purchase orders
    const totalPOs = await Model.countDocuments(filter);

    // POs by status
    const posByStatus = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$total' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // POs by supplier
    const posBySupplier = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$supplier',
          count: { $sum: 1 },
          totalValue: { $sum: '$total' },
          totalPaid: { $sum: '$paidAmount' },
        },
      },
      { $sort: { totalValue: -1 } },
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
          totalPaid: 1,
          outstanding: { $subtract: ['$totalValue', '$totalPaid'] },
        },
      },
    ]);

    // POs by month
    const posByMonth = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$total' },
          totalPaid: { $sum: '$paidAmount' },
        },
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
        },
      },
      { $limit: 12 },
    ]);

    // Calculate totals
    const totals = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$total' },
          totalPaid: { $sum: '$paidAmount' },
          totalSubtotal: { $sum: '$subtotal' },
          totalTax: { $sum: '$taxAmount' },
          totalShipping: { $sum: '$shippingCost' },
        },
      },
    ]);

    // Recent purchase orders
    const recentPOs = await Model.find(filter)
      .sort({ orderDate: -1 })
      .limit(10)
      .populate('supplier', 'companyName contactPerson')
      .select('poNumber orderDate status total paidAmount supplier expectedDeliveryDate');

    // Pending deliveries (sent or confirmed but not received)
    const pendingDeliveries = await Model.find({
      ...filter,
      status: { $in: ['sent', 'confirmed', 'partially_received'] },
    })
      .sort({ expectedDeliveryDate: 1 })
      .limit(10)
      .populate('supplier', 'companyName contactPerson phone')
      .select('poNumber orderDate status total expectedDeliveryDate supplier');

    // Overdue deliveries
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueDeliveries = await Model.find({
      ...filter,
      status: { $in: ['sent', 'confirmed', 'partially_received'] },
      expectedDeliveryDate: { $lt: today },
    })
      .sort({ expectedDeliveryDate: 1 })
      .populate('supplier', 'companyName contactPerson phone')
      .select('poNumber orderDate status total expectedDeliveryDate supplier');

    // Payment status summary
    const paymentSummary = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalValue: { $sum: '$total' },
          totalPaid: { $sum: '$paidAmount' },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      result: {
        overview: {
          totalPOs,
          ...(totals[0] || {
            totalValue: 0,
            totalPaid: 0,
            totalSubtotal: 0,
            totalTax: 0,
            totalShipping: 0,
          }),
          totalOutstanding:
            (totals[0]?.totalValue || 0) - (totals[0]?.totalPaid || 0),
        },
        posByStatus,
        posBySupplier,
        posByMonth,
        paymentSummary,
        recentPOs,
        pendingDeliveries: {
          count: pendingDeliveries.length,
          items: pendingDeliveries,
        },
        overdueDeliveries: {
          count: overdueDeliveries.length,
          items: overdueDeliveries,
        },
      },
      message: 'Purchase order summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving purchase order summary',
    });
  }
};

module.exports = summary;
