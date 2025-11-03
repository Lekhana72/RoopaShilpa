const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  title: String,
  description: String,
  height: Number,
  material: String,
  timeline: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);

