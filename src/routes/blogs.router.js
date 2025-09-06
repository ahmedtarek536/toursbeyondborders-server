const express = require("express");
const router = express.Router();
const {
  getBlogs,
  getBlogById,
  getBlogsByCategory,
  getFeaturedBlogs,
  searchBlogs,
  getRandomBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../services/blogs.service");
const { authenticateToken } = require("../middleware/auth.middleware");

// Get all blogs
router.get("/", async (req, res, next) => {
  try {
    const blogs = await getBlogs();
    return res.json(blogs);
  } catch (err) {
    return next(err);
  }
});

// Get blog by ID
router.get("/:id", async (req, res, next) => {
  try {
    const blog = await getBlogById(req.params.id);
    return res.json(blog);
  } catch (err) {
    return next(err);
  }
});

// Get blogs by category
router.get("/category/:category", async (req, res, next) => {
  try {
    const blogs = await getBlogsByCategory(req.params.category);
    return res.json(blogs);
  } catch (err) {
    return next(err);
  }
});

// Get featured blogs
router.get("/featured/all", async (req, res, next) => {
  try {
    const blogs = await getFeaturedBlogs();
    return res.json(blogs);
  } catch (err) {
    return next(err);
  }
});

// Get random blogs
router.get("/random/:limit", async (req, res, next) => {
  try {
    const limit = parseInt(req.params.limit) || 4;
    const blogs = await getRandomBlogs(limit);
    return res.json(blogs);
  } catch (err) {
    return next(err);
  }
});

// Get random blogs (default limit)
router.get("/random", async (req, res, next) => {
  try {
    const blogs = await getRandomBlogs(4);
    return res.json(blogs);
  } catch (err) {
    return next(err);
  }
});

// Search blogs
router.get("/search/:term", async (req, res, next) => {
  try {
    const blogs = await searchBlogs(req.params.term);
    return res.json(blogs);
  } catch (err) {
    return next(err);
  }
});

// Create new blog
router.post("/", async (req, res, next) => {
  try {
    const created = await createBlog(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

// Update blog
router.put("/:id", async (req, res, next) => {
  try {
    const updated = await updateBlog(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

// Delete blog
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteBlog(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
