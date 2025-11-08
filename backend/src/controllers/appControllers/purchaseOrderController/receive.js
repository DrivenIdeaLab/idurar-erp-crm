const mongoose = require('mongoose');

/**
 * Receive items from a purchase order
 * @route POST /purchaseorder/receive/:id
 */
const receive = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { items, actualDeliveryDate, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Items array is required',
      });
    }

    // Find the purchase order
    const purchaseOrder = await Model.findOne({ _id: id, removed: false }).populate('items.part');

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Purchase order not found',
      });
    }

    // Validate PO status
    if (!['sent', 'confirmed', 'partially_received'].includes(purchaseOrder.status)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: `Cannot receive items from PO with status: ${purchaseOrder.status}`,
      });
    }

    const Part = mongoose.model('Part');
    const InventoryTransaction = mongoose.model('InventoryTransaction');
    const receivedItems = [];

    // Process each received item
    for (const receivedItem of items) {
      const { itemId, quantityReceived } = receivedItem;

      if (!itemId || !quantityReceived || quantityReceived <= 0) {
        continue;
      }

      // Find the item in the PO
      const poItem = purchaseOrder.items.find((item) => item._id.toString() === itemId);

      if (!poItem) {
        return res.status(400).json({
          success: false,
          result: null,
          message: `Item ${itemId} not found in purchase order`,
        });
      }

      // Check if trying to receive more than ordered
      const totalReceived = (poItem.quantityReceived || 0) + quantityReceived;
      if (totalReceived > poItem.quantityOrdered) {
        return res.status(400).json({
          success: false,
          result: null,
          message: `Cannot receive ${quantityReceived} units of ${poItem.partNumber}. Maximum receivable: ${
            poItem.quantityOrdered - (poItem.quantityReceived || 0)
          }`,
        });
      }

      // Update PO item quantities
      poItem.quantityReceived = (poItem.quantityReceived || 0) + quantityReceived;
      poItem.quantityOutstanding = poItem.quantityOrdered - poItem.quantityReceived;

      // Update part inventory
      const part = await Part.findById(poItem.part);
      if (part) {
        const quantityBefore = part.quantityOnHand;
        part.quantityOnHand += quantityReceived;
        part.lastRestocked = new Date();
        await part.save();

        // Create inventory transaction
        await InventoryTransaction.create({
          part: part._id,
          type: 'purchase',
          quantityChange: quantityReceived,
          quantityBefore: quantityBefore,
          quantityAfter: part.quantityOnHand,
          unitCost: poItem.unitCost,
          totalCost: poItem.unitCost * quantityReceived,
          purchaseOrder: purchaseOrder._id,
          reason: `Received from PO ${purchaseOrder.poNumber}`,
          notes: notes,
          performedBy: req.admin._id,
          transactionDate: actualDeliveryDate || new Date(),
        });

        receivedItems.push({
          part: part.partNumber,
          name: part.name,
          quantityReceived: quantityReceived,
          quantityBefore: quantityBefore,
          quantityAfter: part.quantityOnHand,
        });
      }
    }

    // Update PO status
    const allItemsReceived = purchaseOrder.items.every(
      (item) => item.quantityReceived >= item.quantityOrdered
    );

    const anyItemsReceived = purchaseOrder.items.some((item) => item.quantityReceived > 0);

    if (allItemsReceived) {
      purchaseOrder.status = 'received';
      purchaseOrder.actualDeliveryDate = actualDeliveryDate || new Date();
    } else if (anyItemsReceived) {
      purchaseOrder.status = 'partially_received';
    }

    // Add notes if provided
    if (notes) {
      purchaseOrder.internalNotes = purchaseOrder.internalNotes
        ? `${purchaseOrder.internalNotes}\n\n[${new Date().toISOString()}] ${notes}`
        : `[${new Date().toISOString()}] ${notes}`;
    }

    await purchaseOrder.save();

    return res.status(200).json({
      success: true,
      result: {
        purchaseOrder: {
          _id: purchaseOrder._id,
          poNumber: purchaseOrder.poNumber,
          status: purchaseOrder.status,
          actualDeliveryDate: purchaseOrder.actualDeliveryDate,
          items: purchaseOrder.items.map((item) => ({
            _id: item._id,
            partNumber: item.partNumber,
            description: item.description,
            quantityOrdered: item.quantityOrdered,
            quantityReceived: item.quantityReceived,
            quantityOutstanding: item.quantityOutstanding,
          })),
        },
        receivedItems: receivedItems,
      },
      message: 'Items received successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Error receiving items',
    });
  }
};

module.exports = receive;
