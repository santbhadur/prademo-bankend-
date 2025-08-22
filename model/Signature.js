// model/Signature.js
const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Signature", signatureSchema);
