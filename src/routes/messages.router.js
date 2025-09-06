const express = require("express");
const router = express.Router();
const {
  listMessages,
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
} = require("../services/messages.service");

router.get("/", async (req, res, next) => {
  try {
    const messages = await listMessages();
    return res.json(messages);
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const created = await createMessage(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const message = await getMessageById(req.params.id);
    return res.json(message);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updated = await updateMessage(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const updated = await updateMessage(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteMessage(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
