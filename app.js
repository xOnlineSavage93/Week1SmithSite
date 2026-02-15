require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const itemRoutes = require("./routes/item"); // or ./routes/items
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
      }
    }));

    app.use("/api/auth", authRoutes);
    app.use("/api/items", itemRoutes);

    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  })
  .catch(err => console.log("Mongo Error:", err));
