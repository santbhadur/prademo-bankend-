const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Bill = require("./model/Bill");
const Counter = require("./model/Counter");
const GstBill = require("./model/GstBill");
const Counter1 = require("./model/Counter1");
const Logo = require("./model/Logo");
const { cloudinary, storage } = require("./cloudinary");
const upload = multer({ storage });


const app = express();
app.use("/uploads", express.static("uploads"));


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

// Helper functions for sequence
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

async function getNextSequences(name) {
  const counter = await Counter1.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // agar document nahi hai toh bana dega
  );
  return counter.seq;
}





// ------------------ API ROUTES ------------------

// ✅ Upload API
// ✅ Upload API with DB save
// ✅ Upload route
app.post("/upload", upload.single("logo"), (req, res) => {
  try {
    res.json({
      message: "Uploaded successfully",
      url: req.file.path, // Cloudinary returns public URL
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/logo", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:logos")
      .sort_by("created_at", "desc")
      .max_results(1)
      .execute();

    if (!result.resources || result.resources.length === 0) {
      return res.status(404).json({ message: "No logo found" });
    }

    res.json({
      url: result.resources[0].secure_url,
      uploadedAt: result.resources[0].created_at,
    });
  } catch (err) {
    console.error("Error fetching logo:", err);
    res.status(500).json({ error: "Error fetching logo", details: err.message });
  }
});





// ✅ Static folder to serve images
app.use("/uploads", express.static("uploads"));

// ✅ Get next bill number (normal bills)
app.get("/api/bills/next-bill", async (req, res) => {
  try {
    const counter = await Counter.findOne({ id: "billNumber" });
    let nextBillNumber = counter ? counter.seq + 1 : 1;
    res.json({ nextBillNumber });
  } catch (err) {
    console.error("Error fetching next bill number:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get next bill number (GST bills)
app.get("/api/bills/next-bills", async (req, res) => {
  try {
    const counter = await Counter1.findOne({ id: "billNumber" });
    let nextBillNumber = counter ? counter.seq + 1 : 1;
    res.json({ nextBillNumber });
  } catch (err) {
    console.error("Error fetching next bill number:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create Bill (Normal)
app.post("/api/bills", async (req, res) => {
  try {
    const nextBillNumber = await getNextSequence("billNumber");

    const bill = new Bill({
      billNumber: nextBillNumber,
      billDate: parseDate(req.body.billDate),
      customerName: req.body.customerName,
      phoneNumber: req.body.phoneNumber,
      items: req.body.items,
      subtotal: req.body.subtotal,
      discountType: req.body.discountType,
      discountValue: req.body.discountValue,
      discountAmount: req.body.discountAmount,
      grandTotal: req.body.grandTotal,
    });

    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    console.error("Error saving bill:", err);
    res.status(500).json({ error: err.message });
  }
});

function parseDate(input) {
  if (!input) return new Date();
  // If input is in DD/MM/YYYY format
  if (input.includes("/")) {
    const [day, month, year] = input.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(input); // for ISO or timestamp
}

app.post("/api/billss", async (req, res) => {
  try {
    const nextBillNumber = await getNextSequences("billNumber");

    const gstBill = new GstBill({
      billNumber: nextBillNumber,
      billDate: parseDate(req.body.billDate),
      customerName: req.body.customerName,
      phoneNumber: req.body.phoneNumber,
      items: req.body.items,
      subtotal: req.body.subtotal,
      gstType: req.body.gstType,
      gstTotal: req.body.gstTotal,
      cgstTotal: req.body.cgstTotal,
      sgstTotal: req.body.sgstTotal,
      igstTotal: req.body.igstTotal,
      discountType: req.body.discountType,
      discountValue: req.body.discountValue,
      discountAmount: req.body.discountAmount,
      grandTotal: req.body.grandTotal,
    });

    await gstBill.save();
    res.status(201).json(gstBill);
  } catch (err) {
    console.error("Error saving GST bill:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all normal bills (with optional date filter)
app.get("/api/bills", async (req, res) => {
  try {
    const { from, to } = req.query;
    let query = {};

    if (from && to) {
      query.billDate = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const bills = await Bill.find(query).sort({ billDate: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bills" });
  }
});

// ✅ Get all GST bills
app.get("/api/billss", async (req, res) => {
  try {
    const bills = await GstBill.find().sort({ billDate: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: "Error fetching GST bills" });
  }
});

// 🔹 Get single bill (View Page)
app.get("/api/billss/:id", async (req, res) => {
  try {
    const bill = await GstBill.findById(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔹 Get single bill (View Page)
app.get("/api/bills/:id", async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update bill (Edit Page)
app.put("/api/bills/:id", async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Delete bill
app.delete("/api/bills/:id", async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json({ message: "Bill deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete bill
app.delete("/api/billss/:id", async (req, res) => {
  try {
    const bill = await GstBill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json({ message: "Bill deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get total of all bills (Normal + GST)
app.get("/api/bills/total", async (req, res) => {
  try {
    // Normal bills ka total
    const normalTotal = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: { $toDouble: "$grandTotal" } } } }
    ]);

    // GST bills ka total
    const gstTotal = await GstBill.aggregate([
      { $group: { _id: null, total: { $sum: { $toDouble: "$grandTotal" } } } }
    ]);

    const normalSum = normalTotal.length > 0 ? normalTotal[0].total : 0;
    const gstSum = gstTotal.length > 0 ? gstTotal[0].total : 0;

    res.json({
      normalTotal: normalSum,
      gstTotal: gstSum,
      combinedTotal: normalSum + gstSum,
    });
  } catch (err) {
    console.error("Error fetching totals:", err);
    res.status(500).json({ error: err.message });
  }
});


// ------------------ START SERVER ------------------
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
