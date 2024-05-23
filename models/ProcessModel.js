import mongoose from "mongoose";
const processSchema = new mongoose.Schema({
  processId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Process", processSchema);
