import mongoose from "mongoose";
const timeLogSchema = new mongoose.Schema({
  processId: { type: String, required: true },
  time: { type: Date, required: true },
});

export default mongoose.model("TimeLog", timeLogSchema);
