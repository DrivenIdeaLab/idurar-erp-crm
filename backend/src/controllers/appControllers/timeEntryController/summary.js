/**
 * Get time entry summary statistics
 * @route GET /timeentry/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { employee, startDate, endDate } = req.query;

    const filter = { removed: false, entryType: 'clock_out' };

    if (employee) {
      filter.employee = employee;
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = end;
      }
    }

    // Total time entries
    const totalEntries = await Model.countDocuments(filter);

    // Pending approvals
    const pendingApprovals = await Model.countDocuments({
      ...filter,
      status: 'pending',
    });

    // Time entries by status
    const entriesByStatus = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$hoursWorked' },
        },
      },
    ]);

    // Hours by employee
    const hoursByEmployee = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$employee',
          totalHours: { $sum: '$hoursWorked' },
          regularHours: { $sum: '$regularHours' },
          overtimeHours: { $sum: '$overtimeHours' },
          doubleTimeHours: { $sum: '$doubleTimeHours' },
          daysWorked: { $sum: 1 },
        },
      },
      { $sort: { totalHours: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employeeDetails',
        },
      },
      {
        $unwind: {
          path: '$employeeDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          employee: {
            _id: '$_id',
            employeeNumber: '$employeeDetails.employeeNumber',
            firstName: '$employeeDetails.firstName',
            lastName: '$employeeDetails.lastName',
          },
          totalHours: 1,
          regularHours: 1,
          overtimeHours: 1,
          doubleTimeHours: 1,
          daysWorked: 1,
        },
      },
    ]);

    // Total hours calculated
    const totalHours = await Model.aggregate([
      { $match: { ...filter, status: { $in: ['approved', 'adjusted'] } } },
      {
        $group: {
          _id: null,
          totalHours: { $sum: '$hoursWorked' },
          totalRegularHours: { $sum: '$regularHours' },
          totalOvertimeHours: { $sum: '$overtimeHours' },
          totalDoubleTimeHours: { $sum: '$doubleTimeHours' },
        },
      },
    ]);

    // Late clock-ins
    const lateClockIns = await Model.countDocuments({
      removed: false,
      entryType: 'clock_in',
      isLate: true,
      ...(startDate || endDate ? { timestamp: filter.timestamp } : {}),
    });

    // Recent time entries
    const recentEntries = await Model.find(filter)
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('employee', 'employeeNumber firstName lastName position');

    // Hours by day of week
    const hoursByDayOfWeek = await Model.aggregate([
      { $match: { ...filter, status: { $in: ['approved', 'adjusted'] } } },
      {
        $group: {
          _id: { $dayOfWeek: '$timestamp' },
          totalHours: { $sum: '$hoursWorked' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      result: {
        overview: {
          totalEntries,
          pendingApprovals,
          lateClockIns,
          ...(totalHours[0] || {
            totalHours: 0,
            totalRegularHours: 0,
            totalOvertimeHours: 0,
            totalDoubleTimeHours: 0,
          }),
        },
        entriesByStatus,
        hoursByEmployee,
        hoursByDayOfWeek,
        recentEntries,
      },
      message: 'Time entry summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving time entry summary',
    });
  }
};

module.exports = summary;
