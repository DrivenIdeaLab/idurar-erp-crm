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
  entryType: {
    type: 'select',
    label: 'Entry Type',
    required: true,
    options: [
      { value: 'clock_in', label: 'Clock In' },
      { value: 'clock_out', label: 'Clock Out' },
      { value: 'break_start', label: 'Break Start' },
      { value: 'break_end', label: 'Break End' },
    ],
    rules: [
      {
        required: true,
        message: 'Entry type is required',
      },
    ],
  },
  timestamp: {
    type: 'datetime',
    label: 'Timestamp',
    required: true,
    default: new Date(),
  },
  scheduledShiftStart: {
    type: 'datetime',
    label: 'Scheduled Shift Start',
  },
  scheduledShiftEnd: {
    type: 'datetime',
    label: 'Scheduled Shift End',
  },
  status: {
    type: 'select',
    label: 'Status',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'adjusted', label: 'Adjusted' },
    ],
    default: 'pending',
  },
  notes: {
    type: 'textarea',
    label: 'Notes',
  },
};
