const mongoose = require('mongoose');

/**
 * Clock out an employee
 * @route POST /timeentry/clock-out
 */
const clockOut = async (Model, req, res) => {
  try {
    const { employee, pin, location, deviceId, method = 'web' } = req.body;

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

    // Find the most recent clock-in without a clock-out
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const clockInEntry = await Model.findOne({
      employee: employee,
      entryType: 'clock_in',
      timestamp: { $gte: today },
      removed: false,
    }).sort({ timestamp: -1 });

    if (!clockInEntry) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'No active clock-in found. Please clock in first.',
      });
    }

    // Check if already clocked out
    const existingClockOut = await Model.findOne({
      employee: employee,
      entryType: 'clock_out',
      timestamp: { $gt: clockInEntry.timestamp },
      removed: false,
    });

    if (existingClockOut) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Already clocked out.',
      });
    }

    const timestamp = new Date();
    const clockInTime = clockInEntry.timestamp;
    const clockOutTime = timestamp;

    // Calculate total break time
    const breaks = await Model.find({
      employee: employee,
      entryType: { $in: ['break_start', 'break_end'] },
      timestamp: { $gte: clockInTime, $lte: clockOutTime },
      removed: false,
    }).sort({ timestamp: 1 });

    let breakDuration = 0; // in minutes
    let breakStart = null;

    breaks.forEach((entry) => {
      if (entry.entryType === 'break_start') {
        breakStart = entry.timestamp;
      } else if (entry.entryType === 'break_end' && breakStart) {
        const breakMinutes = Math.floor((entry.timestamp - breakStart) / (1000 * 60));
        breakDuration += breakMinutes;
        breakStart = null;
      }
    });

    // Calculate hours worked
    const totalMinutes = Math.floor((clockOutTime - clockInTime) / (1000 * 60));
    const workMinutes = totalMinutes - breakDuration;
    const hoursWorked = workMinutes / 60;

    // Calculate regular and overtime hours (standard 8-hour day)
    let regularHours = 0;
    let overtimeHours = 0;
    let doubleTimeHours = 0;

    if (hoursWorked <= 8) {
      regularHours = hoursWorked;
    } else if (hoursWorked <= 12) {
      regularHours = 8;
      overtimeHours = hoursWorked - 8;
    } else {
      regularHours = 8;
      overtimeHours = 4;
      doubleTimeHours = hoursWorked - 12;
    }

    // Create clock-out entry
    const timeEntry = await Model.create({
      employee: employee,
      entryType: 'clock_out',
      timestamp: timestamp,
      location: location,
      deviceId: deviceId,
      method: method,
      clockInTime: clockInTime,
      clockOutTime: clockOutTime,
      breakDuration: breakDuration,
      hoursWorked: Math.round(hoursWorked * 100) / 100,
      regularHours: Math.round(regularHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      doubleTimeHours: Math.round(doubleTimeHours * 100) / 100,
      status: 'pending', // Clock-outs need approval
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
          clockInTime: timeEntry.clockInTime,
          clockOutTime: timeEntry.clockOutTime,
          hoursWorked: timeEntry.hoursWorked,
          regularHours: timeEntry.regularHours,
          overtimeHours: timeEntry.overtimeHours,
          doubleTimeHours: timeEntry.doubleTimeHours,
          breakDuration: timeEntry.breakDuration,
        },
      },
      message: `Clocked out successfully. Hours worked: ${timeEntry.hoursWorked}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error clocking out',
    });
  }
};

module.exports = clockOut;
