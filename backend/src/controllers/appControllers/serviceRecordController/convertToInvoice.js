const mongoose = require('mongoose');

/**
 * Convert service record to invoice
 * @route POST /servicerecord/convert-to-invoice/:id
 */
const convertToInvoice = async (Model, req, res) => {
  try {
    const { id } = req.params;

    const serviceRecord = await Model.findOne({ _id: id, removed: false });

    if (!serviceRecord) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Service record not found',
      });
    }

    // Check if already converted
    if (serviceRecord.invoice) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Service record already converted to invoice',
      });
    }

    // Check if service is completed
    if (serviceRecord.status !== 'completed') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Service record must be completed before converting to invoice',
      });
    }

    const Invoice = mongoose.model('Invoice');

    // Get the latest invoice number for this year
    const currentYear = new Date().getFullYear();
    const lastInvoice = await Invoice.findOne({ year: currentYear })
      .sort({ number: -1 })
      .limit(1);

    const invoiceNumber = lastInvoice ? lastInvoice.number + 1 : 1;

    // Build invoice items from parts and labor
    const items = [];

    // Add parts as line items
    serviceRecord.parts.forEach((part) => {
      items.push({
        itemName: part.partName,
        description: `Part #${part.partNumber || 'N/A'} - ${part.partName}`,
        quantity: part.quantity,
        price: part.unitPrice,
        total: part.total,
      });
    });

    // Add labor as line items
    serviceRecord.labor.forEach((labor) => {
      items.push({
        itemName: 'Labor',
        description: labor.description,
        quantity: labor.hours,
        price: labor.rate,
        total: labor.total,
      });
    });

    // Create invoice
    const invoice = new Invoice({
      number: invoiceNumber,
      year: currentYear,
      client: serviceRecord.customer,
      date: new Date(),
      expiredDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      items,
      taxRate: serviceRecord.taxRate,
      subTotal: serviceRecord.subTotal,
      taxTotal: serviceRecord.taxTotal,
      total: serviceRecord.total,
      status: 'sent',
      notes: `Service: ${serviceRecord.serviceType}\nVehicle: ${serviceRecord.vehicle.make} ${serviceRecord.vehicle.model} (${serviceRecord.vehicle.vin})\nService Record #${serviceRecord.number}`,
      createdBy: req.admin._id,
    });

    await invoice.save();

    // Update service record with invoice reference
    serviceRecord.invoice = invoice._id;
    serviceRecord.status = 'invoiced';
    await serviceRecord.save();

    return res.status(200).json({
      success: true,
      result: {
        invoice: {
          _id: invoice._id,
          number: invoice.number,
          year: invoice.year,
          total: invoice.total,
        },
        serviceRecord: {
          _id: serviceRecord._id,
          number: serviceRecord.number,
          status: serviceRecord.status,
        },
      },
      message: 'Service record converted to invoice successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error converting service record to invoice',
    });
  }
};

module.exports = convertToInvoice;
