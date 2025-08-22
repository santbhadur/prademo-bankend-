const express = require("express");
const router = express.Router();
const GstBill = require("../model/GstBill");

// Create Bill
router.post("/", async (req, res) => {
  try {
    const billData = req.body;

    // Subtotal
    const subtotal = billData.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    // GST calculation
    let totalGst = 0;
    const items = billData.items.map((item) => {
      const gstAmount = (item.price * item.qty * item.gstRate) / 100;
      totalGst += gstAmount;
      return {
        ...item,
        gstAmount,
        totalWithGst: item.price * item.qty + gstAmount,
      };
    });

    const grandTotal = subtotal + totalGst;

    const newBill = new GstBill({
      ...billData,
      items,
      subtotal,
      totalGst,
      grandTotal,
    });

    await newBill.save();
    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bills
router.get("/", async (req, res) => {
  try {
    const bills = await GstBill.find().sort({ billNumber: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
