export const fields = {
  admin: {
    type: 'async',
    label: 'Admin User',
    required: true,
    entity: 'admin',
    displayLabels: ['name', 'email'],
    dataIndex: ['name', 'email'],
    searchFields: 'name,email',
    rules: [
      {
        required: true,
        message: 'Admin user is required',
      },
    ],
  },
  firstName: {
    type: 'string',
    required: true,
    label: 'First Name',
    rules: [
      {
        required: true,
        message: 'First name is required',
      },
    ],
  },
  lastName: {
    type: 'string',
    required: true,
    label: 'Last Name',
    rules: [
      {
        required: true,
        message: 'Last name is required',
      },
    ],
  },
  dateOfBirth: {
    type: 'date',
    label: 'Date of Birth',
  },
  gender: {
    type: 'select',
    label: 'Gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer_not_to_say', label: 'Prefer not to say' },
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
  email: {
    type: 'email',
    label: 'Email',
  },
  hireDate: {
    type: 'date',
    label: 'Hire Date',
    required: true,
    rules: [
      {
        required: true,
        message: 'Hire date is required',
      },
    ],
  },
  employmentType: {
    type: 'select',
    label: 'Employment Type',
    options: [
      { value: 'full_time', label: 'Full Time' },
      { value: 'part_time', label: 'Part Time' },
      { value: 'contractor', label: 'Contractor' },
      { value: 'temporary', label: 'Temporary' },
    ],
    default: 'full_time',
  },
  employmentStatus: {
    type: 'select',
    label: 'Employment Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'on_leave', label: 'On Leave' },
      { value: 'suspended', label: 'Suspended' },
      { value: 'terminated', label: 'Terminated' },
    ],
    default: 'active',
  },
  position: {
    type: 'select',
    label: 'Position',
    required: true,
    options: [
      { value: 'service_advisor', label: 'Service Advisor' },
      { value: 'technician', label: 'Technician' },
      { value: 'master_technician', label: 'Master Technician' },
      { value: 'apprentice', label: 'Apprentice' },
      { value: 'service_manager', label: 'Service Manager' },
      { value: 'shop_foreman', label: 'Shop Foreman' },
      { value: 'parts_manager', label: 'Parts Manager' },
      { value: 'cashier', label: 'Cashier' },
      { value: 'detailer', label: 'Detailer' },
      { value: 'porter', label: 'Porter' },
      { value: 'general_manager', label: 'General Manager' },
      { value: 'other', label: 'Other' },
    ],
    rules: [
      {
        required: true,
        message: 'Position is required',
      },
    ],
  },
  department: {
    type: 'select',
    label: 'Department',
    options: [
      { value: 'service', label: 'Service' },
      { value: 'parts', label: 'Parts' },
      { value: 'management', label: 'Management' },
      { value: 'administration', label: 'Administration' },
      { value: 'other', label: 'Other' },
    ],
    default: 'service',
  },
  payType: {
    type: 'select',
    label: 'Pay Type',
    options: [
      { value: 'hourly', label: 'Hourly' },
      { value: 'salary', label: 'Salary' },
      { value: 'commission', label: 'Commission' },
      { value: 'flat_rate', label: 'Flat Rate' },
    ],
    default: 'hourly',
  },
  payRate: {
    type: 'currency',
    label: 'Pay Rate',
  },
  scheduledHoursPerWeek: {
    type: 'number',
    label: 'Scheduled Hours Per Week',
    default: 40,
  },
  specialties: {
    type: 'multiselect',
    label: 'Specialties',
    options: [
      { value: 'engine_repair', label: 'Engine Repair' },
      { value: 'transmission', label: 'Transmission' },
      { value: 'brakes', label: 'Brakes' },
      { value: 'suspension', label: 'Suspension' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'diagnostics', label: 'Diagnostics' },
      { value: 'ac_hvac', label: 'AC/HVAC' },
      { value: 'hybrid_electric', label: 'Hybrid/Electric' },
      { value: 'diesel', label: 'Diesel' },
      { value: 'performance', label: 'Performance' },
      { value: 'body_work', label: 'Body Work' },
      { value: 'detailing', label: 'Detailing' },
    ],
  },
  notes: {
    type: 'textarea',
    label: 'Notes',
  },
  isActive: {
    type: 'boolean',
    label: 'Active',
    default: true,
  },
};
