import mongoose from "./index.js";

const ProfessionalSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  experience: Number,
  contactInfo: String,
  stores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
});

const Professional = mongoose.model("Professional", ProfessionalSchema);

module.exports = Professional;
