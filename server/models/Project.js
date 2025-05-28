const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: String,
  description: String,
  skills : String,
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
});

const Project = mongoose.model("Project", blogSchema);

module.exports = Project;
