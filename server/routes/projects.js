const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/auth');
const User = require('../models/User');




router.post('/',verifyToken, async (req, res) => {
   console.log("REQ.BODY:", req.body); 
  const { name } = req.body;
  try {
    const { name, description, skills} = req.body;

    const project = new Project({
      name,
      description,
      skills,
      userId: req.userId
    });

    await project.save();
    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error('Error adding project:', err);
    res.status(500).json({ success: false, message: 'Server error', error : err});
  }
});

router.get('/:id',verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ message: "Error fetching project" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    res.status(200).json({ success: true, project: deletedProject });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});



router.get('/',verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId });
    res.status(200).json({projects});
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

router.get('/public/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const projects = await Project.find({ userId: user._id });
    res.status(200).json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});


module.exports = router;
