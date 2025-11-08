export const fields = {
  vin: {
    type: 'string',
    required: true,
    label: 'VIN',
    rules: [
      {
        required: true,
        message: 'VIN is required',
      },
      {
        len: 17,
        message: 'VIN must be exactly 17 characters',
      },
      {
        pattern: /^[A-HJ-NPR-Z0-9]{17}$/,
        message: 'VIN can only contain letters A-Z (excluding I, O, Q) and numbers',
      },
    ],
  },
  customer: {
    type: 'async',
    label: 'Customer',
    required: true,
    entity: 'client',
    displayLabels: ['name'],
    dataIndex: ['name'],
    searchFields: 'name,email',
  },
  licensePlate: {
    type: 'string',
    label: 'License Plate',
  },
  year: {
    type: 'number',
    label: 'Year',
    required: true,
  },
  make: {
    type: 'string',
    label: 'Make',
    required: true,
  },
  model: {
    type: 'string',
    label: 'Model',
    required: true,
  },
  trim: {
    type: 'string',
    label: 'Trim',
  },
  color: {
    type: 'string',
    label: 'Color',
  },
  engine: {
    type: 'string',
    label: 'Engine',
  },
  transmission: {
    type: 'string',
    label: 'Transmission',
  },
  fuelType: {
    type: 'select',
    label: 'Fuel Type',
    options: [
      { value: 'gasoline', label: 'Gasoline' },
      { value: 'diesel', label: 'Diesel' },
      { value: 'electric', label: 'Electric' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'other', label: 'Other' },
    ],
  },
  currentMileage: {
    type: 'number',
    label: 'Current Mileage',
  },
  mileageUnit: {
    type: 'select',
    label: 'Mileage Unit',
    options: [
      { value: 'miles', label: 'Miles' },
      { value: 'kilometers', label: 'Kilometers' },
    ],
    default: 'miles',
  },
  notes: {
    type: 'textarea',
    label: 'Notes',
  },
};
