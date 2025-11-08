/**
 * Check stock levels for parts
 * @route GET /part/check-stock
 */
const checkStock = async (Model, req, res) => {
  try {
    const { partNumber, partId, threshold } = req.query;

    if (partNumber) {
      // Check specific part by part number
      const part = await Model.findOne({
        partNumber: partNumber.toUpperCase(),
        removed: false,
      }).populate('supplier', 'companyName contactPerson phone email');

      if (!part) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'Part not found',
        });
      }

      return res.status(200).json({
        success: true,
        result: {
          part: {
            _id: part._id,
            partNumber: part.partNumber,
            name: part.name,
            quantityOnHand: part.quantityOnHand,
            quantityReserved: part.quantityReserved,
            quantityAvailable: part.quantityAvailable,
            reorderPoint: part.reorderPoint,
            reorderQuantity: part.reorderQuantity,
            outOfStock: part.outOfStock,
            lowStockAlert: part.lowStockAlert,
            supplier: part.supplier,
          },
          status: part.outOfStock
            ? 'out_of_stock'
            : part.lowStockAlert
            ? 'low_stock'
            : 'in_stock',
        },
        message: 'Stock level retrieved successfully',
      });
    } else if (partId) {
      // Check specific part by ID
      const part = await Model.findOne({
        _id: partId,
        removed: false,
      }).populate('supplier', 'companyName contactPerson phone email');

      if (!part) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'Part not found',
        });
      }

      return res.status(200).json({
        success: true,
        result: {
          part: {
            _id: part._id,
            partNumber: part.partNumber,
            name: part.name,
            quantityOnHand: part.quantityOnHand,
            quantityReserved: part.quantityReserved,
            quantityAvailable: part.quantityAvailable,
            reorderPoint: part.reorderPoint,
            reorderQuantity: part.reorderQuantity,
            outOfStock: part.outOfStock,
            lowStockAlert: part.lowStockAlert,
            supplier: part.supplier,
          },
          status: part.outOfStock
            ? 'out_of_stock'
            : part.lowStockAlert
            ? 'low_stock'
            : 'in_stock',
        },
        message: 'Stock level retrieved successfully',
      });
    } else {
      // Get all parts with stock alerts
      const customThreshold = threshold ? parseInt(threshold) : null;

      const filter = { removed: false, isActive: true };

      // Build query for stock alerts
      if (customThreshold) {
        filter.$or = [
          { outOfStock: true },
          { quantityOnHand: { $lte: customThreshold } },
        ];
      } else {
        filter.$or = [{ outOfStock: true }, { lowStockAlert: true }];
      }

      const parts = await Model.find(filter)
        .populate('supplier', 'companyName contactPerson phone email')
        .sort({ quantityOnHand: 1 });

      const outOfStock = parts.filter((p) => p.outOfStock);
      const lowStock = parts.filter((p) => !p.outOfStock && p.lowStockAlert);

      return res.status(200).json({
        success: true,
        result: {
          totalAlerts: parts.length,
          outOfStock: {
            count: outOfStock.length,
            parts: outOfStock.map((p) => ({
              _id: p._id,
              partNumber: p.partNumber,
              name: p.name,
              quantityOnHand: p.quantityOnHand,
              reorderPoint: p.reorderPoint,
              reorderQuantity: p.reorderQuantity,
              supplier: p.supplier,
            })),
          },
          lowStock: {
            count: lowStock.length,
            parts: lowStock.map((p) => ({
              _id: p._id,
              partNumber: p.partNumber,
              name: p.name,
              quantityOnHand: p.quantityOnHand,
              reorderPoint: p.reorderPoint,
              reorderQuantity: p.reorderQuantity,
              supplier: p.supplier,
            })),
          },
        },
        message: 'Stock alerts retrieved successfully',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error checking stock levels',
    });
  }
};

module.exports = checkStock;
