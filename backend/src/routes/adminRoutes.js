const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const User = require("../models/User");
const Order = require("../models/Order");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Ви успішно увійшли до адмін-панелі",
    admin: {
      userId: req.user.userId,
      role: req.user.role,
    },
  });
});

router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Помилка отримання користувачів:", error);

    res.status(500).json({
      message: "Не вдалося отримати список користувачів",
    });
  }
});


router.get(
  "/users/:id/orders",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Некоректний ID користувача",
        });
      }

      const orders = await Order.find({ customer: id }).sort({
        createdAt: -1,
      });

      res.json(orders);
    } catch (error) {
      console.error("Помилка отримання історії замовлень:", error);

      res.status(500).json({
        message: "Не вдалося отримати історію замовлень",
      });
    }
  },
);


module.exports = router;
