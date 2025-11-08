/**
 * Get service record summary statistics
 * @route GET /servicerecord/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { vehicle, customer, startDate, endDate } = req.query;

    const filter = { removed: false };

    if (vehicle) filter.vehicle = vehicle;
    if (customer) filter.customer = customer;
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    // Total service records
    const totalServices = await Model.countDocuments(filter);

    // Services by status
    const servicesByStatus = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Services by type
    const servicesByType = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          averageCost: { $avg: '$total' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Revenue by month
    const revenueByMonth = await Model.aggregate([
      { $match: { ...filter, status: { $in: ['completed', 'invoiced'] } } },
      {
        $group: {
          _id: {
            year: { $year: '$completionDate' },
            month: { $month: '$completionDate' },
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    // Top technicians
    const topTechnicians = await Model.aggregate([
      { $match: { ...filter, status: 'completed' } },
      { $match: { technician: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$technician',
          servicesCompleted: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
        },
      },
      { $sort: { servicesCompleted: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'admins',
          localField: '_id',
          foreignField: '_id',
          as: 'technicianDetails',
        },
      },
      {
        $unwind: {
          path: '$technicianDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          technician: {
            _id: '$_id',
            name: '$technicianDetails.name',
            email: '$technicianDetails.email',
          },
          servicesCompleted: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // Recent services
    const recentServices = await Model.find(filter)
      .sort({ created: -1 })
      .limit(10)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'vin make model year')
      .populate('technician', 'name');

    // Average service time (completion - check-in)
    const avgServiceTime = await Model.aggregate([
      {
        $match: {
          ...filter,
          status: 'completed',
          checkInDate: { $exists: true },
          completionDate: { $exists: true },
        },
      },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ['$completionDate', '$checkInDate'] },
              1000 * 60 * 60, // Convert to hours
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          averageHours: { $avg: '$duration' },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      result: {
        totalServices,
        servicesByStatus,
        servicesByType,
        revenueByMonth,
        topTechnicians,
        recentServices,
        averageServiceTimeHours: avgServiceTime[0]?.averageHours || 0,
      },
      message: 'Service record summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving service record summary',
    });
  }
};

module.exports = summary;
