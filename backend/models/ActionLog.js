import mongoose from "mongoose";

const ActionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  timestamp: { type: Date, default: Date.now },
});

const ActionLog = mongoose.model("ActionLog", ActionLogSchema);
export default ActionLog;
