const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
  filename: String,
  filePath: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Logo", logoSchema);
