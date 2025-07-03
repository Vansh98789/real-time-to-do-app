import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";
import ActionLog from "../models/ActionLog.js";
import auth from "../middleware/authMiddleware.js";
import { getIO } from "../socket.js";

const router = express.Router();

router.get("/", auth, async (_req, res) => {
  const tasks = await Task.find().populate("assignedTo", "username");
  res.json(tasks);
});

router.post("/", auth, async (req, res) => {
  const task = await Task.create(req.body);

  const log = await ActionLog.create({
    user: req.user.id,
    action: "created a task",
    taskId: task._id,
  });

  const io = getIO();
  io.emit("taskCreated", task);
  io.emit("actionLogged", log);

  res.status(201).json(task);
});

router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { ...req.body, lastUpdatedAt: new Date() },
    { new: true }
  );

  const log = await ActionLog.create({
    user: req.user.id,
    action: "updated a task",
    taskId: task._id,
  });

  const io = getIO();
  io.emit("taskUpdated", task);
  io.emit("actionLogged", log);

  res.json(task);
});

router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  const log = await ActionLog.create({
    user: req.user.id,
    action: "deleted a task",
    taskId: req.params.id,
  });

  const io = getIO();
  io.emit("taskDeleted", req.params.id);
  io.emit("actionLogged", log);

  res.json({ message: "Task deleted" });
});

/* smart‑assign stays the same, just emit events */
router.post("/:id/smart-assign", auth, async (req, res) => {
  const users = await User.find();
  const counts = await Promise.all(
    users.map((u) =>
      Task.countDocuments({
        assignedTo: u._id,
        status: { $in: ["Todo", "In Progress"] },
      }).then((c) => ({ user: u, count: c }))
    )
  );

  counts.sort((a, b) => a.count - b.count);
  const target = counts[0].user;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { assignedTo: target._id },
    { new: true }
  );

  const log = await ActionLog.create({
    user: req.user.id,
    action: `smart‑assigned task to ${target.username}`,
    taskId: task._id,
  });

  const io = getIO();
  io.emit("taskUpdated", task);
  io.emit("actionLogged", log);

  res.json(task);
});

export default router;
