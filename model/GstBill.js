const mongoose = require("mongoose");

const GstBillSchema = new mongoose.Schema({
  billNumber: Number,
  billDate: { type: Date, default: Date.now },
  customerName: String,
  phoneNumber: String,
  address: { type: String },   // ✅ नया field
  gstin: { type: String },     // ✅ नया field
  items: [
    {
      itemName: String,    // ✅ frontend ke hisaab se
      price: Number,
      qty: Number,
      unit: String,
      gst: Number,
      taxable: Number,
      gstAmount: Number,
      total: Number,
    },
  ],

  subtotal: Number,
  gstType: String,     
  gstAmount: Number,   // ✅ frontend me gstAmount bhej rahe ho
  cgstTotal: Number,   
  sgstTotal: Number,   
  igstTotal: Number,   
  discountType: String,
  discountValue: Number,
  discountAmount: Number,
  grandTotal: Number,
});

module.exports = mongoose.model("GstBill", GstBillSchema);
