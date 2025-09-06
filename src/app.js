const express = require("express");
const cors = require("cors");
const path = require("path");

const destinationsRouter = require("./routes/destinations.router");
const packagesRouter = require("./routes/packages.router");
const reservationsRouter = require("./routes/reservations.router");
const customTripsRouter = require("./routes/customTrips.router");
const messagesRouter = require("./routes/messages.router");
const blogsRouter = require("./routes/blogs.router");
const servicesRouter = require("./routes/services.router");
const uploadRouter = require("./routes/upload.router");
const cloudinaryRouter = require("./routes/cloudinary");
const authRouter = require("./routes/auth.router");
const sitemapRouter = require("./routes/sitemap.router");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/error.middleware");
const {
  authenticateToken,
  requireAdmin,
} = require("./middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());

// Note: Static file serving removed for Vercel compatibility
// Files should be served from external services like Cloudinary

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

// Public authentication routes
app.use("/auth", authRouter);

// SEO routes (sitemap and robots.txt)
app.use("/", sitemapRouter);

// Public routes (read-only access for website visitors)
app.use("/destinations", destinationsRouter);
app.use("/packages", packagesRouter);
app.use("/reservations", reservationsRouter);
app.use("/messages", messagesRouter);
app.use("/custom-trips", customTripsRouter);
app.use("/blogs", blogsRouter);
app.use("/services", servicesRouter);
app.use("/upload", servicesRouter);
app.use("/cloudinary", servicesRouter);

// Protected admin routes (authentication required for admin operations)
app.use(
  "/admin/destinations",
  authenticateToken,
  requireAdmin,
  destinationsRouter
);
app.use("/admin/packages", authenticateToken, requireAdmin, packagesRouter);
app.use(
  "/admin/reservations",
  authenticateToken,
  requireAdmin,
  reservationsRouter
);
app.use("/admin/messages", authenticateToken, requireAdmin, messagesRouter);
app.use(
  "/admin/custom-trips",
  authenticateToken,
  requireAdmin,
  customTripsRouter
);
app.use("/admin/blogs", authenticateToken, requireAdmin, blogsRouter);
app.use("/admin/services", authenticateToken, requireAdmin, servicesRouter);
app.use("/admin/upload", authenticateToken, requireAdmin, uploadRouter);
app.use("/admin/cloudinary", authenticateToken, requireAdmin, cloudinaryRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
