const mongoose = require('mongoose');
const { Schema } = mongoose;

const tenantSchema = new Schema({
  tenantId: {
    type: String,
    required: true,
    unique: true,
    index: true, // Added index as it's a unique identifier
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: [String], // Array of strings
    enum: ['mechanical', 'performance', 'module_programming', 'hybrid'],
    default: [],
  },
  subscription: {
    plan: {
      type: String, // Assuming a single plan, not an array of possible plans. If multiple, then [String]
      enum: ['starter', 'professional', 'enterprise'],
    },
    status: {
      type: String, // Assuming a single status
      enum: ['active', 'suspended', 'cancelled'],
    },
    validUntil: Date,
    features: [String], // Array of strings
  },
  settings: {
    timezone: String,
    currency: String,
    taxRate: Number,
    businessHours: mongoose.Schema.Types.Mixed, // Using Mixed for Object
    branding: {
      logo: String,
      primaryColor: String,
      invoiceTemplate: String,
    },
  },
  integrations: {
    xero: {
      enabled: Boolean,
      credentials: mongoose.Schema.Types.Mixed, // Using Mixed for Object
    },
    myob: {
      enabled: Boolean,
      credentials: mongoose.Schema.Types.Mixed, // Using Mixed for Object
    },
    capricorn: {
      enabled: Boolean,
      memberId: String,
    },
    spsCommerce: {
      enabled: Boolean,
      config: mongoose.Schema.Types.Mixed, // Using Mixed for Object
    },
  },
  // createdAt and updatedAt will be handled by timestamps option
}, { timestamps: true }); // Enables createdAt and updatedAt timestamps

// Adding a specific index for tenantId as it's frequently queried
// tenantSchema.index({ tenantId: 1 }); // Already added unique:true and index:true above

module.exports = mongoose.model('Tenant', tenantSchema);
