const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Product = require("../models/Product");

const router = express.Router();

const restoreOrderStock = async (order, session) => {
  if (!order.stockDeducted || order.stockRestored) {
    return;
  }

  const productsToRestore = new Map();

  for (const item of order.items) {
    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Некоректна кількість товару в замовленні");
    }

    const productId = String(item.product);

    let product = productsToRestore.get(productId);

    if (!product) {
      product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error(
          `Товар ${item.name} не знайдено під час повернення залишків`,
        );
      }

      productsToRestore.set(productId, product);
    }

    const stockItem = product.stock.find(
      (stock) => stock.size === item.size && stock.color === item.color,
    );

    if (!stockItem) {
      throw new Error(
        `Не знайдено складський варіант: ${item.name}, ${item.size}, ${item.color}`,
      );
    }

    stockItem.quantity += quantity;
  }

  for (const product of productsToRestore.values()) {
    product.inStock = product.stock.some((stock) => stock.quantity > 0);

    await product.save({ session });
  }

  order.stockRestored = true;
  await order.save({ session });
};

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Помилка завантаження моїх замовлень:", error);

    res.status(500).json({
      message: "Не вдалося завантажити ваші замовлення",
    });
  }
});

router.patch("/my/:id/cancel", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let cancelledOrder;

    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: req.params.id,
        customer: req.user.userId,
      }).session(session);

      if (!order) {
        const error = new Error("Замовлення не знайдено.");
        error.statusCode = 404;
        throw error;
      }

      if (order.status !== "Нове") {
        const error = new Error("Скасувати можна лише нове замовлення.");
        error.statusCode = 400;
        throw error;
      }

      await restoreOrderStock(order, session);

      order.status = "Скасоване";
      order.cancellationUnread = true;

      await order.save({ session });

      cancelledOrder = order;
    });

    res.json({
      message: "Замовлення успішно скасовано.",
      order: cancelledOrder,
    });
  } catch (error) {
    console.error("Помилка скасування замовлення:", error);

    res.status(error.statusCode || 500).json({
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Не вдалося скасувати замовлення.",
    });
  } finally {
    await session.endSession();
  }
});

router.delete("/my/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Замовлення не знайдено.",
      });
    }

    if (!["Виконане", "Скасоване"].includes(order.status)) {
      return res.status(400).json({
        message: "Видалити можна лише виконані або скасовані замовлення.",
      });
    }

    await Order.deleteOne({ _id: order._id });

    res.json({
      message: "Замовлення успішно видалено.",
    });
  } catch (error) {
    console.error("Помилка видалення замовлення:", error);

    res.status(500).json({
      message: "Не вдалося видалити замовлення.",
    });
  }
});

router.patch("/:id/read", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        message: "Замовлення не знайдено",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Помилка позначення замовлення як прочитаного:", error);

    res.status(500).json({
      message: "Не вдалося позначити замовлення як прочитане",
    });
  }
});

