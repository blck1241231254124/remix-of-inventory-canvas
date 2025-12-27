const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const generateTransactionNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `OUT-${year}${month}${day}-${random}`;
};

// Get all outgoing goods
router.get('/', authenticate, async (req, res) => {
  try {
    const outgoingGoods = await prisma.outgoingGoods.findMany({
      include: {
        issuedBy: { select: { id: true, name: true, username: true } },
        items: { include: { item: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(outgoingGoods);
  } catch (error) {
    console.error('Get outgoing goods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create outgoing goods
router.post('/', authenticate, authorize('admin', 'warehouse_staff'), async (req, res) => {
  try {
    const { destination, items, notes, recipientName, recipientSignature } = req.body;

    const outgoingGoods = await prisma.$transaction(async (tx) => {
      const outgoing = await tx.outgoingGoods.create({
        data: {
          transactionNumber: generateTransactionNumber(),
          destination,
          issuedById: req.user.id,
          notes,
          recipientName,
          recipientSignature,
          status: 'completed',
          items: {
            create: items.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          issuedBy: { select: { id: true, name: true, username: true } },
          items: { include: { item: true } },
        },
      });

      // Update stock for each item
      for (const item of items) {
        const existingItem = await tx.item.findUnique({
          where: { id: item.itemId },
        });

        await tx.item.update({
          where: { id: item.itemId },
          data: { currentStock: existingItem.currentStock - item.quantity },
        });

        // Create stock movement record
        await tx.stockMovement.create({
          data: {
            itemId: item.itemId,
            type: 'out',
            quantity: item.quantity,
            previousStock: existingItem.currentStock,
            newStock: existingItem.currentStock - item.quantity,
            reference: outgoing.transactionNumber,
            performedById: req.user.id,
          },
        });
      }

      return outgoing;
    });

    res.status(201).json(outgoingGoods);
  } catch (error) {
    console.error('Create outgoing goods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete outgoing goods
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await prisma.outgoingGoods.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Outgoing goods deleted successfully' });
  } catch (error) {
    console.error('Delete outgoing goods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
