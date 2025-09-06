const express = require("express");
const router = express.Router();
const {
  listReservations,
  createReservation,
  getReservationById,
  updateReservation,
  deleteReservation,
} = require("../services/reservations.service");

router.get("/", async (req, res, next) => {
  try {
    const reservations = await listReservations();
    return res.json(reservations);
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const reservation = await createReservation(req.body);
    return res.status(201).json(reservation);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const reservation = await getReservationById(req.params.id);
    return res.json(reservation);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updated = await updateReservation(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const updated = await updateReservation(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteReservation(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
