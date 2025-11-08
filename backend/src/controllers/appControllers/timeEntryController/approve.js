/**
 * Approve time entries
 * @route POST /timeentry/approve/:id
 */
const approve = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Status must be either approved or rejected',
      });
    }

    const timeEntry = await Model.findOne({ _id: id, removed: false });

    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Time entry not found',
      });
    }

    if (timeEntry.status === 'approved' || timeEntry.status === 'rejected') {
      return res.status(400).json({
        success: false,
        result: null,
        message: `Time entry already ${timeEntry.status}`,
      });
    }

    timeEntry.status = status;
    timeEntry.approvedBy = req.admin._id;
    timeEntry.approvalDate = new Date();
    if (notes) {
      timeEntry.notes = timeEntry.notes ? `${timeEntry.notes}\n${notes}` : notes;
    }

    await timeEntry.save();

    await timeEntry.populate('employee', 'employeeNumber firstName lastName');
    await timeEntry.populate('approvedBy', 'name email');

    return res.status(200).json({
      success: true,
      result: {
        _id: timeEntry._id,
        employee: timeEntry.employee,
        entryType: timeEntry.entryType,
        timestamp: timeEntry.timestamp,
        hoursWorked: timeEntry.hoursWorked,
        status: timeEntry.status,
        approvedBy: timeEntry.approvedBy,
        approvalDate: timeEntry.approvalDate,
      },
      message: `Time entry ${status} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error approving time entry',
    });
  }
};

module.exports = approve;
