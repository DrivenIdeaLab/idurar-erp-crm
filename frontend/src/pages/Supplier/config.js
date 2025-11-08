export const fields = {
  companyName: {
    type: 'string',
    required: true,
    label: 'Company Name',
    rules: [
      {
        required: true,
        message: 'Company name is required',
      },
    ],
  },
  tradingName: {
    type: 'string',
    label: 'Trading Name',
  },
  registrationNumber: {
    type: 'string',
    label: 'Registration Number',
  },
  taxId: {
    type: 'string',
    label: 'Tax ID',
  },
  contactPerson: {
    type: 'string',
    label: 'Contact Person',
  },
  email: {
    type: 'email',
    required: true,
    label: 'Email',
    rules: [
      {
        required: true,
        message: 'Email is required',
      },
      {
        type: 'email',
        message: 'Please enter a valid email',
      },
    ],
  },
  phone: {
    type: 'phone',
    label: 'Phone',
  },
  mobile: {
    type: 'phone',
    label: 'Mobile',
  },
  website: {
    type: 'string',
    label: 'Website',
  },
  address: {
    type: 'object',
    label: 'Address',
    fields: {
      street: { type: 'string', label: 'Street' },
      city: { type: 'string', label: 'City' },
      state: { type: 'string', label: 'State' },
      postcode: { type: 'string', label: 'Postcode' },
      country: { type: 'string', label: 'Country' },
    },
  },
  paymentTerms: {
    type: 'select',
    label: 'Payment Terms',
    options: [
      { value: 'net_7', label: 'Net 7 Days' },
      { value: 'net_15', label: 'Net 15 Days' },
      { value: 'net_30', label: 'Net 30 Days' },
      { value: 'net_60', label: 'Net 60 Days' },
      { value: 'net_90', label: 'Net 90 Days' },
      { value: 'cod', label: 'Cash on Delivery' },
      { value: 'prepaid', label: 'Prepaid' },
      { value: 'other', label: 'Other' },
    ],
    default: 'net_30',
  },
  creditLimit: {
    type: 'currency',
    label: 'Credit Limit',
  },
  currency: {
    type: 'select',
    label: 'Currency',
    options: [
      { value: 'USD', label: 'USD - US Dollar' },
      { value: 'EUR', label: 'EUR - Euro' },
      { value: 'GBP', label: 'GBP - British Pound' },
      { value: 'CAD', label: 'CAD - Canadian Dollar' },
    ],
    default: 'USD',
  },
  categories: {
    type: 'multiselect',
    label: 'Categories',
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
      { value: 'tools', label: 'Tools' },
      { value: 'general', label: 'General' },
    ],
  },
  rating: {
    type: 'number',
    label: 'Rating (0-5)',
    min: 0,
    max: 5,
  },
  isPreferred: {
    type: 'boolean',
    label: 'Preferred Supplier',
    default: false,
  },
  isActive: {
    type: 'boolean',
    label: 'Active',
    default: true,
  },
  notes: {
    type: 'textarea',
    label: 'Notes',
  },
};
