const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Generate transaction number: IN-YYYYMMDD-XXXX
 */
const generateTransactionNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `IN-${year}${month}${day}-${random}`;
};

/**
 * GET /api/incoming-goods
 * Get all incoming goods
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const incomingGoods = await prisma.incomingGoods.findMany({
      include: {
        supplier: true,
        receivedBy: {
          select: { id: true, name: true, username: true },
        },
        items: {
          include: { item: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(incomingGoods);
  } catch (error) {
    console.error("Get incoming goods error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/incoming-goods
 * Create incoming goods
 */
router.post(
  "/",
  authenticate,
  authorize("admin", "warehouse_staff"),
  async (req, res) => {
    try {
      const { supplierId, items, notes, receivedAt } = req.body;

      // Basic validation
      if (!supplierId || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      const incomingGoods = await prisma.$transaction(async (tx) => {
        // Create incoming goods record
        const incoming = await tx.incomingGoods.create({
          data: {
            transactionNumber: generateTransactionNumber(),
            supplierId,
            receivedById: req.user.id,
            receivedAt: receivedAt ? new Date(receivedAt) : new Date(),
            notes: notes || null,
            status: "completed",
            items: {
              create: items.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
                unitPrice: item.unitPrice ?? 0,
              })),
            },
          },
          include: {
            supplier: true,
            receivedBy: {
              select: { id: true, name: true, username: true },
            },
            items: {
              include: { item: true },
            },
          },
        });

        // Update stock & create stock movements
        for (const item of items) {
          const existingItem = await tx.item.findUnique({
            where: { id: item.itemId },
          });

          if (!existingItem) {
            throw new Error(`Item not found: ${item.itemId}`);
          }

          const newStock = existingItem.currentStock + item.quantity;

          await tx.item.update({
            where: { id: item.itemId },
            data: { currentStock: newStock },
          });

          await tx.stockMovement.create({
            data: {
              itemId: item.itemId,
              type: "in",
              quantity: item.quantity,
              previousStock: existingItem.currentStock,
              newStock,
              reference: incoming.transactionNumber,
              performedById: req.user.id,
            },
          });
        }

        return incoming;
      });

      res.status(201).json(incomingGoods);
    } catch (error) {
      console.error("Create incoming goods error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * DELETE /api/incoming-goods/:id
 * Delete incoming goods
 */
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    await prisma.incomingGoods.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Incoming goods deleted successfully" });
  } catch (error) {
    console.error("Delete incoming goods error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
