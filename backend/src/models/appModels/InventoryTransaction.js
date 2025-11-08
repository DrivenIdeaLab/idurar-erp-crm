const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  // Part Reference
  part: {
    type: mongoose.Schema.ObjectId,
    ref: 'Part',
    required: true,
    autopopulate: true,
  },

  // Transaction Type
  type: {
    type: String,
    enum: [
      'purchase',
      'sale',
      'adjustment',
      'return',
      'transfer',
      'damaged',
      'found',
      'lost',
      'reserved',
      'unreserved',
    ],
    required: true,
  },

  // Quantity Change
  quantityChange: {
    type: Number,
    required: true,
  },
  quantityBefore: {
    type: Number,
    required: true,
  },
  quantityAfter: {
    type: Number,
    required: true,
  },

  // Cost & Value
  unitCost: Number,
  totalCost: Number,
  unitPrice: Number,
  totalPrice: Number,

  // Reference Documents
  purchaseOrder: {
    type: mongoose.Schema.ObjectId,
    ref: 'PurchaseOrder',
  },
  serviceRecord: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceRecord',
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
  },

  // Location
  fromLocation: String,
  toLocation: String,

  // Reason & Notes
  reason: String,
  notes: String,

  // Metadata
  transactionDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
    autopopulate: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
inventoryTransactionSchema.index({ part: 1, transactionDate: -1 });
inventoryTransactionSchema.index({ type: 1 });
inventoryTransactionSchema.index({ transactionDate: -1 });

// Plugin for auto-populating references
inventoryTransactionSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
