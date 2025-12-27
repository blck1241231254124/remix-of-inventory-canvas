const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `PO-${year}${month}${day}-${random}`;
};

// Get all purchase orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        createdBy: { select: { id: true, name: true, username: true } },
        approvedBy: { select: { id: true, name: true, username: true } },
        items: { include: { item: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Get purchase orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create purchase order
router.post('/', authenticate, authorize('admin', 'purchasing'), async (req, res) => {
  try {
    const { supplierId, items, notes } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber: generateOrderNumber(),
        supplierId,
        createdById: req.user.id,
        notes,
        totalAmount,
        items: {
          create: items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        supplier: true,
        createdBy: { select: { id: true, name: true, username: true } },
        items: { include: { item: true } },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create purchase order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject purchase order
router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;

    const order = await prisma.purchaseOrder.update({
      where: { id: req.params.id },
      data: {
        status,
        approvedById: req.user.id,
        approvedAt: new Date(),
      },
      include: {
        supplier: true,
        createdBy: { select: { id: true, name: true, username: true } },
        approvedBy: { select: { id: true, name: true, username: true } },
        items: { include: { item: true } },
      },
    });

    res.json(order);
  } catch (error) {
    console.error('Update purchase order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete purchase order
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await prisma.purchaseOrder.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    console.error('Delete purchase order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
