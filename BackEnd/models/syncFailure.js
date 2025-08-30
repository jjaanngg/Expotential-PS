// models/SyncFailure.js
import mongoose from "mongoose"; 

const syncFailureSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, index: true },
  where:  { type: String, enum: ["login","daily"]},
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

const syncFailureModel = mongoose.model("SyncFailure", syncFailureSchema);

export default syncFailureModel;