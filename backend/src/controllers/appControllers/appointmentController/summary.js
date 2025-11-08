/**
 * Get appointment summary statistics
 * @route GET /appointment/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { removed: false };

    if (startDate || endDate) {
      filter.appointmentDate = {};
      if (startDate) filter.appointmentDate.$gte = new Date(startDate);
      if (endDate) filter.appointmentDate.$lte = new Date(endDate);
    }

    // Total appointments
    const totalAppointments = await Model.countDocuments(filter);

    // Appointments by status
    const appointmentsByStatus = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Appointments by service type
    const appointmentsByType = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Upcoming appointments (next 7 days)
    const upcomingAppointments = await Model.find({
      ...filter,
      appointmentDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      status: { $in: ['scheduled', 'confirmed'] },
    })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(20)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'vin make model year')
      .populate('technician', 'name');

    // Today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysAppointments = await Model.find({
      ...filter,
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .sort({ appointmentTime: 1 })
      .populate('customer', 'name email phone')
      .populate('vehicle', 'vin make model year')
      .populate('technician', 'name');

    // No-show rate
    const totalCompleted = await Model.countDocuments({
      ...filter,
      status: { $in: ['completed', 'no_show'] },
    });
    const noShows = await Model.countDocuments({
      ...filter,
      status: 'no_show',
    });
    const noShowRate = totalCompleted > 0 ? ((noShows / totalCompleted) * 100).toFixed(2) : 0;

    return res.status(200).json({
      success: true,
      result: {
        totalAppointments,
        appointmentsByStatus,
        appointmentsByType,
        upcomingAppointments,
        todaysAppointments,
        noShowRate: parseFloat(noShowRate),
      },
      message: 'Appointment summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving appointment summary',
    });
  }
};

module.exports = summary;
