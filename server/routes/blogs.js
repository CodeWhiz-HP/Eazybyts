const express = require('express');
const verifyToken = require("../middleware/auth");
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');



router.post('/',verifyToken, async (req, res) => {
   console.log("REQ.BODY:", req.body); //See what data arrives
  const { title } = req.body;
  try {
    const { title, description, content, author, tags } = req.body;

    const blog = new Blog({
      title,
      description,
      content,
      author,
      tags,
      userId: req.userId
    });

    await blog.save();
    res.status(201).json({ success: true, blog });
  } catch (err) {
    console.error('Error adding blog:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ blog });
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog" });
  }
});

router.delete("/:id",verifyToken, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    res.status(200).json({ success: true, blog: deletedBlog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.userId });
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

router.get('/public/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const blogs = await Blog.find({ userId: user._id });
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});


module.exports = router;
