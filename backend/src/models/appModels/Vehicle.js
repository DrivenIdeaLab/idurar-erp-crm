const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  // VIN (Vehicle Identification Number)
  vin: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 17,
    maxlength: 17,
  },

  // License Plate
  licensePlate: {
    type: String,
    uppercase: true,
    trim: true,
  },

  // Vehicle Basic Info
  year: {
    type: Number,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  trim: String,
  color: String,

  // Engine & Transmission
  engine: String,
  transmission: String,
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'other'],
  },

  // Ownership & Customer
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },

  // Mileage Tracking
  currentMileage: {
    type: Number,
    default: 0,
  },
  mileageUnit: {
    type: String,
    enum: ['miles', 'kilometers'],
    default: 'miles',
  },
  mileageHistory: [
    {
      mileage: Number,
      recordedDate: {
        type: Date,
        default: Date.now,
      },
      recordedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
      },
      serviceRecordId: {
        type: mongoose.Schema.ObjectId,
        ref: 'ServiceRecord',
      },
    },
  ],

  // Photos
  photos: [
    {
      url: String,
      uploadedDate: {
        type: Date,
        default: Date.now,
      },
      description: String,
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
  ],

  // Notes
  notes: String,

  // VIN Decode Data
  vinDecodeData: {
    manufacturer: String,
    plantCountry: String,
    plantCity: String,
    vehicleType: String,
    bodyClass: String,
    doors: Number,
    engineCylinders: Number,
    engineDisplacement: String,
    driveType: String,
    abs: String,
    standardSeating: Number,
    otherSpecs: mongoose.Schema.Types.Mixed,
  },

  // Metadata
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  assigned: {
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

// Indexes for better query performance
vehicleSchema.index({ vin: 1 });
vehicleSchema.index({ customer: 1 });
vehicleSchema.index({ licensePlate: 1 });
vehicleSchema.index({ make: 1, model: 1, year: 1 });

// Plugin for auto-populating references
vehicleSchema.plugin(require('mongoose-autopopulate'));

// Pre-save middleware to update the 'updated' timestamp
vehicleSchema.pre('save', function (next) {
  this.updated = Date.now();
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
