const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configure multer for memory storage (Vercel-compatible)
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Upload single image (memory storage - requires external service like Cloudinary)
router.post("/image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // File is now in memory (req.file.buffer)
    // You need to integrate with Cloudinary or another service here
    res.json({
      success: true,
      message: "File received in memory. Integrate with Cloudinary for permanent storage.",
      file: {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer ? "Buffer available" : "No buffer"
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// Upload multiple images (memory storage)
router.post("/images", upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const files = req.files.map((file) => ({
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer ? "Buffer available" : "No buffer"
    }));

    res.json({
      success: true,
      message: "Files received in memory. Integrate with Cloudinary for permanent storage.",
      files: files,
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 5MB." });
    }
  }
  res.status(400).json({ error: error.message });
});

module.exports = router;

