const express = require("express");
const router = express.Router();

const FavoriteItem = require("../models/FavoriteItem");
const requireAuth = require("../middleware/requireAuth");

// PUBLIC READ 
router.get("/", async (req, res) => {
  const items = await FavoriteItem.find().sort({ createdAt: -1 });
  res.json(items);
});

// PROTECTED CREATE 
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const created = await FavoriteItem.create({ name });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: "Could not create item" });
  }
});

// PROTECTED UPDATE 
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await FavoriteItem.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Could not update item" });
  }
});

// PROTECTED DELETE 
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await FavoriteItem.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Could not delete item" });
  }
});

module.exports = router;
