/**
 * Get vehicle summary statistics
 * @route GET /vehicle/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { customer } = req.query;

    const filter = { removed: false };
    if (customer) {
      filter.customer = customer;
    }

    // Total vehicles
    const totalVehicles = await Model.countDocuments(filter);

    // Vehicles by customer
    const vehiclesByCustomer = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$customer',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'customerDetails',
        },
      },
      {
        $unwind: {
          path: '$customerDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          customer: {
            _id: '$_id',
            name: '$customerDetails.name',
          },
          count: 1,
        },
      },
    ]);

    // Vehicles by make
    const vehiclesByMake = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$make',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Vehicles by year
    const vehiclesByYear = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Recently added vehicles
    const recentVehicles = await Model.find(filter)
      .sort({ created: -1 })
      .limit(5)
      .populate('customer', 'name email phone');

    return res.status(200).json({
      success: true,
      result: {
        totalVehicles,
        vehiclesByCustomer,
        vehiclesByMake,
        vehiclesByYear,
        recentVehicles,
      },
      message: 'Vehicle summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving vehicle summary',
    });
  }
};

module.exports = summary;
