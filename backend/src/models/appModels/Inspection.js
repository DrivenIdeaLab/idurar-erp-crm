const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  // Service Record Link
  serviceRecord: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceRecord',
    required: true,
  },

  // Vehicle & Customer (denormalized for easy querying)
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle',
    required: true,
    autopopulate: true,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },

  // Inspector
  inspector: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
    autopopulate: true,
  },

  // Inspection Date
  inspectionDate: {
    type: Date,
    default: Date.now,
  },

  // Mileage at inspection
  mileage: Number,

  // Inspection Items
  items: [
    {
      category: {
        type: String,
        enum: [
          'brakes',
          'tires',
          'battery',
          'fluids',
          'lights',
          'wipers',
          'suspension',
          'steering',
          'exhaust',
          'belts_hoses',
          'filters',
          'other',
        ],
        required: true,
      },
      itemName: {
        type: String,
        required: true,
      },
      condition: {
        type: String,
        enum: ['good', 'fair', 'poor', 'needs_immediate_attention'],
        required: true,
      },
      notes: String,
      recommendedAction: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low',
      },
      estimatedCost: Number,
      photos: [
        {
          url: String,
          uploadedDate: {
            type: Date,
            default: Date.now,
          },
          description: String,
        },
      ],
    },
  ],

  // Overall Assessment
  overallCondition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
  },

  // Safety Issues
  safetyIssues: [
    {
      description: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
      },
      recommendedAction: String,
    },
  ],

  // Recommendations
  recommendations: String,
  nextServiceDue: Date,
  nextServiceMileage: Number,

  // Customer Notification
  customerNotified: {
    type: Boolean,
    default: false,
  },
  customerApproval: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'partial'],
    default: 'pending',
  },
  approvedItems: [String], // Array of item names that were approved

  // Photos (overall vehicle photos)
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
        enum: ['exterior', 'interior', 'undercarriage', 'engine', 'other'],
      },
    },
  ],

  // Digital Signature
  customerSignature: String, // Base64 encoded image or URL
  signedDate: Date,

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
inspectionSchema.index({ serviceRecord: 1 });
inspectionSchema.index({ vehicle: 1 });
inspectionSchema.index({ customer: 1 });
inspectionSchema.index({ inspectionDate: 1 });

// Plugin for auto-populating references
inspectionSchema.plugin(require('mongoose-autopopulate'));

// Pre-save middleware
inspectionSchema.pre('save', function (next) {
  this.updated = Date.now();
  next();
});

module.exports = mongoose.model('Inspection', inspectionSchema);
