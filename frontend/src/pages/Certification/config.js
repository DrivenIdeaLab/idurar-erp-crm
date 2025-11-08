export const fields = {
  employee: {
    type: 'async',
    label: 'Employee',
    required: true,
    entity: 'employee',
    displayLabels: ['employeeNumber', 'firstName', 'lastName'],
    dataIndex: ['employeeNumber', 'firstName', 'lastName'],
    searchFields: 'employeeNumber,firstName,lastName',
    rules: [
      {
        required: true,
        message: 'Employee is required',
      },
    ],
  },
  certificationType: {
    type: 'select',
    label: 'Certification Type',
    required: true,
    options: [
      { value: 'ase_a1', label: 'ASE A1 - Engine Repair' },
      { value: 'ase_a2', label: 'ASE A2 - Automatic Transmission' },
      { value: 'ase_a3', label: 'ASE A3 - Manual Transmission' },
      { value: 'ase_a4', label: 'ASE A4 - Suspension & Steering' },
      { value: 'ase_a5', label: 'ASE A5 - Brakes' },
      { value: 'ase_a6', label: 'ASE A6 - Electrical/Electronic' },
      { value: 'ase_a7', label: 'ASE A7 - Heating & Air Conditioning' },
      { value: 'ase_a8', label: 'ASE A8 - Engine Performance' },
      { value: 'ase_master', label: 'ASE Master Technician' },
      { value: 'smog_inspector', label: 'Smog Inspector' },
      { value: 'hybrid_electric', label: 'Hybrid/Electric Vehicle' },
      { value: 'safety_inspection', label: 'Safety Inspection' },
      { value: 'welding', label: 'Welding' },
      { value: 'forklift', label: 'Forklift Operation' },
      { value: 'first_aid', label: 'First Aid/CPR' },
      { value: 'osha', label: 'OSHA Safety' },
      { value: 'other', label: 'Other' },
    ],
    rules: [
      {
        required: true,
        message: 'Certification type is required',
      },
    ],
  },
  certificationName: {
    type: 'string',
    required: true,
    label: 'Certification Name',
    rules: [
      {
        required: true,
        message: 'Certification name is required',
      },
    ],
  },
  certificationNumber: {
    type: 'string',
    required: true,
    label: 'Certification Number',
    rules: [
      {
        required: true,
        message: 'Certification number is required',
      },
    ],
  },
  issuingOrganization: {
    type: 'string',
    required: true,
    label: 'Issuing Organization',
    rules: [
      {
        required: true,
        message: 'Issuing organization is required',
      },
    ],
  },
  issueDate: {
    type: 'date',
    required: true,
    label: 'Issue Date',
    rules: [
      {
        required: true,
        message: 'Issue date is required',
      },
    ],
  },
  expiryDate: {
    type: 'date',
    label: 'Expiry Date',
  },
  status: {
    type: 'select',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'expired', label: 'Expired' },
      { value: 'suspended', label: 'Suspended' },
      { value: 'renewed', label: 'Renewed' },
      { value: 'pending_renewal', label: 'Pending Renewal' },
    ],
    default: 'active',
  },
  level: {
    type: 'select',
    label: 'Level',
    options: [
      { value: 'basic', label: 'Basic' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'master', label: 'Master' },
    ],
  },
  score: {
    type: 'number',
    label: 'Score',
  },
  requiredForJob: {
    type: 'boolean',
    label: 'Required for Job',
    default: false,
  },
  notes: {
    type: 'textarea',
    label: 'Notes',
  },
};
