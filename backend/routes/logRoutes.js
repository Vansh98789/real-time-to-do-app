import express from "express";
import ActionLog from "../models/ActionLog.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .populate("user", "username")
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
