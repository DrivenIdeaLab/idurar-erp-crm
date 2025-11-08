/**
 * Renew a certification
 * @route POST /certification/renew/:id
 */
const renew = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { newExpiryDate, notes, certificateUrl } = req.body;

    if (!newExpiryDate) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'New expiry date is required',
      });
    }

    const certification = await Model.findOne({ _id: id, removed: false });

    if (!certification) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Certification not found',
      });
    }

    const oldExpiryDate = certification.expiryDate;
    const renewalDate = new Date();

    // Add to renewal history
    certification.renewalHistory.push({
      renewalDate: renewalDate,
      previousExpiryDate: oldExpiryDate,
      newExpiryDate: new Date(newExpiryDate),
      notes: notes || 'Certification renewed',
    });

    // Update expiry date and status
    certification.expiryDate = new Date(newExpiryDate);
    certification.status = 'renewed';
    certification.expiryAlertSent = false; // Reset alert

    // Update certificate URL if provided
    if (certificateUrl) {
      certification.certificateUrl = certificateUrl;
    }

    await certification.save();

    await certification.populate('employee', 'employeeNumber firstName lastName position');

    return res.status(200).json({
      success: true,
      result: {
        _id: certification._id,
        employee: certification.employee,
        certificationType: certification.certificationType,
        certificationName: certification.certificationName,
        previousExpiryDate: oldExpiryDate,
        newExpiryDate: certification.expiryDate,
        status: certification.status,
        renewalHistory: certification.renewalHistory,
      },
      message: 'Certification renewed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error renewing certification',
    });
  }
};

module.exports = renew;
