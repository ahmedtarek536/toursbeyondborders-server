const express = require("express");
const router = express.Router();
const {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} = require("../services/destinations.service");

router.get("/", async (req, res, next) => {
  try {
    const destinations = await getDestinations();
    return res.json(destinations);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const destination = await getDestinationById(req.params.id);
    return res.json(destination);
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const created = await createDestination(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updated = await updateDestination(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteDestination(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
