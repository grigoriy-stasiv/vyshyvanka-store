const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ПЕРЕВІРКА ДОСТУПУ АДМІНІСТРАТОРА
router.get("/", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Ви успішно увійшли до адмін-панелі",
    admin: {
      userId: req.user.userId,
      role: req.user.role,
    },
  });
});

module.exports = router;
