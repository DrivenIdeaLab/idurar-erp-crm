export const fields = {
  part: {
    type: 'async',
    label: 'Part',
    required: true,
    entity: 'part',
    displayLabels: ['partNumber', 'name'],
    dataIndex: ['partNumber', 'name'],
    searchFields: 'partNumber,name',
    rules: [
      {
        required: true,
        message: 'Part is required',
      },
    ],
  },
  type: {
    type: 'select',
    label: 'Transaction Type',
    required: true,
    options: [
      { value: 'purchase', label: 'Purchase' },
      { value: 'sale', label: 'Sale' },
      { value: 'adjustment', label: 'Adjustment' },
      { value: 'return', label: 'Return' },
      { value: 'transfer', label: 'Transfer' },
      { value: 'damaged', label: 'Damaged' },
      { value: 'found', label: 'Found' },
      { value: 'lost', label: 'Lost' },
      { value: 'reserved', label: 'Reserved' },
      { value: 'unreserved', label: 'Unreserved' },
    ],
    rules: [
      {
        required: true,
        message: 'Transaction type is required',
      },
    ],
  },
  quantityChange: {
    type: 'number',
    label: 'Quantity Change',
    required: true,
    rules: [
      {
        required: true,
        message: 'Quantity change is required',
      },
    ],
  },
  unitCost: {
    type: 'currency',
    label: 'Unit Cost',
  },
  unitPrice: {
    type: 'currency',
    label: 'Unit Price',
  },
  fromLocation: {
    type: 'string',
    label: 'From Location',
  },
  toLocation: {
    type: 'string',
    label: 'To Location',
  },
  reason: {
    type: 'string',
    label: 'Reason',
  },
  notes: {
    type: 'textarea',
    label: 'Notes',
  },
  transactionDate: {
    type: 'date',
    label: 'Transaction Date',
    default: new Date(),
  },
};
