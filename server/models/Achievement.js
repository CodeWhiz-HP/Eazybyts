const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
});

const Achievement = mongoose.model("Achievement", blogSchema);

module.exports = Achievement;