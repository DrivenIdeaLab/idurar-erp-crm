const mongoose = require('mongoose');

/**
 * Get service advisor dashboard metrics
 * @route GET /api/analytics/advisor-dashboard
 */
const serviceAdvisorDashboard = async (req, res) => {
  try {
    const { advisorId } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const Appointment = mongoose.model('Appointment');
    const ServiceRecord = mongoose.model('ServiceRecord');
    const Invoice = mongoose.model('Invoice');

    // Build filter for advisor
    const advisorFilter = advisorId ? { assignedTo: advisorId } : {};

    // Today's appointments
    const todayAppointments = await Appointment.find({
      appointmentDate: { $gte: today, $lt: tomorrow },
      removed: false,
      ...advisorFilter,
    })
      .populate('vehicle', 'make model year licensePlate')
      .populate('customer', 'name phone')
      .sort({ appointmentTime: 1 });

    // Pending approvals
    const pendingApprovals = await ServiceRecord.find({
      status: 'pending_approval',
      removed: false,
      ...advisorFilter,
    })
      .populate('vehicle', 'make model year licensePlate')
      .populate('customer', 'name phone')
      .limit(10);

    // Ready for pickup
    const readyForPickup = await ServiceRecord.find({
      status: 'completed',
      removed: false,
      ...advisorFilter,
    })
      .populate('vehicle', 'make model year licensePlate')
      .populate('customer', 'name phone')
      .limit(10);

    // Today's sales
    const todaySales = await Invoice.aggregate([
      {
        $match: {
          removed: false,
          created: { $gte: today, $lt: tomorrow },
          ...(advisorId ? { createdBy: mongoose.Types.ObjectId(advisorId) } : {}),
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' },
          paidAmount: { $sum: '$paidAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Open service records
    const openServiceRecords = await ServiceRecord.find({
      status: { $in: ['in_progress', 'pending_parts'] },
      removed: false,
      ...advisorFilter,
    })
      .populate('vehicle', 'make model year licensePlate')
      .populate('customer', 'name phone')
      .limit(10);

    // Weekly stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyStats = await ServiceRecord.aggregate([
      {
        $match: {
          removed: false,
          created: { $gte: weekAgo },
          ...advisorFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalServices: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          completed: {
            $sum: {
              $cond: [
                { $in: ['$status', ['completed', 'invoiced']] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      result: {
        todayAppointments: {
          count: todayAppointments.length,
          appointments: todayAppointments,
        },
        pendingApprovals: {
          count: pendingApprovals.length,
          items: pendingApprovals,
        },
        readyForPickup: {
          count: readyForPickup.length,
          items: readyForPickup,
        },
        todaySales: todaySales[0] || {
          totalSales: 0,
          paidAmount: 0,
          count: 0,
        },
        openServiceRecords: {
          count: openServiceRecords.length,
          items: openServiceRecords,
        },
        weeklyStats: weeklyStats[0] || {
          totalServices: 0,
          totalRevenue: 0,
          completed: 0,
        },
      },
      message: 'Service advisor dashboard retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving advisor dashboard',
    });
  }
};

module.exports = serviceAdvisorDashboard;
