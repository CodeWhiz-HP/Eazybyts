const express = require('express');
const router = express.Router();
const AboutInfo = require('../models/AboutInfo');
const verifyToken = require('../middleware/auth');
const User = require('../models/User');

router.put('/', verifyToken, async (req, res) => {
  console.log("REQ.BODY:", req.body);
  const { info } = req.body;

  if (!info) {
    return res.status(400).json({ success: false, message: "Info is missing in request body" });
  }

  try {
    const updatedAbout = await AboutInfo.findOneAndUpdate(
      { userId: req.userId },
      { info },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, aboutinfo: updatedAbout });
  } catch (err) {
    console.error('Error updating info:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const aboutinfo = await AboutInfo.findById(req.params.id);
    if (!aboutinfo) return res.status(404).json({ message: "Info not found" });
    res.status(200).json({ aboutinfo });
  } catch (err) {
    res.status(500).json({ message: "Error fetching info" });
  }
});

router.get('/',verifyToken, async (req, res) => {
  try {
    const aboutinfo = await AboutInfo.find({ userId: req.userId });
    res.status(200).json({aboutinfo});
  } catch (err) {
    res.status(500).json({ message: "Error fetching info" });
  }
});

router.get('/public/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const aboutinfo = await AboutInfo.find({ userId: user._id });
    res.status(200).json({ aboutinfo });
  } catch (err) {
    res.status(500).json({ message: "Error fetching info" });
  }
});

module.exports = router;