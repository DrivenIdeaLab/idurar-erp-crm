const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const employeeSchema = new mongoose.Schema({
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

  // Link to Admin for authentication
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
    unique: true,
    autopopulate: true,
  },

  // Employee Number
  employeeNumber: {
    type: String,
    required: true,
    unique: true,
  },
  year: { type: Number },
  number: { type: Number },

  // Personal Information
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: { type: Date },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
  },
  ssn: { type: String }, // Encrypted in production

  // Contact Information
  phone: { type: String },
  mobile: { type: String },
  email: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postcode: { type: String },
    country: { type: String },
  },

  // Emergency Contact
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String },
    mobile: { type: String },
  },

  // Employment Details
  hireDate: {
    type: Date,
    required: true,
  },
  terminationDate: { type: Date },
  employmentType: {
    type: String,
    enum: ['full_time', 'part_time', 'contractor', 'temporary'],
    default: 'full_time',
  },
  employmentStatus: {
    type: String,
    enum: ['active', 'on_leave', 'suspended', 'terminated'],
    default: 'active',
  },

  // Position and Department
  position: {
    type: String,
    required: true,
    enum: [
      'service_advisor',
      'technician',
      'master_technician',
      'apprentice',
      'service_manager',
      'shop_foreman',
      'parts_manager',
      'cashier',
      'detailer',
      'porter',
      'general_manager',
      'other',
    ],
  },
  department: {
    type: String,
    enum: ['service', 'parts', 'management', 'administration', 'other'],
    default: 'service',
  },
  supervisor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    autopopulate: { select: 'employeeNumber firstName lastName' },
  },

  // Compensation
  payType: {
    type: String,
    enum: ['hourly', 'salary', 'commission', 'flat_rate'],
    default: 'hourly',
  },
  payRate: { type: Number },
  currency: { type: String, default: 'USD' },
  overtimeEligible: { type: Boolean, default: true },

  // Schedule
  scheduledHoursPerWeek: { type: Number, default: 40 },
  defaultShiftStart: { type: String }, // "08:00"
  defaultShiftEnd: { type: String }, // "17:00"
  workDays: [
    {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
  ],

  // Skills and Specialties
  skills: [{ type: String }],
  specialties: [
    {
      type: String,
      enum: [
        'engine_repair',
        'transmission',
        'brakes',
        'suspension',
        'electrical',
        'diagnostics',
        'ac_hvac',
        'hybrid_electric',
        'diesel',
        'performance',
        'body_work',
        'detailing',
      ],
    },
  ],

  // Performance Metrics (calculated)
  performanceMetrics: {
    jobsCompleted: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageJobValue: { type: Number, default: 0 },
    efficiencyRate: { type: Number, default: 0 }, // Percentage
    customerSatisfaction: { type: Number, default: 0 }, // 0-5 rating
    reworkPercentage: { type: Number, default: 0 },
    lastUpdated: { type: Date },
  },

  // Documents
  documents: [
    {
      type: { type: String }, // 'license', 'insurance', 'contract', etc.
      name: { type: String },
      url: { type: String },
      uploadDate: { type: Date, default: Date.now },
      expiryDate: { type: Date },
    },
  ],

  // Time Clock PIN (hashed)
  clockPin: { type: String },

  // Notes
  notes: { type: String },
  isActive: { type: Boolean, default: true },
});

// Indexes
employeeSchema.index({ employeeNumber: 1 });
employeeSchema.index({ admin: 1 });
employeeSchema.index({ position: 1, department: 1 });
employeeSchema.index({ employmentStatus: 1 });

// Virtual for full name
employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware
employeeSchema.pre('save', async function (next) {
  this.updated = Date.now();

  // Generate employee number if not exists
  if (!this.employeeNumber) {
    const year = new Date().getFullYear();
    this.year = year;

    // Find the last employee number for this year
    const lastEmployee = await mongoose
      .model('Employee')
      .findOne({ year: year })
      .sort({ number: -1 });

    this.number = lastEmployee ? lastEmployee.number + 1 : 1;
    this.employeeNumber = `EMP-${year}-${String(this.number).padStart(4, '0')}`;
  }

  next();
});

// Plugin for soft delete and auto-populate
employeeSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Employee', employeeSchema);
