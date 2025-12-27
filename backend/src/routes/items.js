const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all items
router.get('/', authenticate, async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: { category: true },
    });
    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get item by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create item
router.post('/', authenticate, authorize('admin', 'warehouse_staff'), async (req, res) => {
  try {
    const { sku, name, description, categoryId, unit, minStock, currentStock, location } = req.body;

    const item = await prisma.item.create({
      data: {
        sku,
        name,
        description,
        categoryId,
        unit,
        minStock: minStock || 0,
        currentStock: currentStock || 0,
        location,
      },
      include: { category: true },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item
router.put('/:id', authenticate, authorize('admin', 'warehouse_staff'), async (req, res) => {
  try {
    const { sku, name, description, categoryId, unit, minStock, currentStock, location } = req.body;

    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: {
        sku,
        name,
        description,
        categoryId,
        unit,
        minStock,
        currentStock,
        location,
      },
      include: { category: true },
    });

    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await prisma.item.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
