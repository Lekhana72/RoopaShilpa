const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commissionSchema = new Schema({
  name: { type: String, required: true },
  subjectStyle: { type: String, required: true },
  materialDescription: { type: String },
  materials: [{ type: String }],
  timeline: { type: Date },
  budget: { type: Number },
  contactNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Quoted", "Approved", "In Progress", "Completed"],
    default: "Pending"
  },
  sculptorResponse: {
    costEstimate: Number,
    expectedCompletion: Date,
    message: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CommissionRequest", commissionSchema);

