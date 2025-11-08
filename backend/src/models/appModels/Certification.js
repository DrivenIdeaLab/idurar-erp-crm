const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const certificationSchema = new mongoose.Schema({
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

  // Certification Details
  certificationType: {
    type: String,
    enum: [
      'ase_a1', // Engine Repair
      'ase_a2', // Automatic Transmission
      'ase_a3', // Manual Transmission
      'ase_a4', // Suspension & Steering
      'ase_a5', // Brakes
      'ase_a6', // Electrical/Electronic
      'ase_a7', // Heating & Air Conditioning
      'ase_a8', // Engine Performance
      'ase_master', // Master Technician
      'smog_inspector',
      'hybrid_electric',
      'safety_inspection',
      'welding',
      'forklift',
      'first_aid',
      'osha',
      'other',
    ],
    required: true,
  },

  certificationName: {
    type: String,
    required: true,
  },

  certificationNumber: {
    type: String,
    required: true,
  },

  // Issuing Organization
  issuingOrganization: {
    type: String,
    required: true,
  },

  // Dates
  issueDate: {
    type: Date,
    required: true,
  },

  expiryDate: {
    type: Date,
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'suspended', 'renewed', 'pending_renewal'],
    default: 'active',
  },

  // Alert
  expiryAlertSent: { type: Boolean, default: false },
  daysUntilExpiry: { type: Number },
  isExpiring: { type: Boolean, default: false }, // Within 30 days

  // Renewal
  renewalHistory: [
    {
      renewalDate: { type: Date },
      previousExpiryDate: { type: Date },
      newExpiryDate: { type: Date },
      notes: { type: String },
    },
  ],

  // Documents
  certificateUrl: { type: String },
  documents: [
    {
      name: { type: String },
      url: { type: String },
      uploadDate: { type: Date, default: Date.now },
    },
  ],

  // Additional Info
  level: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced', 'master'],
  },

  score: { type: Number }, // If applicable
  requiredForJob: { type: Boolean, default: false },
  notes: { type: String },
});

// Indexes
certificationSchema.index({ employee: 1 });
certificationSchema.index({ certificationType: 1 });
certificationSchema.index({ expiryDate: 1 });
certificationSchema.index({ status: 1 });

// Virtual for checking if certification is valid
certificationSchema.virtual('isValid').get(function () {
  if (!this.expiryDate) return true; // No expiry = perpetual
  return this.expiryDate > new Date() && this.status === 'active';
});

// Pre-save middleware
certificationSchema.pre('save', function (next) {
  this.updated = Date.now();

  // Calculate days until expiry and set status
  if (this.expiryDate) {
    const today = new Date();
    const diffTime = this.expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    this.daysUntilExpiry = diffDays;

    // Set status based on expiry
    if (diffDays <= 0) {
      this.status = 'expired';
      this.isExpiring = false;
    } else if (diffDays <= 30) {
      this.isExpiring = true;
      if (this.status !== 'renewed') {
        this.status = 'pending_renewal';
      }
    } else {
      this.isExpiring = false;
      if (this.status === 'expired' || this.status === 'pending_renewal') {
        this.status = 'active';
      }
    }
  }

  next();
});

// Plugin for soft delete and auto-populate
certificationSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Certification', certificationSchema);
