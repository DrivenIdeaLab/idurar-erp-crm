/**
 * Get supplier summary statistics
 * @route GET /supplier/summary
 */
const summary = async (Model, req, res) => {
  try {
    const { category, isPreferred, isActive } = req.query;

    // Build filter
    const filter = { removed: false };

    if (category) {
      filter.categories = category;
    }

    if (isPreferred !== undefined) {
      filter.isPreferred = isPreferred === 'true';
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Total suppliers
    const totalSuppliers = await Model.countDocuments(filter);

    // Active vs inactive
    const activeSuppliers = await Model.countDocuments({ ...filter, isActive: true });
    const inactiveSuppliers = await Model.countDocuments({ ...filter, isActive: false });

    // Preferred suppliers
    const preferredSuppliers = await Model.countDocuments({ ...filter, isPreferred: true });

    // Suppliers by category
    const suppliersByCategory = await Model.aggregate([
      { $match: filter },
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Top suppliers by total spent
    const topSuppliersBySpending = await Model.find(filter)
      .sort({ totalSpent: -1 })
      .limit(10)
      .select('companyName totalSpent totalOrders rating onTimeDeliveryRate isPreferred');

    // Top suppliers by rating
    const topSuppliersByRating = await Model.find(filter)
      .sort({ rating: -1, totalOrders: -1 })
      .limit(10)
      .select('companyName rating totalOrders totalSpent onTimeDeliveryRate isPreferred');

    // Suppliers with best on-time delivery
    const bestOnTimeDelivery = await Model.find({
      ...filter,
      totalOrders: { $gte: 5 }, // At least 5 orders
    })
      .sort({ onTimeDeliveryRate: -1 })
      .limit(10)
      .select('companyName onTimeDeliveryRate totalOrders averageLeadTime rating');

    // Recent suppliers (newly added)
    const recentSuppliers = await Model.find(filter)
      .sort({ created: -1 })
      .limit(5)
      .select('companyName email phone categories created');

    // Suppliers needing review (low rating or poor delivery)
    const suppliersNeedingReview = await Model.find({
      ...filter,
      isActive: true,
      $or: [{ rating: { $lte: 2 } }, { onTimeDeliveryRate: { $lt: 80 } }],
    })
      .sort({ rating: 1 })
      .limit(10)
      .select('companyName rating onTimeDeliveryRate totalOrders lastOrderDate');

    // Calculate total spending across all suppliers
    const spendingStats = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSpending: { $sum: '$totalSpent' },
          averageSpentPerSupplier: { $avg: '$totalSpent' },
          totalOrdersAllSuppliers: { $sum: '$totalOrders' },
        },
      },
    ]);

    // Average metrics
    const averageMetrics = await Model.aggregate([
      { $match: { ...filter, totalOrders: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          averageOnTimeDelivery: { $avg: '$onTimeDeliveryRate' },
          averageLeadTime: { $avg: '$averageLeadTime' },
        },
      },
    ]);

    // Suppliers by payment terms
    const suppliersByPaymentTerms = await Model.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$paymentTerms',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      result: {
        overview: {
          totalSuppliers,
          activeSuppliers,
          inactiveSuppliers,
          preferredSuppliers,
          ...(spendingStats[0] || {
            totalSpending: 0,
            averageSpentPerSupplier: 0,
            totalOrdersAllSuppliers: 0,
          }),
        },
        averageMetrics: averageMetrics[0] || {
          averageRating: 0,
          averageOnTimeDelivery: 0,
          averageLeadTime: 0,
        },
        suppliersByCategory,
        suppliersByPaymentTerms,
        topSuppliersBySpending,
        topSuppliersByRating,
        bestOnTimeDelivery,
        recentSuppliers,
        suppliersNeedingReview: {
          count: suppliersNeedingReview.length,
          items: suppliersNeedingReview,
        },
      },
      message: 'Supplier summary retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving supplier summary',
    });
  }
};

module.exports = summary;
