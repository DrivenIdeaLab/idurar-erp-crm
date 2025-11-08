const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  // Customer & Vehicle
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle',
    required: true,
    autopopulate: true,
  },

  // Appointment Date & Time
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String, // e.g., "09:00", "14:30"
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    default: 60,
  },

  // Service Type
  serviceType: {
    type: String,
    enum: [
      'oil_change',
      'tire_rotation',
      'brake_service',
      'engine_repair',
      'transmission_service',
      'electrical',
      'diagnostic',
      'inspection',
      'maintenance',
      'other',
    ],
    required: true,
  },

  // Status
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'arrived', 'in_service', 'completed', 'no_show', 'cancelled'],
    default: 'scheduled',
  },

  // Assignment
  technician: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    autopopulate: true,
  },
  advisor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    autopopulate: true,
  },

  // Customer Notes
  customerConcerns: String,
  specialInstructions: String,

  // Estimated Cost
  estimatedCost: Number,

  // Contact Information
  contactPhone: String,
  contactEmail: String,

  // Reminder Sent
  reminderSent: {
    type: Boolean,
    default: false,
  },
  reminderSentDate: Date,

  // Confirmation
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirmedDate: Date,

  // Service Record Link (created when customer arrives)
  serviceRecord: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceRecord',
  },

  // Cancellation
  cancellationReason: String,
  cancelledBy: String, // 'customer' or 'shop'
  cancelledDate: Date,

  // Metadata
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ customer: 1 });
appointmentSchema.index({ vehicle: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ technician: 1 });

// Plugin for auto-populating references
appointmentSchema.plugin(require('mongoose-autopopulate'));

// Pre-save middleware
appointmentSchema.pre('save', function (next) {
  this.updated = Date.now();
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
