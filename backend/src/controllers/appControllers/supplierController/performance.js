const mongoose = require('mongoose');

/**
 * Get supplier performance metrics
 * @route GET /supplier/performance/:id
 */
const performance = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Find the supplier
    const supplier = await Model.findOne({ _id: id, removed: false });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Supplier not found',
      });
    }

    const PurchaseOrder = mongoose.model('PurchaseOrder');

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.orderDate = {};
      if (startDate) {
        dateFilter.orderDate.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.orderDate.$lte = new Date(endDate);
      }
    }

    // Get all purchase orders for this supplier
    const purchaseOrders = await PurchaseOrder.find({
      supplier: id,
      removed: false,
      ...dateFilter,
    });

    // Calculate metrics
    const totalOrders = purchaseOrders.length;
    const totalSpent = purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0);
    const totalPaid = purchaseOrders.reduce((sum, po) => sum + (po.paidAmount || 0), 0);

    // Order status breakdown
    const ordersByStatus = {};
    purchaseOrders.forEach((po) => {
      ordersByStatus[po.status] = (ordersByStatus[po.status] || 0) + 1;
    });

    // On-time delivery calculation
    const receivedOrders = purchaseOrders.filter(
      (po) => po.status === 'received' && po.expectedDeliveryDate && po.actualDeliveryDate
    );

    let onTimeDeliveries = 0;
    let totalLeadDays = 0;

    receivedOrders.forEach((po) => {
      const expected = new Date(po.expectedDeliveryDate);
      const actual = new Date(po.actualDeliveryDate);
      const orderDate = new Date(po.orderDate);

      if (actual <= expected) {
        onTimeDeliveries++;
      }

      // Calculate lead time in days
      const leadTime = Math.floor((actual - orderDate) / (1000 * 60 * 60 * 24));
      totalLeadDays += leadTime;
    });

    const onTimeDeliveryRate =
      receivedOrders.length > 0 ? (onTimeDeliveries / receivedOrders.length) * 100 : 0;

    const averageLeadTime =
      receivedOrders.length > 0 ? Math.round(totalLeadDays / receivedOrders.length) : 0;

    // Average order value
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Recent orders
    const recentOrders = await PurchaseOrder.find({
      supplier: id,
      removed: false,
    })
      .sort({ orderDate: -1 })
      .limit(10)
      .select('poNumber orderDate status total expectedDeliveryDate actualDeliveryDate');

    // Parts supplied
    const Part = mongoose.model('Part');
    const partCount = await Part.countDocuments({
      supplier: id,
      removed: false,
      isActive: true,
    });

    const parts = await Part.find({
      supplier: id,
      removed: false,
      isActive: true,
    })
      .select('partNumber name category quantityOnHand costPrice')
      .limit(20);

    // Monthly spending trend
    const monthlySpending = await PurchaseOrder.aggregate([
      {
        $match: {
          supplier: mongoose.Types.ObjectId(id),
          removed: false,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
          },
          totalSpent: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
        },
      },
      { $limit: 12 },
    ]);

    // Update supplier metrics
    supplier.totalOrders = totalOrders;
    supplier.totalSpent = totalSpent;
    supplier.averageLeadTime = averageLeadTime;
    supplier.onTimeDeliveryRate = onTimeDeliveryRate;
    supplier.lastOrderDate = purchaseOrders.length > 0 ? purchaseOrders[0].orderDate : null;
    await supplier.save();

    return res.status(200).json({
      success: true,
      result: {
        supplier: {
          _id: supplier._id,
          companyName: supplier.companyName,
          rating: supplier.rating,
          isPreferred: supplier.isPreferred,
        },
        metrics: {
          totalOrders,
          totalSpent,
          totalPaid,
          totalOutstanding: totalSpent - totalPaid,
          averageOrderValue,
          averageLeadTime,
          onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 100) / 100,
          partsSupplied: partCount,
        },
        ordersByStatus,
        monthlySpending,
        recentOrders,
        parts: {
          count: partCount,
          items: parts,
        },
      },
      message: 'Supplier performance metrics retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error retrieving supplier performance',
    });
  }
};

module.exports = performance;
