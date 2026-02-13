const express = require("express");
const router = express.Router();
const FavoriteItem = require("../models/FavoriteItem");

// READ all
router.get("/", async (req, res) => {
  const items = await FavoriteItem.find().sort({ createdAt: -1 });
  res.json(items);
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const created = await FavoriteItem.create({ name });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: "Could not create item" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { name } = req.body;
  const updated = await FavoriteItem.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true, runValidators: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await FavoriteItem.findByIdAndDelete(req.params.id);
  res.json({ ok: true, message: "Item deleted successfully" });
});

module.exports = router;
