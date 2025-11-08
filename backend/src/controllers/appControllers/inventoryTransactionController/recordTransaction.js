const mongoose = require('mongoose');

/**
 * Record an inventory transaction and update part quantities
 * @route POST /inventorytransaction/record-transaction
 */
const recordTransaction = async (Model, req, res) => {
  try {
    const {
      part,
      type,
      quantityChange,
      unitCost,
      unitPrice,
      purchaseOrder,
      serviceRecord,
      invoice,
      fromLocation,
      toLocation,
      reason,
      notes,
    } = req.body;

    if (!part || !type || !quantityChange) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Part, transaction type, and quantity change are required',
      });
    }

    // Validate transaction type
    const validTypes = [
      'purchase',
      'sale',
      'adjustment',
      'return',
      'transfer',
      'damaged',
      'found',
      'lost',
      'reserved',
      'unreserved',
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    // Find the part
    const Part = mongoose.model('Part');
    const partRecord = await Part.findOne({ _id: part, removed: false });

    if (!partRecord) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Part not found',
      });
    }

    // Calculate quantities based on transaction type
    let actualQuantityChange = quantityChange;
    let quantityBefore = partRecord.quantityOnHand;
    let reservedBefore = partRecord.quantityReserved;

    // Handle reserved/unreserved separately
    if (type === 'reserved') {
      // Reserved transactions don't change on-hand quantity
      if (quantityChange > partRecord.quantityAvailable) {
        return res.status(400).json({
          success: false,
          result: null,
          message: `Cannot reserve ${quantityChange} units. Only ${partRecord.quantityAvailable} available.`,
        });
      }
      partRecord.quantityReserved += quantityChange;
      actualQuantityChange = 0; // Don't change on-hand
    } else if (type === 'unreserved') {
      // Unreserved transactions release reserved stock
      if (quantityChange > partRecord.quantityReserved) {
        return res.status(400).json({
          success: false,
          result: null,
          message: `Cannot unreserve ${quantityChange} units. Only ${partRecord.quantityReserved} reserved.`,
        });
      }
      partRecord.quantityReserved -= quantityChange;
      actualQuantityChange = 0; // Don't change on-hand
    } else {
      // For other transaction types, update on-hand quantity
      // Negative changes for: sale, damaged, lost
      // Positive changes for: purchase, return, found, adjustment (can be either)
      if (['sale', 'damaged', 'lost'].includes(type) && quantityChange > 0) {
        actualQuantityChange = -Math.abs(quantityChange);
      } else if (['purchase', 'return', 'found'].includes(type) && quantityChange < 0) {
        actualQuantityChange = Math.abs(quantityChange);
      }

      // Validate we have enough stock for negative changes
      if (actualQuantityChange < 0 && Math.abs(actualQuantityChange) > partRecord.quantityOnHand) {
        return res.status(400).json({
          success: false,
          result: null,
          message: `Insufficient stock. Available: ${partRecord.quantityOnHand}, Required: ${Math.abs(actualQuantityChange)}`,
        });
      }

      partRecord.quantityOnHand += actualQuantityChange;
    }

    const quantityAfter = partRecord.quantityOnHand;

    // Update last restocked/sold dates
    if (actualQuantityChange > 0) {
      partRecord.lastRestocked = new Date();
    } else if (actualQuantityChange < 0 && type === 'sale') {
      partRecord.lastSold = new Date();
    }

    // Save part updates
    await partRecord.save();

    // Create the transaction record
    const transaction = await Model.create({
      part: part,
      type: type,
      quantityChange: actualQuantityChange,
      quantityBefore: quantityBefore,
      quantityAfter: quantityAfter,
      unitCost: unitCost || partRecord.costPrice,
      totalCost: (unitCost || partRecord.costPrice) * Math.abs(actualQuantityChange),
      unitPrice: unitPrice || partRecord.sellPrice,
      totalPrice: (unitPrice || partRecord.sellPrice) * Math.abs(actualQuantityChange),
      purchaseOrder: purchaseOrder,
      serviceRecord: serviceRecord,
      invoice: invoice,
      fromLocation: fromLocation,
      toLocation: toLocation,
      reason: reason,
      notes: notes,
      performedBy: req.admin._id,
      transactionDate: new Date(),
    });

    // Populate the transaction
    await transaction.populate('part', 'partNumber name category');
    await transaction.populate('performedBy', 'name email');

    return res.status(200).json({
      success: true,
      result: {
        transaction: transaction,
        part: {
          _id: partRecord._id,
          partNumber: partRecord.partNumber,
          name: partRecord.name,
          quantityBefore: quantityBefore,
          quantityAfter: quantityAfter,
          quantityOnHand: partRecord.quantityOnHand,
          quantityReserved: partRecord.quantityReserved,
          quantityAvailable: partRecord.quantityAvailable,
          outOfStock: partRecord.outOfStock,
          lowStockAlert: partRecord.lowStockAlert,
        },
      },
      message: 'Transaction recorded successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error recording transaction',
    });
  }
};

module.exports = recordTransaction;
