const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  authenticateToken,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Hardcoded admin credentials (in production, this should be in a database)
const ADMIN_CREDENTIALS = {
  username: "karem",
  password: "123456", // This will be hashed
  role: "admin",
};

// Hash the admin password on startup
let hashedAdminPassword;
bcrypt.hash(ADMIN_CREDENTIALS.password, 10).then((hash) => {
  hashedAdminPassword = hash;
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        message: "Username and password are required",
      });
    }

    // Check if username matches
    if (username !== ADMIN_CREDENTIALS.username) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Invalid username or password",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, hashedAdminPassword);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        username: ADMIN_CREDENTIALS.username,
        role: ADMIN_CREDENTIALS.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      user: {
        username: ADMIN_CREDENTIALS.username,
        role: ADMIN_CREDENTIALS.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An error occurred during login",
    });
  }
});

// Verify token endpoint
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      username: req.user.username,
      role: req.user.role,
    },
  });
});

// Logout endpoint (client-side token removal, but server can track if needed)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
