const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: String,
  price: Number,
  qty: Number,
  unit: String,
});

const billSchema = new mongoose.Schema({
  billNumber: { type: Number, required: true, unique: true },
  billDate: String,
  customerName: String,
  phoneNumber: String,
  items: [itemSchema],
  subtotal: Number,
  discountType: { type: String, enum: ["percent", "flat"], default: "percent" },
  discountValue: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  grandTotal: Number,
});

module.exports = mongoose.model("Bill", billSchema);
