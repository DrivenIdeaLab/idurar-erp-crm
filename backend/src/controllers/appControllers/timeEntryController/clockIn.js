const mongoose = require('mongoose');

/**
 * Clock in an employee
 * @route POST /timeentry/clock-in
 */
const clockIn = async (Model, req, res) => {
  try {
    const {
      employee,
      pin,
      location,
      deviceId,
      method = 'web',
      scheduledShiftStart,
      scheduledShiftEnd,
    } = req.body;

    if (!employee) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Employee ID is required',
      });
    }

    // Check if employee exists
    const Employee = mongoose.model('Employee');
    const employeeRecord = await Employee.findOne({
      _id: employee,
      removed: false,
      isActive: true,
    });

    if (!employeeRecord) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Employee not found or inactive',
      });
    }

    // Verify PIN if provided
    if (pin && employeeRecord.clockPin) {
      const bcrypt = require('bcryptjs');
      const pinValid = await bcrypt.compare(pin, employeeRecord.clockPin);
      if (!pinValid) {
        return res.status(401).json({
          success: false,
          result: null,
          message: 'Invalid PIN',
        });
      }
    }

    // Check if already clocked in
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingClockIn = await Model.findOne({
      employee: employee,
      entryType: 'clock_in',
      timestamp: { $gte: today },
      removed: false,
    }).sort({ timestamp: -1 });

    if (existingClockIn) {
      // Check if there's a matching clock_out
      const clockOut = await Model.findOne({
        employee: employee,
        entryType: 'clock_out',
        timestamp: { $gt: existingClockIn.timestamp },
        removed: false,
      });

      if (!clockOut) {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Employee is already clocked in. Please clock out first.',
        });
      }
    }

    // Create clock-in entry
    const timestamp = new Date();
    const timeEntry = await Model.create({
      employee: employee,
      entryType: 'clock_in',
      timestamp: timestamp,
      location: location,
      deviceId: deviceId,
      method: method,
      scheduledShiftStart: scheduledShiftStart,
      scheduledShiftEnd: scheduledShiftEnd,
      status: 'approved', // Auto-approve clock-ins
    });

    // Populate employee data
    await timeEntry.populate('employee', 'employeeNumber firstName lastName position');

    return res.status(200).json({
      success: true,
      result: {
        timeEntry: {
          _id: timeEntry._id,
          employee: timeEntry.employee,
          entryType: timeEntry.entryType,
          timestamp: timeEntry.timestamp,
          isLate: timeEntry.isLate,
          lateMinutes: timeEntry.lateMinutes,
          scheduledShiftStart: timeEntry.scheduledShiftStart,
        },
      },
      message: `Clocked in successfully at ${timestamp.toLocaleTimeString()}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error clocking in',
    });
  }
};

module.exports = clockIn;
