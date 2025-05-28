const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const verifyToken = require('../middleware/auth');
const User = require('../models/User');



router.post('/',verifyToken, async (req, res) => {
   console.log("REQ.BODY:", req.body);
  const { title } = req.body;
  try {
    const { title, description} = req.body;

    const achievement = new Achievement({
      title,
      description,
      userId: req.userId
    });

    await achievement.save();
    res.status(201).json({ success: true, achievement });
  } catch (err) {
    console.error('Error adding achievement:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ message: "Achievement not found" });
    res.status(200).json({ achievement });
  } catch (err) {
    res.status(500).json({ message: "Error fetching achievement" });
  }
});

router.delete("/:id",verifyToken, async (req, res) => {
  try {
    const deletedAchievement = await Achievement.findByIdAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    res.status(200).json({ success: true, achievement: deletedAchievement });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});



router.get('/',verifyToken, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.userId });
    res.status(200).json({achievements});
  } catch (err) {
    res.status(500).json({ message: "Error fetching achievements" });
  }
});

router.get('/public/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const achievements = await Achievement.find({ userId: user._id });
    res.status(200).json({ achievements });
  } catch (err) {
    res.status(500).json({ message: "Error fetching achievements" });
  }
});


module.exports = router;
