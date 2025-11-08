const { decodeVIN } = require('@/utils/vinDecoder');

/**
 * Decode VIN and return vehicle information
 * @route POST /vehicle/decode-vin
 */
const decodeVin = async (Model, req, res) => {
  try {
    const { vin } = req.body;

    if (!vin) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'VIN is required',
      });
    }

    // Decode the VIN
    const decodedData = await decodeVIN(vin);

    if (!decodedData.success) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Failed to decode VIN',
      });
    }

    // Check if vehicle already exists
    const existingVehicle = await Model.findOne({
      vin: decodedData.vin,
      removed: false,
    });

    if (existingVehicle) {
      return res.status(200).json({
        success: true,
        result: {
          ...decodedData,
          exists: true,
          vehicle: existingVehicle,
        },
        message: 'VIN decoded successfully. Vehicle already exists in the system.',
      });
    }

    return res.status(200).json({
      success: true,
      result: {
        ...decodedData,
        exists: false,
      },
      message: 'VIN decoded successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error decoding VIN',
    });
  }
};

module.exports = decodeVin;
