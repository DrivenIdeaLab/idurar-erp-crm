export const fields = {
  supplier: {
    type: 'async',
    label: 'Supplier',
    required: true,
    entity: 'supplier',
    displayLabels: ['companyName'],
    dataIndex: ['companyName'],
    searchFields: 'companyName,contactPerson',
    rules: [
      {
        required: true,
        message: 'Supplier is required',
      },
    ],
  },
  status: {
    type: 'select',
    label: 'Status',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'sent', label: 'Sent' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'partially_received', label: 'Partially Received' },
      { value: 'received', label: 'Received' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
    default: 'draft',
  },
  orderDate: {
    type: 'date',
    label: 'Order Date',
    required: true,
    default: new Date(),
  },
  expectedDeliveryDate: {
    type: 'date',
    label: 'Expected Delivery Date',
  },
  items: {
    type: 'array',
    label: 'Items',
    required: true,
    fields: {
      part: {
        type: 'async',
        label: 'Part',
        entity: 'part',
        displayLabels: ['partNumber', 'name'],
        dataIndex: ['partNumber', 'name'],
        searchFields: 'partNumber,name',
      },
      partNumber: { type: 'string', label: 'Part Number' },
      description: { type: 'string', label: 'Description' },
      quantityOrdered: { type: 'number', label: 'Quantity', required: true, min: 1 },
      unitCost: { type: 'currency', label: 'Unit Cost', required: true },
      total: { type: 'currency', label: 'Total', disabled: true },
    },
  },
  taxRate: {
    type: 'number',
    label: 'Tax Rate (%)',
    default: 0,
    min: 0,
    max: 100,
  },
  shippingCost: {
    type: 'currency',
    label: 'Shipping Cost',
    default: 0,
  },
  shippingAddress: {
    type: 'object',
    label: 'Shipping Address',
    fields: {
      street: { type: 'string', label: 'Street' },
      city: { type: 'string', label: 'City' },
      state: { type: 'string', label: 'State' },
      postcode: { type: 'string', label: 'Postcode' },
      country: { type: 'string', label: 'Country' },
    },
  },
  shippingMethod: {
    type: 'string',
    label: 'Shipping Method',
  },
  trackingNumber: {
    type: 'string',
    label: 'Tracking Number',
  },
  paymentTerms: {
    type: 'string',
    label: 'Payment Terms',
  },
  paymentStatus: {
    type: 'select',
    label: 'Payment Status',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'partial', label: 'Partial' },
      { value: 'paid', label: 'Paid' },
    ],
    default: 'pending',
  },
  paidAmount: {
    type: 'currency',
    label: 'Paid Amount',
    default: 0,
  },
  notes: {
    type: 'textarea',
    label: 'Notes',
  },
  internalNotes: {
    type: 'textarea',
    label: 'Internal Notes',
  },
};
