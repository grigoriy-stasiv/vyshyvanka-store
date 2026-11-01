const express = require('express');
const router = express.Router();

const Review = require('../models/Review');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .limit(6);

    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          reviewsCount: { $sum: 1 },
        },
      },
    ]);

    res.json({
      reviews,
      rating: stats.length
        ? Number(stats[0].averageRating.toFixed(1))
        : 0,
      reviewsCount: stats.length
        ? stats[0].reviewsCount
        : 0,
    });
  } catch (error) {
    console.error("Помилка отримання відгуків:", error);

    res.status(500).json({
      message: "Не вдалося отримати відгуки",
    });
  }
});


// Get products that the current user can review
router.get("/eligible", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const completedOrders = await Order.find({
      customer: userId,
      status: "Виконане",
    }).populate("items.product", "name");

    const reviewedProducts = await Review.find({
      user: userId,
    }).distinct("product");

    const reviewedIds = new Set(
      reviewedProducts.map((id) => id.toString())
    );

    const productsMap = new Map();

    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const product = item.product;

        if (
          product &&
          !reviewedIds.has(product._id.toString())
        ) {
          productsMap.set(product._id.toString(), {
            _id: product._id,
            name: product.name,
          });
        }
      });
    });

    res.json([...productsMap.values()]);
  } catch (error) {
    console.error("Помилка отримання доступних товарів:", error);

    res.status(500).json({
      message: "Не вдалося отримати список товарів",
    });
  }
});


router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Некоректний ID товару",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Товар не знайдено",
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Помилка отримання відгуків:", error);

    res.status(500).json({
      message: "Не вдалося отримати відгуки",
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, rating, text } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: 'Некоректний ID товару',
      });
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      typeof text !== 'string' ||
      text.trim().length < 5 ||
      text.trim().length > 1000
    ) {
      return res.status(400).json({
        message: 'Перевірте оцінку та текст відгуку',
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Товар не знайдено',
      });
    }

    const completedOrder = await Order.exists({
      customer: userId,
      status: 'Виконане',
      'items.product': productId,
    });

    if (!completedOrder) {
      return res.status(403).json({
        message:
          'Залишити відгук можна лише на придбаний товар після виконання замовлення',
      });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      text: text.trim(),
    });

    const stats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          reviewsCount: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(productId, {
      rating: stats.length ? Number(stats[0].averageRating.toFixed(1)) : 0,
      reviewsCount: stats.length ? stats[0].reviewsCount : 0,
    });

    res.status(201).json({
      message: 'Відгук успішно додано',
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Ви вже залишали відгук на цей товар",
      });
    }

    console.error("Помилка створення відгуку:", error);

    res.status(500).json({
      message: "Не вдалося створити відгук",
    });
  }
});

// Delete review (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Некоректний ID відгуку",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Відгук не знайдено",
      });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(id);

    const stats = await Review.aggregate([
      {
        $match: {
          product: productId,
        },
      },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          reviewsCount: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(productId, {
      rating: stats.length
        ? Number(stats[0].averageRating.toFixed(1))
        : 0,
      reviewsCount: stats.length
        ? stats[0].reviewsCount
        : 0,
    });

    res.json({
      message: "Відгук успішно видалено",
    });
  } catch (error) {
    console.error("Помилка видалення відгуку:", error);

    res.status(500).json({
      message: "Не вдалося видалити відгук",
    });
  }
});

module.exports = router;
