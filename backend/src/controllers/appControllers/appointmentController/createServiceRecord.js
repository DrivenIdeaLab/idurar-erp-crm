const mongoose = require('mongoose');

/**
 * Create service record from appointment (when customer arrives)
 * @route POST /appointment/create-service-record/:id
 */
const createServiceRecord = async (Model, req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Model.findOne({ _id: id, removed: false });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Appointment not found',
      });
    }

    // Check if service record already exists
    if (appointment.serviceRecord) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Service record already created for this appointment',
      });
    }

    const ServiceRecord = mongoose.model('ServiceRecord');

    // Get the latest service record number for this year
    const currentYear = new Date().getFullYear();
    const lastServiceRecord = await ServiceRecord.findOne({ year: currentYear })
      .sort({ number: -1 })
      .limit(1);

    const serviceNumber = lastServiceRecord ? lastServiceRecord.number + 1 : 1;

    // Create service record
    const serviceRecord = new ServiceRecord({
      number: serviceNumber,
      year: currentYear,
      customer: appointment.customer,
      vehicle: appointment.vehicle,
      serviceType: appointment.serviceType,
      status: 'checked_in',
      scheduledDate: appointment.appointmentDate,
      checkInDate: new Date(),
      technician: appointment.technician,
      advisor: appointment.advisor,
      customerConcerns: appointment.customerConcerns,
      appointment: appointment._id,
      createdBy: req.admin._id,
    });

    await serviceRecord.save();

    // Update appointment
    appointment.serviceRecord = serviceRecord._id;
    appointment.status = 'in_service';
    await appointment.save();

    return res.status(200).json({
      success: true,
      result: {
        serviceRecord: {
          _id: serviceRecord._id,
          number: serviceRecord.number,
          year: serviceRecord.year,
          status: serviceRecord.status,
        },
        appointment: {
          _id: appointment._id,
          status: appointment.status,
        },
      },
      message: 'Service record created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error creating service record',
    });
  }
};

module.exports = createServiceRecord;
