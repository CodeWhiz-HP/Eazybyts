const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  info: { type: String, required: true },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
});

const AboutInfo = mongoose.model("AboutInfo", aboutSchema);

module.exports = AboutInfo;