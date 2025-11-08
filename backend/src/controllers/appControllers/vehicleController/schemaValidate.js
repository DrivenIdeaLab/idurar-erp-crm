const Joi = require('joi');

const vehicleSchema = Joi.object({
  // VIN - required, exactly 17 characters
  vin: Joi.string()
    .length(17)
    .uppercase()
    .pattern(/^[A-HJ-NPR-Z0-9]{17}$/) // VIN cannot contain I, O, Q
    .required()
    .messages({
      'string.length': 'VIN must be exactly 17 characters',
      'string.pattern.base': 'VIN can only contain letters A-Z (excluding I, O, Q) and numbers 0-9',
    }),

  // License Plate - optional
  licensePlate: Joi.string().allow('').optional(),

  // Vehicle Basic Info
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 2).required(),
  make: Joi.string().required(),
  model: Joi.string().required(),
  trim: Joi.string().allow('').optional(),
  color: Joi.string().allow('').optional(),

  // Engine & Transmission
  engine: Joi.string().allow('').optional(),
  transmission: Joi.string().allow('').optional(),
  fuelType: Joi.string()
    .valid('gasoline', 'diesel', 'electric', 'hybrid', 'other')
    .optional()
    .allow(''),

  // Customer - required
  customer: Joi.alternatives().try(Joi.string(), Joi.object()).required(),

  // Mileage
  currentMileage: Joi.number().min(0).optional(),
  mileageUnit: Joi.string().valid('miles', 'kilometers').optional(),

  // Notes
  notes: Joi.string().allow('').optional(),

  // VIN Decode Data - optional, populated automatically
  vinDecodeData: Joi.object().optional(),

  // Photos - optional array
  photos: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required(),
        uploadedDate: Joi.date().optional(),
        description: Joi.string().allow('').optional(),
        isPublic: Joi.boolean().optional(),
      })
    )
    .optional(),

  // System fields - optional (auto-generated)
  enabled: Joi.boolean().optional(),
  removed: Joi.boolean().optional(),
  createdBy: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
  assigned: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
  created: Joi.date().optional(),
  updated: Joi.date().optional(),
});

// Validation schema for VIN decode request
const vinDecodeSchema = Joi.object({
  vin: Joi.string()
    .length(17)
    .uppercase()
    .pattern(/^[A-HJ-NPR-Z0-9]{17}$/)
    .required()
    .messages({
      'string.length': 'VIN must be exactly 17 characters',
      'string.pattern.base': 'VIN can only contain letters A-Z (excluding I, O, Q) and numbers 0-9',
    }),
});

// Validation schema for mileage update
const mileageUpdateSchema = Joi.object({
  mileage: Joi.number().min(0).required(),
  serviceRecordId: Joi.string().optional().allow(''),
});

module.exports = {
  vehicleSchema,
  vinDecodeSchema,
  mileageUpdateSchema,
};
