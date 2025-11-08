/**
 * Get inventory transaction summary statistics
 * @route GET /inventorytransaction/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { part, type, startDate, endDate } = req.query;

    // Build filter
    const filter = { removed: false };

    if (part) {
      filter.part = part;
    }

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) {
        filter.transactionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.transactionDate.$lte = new Date(endDate);
      }
    }

    // Total transactions
    const totalTransactions = await Model.countDocuments(filter);

    // Transactions by type
    const transactionsByType = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantityChange' },
          totalCost: { $sum: '$totalCost' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Transactions by part
    const transactionsByPart = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$part',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantityChange' },
          totalCost: { $sum: '$totalCost' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'parts',
          localField: '_id',
          foreignField: '_id',
          as: 'partDetails',
        },
      },
      {
        $unwind: {
          path: '$partDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          part: {
            _id: '$_id',
            partNumber: '$partDetails.partNumber',
            name: '$partDetails.name',
          },
          count: 1,
          totalQuantity: 1,
          totalCost: 1,
        },
      },
    ]);

    // Transactions by date (daily)
    const transactionsByDate = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$transactionDate' },
            month: { $month: '$transactionDate' },
            day: { $dayOfMonth: '$transactionDate' },
          },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantityChange' },
          totalCost: { $sum: '$totalCost' },
        },
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
          '_id.day': -1,
        },
      },
      { $limit: 30 },
    ]);

    // Recent transactions
    const recentTransactions = await Model.find(filter)
      .sort({ transactionDate: -1 })
      .limit(10)
      .populate('part', 'partNumber name category')
      .populate('performedBy', 'name email');

    // Calculate totals
    const totals = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$totalCost' },
          totalPrice: { $sum: '$totalPrice' },
          totalQuantityIn: {
            $sum: {
              $cond: [{ $gt: ['$quantityChange', 0] }, '$quantityChange', 0],
            },
          },
          totalQuantityOut: {
            $sum: {
              $cond: [{ $lt: ['$quantityChange', 0] }, { $abs: '$quantityChange' }, 0],
            },
          },
        },
      },
    ]);

    // Most active parts (by transaction count)
    const mostActiveParts = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$part',
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { transactionCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'parts',
          localField: '_id',
          foreignField: '_id',
          as: 'partDetails',
        },
      },
      {
        $unwind: {
          path: '$partDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          part: {
            _id: '$_id',
            partNumber: '$partDetails.partNumber',
            name: '$partDetails.name',
            category: '$partDetails.category',
          },
          transactionCount: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      result: {
        overview: {
          totalTransactions,
          ...(totals[0] || {
            totalCost: 0,
            totalPrice: 0,
            totalQuantityIn: 0,
            totalQuantityOut: 0,
          }),
        },
        transactionsByType,
        transactionsByPart,
        transactionsByDate,
        mostActiveParts,
        recentTransactions,
      },
      message: 'Inventory transaction summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving transaction summary',
    });
  }
};

module.exports = summary;
