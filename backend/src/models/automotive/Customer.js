const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
  tenantId: { // CRITICAL: For multi-tenant isolation
    type: String,
    required: true,
    index: true,
  },
  customerId: { // Unique within tenant
    type: String,
    required: true,
    index: true,
  },

  // Personal Information
  firstName: String,
  lastName: String,
  company: String,
  email: {
    type: String,
    index: true, // Often searched/queried
  },
  phone: String,
  mobile: String,

  // Address
  address: {
    street: String,
    suburb: String,
    state: String,
    postcode: String,
    country: String,
  },

  // Customer Preferences
  preferences: {
    contactMethod: {
      type: [String],
      enum: ['email', 'sms', 'phone'],
      default: [],
    },
    serviceReminders: Boolean,
    marketingOptIn: Boolean,
    preferredTechnician: {
      type: Schema.Types.ObjectId,
      // ref: 'Technician' // Assuming a Technician model might exist later
    },
  },

  // Business Information
  businessType: {
    type: String, // Document shows array of possible values, implies single choice for a customer
    enum: ['personal', 'fleet', 'commercial'],
  },
  abn: String,

  // Relationships
  vehicles: [{
    type: Schema.Types.ObjectId,
    ref: 'Vehicle', // Reference to the Vehicle model
  }],

  // Financial
  creditLimit: Number,
  paymentTerms: Number, // Days
  taxExempt: Boolean,

  // Metadata
  source: {
    type: String, // Document shows array of possible values, implies single choice
    enum: ['walk-in', 'phone', 'online', 'referral'],
  },
  referredBy: { // Assuming this refers to another Customer or a User
    type: Schema.Types.ObjectId,
    // ref: 'AutomotiveCustomer' // Or 'User'
  },
  tags: [String],
  notes: String,

  // Timestamps
  firstVisit: Date,
  lastVisit: Date,
  // createdAt and updatedAt will be handled by timestamps option
}, { timestamps: true });

// Compound index for tenantId and customerId for efficient lookups
customerSchema.index({ tenantId: 1, customerId: 1 }, { unique: true });
// Index for searching by name within a tenant
customerSchema.index({ tenantId: 1, lastName: 1, firstName: 1 });
// Index for searching by email within a tenant
customerSchema.index({ tenantId: 1, email: 1 });


module.exports = mongoose.model('AutomotiveCustomer', customerSchema);
