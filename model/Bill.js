// models/Bill.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  unit: { type: String, required: true },
});

const billSchema = new mongoose.Schema({
  billNumber: { type: Number, required: true, unique: true },
  billDate: { type: Date, required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },   // ✅ नया field
  gstin: { type: String },     // ✅ नया field
  items: [itemSchema],
  subtotal: { type: Number, required: true },
  discountType: {
    type: String,
    enum: ["percent", "flat"], // ✅ FIXED
    default: "flat",
  },
  discountValue: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
});

module.exports = mongoose.model("Bill", billSchema);
