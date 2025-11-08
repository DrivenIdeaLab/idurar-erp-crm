/**
 * Update vehicle mileage
 * @route POST /vehicle/update-mileage/:id
 */
const updateMileage = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { mileage, serviceRecordId } = req.body;

    if (!mileage || mileage < 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Valid mileage is required',
      });
    }

    const vehicle = await Model.findOne({ _id: id, removed: false });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Vehicle not found',
      });
    }

    // Check if new mileage is less than current (possible rollback/error)
    if (mileage < vehicle.currentMileage) {
      return res.status(400).json({
        success: false,
        result: null,
        message: `New mileage (${mileage}) cannot be less than current mileage (${vehicle.currentMileage})`,
      });
    }

    // Update current mileage
    vehicle.currentMileage = mileage;

    // Add to mileage history
    vehicle.mileageHistory.push({
      mileage,
      recordedDate: new Date(),
      recordedBy: req.admin._id,
      serviceRecordId: serviceRecordId || null,
    });

    vehicle.updated = Date.now();

    await vehicle.save();

    return res.status(200).json({
      success: true,
      result: vehicle,
      message: 'Vehicle mileage updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error updating vehicle mileage',
    });
  }
};

module.exports = updateMileage;
