/**
 * Update purchase order status
 * @route POST /purchaseorder/update-status/:id
 */
const updateStatus = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Status is required',
      });
    }

    // Validate status
    const validStatuses = [
      'draft',
      'sent',
      'confirmed',
      'partially_received',
      'received',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Find the purchase order
    const purchaseOrder = await Model.findOne({ _id: id, removed: false });

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Purchase order not found',
      });
    }

    const oldStatus = purchaseOrder.status;

    // Validate status transitions
    if (oldStatus === 'received' && status !== 'received') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot change status of a fully received purchase order',
      });
    }

    if (oldStatus === 'cancelled' && status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot change status of a cancelled purchase order',
      });
    }

    // Update status
    purchaseOrder.status = status;

    // Set delivery date if status is received
    if (status === 'received' && !purchaseOrder.actualDeliveryDate) {
      purchaseOrder.actualDeliveryDate = new Date();
    }

    // Add status change note
    const statusNote = `[${new Date().toISOString()}] Status changed from ${oldStatus} to ${status}`;
    if (notes) {
      purchaseOrder.internalNotes = purchaseOrder.internalNotes
        ? `${purchaseOrder.internalNotes}\n\n${statusNote}\nNote: ${notes}`
        : `${statusNote}\nNote: ${notes}`;
    } else {
      purchaseOrder.internalNotes = purchaseOrder.internalNotes
        ? `${purchaseOrder.internalNotes}\n\n${statusNote}`
        : statusNote;
    }

    await purchaseOrder.save();

    return res.status(200).json({
      success: true,
      result: {
        _id: purchaseOrder._id,
        poNumber: purchaseOrder.poNumber,
        status: purchaseOrder.status,
        oldStatus: oldStatus,
        actualDeliveryDate: purchaseOrder.actualDeliveryDate,
      },
      message: 'Purchase order status updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error updating purchase order status',
    });
  }
};

module.exports = updateStatus;
