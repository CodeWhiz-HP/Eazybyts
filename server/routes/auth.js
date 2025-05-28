const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const SECRET = "your_super_secret_key"; // keep this safe

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: "2h" });
  res.json({ token, username: user.username, name: user.name });
});


// register route
router.post("/register", async (req, res) => {
  const { name, username,role, email, password } = req.body;
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, username,role, email, password: hashed });
  await user.save();

  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: "2h" });
  res.json({ token, username: user.username, name: user.name , role: user.role});
});


module.exports = router;
