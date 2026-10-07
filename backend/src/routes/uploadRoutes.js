const express = require("express");
const multer = require("multer");

const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/image",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Файл зображення не вибрано",
        });
      }

      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "vyshyvanka-store",
            resource_type: "image",

            // Єдиний формат фотографій товарів
            transformation: [
              {
                width: 800,
                height: 1200,
                crop: "fill",
                gravity: "auto",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error) {
              console.error(
                "Cloudinary error:",
                error
              );

              return res.status(500).json({
                message:
                  "Помилка завантаження зображення",
              });
            }

            res.json({
              message:
                "Зображення успішно завантажено",
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        );

      uploadStream.end(req.file.buffer);
    } catch (error) {
      console.error(
        "Помилка завантаження:",
        error
      );

      res.status(500).json({
        message:
          "Помилка при завантаженні зображення",
        error: error.message,
      });
    }
  }
);

module.exports = router;