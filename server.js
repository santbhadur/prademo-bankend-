const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Bill = require("./model/Bill");
const Counter = require("./model/Counter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://yrohan645:vEeMddaYn6y1iMxq@rohanapi.gxdefpz.mongodb.net/vastu?retryWrites=true&w=majority&appName=RohanApi",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ MongoDB connected"));

// Function to get next sequence number
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Get next bill number (without saving)
app.get("/api/bills/next-bill", async (req, res) => {
  try {
    const counter = await Counter.findOne({ id: "billNumber" });

    let nextBillNumber;
    if (!counter) {
      // If no counter exists, start from 1
      nextBillNumber = 1;
    } else {
      nextBillNumber = counter.seq + 1;
    }

    res.json({ nextBillNumber });
  } catch (err) {
    console.error("Error fetching next bill number:", err);
    res.status(500).json({ error: err.message });
  }
});


// Create Bill (Auto Increment billNumber)
// Create Bill (Auto Increment billNumber)
app.post("/api/bills", async (req, res) => {
  try {
    const nextBillNumber = await getNextSequence("billNumber");

    const {
      billDate,
      customerName,
      phoneNumber,
      items,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      grandTotal,
    } = req.body;

    const bill = new Bill({
      billNumber: nextBillNumber,
      billDate,
      customerName,
      phoneNumber,
      items,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      grandTotal,
    });

    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    console.error("Error saving bill:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all bills
app.get("/", async (req, res) => {
  const bills = await Bill.find();
  res.json(bills);
});

// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
