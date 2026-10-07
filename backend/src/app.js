require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({
    message: "Vyshyvanka Store API працює!",
  });
});

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/upload", uploadRoutes);

module.exports = app;