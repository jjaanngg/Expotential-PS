// models/ProblemSet.js
import mongoose from "mongoose";

const problemSetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  setNumber: { type: Number, required: true },
  tiers: [String],
  problems: [             // ✅ Problem 모델과 스키마 형식 맞춰주기
    {
      problemId: Number,
      titleKo: String,
      tier: Number,
      solvedCount: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const ProblemSet = mongoose.model('ProblemSet', problemSetSchema);

export default ProblemSet;