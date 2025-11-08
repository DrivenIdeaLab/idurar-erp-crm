/**
 * Update service record status
 * @route POST /servicerecord/update-status/:id
 */
const updateStatus = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'scheduled',
      'checked_in',
      'in_progress',
      'awaiting_parts',
      'awaiting_approval',
      'completed',
      'invoiced',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid status value',
      });
    }

    const serviceRecord = await Model.findOne({ _id: id, removed: false });

    if (!serviceRecord) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Service record not found',
      });
    }

    // Update status and related fields
    serviceRecord.status = status;

    // Set timestamps based on status
    if (status === 'checked_in' && !serviceRecord.checkInDate) {
      serviceRecord.checkInDate = new Date();
    }

    if (status === 'completed' && !serviceRecord.completionDate) {
      serviceRecord.completionDate = new Date();
    }

    await serviceRecord.save();

    return res.status(200).json({
      success: true,
      result: serviceRecord,
      message: 'Service record status updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error updating service record status',
    });
  }
};

module.exports = updateStatus;
