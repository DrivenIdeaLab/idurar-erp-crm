/**
 * Get employee summary statistics
 * @route GET /employee/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { position, department, employmentStatus } = req.query;

    const filter = { removed: false };

    if (position) {
      filter.position = position;
    }

    if (department) {
      filter.department = department;
    }

    if (employmentStatus) {
      filter.employmentStatus = employmentStatus;
    } else {
      filter.employmentStatus = 'active'; // Default to active only
    }

    // Total employees
    const totalEmployees = await Model.countDocuments(filter);

    // By position
    const byPosition = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$position',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // By department
    const byDepartment = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
    ]);

    // By employment type
    const byEmploymentType = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$employmentType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Top performers
    const topPerformers = await Model.find(filter)
      .sort({ 'performanceMetrics.totalRevenue': -1 })
      .limit(10)
      .select(
        'employeeNumber firstName lastName position performanceMetrics.totalRevenue performanceMetrics.jobsCompleted performanceMetrics.customerSatisfaction'
      );

    // Recent hires (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const recentHires = await Model.find({
      ...filter,
      hireDate: { $gte: ninetyDaysAgo },
    })
      .sort({ hireDate: -1 })
      .select('employeeNumber firstName lastName position hireDate');

    // Anniversaries (employees hired this month/year)
    const today = new Date();
    const thisMonth = today.getMonth() + 1;

    const anniversaries = await Model.find(filter).select(
      'employeeNumber firstName lastName position hireDate'
    );

    const upcomingAnniversaries = anniversaries
      .filter((emp) => {
        const hireMonth = new Date(emp.hireDate).getMonth() + 1;
        return hireMonth === thisMonth;
      })
      .slice(0, 10);

    // Average metrics across all employees
    const aggregateMetrics = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          avgEfficiency: { $avg: '$performanceMetrics.efficiencyRate' },
          avgSatisfaction: { $avg: '$performanceMetrics.customerSatisfaction' },
          avgRework: { $avg: '$performanceMetrics.reworkPercentage' },
          totalRevenue: { $sum: '$performanceMetrics.totalRevenue' },
          totalJobs: { $sum: '$performanceMetrics.jobsCompleted' },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      result: {
        overview: {
          totalEmployees,
          ...(aggregateMetrics[0] || {
            avgEfficiency: 0,
            avgSatisfaction: 0,
            avgRework: 0,
            totalRevenue: 0,
            totalJobs: 0,
          }),
        },
        byPosition,
        byDepartment,
        byEmploymentType,
        topPerformers,
        recentHires: {
          count: recentHires.length,
          items: recentHires,
        },
        upcomingAnniversaries: {
          count: upcomingAnniversaries.length,
          items: upcomingAnniversaries,
        },
      },
      message: 'Employee summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving employee summary',
    });
  }
};

module.exports = summary;
