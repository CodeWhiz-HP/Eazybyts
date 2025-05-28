const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
