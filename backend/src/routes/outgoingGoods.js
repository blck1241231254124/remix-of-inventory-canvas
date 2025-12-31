const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

const generateTransactionNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `OUT-${year}${month}${day}-${random}`;
};

// Get all outgoing goods
router.get("/", authenticate, async (req, res) => {
  try {
    const outgoingGoods = await prisma.outgoingGoods.findMany({
      include: {
        issuedBy: { select: { id: true, name: true, username: true } },
        items: {
          include: {
            item: {
              select: {
                id: true,
                sku: true,
                name: true,
                currentStock: true,
                unit: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(outgoingGoods);
  } catch (error) {
    console.error("Get outgoing goods error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create outgoing goods
router.post(
  "/",
  authenticate,
  authorize("admin", "warehouse_staff"),
  async (req, res) => {
    try {
      const { destination, recipientName, notes, items, issuedById } = req.body;

      // Validate required fields
      if (!destination || !recipientName) {
        return res.status(400).json({
          error: "Destination and recipient name are required",
        });
      }

      if (!items || items.length === 0) {
        return res.status(400).json({
          error: "At least one item is required",
        });
      }

      const outgoingGoods = await prisma.$transaction(async (tx) => {
        const outgoing = await tx.outgoingGoods.create({
          data: {
            transactionNumber: generateTransactionNumber(),
            destination,
            issuedById: issuedById || req.user.id,
            notes: notes || "",
            recipientName,
            items: {
              create: items.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
              })),
            },
          },
          include: {
            issuedBy: { select: { id: true, name: true, username: true } },
            items: {
              include: {
                item: {
                  select: {
                    id: true,
                    sku: true,
                    name: true,
                    currentStock: true,
                    unit: true,
                  },
                },
              },
            },
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
              type: "out",
              quantity: item.quantity,
              previousStock: existingItem.currentStock,
              newStock: existingItem.currentStock - item.quantity,
              reference: outgoing.transactionNumber,
              performedById: issuedById || req.user.id,
            },
          });
        }

        return outgoing;
      });

      res.status(201).json(outgoingGoods);
    } catch (error) {
      console.error("Create outgoing goods error:", error);

      if (error.code === "P2003") {
        return res.status(400).json({ error: "Invalid item or user ID" });
      }

      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  }
);

// Update outgoing goods
router.put(
  "/:id",
  authenticate,
  authorize("admin", "warehouse_staff"),
  async (req, res) => {
    try {
      const { destination, recipientName, notes, items } = req.body;

      // Delete old items
      await prisma.outgoingGoodsItem.deleteMany({
        where: { outgoingGoodsId: req.params.id },
      });

      const outgoingGoods = await prisma.outgoingGoods.update({
        where: { id: req.params.id },
        data: {
          destination,
          recipientName,
          notes: notes || "",
          items: {
            create: items.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          issuedBy: { select: { id: true, name: true, username: true } },
          items: {
            include: {
              item: {
                select: {
                  id: true,
                  sku: true,
                  name: true,
                  currentStock: true,
                  unit: true,
                },
              },
            },
          },
        },
      });

      res.json(outgoingGoods);
    } catch (error) {
      console.error("Update outgoing goods error:", error);

      if (error.code === "P2025") {
        return res.status(404).json({ error: "Transaction not found" });
      }

      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  }
);

// Delete outgoing goods
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    await prisma.outgoingGoods.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Outgoing goods deleted successfully" });
  } catch (error) {
    console.error("Delete outgoing goods error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
