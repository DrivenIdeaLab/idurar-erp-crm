/**
 * Get inspection summary statistics
 * @route GET /inspection/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { vehicle, customer, startDate, endDate } = req.query;

    const filter = { removed: false };

    if (vehicle) filter.vehicle = vehicle;
    if (customer) filter.customer = customer;
    if (startDate || endDate) {
      filter.inspectionDate = {};
      if (startDate) filter.inspectionDate.$gte = new Date(startDate);
      if (endDate) filter.inspectionDate.$lte = new Date(endDate);
    }

    // Total inspections
    const totalInspections = await Model.countDocuments(filter);

    // Inspections by overall condition
    const byCondition = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$overallCondition',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Safety issues by severity
    const bySafetySeverity = await Model.aggregate([
      { $match: filter },
      { $unwind: '$safetyIssues' },
      {
        $group: {
          _id: '$safetyIssues.severity',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Customer approval rate
    const totalWithApproval = await Model.countDocuments({
      ...filter,
      customerApproval: { $in: ['approved', 'declined', 'partial'] },
    });
    const approved = await Model.countDocuments({
      ...filter,
      customerApproval: 'approved',
    });
    const approvalRate =
      totalWithApproval > 0 ? ((approved / totalWithApproval) * 100).toFixed(2) : 0;

    // Recent inspections
    const recentInspections = await Model.find(filter)
      .sort({ inspectionDate: -1 })
      .limit(10)
      .populate('customer', 'name email')
      .populate('vehicle', 'vin make model year')
      .populate('inspector', 'name');

    return res.status(200).json({
      success: true,
      result: {
        totalInspections,
        byCondition,
        bySafetySeverity,
        approvalRate: parseFloat(approvalRate),
        recentInspections,
      },
      message: 'Inspection summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving inspection summary',
    });
  }
};

module.exports = summary;
