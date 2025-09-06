const express = require("express");
const router = express.Router();
const {
  getReviewsByPackageId,
  createReview,
  getReviewStats,
} = require("../services/reviews.service");

// GET /api/reviews/:packageId - Get all reviews for a package
router.get("/:packageId", async (req, res, next) => {
  try {
    const { packageId } = req.params;
    const result = await getReviewsByPackageId(packageId);
    res.json(result);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    next(error);
  }
});

// POST /api/reviews - Create a new review
router.post("/", async (req, res, next) => {
  try {
    const reviewData = req.body;
    const result = await createReview(reviewData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating review:", error);
    if (
      error.message.includes("required") ||
      error.message.includes("must be between")
    ) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// GET /api/reviews/stats/:packageId - Get review statistics for a package
router.get("/stats/:packageId", async (req, res, next) => {
  try {
    const { packageId } = req.params;
    const result = await getReviewStats(packageId);
    res.json(result);
  } catch (error) {
    console.error("Error fetching review stats:", error);
    next(error);
  }
});

module.exports = router;
