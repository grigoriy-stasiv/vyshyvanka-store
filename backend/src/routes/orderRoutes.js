const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Product = require("../models/Product");

const router = express.Router();

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

    if (order.status !== "Нове") {
      return res.status(400).json({
        message: "Скасувати можна лише нове замовлення.",
      });
    }

    order.status = "Скасоване";
    order.cancellationUnread = true;
    await order.save();

    res.json({
      message: "Замовлення успішно скасовано.",
      order,
    });
  } catch (error) {
    console.error("Помилка скасування замовлення:", error);

    res.status(500).json({
      message: "Не вдалося скасувати замовлення.",
    });
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

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true },
      );

      if (!order) {
        return res.status(404).json({
          message: "Замовлення не знайдено",
        });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({
        message: "Не вдалося оновити статус замовлення",
      });
    }
  },
);

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, phone, deliveryAddress } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      !phone?.trim() ||
      !deliveryAddress?.trim()
    ) {
      return res.status(400).json({
        message: "Заповніть товари, телефон та адресу доставки",
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
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || !product.inStock) {
        return res.status(400).json({
          message: "Один із товарів відсутній у продажу",
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        return res.status(400).json({
          message: "Некоректна кількість товару",
        });
      }

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

    const order = await Order.create({
      customer: user._id,
      customerName: user.name,
      customerEmail: user.email,
      phone: phone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({
      message: "Замовлення успішно оформлено",
      order,
    });
  } catch (error) {
    console.error("Помилка оформлення замовлення:", error);

    res.status(500).json({
      message: "Не вдалося оформити замовлення",
    });
  }
});

module.exports = router;
