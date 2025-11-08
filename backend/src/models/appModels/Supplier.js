const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  // Company Information
  companyName: {
    type: String,
    required: true,
  },
  tradingName: String,
  registrationNumber: String,
  taxId: String,

  // Contact Information
  contactPerson: String,
  email: {
    type: String,
    required: true,
  },
  phone: String,
  mobile: String,
  fax: String,
  website: String,

  // Address
  address: {
    street: String,
    city: String,
    state: String,
    postcode: String,
    country: String,
  },

  // Billing Address (if different)
  billingAddress: {
    street: String,
    city: String,
    state: String,
    postcode: String,
    country: String,
  },

  // Payment Terms
  paymentTerms: {
    type: String,
    enum: ['net_7', 'net_15', 'net_30', 'net_60', 'net_90', 'cod', 'prepaid', 'other'],
    default: 'net_30',
  },
  creditLimit: Number,
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },

  // Banking Details
  bankDetails: {
    bankName: String,
    accountName: String,
    accountNumber: String,
    routingNumber: String,
    swiftCode: String,
  },

  // Categories
  categories: [
    {
      type: String,
      enum: [
        'engine',
        'transmission',
        'brakes',
        'suspension',
        'electrical',
        'body',
        'interior',
        'tires',
        'fluids',
        'filters',
        'tools',
        'general',
      ],
    },
  ],

  // Performance Metrics
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  averageLeadTime: {
    type: Number, // in days
    default: 0,
  },
  onTimeDeliveryRate: {
    type: Number, // percentage
    default: 100,
  },

  // Status
  isPreferred: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  // Notes
  notes: String,

  // Metadata
  lastOrderDate: Date,
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
supplierSchema.index({ companyName: 1 });
supplierSchema.index({ email: 1 });
supplierSchema.index({ isPreferred: 1, isActive: 1 });
supplierSchema.index({ categories: 1 });

// Pre-save middleware
supplierSchema.pre('save', function (next) {
  this.updated = Date.now();
  next();
});

// Plugin for auto-populating references
supplierSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Supplier', supplierSchema);
