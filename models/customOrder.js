const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customizeOrderSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  stone: String,
  height: Number,
  place: String,
  duration: Number
});

const CustomizeOrder = mongoose.model("CustomizeOrder", customizeOrderSchema);
module.exports = CustomizeOrder;
