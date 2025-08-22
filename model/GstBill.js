const mongoose = require("mongoose");

const GstBillSchema = new mongoose.Schema({
  billNumber: Number,
  billDate: { type: Date, default: Date.now },
  customerName: String,
  phoneNumber: String,
  items: [
    {
      description: String,
      hsn: String,
      quantity: Number,
      rate: Number,
      amount: Number,
    },
  ],
  subtotal: Number,
  gstType: String,     // ✅ CGST/SGST or IGST
  gstTotal: Number,
  cgstTotal: Number,   // ✅ New field
  sgstTotal: Number,   // ✅ New field
  igstTotal: Number,   // ✅ New field
  discountType: String,
  discountValue: Number,
  discountAmount: Number,
  grandTotal: Number,
});

module.exports = mongoose.model("GstBill", GstBillSchema);
