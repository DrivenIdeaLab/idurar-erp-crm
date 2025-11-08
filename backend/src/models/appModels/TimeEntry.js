const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const timeEntrySchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },

  // Employee Reference
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
    autopopulate: true,
  },

  // Time Entry Details
  entryType: {
    type: String,
    enum: ['clock_in', 'clock_out', 'break_start', 'break_end'],
    required: true,
  },

  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },

  // Location tracking (optional)
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String },
  },

  // Device/PIN used
  deviceId: { type: String },
  method: {
    type: String,
    enum: ['pin', 'biometric', 'manual', 'web'],
    default: 'web',
  },

  // Shift Information
  scheduledShiftStart: { type: Date },
  scheduledShiftEnd: { type: Date },

  // Status
  isLate: { type: Boolean, default: false },
  isEarly: { type: Boolean, default: false },
  lateMinutes: { type: Number, default: 0 },

  // Time Calculations (for clock_out entries)
  clockInTime: { type: Date },
  clockOutTime: { type: Date },
  breakDuration: { type: Number, default: 0 }, // in minutes
  hoursWorked: { type: Number, default: 0 },
  regularHours: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  doubleTimeHours: { type: Number, default: 0 },

  // Approval
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'adjusted'],
    default: 'pending',
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    autopopulate: true,
  },
  approvalDate: { type: Date },

  // Adjustments
  isAdjusted: { type: Boolean, default: false },
  adjustedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    autopopulate: true,
  },
  adjustmentReason: { type: String },
  originalTimestamp: { type: Date },

  // Notes
  notes: { type: String },
  flagReason: { type: String },
});

// Indexes
timeEntrySchema.index({ employee: 1, timestamp: -1 });
timeEntrySchema.index({ status: 1 });
timeEntrySchema.index({ timestamp: 1 });

// Pre-save middleware
timeEntrySchema.pre('save', function (next) {
  this.updated = Date.now();

  // Calculate late status for clock_in
  if (this.entryType === 'clock_in' && this.scheduledShiftStart) {
    const diffMinutes = Math.floor((this.timestamp - this.scheduledShiftStart) / (1000 * 60));
    if (diffMinutes > 5) {
      // Grace period of 5 minutes
      this.isLate = true;
      this.lateMinutes = diffMinutes;
    }
  }

  next();
});

// Plugin for soft delete and auto-populate
timeEntrySchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
