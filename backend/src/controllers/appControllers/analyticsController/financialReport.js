const mongoose = require('mongoose');
const { validateDateRange } = require('@/middlewares/inputValidation');

/**
 * Generate financial report
 * @route GET /api/analytics/financial-report
 */
const financialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate date range
    const validation = validateDateRange(startDate, endDate);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        result: null,
        message: validation.errors.join(', '),
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const Invoice = mongoose.model('Invoice');
    const Payment = mongoose.model('Payment');
    const ServiceRecord = mongoose.model('ServiceRecord');
    const PurchaseOrder = mongoose.model('PurchaseOrder');

    // Revenue breakdown
    const revenueBreakdown = await Invoice.aggregate([
      {
        $match: {
          removed: false,
          invoiceDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalInvoiced: { $sum: '$total' },
          totalPaid: { $sum: '$paidAmount' },
          totalDue: { $sum: { $subtract: ['$total', '$paidAmount'] } },
          invoiceCount: { $sum: 1 },
          taxCollected: { $sum: '$taxAmount' },
        },
      },
    ]);

    // Revenue by category (labor vs parts)
    const revenueByCategory = await ServiceRecord.aggregate([
      {
        $match: {
          removed: false,
          created: { $gte: start, $lte: end },
          status: { $in: ['completed', 'invoiced'] },
        },
      },
      {
        $group: {
          _id: null,
          laborRevenue: { $sum: '$laborTotal' },
          partsRevenue: { $sum: '$partsTotal' },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Payments received
    const paymentsReceived = await Payment.aggregate([
      {
        $match: {
          removed: false,
          paymentDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$paymentMode',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Expenses (from purchase orders)
    const expenses = await PurchaseOrder.aggregate([
      {
        $match: {
          removed: false,
          orderDate: { $gte: start, $lte: end },
          status: { $in: ['received', 'partially_received'] },
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$total' },
          paidExpenses: { $sum: '$paidAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // AR Aging
    const arAging = await Invoice.aggregate([
      {
        $match: {
          removed: false,
          status: { $in: ['sent', 'partially_paid'] },
        },
      },
      {
        $addFields: {
          daysOutstanding: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), '$invoiceDate'] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
          amountDue: { $subtract: ['$total', '$paidAmount'] },
        },
      },
      {
        $bucket: {
          groupBy: '$daysOutstanding',
          boundaries: [0, 30, 60, 90, 120],
          default: '120+',
          output: {
            totalDue: { $sum: '$amountDue' },
            count: { $sum: 1 },
          },
        },
      },
    ]);

    // Calculate profit
    const totalRevenue = revenueBreakdown[0]?.totalPaid || 0;
    const totalExpenses = expenses[0]?.paidExpenses || 0;
    const grossProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return res.status(200).json({
      success: true,
      result: {
        period: {
          startDate: start,
          endDate: end,
        },
        revenue: revenueBreakdown[0] || {
          totalInvoiced: 0,
          totalPaid: 0,
          totalDue: 0,
          invoiceCount: 0,
          taxCollected: 0,
        },
        revenueByCategory: revenueByCategory[0] || {
          laborRevenue: 0,
          partsRevenue: 0,
          totalRevenue: 0,
        },
        expenses: expenses[0] || {
          totalExpenses: 0,
          paidExpenses: 0,
          count: 0,
        },
        profitLoss: {
          revenue: totalRevenue,
          expenses: totalExpenses,
          grossProfit: grossProfit,
          profitMargin: Math.round(profitMargin * 100) / 100,
        },
        paymentsReceived: paymentsReceived,
        arAging: arAging,
      },
      message: 'Financial report generated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error generating financial report',
    });
  }
};

module.exports = financialReport;
