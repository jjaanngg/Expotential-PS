// models/ProblemSet.js
import mongoose from "mongoose";

const problemSetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  setNumber: { type: Number, required: true },
  tiers: [String],
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem' 
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const ProblemSet = mongoose.model('ProblemSet', problemSetSchema);

export default ProblemSet;