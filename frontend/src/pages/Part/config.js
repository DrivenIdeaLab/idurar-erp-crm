export const fields = {
  partNumber: {
    type: 'string',
    required: true,
    label: 'Part Number',
    rules: [
      {
        required: true,
        message: 'Part number is required',
      },
    ],
  },
  name: {
    type: 'string',
    required: true,
    label: 'Part Name',
    rules: [
      {
        required: true,
        message: 'Part name is required',
      },
    ],
  },
  description: {
    type: 'textarea',
    label: 'Description',
  },
  category: {
    type: 'select',
    label: 'Category',
    required: true,
    options: [
      { value: 'engine', label: 'Engine' },
      { value: 'transmission', label: 'Transmission' },
      { value: 'brakes', label: 'Brakes' },
      { value: 'suspension', label: 'Suspension' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'body', label: 'Body' },
      { value: 'interior', label: 'Interior' },
      { value: 'tires', label: 'Tires' },
      { value: 'fluids', label: 'Fluids' },
      { value: 'filters', label: 'Filters' },
      { value: 'belts_hoses', label: 'Belts & Hoses' },
      { value: 'other', label: 'Other' },
    ],
  },
  subcategory: {
    type: 'string',
    label: 'Subcategory',
  },
  supplier: {
    type: 'async',
    label: 'Supplier',
    entity: 'supplier',
    displayLabels: ['companyName'],
    dataIndex: ['companyName'],
    searchFields: 'companyName,contactPerson',
  },
  supplierPartNumber: {
    type: 'string',
    label: 'Supplier Part Number',
  },
  costPrice: {
    type: 'currency',
    label: 'Cost Price',
    required: true,
  },
  sellPrice: {
    type: 'currency',
    label: 'Sell Price',
    required: true,
  },
  markup: {
    type: 'number',
    label: 'Markup %',
  },
  quantityOnHand: {
    type: 'number',
    label: 'Quantity On Hand',
    default: 0,
  },
  reorderPoint: {
    type: 'number',
    label: 'Reorder Point',
    default: 10,
  },
  reorderQuantity: {
    type: 'number',
    label: 'Reorder Quantity',
    default: 50,
  },
  maxStockLevel: {
    type: 'number',
    label: 'Max Stock Level',
    default: 200,
  },
  binLocation: {
    type: 'string',
    label: 'Bin Location',
  },
  warehouseLocation: {
    type: 'string',
    label: 'Warehouse Location',
  },
  weight: {
    type: 'number',
    label: 'Weight',
  },
  weightUnit: {
    type: 'select',
    label: 'Weight Unit',
    options: [
      { value: 'kg', label: 'Kilograms' },
      { value: 'lb', label: 'Pounds' },
      { value: 'g', label: 'Grams' },
      { value: 'oz', label: 'Ounces' },
    ],
    default: 'kg',
  },
  isActive: {
    type: 'boolean',
    label: 'Active',
    default: true,
  },
  isDiscontinued: {
    type: 'boolean',
    label: 'Discontinued',
    default: false,
  },
  internalNotes: {
    type: 'textarea',
    label: 'Internal Notes',
  },
  publicNotes: {
    type: 'textarea',
    label: 'Public Notes',
  },
};
