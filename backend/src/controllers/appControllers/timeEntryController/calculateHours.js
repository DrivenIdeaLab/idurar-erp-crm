/**
 * Calculate hours worked for an employee over a period
 * @route GET /timeentry/calculate-hours
 */
const calculateHours = async (Model, req, res) => {
  try {
    const { employee, startDate, endDate } = req.query;

    if (!employee || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Employee ID, start date, and end date are required',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Find all clock-out entries for the period (these contain hour calculations)
    const timeEntries = await Model.find({
      employee: employee,
      entryType: 'clock_out',
      timestamp: { $gte: start, $lte: end },
      status: { $in: ['approved', 'adjusted'] },
      removed: false,
    }).sort({ timestamp: 1 });

    // Calculate totals
    let totalHours = 0;
    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    let totalDoubleTimeHours = 0;
    let totalBreakDuration = 0;
    const dailyBreakdown = [];

    timeEntries.forEach((entry) => {
      totalHours += entry.hoursWorked || 0;
      totalRegularHours += entry.regularHours || 0;
      totalOvertimeHours += entry.overtimeHours || 0;
      totalDoubleTimeHours += entry.doubleTimeHours || 0;
      totalBreakDuration += entry.breakDuration || 0;

      dailyBreakdown.push({
        date: entry.timestamp.toISOString().split('T')[0],
        clockIn: entry.clockInTime,
        clockOut: entry.clockOutTime,
        hoursWorked: entry.hoursWorked,
        regularHours: entry.regularHours,
        overtimeHours: entry.overtimeHours,
        doubleTimeHours: entry.doubleTimeHours,
        breakDuration: entry.breakDuration,
      });
    });

    // Get employee details for pay calculation
    const mongoose = require('mongoose');
    const Employee = mongoose.model('Employee');
    const employeeRecord = await Employee.findById(employee).select(
      'employeeNumber firstName lastName payType payRate'
    );

    let estimatedPay = 0;
    if (employeeRecord && employeeRecord.payRate) {
      if (employeeRecord.payType === 'hourly') {
        estimatedPay =
          totalRegularHours * employeeRecord.payRate +
          totalOvertimeHours * employeeRecord.payRate * 1.5 +
          totalDoubleTimeHours * employeeRecord.payRate * 2;
      } else if (employeeRecord.payType === 'salary') {
        estimatedPay = employeeRecord.payRate; // Assuming payRate is annual salary
      }
    }

    return res.status(200).json({
      success: true,
      result: {
        employee: employeeRecord,
        period: {
          startDate: start,
          endDate: end,
          days: timeEntries.length,
        },
        hours: {
          totalHours: Math.round(totalHours * 100) / 100,
          regularHours: Math.round(totalRegularHours * 100) / 100,
          overtimeHours: Math.round(totalOvertimeHours * 100) / 100,
          doubleTimeHours: Math.round(totalDoubleTimeHours * 100) / 100,
          breakDuration: Math.round(totalBreakDuration),
        },
        estimatedPay: Math.round(estimatedPay * 100) / 100,
        dailyBreakdown: dailyBreakdown,
      },
      message: 'Hours calculated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error calculating hours',
    });
  }
};

module.exports = calculateHours;
