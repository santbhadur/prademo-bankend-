
const mongoose = require("mongoose");

const counter1Schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter1", counter1Schema);
