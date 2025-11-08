/**
 * Get expiring certifications
 * @route GET /certification/expiring
 */
const expiring = async (Model, req, res) => {
  try {
    const { days = 30, employee } = req.query;

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const filter = {
      removed: false,
      enabled: true,
      expiryDate: {
        $gte: today,
        $lte: futureDate,
      },
      status: { $in: ['active', 'pending_renewal'] },
    };

    if (employee) {
      filter.employee = employee;
    }

    // Find certifications expiring within the specified days
    const expiringCerts = await Model.find(filter)
      .populate('employee', 'employeeNumber firstName lastName position')
      .sort({ expiryDate: 1 });

    // Group by urgency
    const urgent = [];
    const warning = [];
    const normal = [];

    expiringCerts.forEach((cert) => {
      const daysUntilExpiry = cert.daysUntilExpiry;
      if (daysUntilExpiry <= 7) {
        urgent.push(cert);
      } else if (daysUntilExpiry <= 14) {
        warning.push(cert);
      } else {
        normal.push(cert);
      }
    });

    // Already expired (but within grace period)
    const expired = await Model.find({
      removed: false,
      enabled: true,
      expiryDate: { $lt: today },
      status: 'expired',
      ...(employee ? { employee } : {}),
    })
      .populate('employee', 'employeeNumber firstName lastName position')
      .sort({ expiryDate: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      result: {
        summary: {
          totalExpiring: expiringCerts.length,
          urgent: urgent.length,
          warning: warning.length,
          normal: normal.length,
          expired: expired.length,
        },
        urgent: urgent,
        warning: warning,
        normal: normal,
        expired: expired,
      },
      message: 'Expiring certifications retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving expiring certifications',
    });
  }
};

module.exports = expiring;
