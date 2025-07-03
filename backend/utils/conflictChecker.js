import Task from "../models/Task.js";

const checkForConflict = async (taskId, clientUpdatedAt) => {
  const task = await Task.findById(taskId);
  if (!task) return { conflict: false };

  const serverUpdatedAt = new Date(task.lastUpdatedAt).getTime();
  const clientTime = new Date(clientUpdatedAt).getTime();

  const conflict = Math.abs(serverUpdatedAt - clientTime) > 1000;
  return { conflict, task };
};

export default checkForConflict;
