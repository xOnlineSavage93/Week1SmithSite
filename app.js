require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const itemRoutes = require("./routes/items");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// mount API
app.use("/api/items", itemRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  })
  .catch(err => console.log("Mongo Error:", err));
