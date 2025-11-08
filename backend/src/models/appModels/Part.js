const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  // Part Identification
  partNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,

  // Categorization
  category: {
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
      'belts_hoses',
      'other',
    ],
    required: true,
  },
  subcategory: String,

  // Supplier Information
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    autopopulate: true,
  },
  supplierPartNumber: String,

  // Pricing
  costPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  sellPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  markup: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },

  // Inventory
  quantityOnHand: {
    type: Number,
    default: 0,
    min: 0,
  },
  quantityReserved: {
    type: Number,
    default: 0,
    min: 0,
  },
  quantityAvailable: {
    type: Number,
    default: 0,
    min: 0,
  },
  reorderPoint: {
    type: Number,
    default: 10,
    min: 0,
  },
  reorderQuantity: {
    type: Number,
    default: 50,
    min: 0,
  },
  maxStockLevel: {
    type: Number,
    default: 200,
    min: 0,
  },

  // Physical Properties
  weight: Number,
  weightUnit: {
    type: String,
    enum: ['kg', 'lb', 'g', 'oz'],
    default: 'kg',
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in', 'mm'],
      default: 'cm',
    },
  },

  // Location
  binLocation: String,
  warehouseLocation: String,

  // Compatibility
  compatibleMakes: [String],
  compatibleModels: [String],
  compatibleYears: [Number],
  universalFit: {
    type: Boolean,
    default: false,
  },

  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  isDiscontinued: {
    type: Boolean,
    default: false,
  },
  lowStockAlert: {
    type: Boolean,
    default: false,
  },
  outOfStock: {
    type: Boolean,
    default: false,
  },

  // Images & Documents
  images: [
    {
      url: String,
      isPrimary: Boolean,
      uploadedDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  documents: [
    {
      name: String,
      url: String,
      type: {
        type: String,
        enum: ['specification', 'installation_guide', 'warranty', 'other'],
      },
    },
  ],

  // Notes
  internalNotes: String,
  publicNotes: String,

  // Metadata
  lastRestocked: Date,
  lastSold: Date,
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

// Indexes for performance
partSchema.index({ partNumber: 1 }, { unique: true });
partSchema.index({ name: 'text', description: 'text' });
partSchema.index({ category: 1, subcategory: 1 });
partSchema.index({ supplier: 1 });
partSchema.index({ lowStockAlert: 1, isActive: 1 });

// Virtual for quantity available
partSchema.virtual('availableQuantity').get(function () {
  return this.quantityOnHand - this.quantityReserved;
});

// Pre-save middleware
partSchema.pre('save', function (next) {
  this.updated = Date.now();

  // Calculate available quantity
  this.quantityAvailable = this.quantityOnHand - this.quantityReserved;

  // Check stock alerts
  this.outOfStock = this.quantityOnHand === 0;
  this.lowStockAlert = this.quantityOnHand > 0 && this.quantityOnHand <= this.reorderPoint;

  // Calculate markup if not set
  if (this.costPrice && this.sellPrice && !this.markup) {
    this.markup = ((this.sellPrice - this.costPrice) / this.costPrice) * 100;
  }

  next();
});

// Plugin for auto-populating references
partSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Part', partSchema);
