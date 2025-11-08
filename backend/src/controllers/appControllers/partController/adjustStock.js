const mongoose = require('mongoose');

/**
 * Adjust stock levels for a part
 * @route POST /part/adjust-stock/:id
 */
const adjustStock = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const {
      adjustment,
      type = 'adjustment',
      reason,
      notes,
      location,
      unitCost,
    } = req.body;

    if (!adjustment || adjustment === 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Adjustment quantity is required and cannot be zero',
      });
    }

    // Find the part
    const part = await Model.findOne({ _id: id, removed: false });

    if (!part) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Part not found',
      });
    }

    // Calculate new quantity
    const quantityBefore = part.quantityOnHand;
    const quantityAfter = quantityBefore + adjustment;

    // Validate new quantity
    if (quantityAfter < 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: `Cannot adjust stock. Current quantity: ${quantityBefore}, Adjustment: ${adjustment}`,
      });
    }

    // Update part quantity
    part.quantityOnHand = quantityAfter;

    // Update last restocked date if adding stock
    if (adjustment > 0) {
      part.lastRestocked = new Date();
    }

    await part.save();

    // Create inventory transaction record
    const InventoryTransaction = mongoose.model('InventoryTransaction');
    const transaction = await InventoryTransaction.create({
      part: part._id,
      type: type,
      quantityChange: adjustment,
      quantityBefore: quantityBefore,
      quantityAfter: quantityAfter,
      unitCost: unitCost || part.costPrice,
      totalCost: unitCost ? unitCost * Math.abs(adjustment) : part.costPrice * Math.abs(adjustment),
      fromLocation: adjustment < 0 ? location : null,
      toLocation: adjustment > 0 ? location : null,
      reason: reason,
      notes: notes,
      performedBy: req.admin._id,
      transactionDate: new Date(),
    });

    return res.status(200).json({
      success: true,
      result: {
        part: {
          _id: part._id,
          partNumber: part.partNumber,
          name: part.name,
          quantityBefore: quantityBefore,
          quantityAfter: quantityAfter,
          quantityAvailable: part.quantityAvailable,
          adjustment: adjustment,
          outOfStock: part.outOfStock,
          lowStockAlert: part.lowStockAlert,
        },
        transaction: {
          _id: transaction._id,
          type: transaction.type,
          quantityChange: transaction.quantityChange,
          transactionDate: transaction.transactionDate,
        },
      },
      message: 'Stock adjusted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error adjusting stock',
    });
  }
};

module.exports = adjustStock;
