const express = require("express");
const router = express.Router();
const {
	listCustomTrips,
	createCustomTrip,
	getCustomTripById,
	updateCustomTrip,
	deleteCustomTrip,
} = require("../services/customTrips.service");

router.get("/", async (req, res, next) => {
	try {
		const items = await listCustomTrips();
		return res.json(items);
	} catch (err) {
		return next(err);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const created = await createCustomTrip(req.body);
		return res.status(201).json(created);
	} catch (err) {
		return next(err);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const item = await getCustomTripById(req.params.id);
		return res.json(item);
	} catch (err) {
		return next(err);
	}
});

router.patch("/:id", async (req, res, next) => {
	try {
		const updated = await updateCustomTrip(req.params.id, req.body);
		return res.json(updated);
	} catch (err) {
		return next(err);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		await deleteCustomTrip(req.params.id);
		return res.status(204).send();
	} catch (err) {
		return next(err);
	}
});

module.exports = router;


