/**
 * Get certification summary statistics
 * @route GET /certification/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { employee, certificationType } = req.query;

    const filter = { removed: false, enabled: true };

    if (employee) {
      filter.employee = employee;
    }

    if (certificationType) {
      filter.certificationType = certificationType;
    }

    // Total certifications
    const totalCertifications = await Model.countDocuments(filter);

    // By status
    const byStatus = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // By type
    const byType = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$certificationType',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // By employee
    const byEmployee = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$employee',
          count: { $sum: 1 },
          activeCerts: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          expiringCerts: {
            $sum: { $cond: ['$isExpiring', 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employeeDetails',
        },
      },
      {
        $unwind: {
          path: '$employeeDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          employee: {
            _id: '$_id',
            employeeNumber: '$employeeDetails.employeeNumber',
            firstName: '$employeeDetails.firstName',
            lastName: '$employeeDetails.lastName',
          },
          count: 1,
          activeCerts: 1,
          expiringCerts: 1,
        },
      },
    ]);

    // Expiring soon (within 30 days)
    const today = new Date();
    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);

    const expiringSoon = await Model.countDocuments({
      ...filter,
      expiryDate: { $gte: today, $lte: in30Days },
      status: { $in: ['active', 'pending_renewal'] },
    });

    // Already expired
    const expired = await Model.countDocuments({
      ...filter,
      expiryDate: { $lt: today },
      status: 'expired',
    });

    // Recent certifications
    const recentCertifications = await Model.find(filter)
      .sort({ issueDate: -1 })
      .limit(10)
      .populate('employee', 'employeeNumber firstName lastName position');

    // Certifications requiring renewal
    const requiresRenewal = await Model.find({
      ...filter,
      $or: [{ status: 'expired' }, { status: 'pending_renewal' }],
    })
      .populate('employee', 'employeeNumber firstName lastName position')
      .sort({ expiryDate: 1 })
      .limit(20);

    // Master technicians
    const masterTechnicians = await Model.find({
      ...filter,
      certificationType: 'ase_master',
      status: 'active',
    }).populate('employee', 'employeeNumber firstName lastName position');

    return res.status(200).json({
      success: true,
      result: {
        overview: {
          totalCertifications,
          active: byStatus.find((s) => s._id === 'active')?.count || 0,
          expiringSoon,
          expired,
          masterTechnicians: masterTechnicians.length,
        },
        byStatus,
        byType,
        byEmployee,
        recentCertifications,
        requiresRenewal: {
          count: requiresRenewal.length,
          items: requiresRenewal,
        },
        masterTechnicians: masterTechnicians,
      },
      message: 'Certification summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving certification summary',
    });
  }
};

module.exports = summary;
