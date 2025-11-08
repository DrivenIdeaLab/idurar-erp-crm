const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  // Service Number (auto-generated)
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
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

  // Status Workflow
  status: {
    type: String,
    enum: [
      'scheduled',
      'checked_in',
      'in_progress',
      'awaiting_parts',
      'awaiting_approval',
      'completed',
      'invoiced',
      'cancelled',
    ],
    default: 'scheduled',
  },

  // Dates
  scheduledDate: {
    type: Date,
    required: true,
  },
  checkInDate: Date,
  completionDate: Date,
  estimatedCompletionDate: Date,

  // Mileage at check-in
  mileageIn: Number,
  mileageOut: Number,

  // Assigned Technician
  technician: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    autopopulate: true,
  },

  // Service Advisor
  advisor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    autopopulate: true,
  },

  // Parts Used
  parts: [
    {
      partName: String,
      partNumber: String,
      quantity: {
        type: Number,
        default: 1,
      },
      unitPrice: Number,
      total: Number,
    },
  ],

  // Labor
  labor: [
    {
      description: String,
      hours: Number,
      rate: Number,
      total: Number,
      technician: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
      },
    },
  ],

  // Inspection
  inspection: {
    type: mongoose.Schema.ObjectId,
    ref: 'Inspection',
    autopopulate: true,
  },

  // Costs & Totals
  partsTotal: {
    type: Number,
    default: 0,
  },
  laborTotal: {
    type: Number,
    default: 0,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  taxTotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },

  // Notes & Recommendations
  customerConcerns: String,
  technicianNotes: String,
  recommendations: String,

  // Photos & Documents
  photos: [
    {
      url: String,
      uploadedDate: {
        type: Date,
        default: Date.now,
      },
      description: String,
      category: {
        type: String,
        enum: ['before', 'during', 'after', 'damage', 'other'],
      },
    },
  ],

  // Invoice Link
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
  },

  // Appointment Link
  appointment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Appointment',
  },

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
serviceRecordSchema.index({ number: 1, year: 1 }, { unique: true });
serviceRecordSchema.index({ customer: 1 });
serviceRecordSchema.index({ vehicle: 1 });
serviceRecordSchema.index({ status: 1 });
serviceRecordSchema.index({ scheduledDate: 1 });

// Plugin for auto-populating references
serviceRecordSchema.plugin(require('mongoose-autopopulate'));

// Pre-save middleware
serviceRecordSchema.pre('save', function (next) {
  this.updated = Date.now();

  // Calculate totals
  this.partsTotal = this.parts.reduce((sum, part) => sum + (part.total || 0), 0);
  this.laborTotal = this.labor.reduce((sum, labor) => sum + (labor.total || 0), 0);
  this.subTotal = this.partsTotal + this.laborTotal;
  this.taxTotal = this.subTotal * (this.taxRate / 100);
  this.total = this.subTotal + this.taxTotal;

  next();
});

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
