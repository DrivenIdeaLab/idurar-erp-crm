const mongoose = require('mongoose');

/**
 * Update employee performance metrics
 * @route POST /employee/update-performance/:id
 */
const updatePerformance = async (Model, req, res) => {
  try {
    const { id } = req.params;

    const employee = await Model.findOne({ _id: id, removed: false });

    if (!employee) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Employee not found',
      });
    }

    const ServiceRecord = mongoose.model('ServiceRecord');

    // Get all service records for this employee
    const serviceRecords = await ServiceRecord.find({
      assignedTo: employee.admin,
      removed: false,
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

    // Calculate efficiency
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

    // Customer satisfaction
    const ratedServices = serviceRecords.filter((sr) => sr.customerRating);
    const customerSatisfaction =
      ratedServices.length > 0
        ? ratedServices.reduce((sum, sr) => sum + sr.customerRating, 0) / ratedServices.length
        : 0;

    // Update performance metrics
    employee.performanceMetrics = {
      jobsCompleted,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageJobValue: Math.round(averageJobValue * 100) / 100,
      efficiencyRate: Math.round(efficiencyRate * 10) / 10,
      customerSatisfaction: Math.round(customerSatisfaction * 10) / 10,
      reworkPercentage: Math.round(reworkPercentage * 10) / 10,
      lastUpdated: new Date(),
    };

    await employee.save();

    return res.status(200).json({
      success: true,
      result: {
        _id: employee._id,
        employeeNumber: employee.employeeNumber,
        fullName: employee.fullName,
        performanceMetrics: employee.performanceMetrics,
      },
      message: 'Performance metrics updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error updating performance metrics',
    });
  }
};

module.exports = updatePerformance;
