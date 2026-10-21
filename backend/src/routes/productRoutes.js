const express = require("express");
const Product = require("../models/Product");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

function validateProductStock(data) {
  if (data.stock === undefined) {
    return null;
  }

  if (!Array.isArray(data.stock)) {
    return "Залишки товару мають бути масивом";
  }

  const sizes = data.sizes || [];
  const colors = data.colors || [];
  const combinations = new Set();

  for (const item of data.stock) {
    if (
      !item ||
      typeof item.size !== "string" ||
      typeof item.color !== "string" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 0
    ) {
      return "Перевірте розмір, колір і кількість товару";
    }

    if (!sizes.includes(item.size) || !colors.includes(item.color)) {
      return "Розмір або колір залишку відсутній у товарі";
    }

    const key = JSON.stringify([item.size, item.color]);

    if (combinations.has(key)) {
      return "Комбінація розміру та кольору не повинна повторюватися";
    }

    combinations.add(key);
  }

  return null;
}

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Помилка при отриманні товарів",
      error: error.message,
    });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Товар не знайдено",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Помилка при отриманні товару",
      error: error.message,
    });
  }
});

// POST /api/products
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stockError = validateProductStock(req.body);

    if (stockError) {
      return res.status(400).json({
        message: stockError,
      });
    }
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: "Помилка при створенні товару",
      error: error.message,
    });
  }
});

// PUT /api/products/:id
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stockError = validateProductStock(req.body);

    if (stockError) {
      return res.status(400).json({
        message: stockError,
      });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Товар не знайдено",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: "Помилка при оновленні товару",
      error: error.message,
    });
  }
});

// DELETE /api/products/:id
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Товар не знайдено",
      });
    }

    res.json({
      message: "Товар успішно видалено",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Помилка при видаленні товару",
      error: error.message,
    });
  }
});

module.exports = router;
