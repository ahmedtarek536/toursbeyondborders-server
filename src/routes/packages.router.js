const express = require("express");
const router = express.Router();
const {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  searchPackages,
  getPackagesByDestination,
  getRecommendedPackages,
  getTopDeals,
} = require("../services/packages.service");

router.get("/", async (req, res, next) => {
  try {
    const {
      search,
      destinationId,
      minPrice,
      maxPrice,
      minRating,
      maxGuests,
      minGuests,
      type,
      style,
      duration,
      groupSize,
    } = req.query;

    // If search or filters are provided, use searchPackages
    if (
      search ||
      destinationId ||
      minPrice ||
      maxPrice ||
      minRating ||
      maxGuests ||
      minGuests ||
      type ||
      style ||
      duration ||
      groupSize
    ) {
      const filters = {
        destinationId: destinationId ? parseInt(destinationId) : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        maxGuests: maxGuests ? parseInt(maxGuests) : undefined,
        minGuests: minGuests ? parseInt(minGuests) : undefined,
        type: type || undefined,
        style: style || undefined,
        duration: duration || undefined,
        groupSize: groupSize || undefined,
      };

      const packages = await searchPackages(search, filters);
      return res.json(packages);
    }

    // Otherwise, get all packages
    const packages = await getPackages();
    return res.json(packages);
  } catch (err) {
    return next(err);
  }
});

router.get("/top-deals", async (req, res, next) => {
  try {
    const topDeals = await getTopDeals();
    return res.json(topDeals);
  } catch (err) {
    return next(err);
  }
});

router.get("/destination/:destinationId", async (req, res, next) => {
  try {
    const packages = await getPackagesByDestination(req.params.destinationId);
    return res.json(packages);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id/recommendations", async (req, res, next) => {
  try {
    const recommendations = await getRecommendedPackages(req.params.id);
    return res.json(recommendations);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const pkg = await getPackageById(req.params.id);
    return res.json(pkg);
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const created = await createPackage(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updated = await updatePackage(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    console.log("Attempting to delete package with ID:", req.params.id);
    await deletePackage(req.params.id);
    console.log("Package deleted successfully");
    return res.status(204).send();
  } catch (err) {
    console.error("Delete package route error:", err);
    return res.status(500).json({
      error: "Failed to delete package",
      details: err.message,
    });
  }
});

module.exports = router;
