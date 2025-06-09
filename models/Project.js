const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  year: Number,
  coverImageUrl: String,
  images: [String]
});

module.exports = mongoose.model("Project", projectSchema);