router.patch(
  "/:id/cancellation-read",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { cancellationUnread: false },
        { new: true },
      );

      if (!order) {
        return res.status(404).json({
          message: "Замовлення не знайдено",
        });
      }

      res.json(order);
    } catch (error) {
      console.error("Помилка позначення скасування як прочитаного:", error);

      res.status(500).json({
        message: "Не вдалося позначити скасування як прочитане",
      });
    }
  },
);

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Некоректний ID замовлення',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Замовлення не знайдено',
      });
    }

    await Order.deleteOne({ _id: order._id });

    res.json({
      message: 'Замовлення успішно видалено',
    });
  } catch (error) {
    console.error('Помилка видалення замовлення адміністратором:', error);

    res.status(500).json({
      message: 'Не вдалося видалити замовлення',
    });
  }
});

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Не вдалося завантажити замовлення",
    });
  }
});

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const session = await mongoose.startSession();

    try {
      const allowedStatuses = [
        "Нове",
        "Підтверджене",
        "Відправлене",
        "Виконане",
        "Скасоване",
      ];

      const { status } = req.body;

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Некоректний статус замовлення",
        });
      }

      let updatedOrder;

      await session.withTransaction(async () => {
        const order = await Order.findById(req.params.id).session(session);

        if (!order) {
          const error = new Error("Замовлення не знайдено");
          error.statusCode = 404;
          throw error;
        }

        if (status === "Скасоване" && order.status !== "Скасоване") {
          await restoreOrderStock(order, session);
        }

        order.status = status;
        await order.save({ session });

        updatedOrder = order;
      });

      res.json(updatedOrder);
    } catch (error) {
      console.error("Помилка оновлення статусу замовлення:", error);

      res.status(error.statusCode || 500).json({
        message:
          error.statusCode && error.statusCode < 500
            ? error.message
            : "Не вдалося оновити статус замовлення",
      });
    } finally {
      await session.endSession();
    }
  },
);

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, phone, deliveryAddress } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 50 ||
      typeof phone !== "string" ||
      typeof deliveryAddress !== "string" ||
      !phone.trim() ||
      !deliveryAddress.trim() ||
      phone.trim().length > 30 ||
      deliveryAddress.trim().length > 300
    ) {
      return res.status(400).json({
        message: "Перевірте товари, телефон та адресу доставки",
      });
    }

    const userId = req.user.userId;

    const User = require("../models/User");
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    const orderItems = [];
    const reservedStock = [];
    let totalAmount = 0;

    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !mongoose.Types.ObjectId.isValid(item.productId)
      ) {
        return res.status(400).json({
          message: "Некоректний ID товару",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product || !product.inStock) {
        return res.status(400).json({
          message: "Один із товарів відсутній у продажу",
        });
      }

      const size = typeof item.size === "string" ? item.size : "";
      const color = typeof item.color === "string" ? item.color : "";

      if (!size || !color) {
        return res.status(400).json({
          message: "Оберіть розмір і колір кожного товару",
        });
      }

      const stockItem = product.stock.find(
        (stock) => stock.size === size && stock.color === color,
      );

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        return res.status(400).json({
          message: "Некоректна кількість товару",
        });
      }

      if (!stockItem || stockItem.quantity < quantity) {
        return res.status(400).json({
          message: `Недостатньо товару в наявності: ${product.name}, розмір ${size}, колір ${color}`,
        });
      }

      stockItem.quantity -= quantity;

      product.inStock = product.stock.some((stock) => stock.quantity > 0);

      reservedStock.push({
        product,
        size,
        color,
        quantity,
      });

      const price = product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price,
        quantity,
        size: item.size || "",
        color: item.color || "",
      });

      totalAmount += price * quantity;
    }

    const savedProducts = [];

    try {
      for (const reserved of reservedStock) {
        const { product, size, color, quantity } = reserved;

        const result = await Product.updateOne(
          {
            _id: product._id,
            stock: {
              $elemMatch: {
                size,
                color,
                quantity: { $gte: quantity },
              },
            },
          },
          {
            $inc: {
              "stock.$.quantity": -quantity,
            },
          },
        );

        if (result.modifiedCount !== 1) {
          throw new Error(`Недостатньо залишків товару: ${product.name}`);
        }

        savedProducts.push({ product, size, color, quantity });
      }

      for (const productId of [
        ...new Set(savedProducts.map((item) => String(item.product._id))),
      ]) {
        const product = await Product.findById(productId);

        product.inStock = product.stock.some((stock) => stock.quantity > 0);

        await product.save();
      }

      const order = await Order.create({
        customer: user._id,
        customerName: user.name,
        customerEmail: user.email,
        phone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        items: orderItems,
        totalAmount,
        stockDeducted: true,
      });

      return res.status(201).json({
        message: "Замовлення успішно оформлено",
        order,
      });
    } catch (error) {
      for (const saved of savedProducts.reverse()) {
        await Product.updateOne(
          {
            _id: saved.product._id,
            stock: {
              $elemMatch: {
                size: saved.size,
                color: saved.color,
              },
            },
          },
          {
            $inc: {
              "stock.$.quantity": saved.quantity,
            },
          },
        );
      }

      for (const productId of [
        ...new Set(savedProducts.map((item) => String(item.product._id))),
      ]) {
        const product = await Product.findById(productId);

        if (product) {
          product.inStock = product.stock.some((stock) => stock.quantity > 0);

          await product.save();
        }
      }

      throw error;
    }
  } catch (error) {
    console.error("Помилка оформлення замовлення:", error);

    res.status(500).json({
      message: "Не вдалося оформити замовлення",
    });
  }
});

module.exports = router;
