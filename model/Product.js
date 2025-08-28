const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true }, // e.g., pcs, gms, kgs
});

module.exports = mongoose.model("Product", productSchema);
