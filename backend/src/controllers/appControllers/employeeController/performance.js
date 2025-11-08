const mongoose = require('mongoose');

/**
 * Get employee performance metrics
 * @route GET /employee/performance/:id
 */
const performance = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Find employee
    const employee = await Model.findOne({ _id: id, removed: false });

    if (!employee) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Employee not found',
      });
    }

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

    const ServiceRecord = mongoose.model('ServiceRecord');

    // Get service records for this employee
    const serviceRecords = await ServiceRecord.find({
      assignedTo: employee.admin, // Assuming assignedTo refers to Admin
      removed: false,
      ...dateFilter,
    });

    // Calculate metrics
    const jobsCompleted = serviceRecords.filter(
      (sr) => sr.status === 'completed' || sr.status === 'invoiced'
    ).length;

    const totalRevenue = serviceRecords.reduce((sum, sr) => {
      if (sr.status === 'completed' || sr.status === 'invoiced') {
        return sum + (sr.totalAmount || 0);
      }
      return sum;
    }, 0);

    const averageJobValue = jobsCompleted > 0 ? totalRevenue / jobsCompleted : 0;

    // Calculate efficiency (actual hours vs estimated hours)
    let totalEstimatedHours = 0;
    let totalActualHours = 0;

    serviceRecords.forEach((sr) => {
      if (sr.estimatedHours) {
        totalEstimatedHours += sr.estimatedHours;
      }
      if (sr.actualHours) {
        totalActualHours += sr.actualHours;
      }
    });

    const efficiencyRate =
      totalEstimatedHours > 0 ? (totalEstimatedHours / totalActualHours) * 100 : 0;

    // Calculate rework percentage
    const reworkJobs = serviceRecords.filter((sr) => sr.isRework || sr.hasComeback).length;
    const reworkPercentage = jobsCompleted > 0 ? (reworkJobs / jobsCompleted) * 100 : 0;

    // Customer satisfaction (if available)
    const ratedServices = serviceRecords.filter((sr) => sr.customerRating);
    const customerSatisfaction =
      ratedServices.length > 0
        ? ratedServices.reduce((sum, sr) => sum + sr.customerRating, 0) / ratedServices.length
        : 0;

    // Get time entries
    const TimeEntry = mongoose.model('TimeEntry');
    const timeEntries = await TimeEntry.find({
      employee: id,
      entryType: 'clock_out',
      status: { $in: ['approved', 'adjusted'] },
      removed: false,
      ...dateFilter,
    });

    const totalHoursWorked = timeEntries.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0);
    const overtimeHours = timeEntries.reduce((sum, entry) => sum + (entry.overtimeHours || 0), 0);

    // Get certifications
    const Certification = mongoose.model('Certification');
    const certifications = await Certification.find({
      employee: id,
      removed: false,
      enabled: true,
    });

    const activeCertifications = certifications.filter((cert) => cert.status === 'active').length;
    const expiringCertifications = certifications.filter((cert) => cert.isExpiring).length;

    // Recent service records
    const recentServices = await ServiceRecord.find({
      assignedTo: employee.admin,
      removed: false,
    })
      .sort({ created: -1 })
      .limit(10)
      .populate('vehicle', 'make model year licensePlate')
      .populate('customer', 'name');

    // Monthly trend
    const monthlyPerformance = await ServiceRecord.aggregate([
      {
        $match: {
          assignedTo: employee.admin,
          removed: false,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$created' },
            month: { $month: '$created' },
          },
          jobsCompleted: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
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

    return res.status(200).json({
      success: true,
      result: {
        employee: {
          _id: employee._id,
          employeeNumber: employee.employeeNumber,
          fullName: employee.fullName,
          position: employee.position,
          hireDate: employee.hireDate,
        },
        metrics: {
          jobsCompleted,
          totalRevenue,
          averageJobValue: Math.round(averageJobValue * 100) / 100,
          efficiencyRate: Math.round(efficiencyRate * 10) / 10,
          customerSatisfaction: Math.round(customerSatisfaction * 10) / 10,
          reworkPercentage: Math.round(reworkPercentage * 10) / 10,
          totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
          overtimeHours: Math.round(overtimeHours * 100) / 100,
          activeCertifications,
          expiringCertifications,
        },
        monthlyPerformance,
        recentServices,
      },
      message: 'Employee performance retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving employee performance',
    });
  }
};

module.exports = performance;
