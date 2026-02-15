const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

function weakPassword(pw) {
  return !pw || pw.length < 6;
}

// Check login state 
router.get("/me", (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, username: req.session.username });
});

// Register
router.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    username = (username || "").trim();
    email = (email || "").trim().toLowerCase();

    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required." });

    if (weakPassword(password))
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ error: "Username or email already exists." });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    req.session.userId = user._id.toString();
    req.session.username = user.username;

    res.status(201).json({ ok: true });
  } catch (err) {
    // Duplicate key safety net
    if (err && err.code === 11000) {
      return res.status(409).json({ error: "Username or email already exists." });
    }
    res.status(500).json({ error: "Registration failed." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    let { usernameOrEmail, password } = req.body;

    usernameOrEmail = (usernameOrEmail || "").trim();
    const emailGuess = usernameOrEmail.toLowerCase();

    if (!usernameOrEmail || !password)
      return res.status(400).json({ error: "Missing credentials." });

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: emailGuess }]
    });

    if (!user) return res.status(401).json({ error: "Invalid login." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid login." });

    req.session.userId = user._id.toString();
    req.session.username = user.username;

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Login failed." });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

module.exports = router;
