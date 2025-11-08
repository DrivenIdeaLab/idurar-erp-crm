const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  // PO Number
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  poNumber: String, // Auto-generated: PO-YYYY-NNNN

  // Supplier
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    required: true,
    autopopulate: true,
  },

  // Status
  status: {
    type: String,
    enum: ['draft', 'sent', 'confirmed', 'partially_received', 'received', 'cancelled'],
    default: 'draft',
  },

  // Dates
  orderDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,

  // Line Items
  items: [
    {
      part: {
        type: mongoose.Schema.ObjectId,
        ref: 'Part',
        autopopulate: true,
      },
      partNumber: String,
      description: String,
      quantityOrdered: {
        type: Number,
        required: true,
        min: 0,
      },
      quantityReceived: {
        type: Number,
        default: 0,
        min: 0,
      },
      quantityOutstanding: {
        type: Number,
        default: 0,
        min: 0,
      },
      unitCost: {
        type: Number,
        required: true,
        min: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],

  // Totals
  subtotal: {
    type: Number,
    default: 0,
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },

  // Shipping Information
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postcode: String,
    country: String,
  },
  shippingMethod: String,
  trackingNumber: String,

  // Payment
  paymentTerms: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending',
  },
  paidAmount: {
    type: Number,
    default: 0,
  },

  // Notes
  notes: String,
  internalNotes: String,

  // Metadata
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  approvedDate: Date,
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
purchaseOrderSchema.index({ number: 1, year: 1 }, { unique: true });
purchaseOrderSchema.index({ poNumber: 1 }, { unique: true });
purchaseOrderSchema.index({ supplier: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ orderDate: -1 });

// Pre-save middleware
purchaseOrderSchema.pre('save', function (next) {
  this.updated = Date.now();

  // Generate PO number
  if (!this.poNumber) {
    this.poNumber = `PO-${this.year}-${String(this.number).padStart(4, '0')}`;
  }

  // Calculate totals
  this.subtotal = this.items.reduce((sum, item) => sum + (item.total || 0), 0);
  this.taxAmount = this.subtotal * (this.taxRate / 100);
  this.total = this.subtotal + this.taxAmount + (this.shippingCost || 0);

  // Update outstanding quantities
  this.items.forEach((item) => {
    item.quantityOutstanding = item.quantityOrdered - (item.quantityReceived || 0);
  });

  next();
});

// Plugin for auto-populating references
purchaseOrderSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
