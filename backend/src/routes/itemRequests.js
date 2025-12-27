const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const generateRequestNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `REQ-${year}${month}${day}-${random}`;
};

// Get all item requests
router.get('/', authenticate, async (req, res) => {
  try {
    const requests = await prisma.itemRequest.findMany({
      include: {
        item: true,
        requestedBy: { select: { id: true, name: true, username: true } },
        approvedBy: { select: { id: true, name: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (error) {
    console.error('Get item requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create item request
router.post('/', authenticate, async (req, res) => {
  try {
    const { itemId, quantity, reason } = req.body;

    const request = await prisma.itemRequest.create({
      data: {
        requestNumber: generateRequestNumber(),
        itemId,
        quantity,
        reason,
        requestedById: req.user.id,
      },
      include: {
        item: true,
        requestedBy: { select: { id: true, name: true, username: true } },
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Create item request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject item request
router.patch('/:id/status', authenticate, authorize('admin', 'warehouse_staff'), async (req, res) => {
  try {
    const { status, notes } = req.body;

    const request = await prisma.itemRequest.update({
      where: { id: req.params.id },
      data: {
        status,
        notes,
        approvedById: req.user.id,
        approvedAt: new Date(),
      },
      include: {
        item: true,
        requestedBy: { select: { id: true, name: true, username: true } },
        approvedBy: { select: { id: true, name: true, username: true } },
      },
    });

    res.json(request);
  } catch (error) {
    console.error('Update item request status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item request
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await prisma.itemRequest.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Item request deleted successfully' });
  } catch (error) {
    console.error('Delete item request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
