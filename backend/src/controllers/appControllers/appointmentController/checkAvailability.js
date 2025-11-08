/**
 * Check appointment availability for a given date and time
 * @route GET /appointment/check-availability
 */
const checkAvailability = async (Model, req, res) => {
  try {
    const { date, time, duration = 60, technician } = req.query;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Date and time are required',
      });
    }

    const appointmentDate = new Date(date);
    const durationMinutes = parseInt(duration);

    // Build query
    const query = {
      appointmentDate,
      appointmentTime: time,
      status: { $in: ['scheduled', 'confirmed', 'arrived'] },
      removed: false,
    };

    if (technician) {
      query.technician = technician;
    }

    // Check if any appointments exist at this time
    const existingAppointments = await Model.find(query);

    // Calculate if there are conflicts
    const conflicts = existingAppointments.filter((apt) => {
      // Check if time slots overlap
      const existingDuration = apt.duration || 60;
      // For simplicity, if same date and time, it's a conflict
      return true;
    });

    const isAvailable = conflicts.length === 0;

    // Get available time slots for the day
    const allAppointments = await Model.find({
      appointmentDate,
      status: { $in: ['scheduled', 'confirmed', 'arrived'] },
      removed: false,
    }).sort({ appointmentTime: 1 });

    return res.status(200).json({
      success: true,
      result: {
        isAvailable,
        conflicts: conflicts.length,
        requestedDate: date,
        requestedTime: time,
        existingAppointments: allAppointments.map((apt) => ({
          time: apt.appointmentTime,
          duration: apt.duration,
          technician: apt.technician,
        })),
      },
      message: isAvailable
        ? 'Time slot is available'
        : 'Time slot is not available - conflicts found',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error checking availability',
    });
  }
};

module.exports = checkAvailability;
