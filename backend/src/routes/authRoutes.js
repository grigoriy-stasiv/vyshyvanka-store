const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ==============================
// РЕЄСТРАЦІЯ
// ==============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Перевірка даних
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Заповніть усі поля",
      });
    }

    // Перевірка довжини пароля
    if (password.length < 6) {
      return res.status(400).json({
        message: "Пароль повинен містити щонайменше 6 символів",
      });
    }

    // Перевіряємо, чи вже існує користувач
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Користувач з таким email вже існує",
      });
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створюємо користувача
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "Користувача успішно зареєстровано",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Помилка реєстрації:", error);

    res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

// ==============================
// ВХІД
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Перевірка даних
    if (!email || !password) {
      return res.status(400).json({
        message: "Введіть email та пароль",
      });
    }

    // Шукаємо користувача
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Невірний email або пароль",
      });
    }

    // Перевіряємо пароль
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Невірний email або пароль",
      });
    }

    // Створюємо JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Вхід успішний",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Помилка входу:", error);

    res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

// ==============================
// ПОТОЧНИЙ КОРИСТУВАЧ
// ==============================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Помилка отримання користувача:", error);

    res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

module.exports = router;