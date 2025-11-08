const mongoose = require('mongoose');

/**
 * Get executive dashboard metrics
 * @route GET /api/analytics/executive-dashboard
 */
const executiveDashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.created = {};
      if (startDate) {
        dateFilter.created.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.created.$lte = end;
      }
    }

    const Invoice = mongoose.model('Invoice');
    const ServiceRecord = mongoose.model('ServiceRecord');
    const Client = mongoose.model('Client');
    const Vehicle = mongoose.model('Vehicle');
    const Part = mongoose.model('Part');

    // Revenue metrics
    const revenueData = await Invoice.aggregate([
      { $match: { removed: false, status: { $in: ['paid', 'partially_paid'] }, ...dateFilter } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalPaid: { $sum: '$paidAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Revenue by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueByDay = await Invoice.aggregate([
      {
        $match: {
          removed: false,
          status: { $in: ['paid', 'partially_paid'] },
          created: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$created' },
            month: { $month: '$created' },
            day: { $dayOfMonth: '$created' },
          },
          revenue: { $sum: '$paidAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Service records stats
    const serviceStats = await ServiceRecord.aggregate([
      { $match: { removed: false, ...dateFilter } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Customer growth
    const customerCount = await Client.countDocuments({ removed: false });
    const newCustomers = await Client.countDocuments({
      removed: false,
      created: { $gte: thirtyDaysAgo },
    });

    // Vehicle count
    const vehicleCount = await Vehicle.countDocuments({ removed: false });

    // Top services by revenue
    const topServices = await ServiceRecord.aggregate([
      {
        $match: {
          removed: false,
          status: { $in: ['completed', 'invoiced'] },
          ...dateFilter,
        },
      },
      { $unwind: '$services' },
      {
        $group: {
          _id: '$services.serviceName',
          count: { $sum: 1 },
          revenue: { $sum: '$services.total' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    // Inventory value
    const inventoryValue = await Part.aggregate([
      { $match: { removed: false, isActive: true } },
      {
        $group: {
          _id: null,
          totalCostValue: {
            $sum: { $multiply: ['$quantityOnHand', '$costPrice'] },
          },
          totalSellValue: {
            $sum: { $multiply: ['$quantityOnHand', '$sellPrice'] },
          },
        },
      },
    ]);

    // Parts low stock count
    const lowStockCount = await Part.countDocuments({
      removed: false,
      isActive: true,
      $or: [{ outOfStock: true }, { lowStockAlert: true }],
    });

    return res.status(200).json({
      success: true,
      result: {
        revenue: {
          total: revenueData[0]?.totalRevenue || 0,
          paid: revenueData[0]?.totalPaid || 0,
          invoiceCount: revenueData[0]?.count || 0,
          trend: revenueByDay,
        },
        customers: {
          total: customerCount,
          new: newCustomers,
          growth: customerCount > 0 ? (newCustomers / customerCount) * 100 : 0,
        },
        vehicles: {
          total: vehicleCount,
        },
        services: {
          stats: serviceStats,
          topServices: topServices,
        },
        inventory: {
          value: inventoryValue[0] || { totalCostValue: 0, totalSellValue: 0 },
          lowStockCount,
        },
      },
      message: 'Executive dashboard data retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving dashboard data',
    });
  }
};

module.exports = executiveDashboard;
