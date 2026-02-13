const mongoose = require("mongoose");

const FavoriteItemSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model("FavoriteItem", FavoriteItemSchema);
