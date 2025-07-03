import Task from "../models/Task.js";
import User from "../models/User.js";

const getUserWithLeastTasks = async () => {
  const users = await User.find();
  const taskCounts = await Promise.all(
    users.map(async (user) => {
      const count = await Task.countDocuments({
        assignedTo: user._id,
        status: { $in: ["Todo", "In Progress"] },
      });
      return { user, count };
    })
  );

  taskCounts.sort((a, b) => a.count - b.count);
  return taskCounts[0].user;
};

export default getUserWithLeastTasks;
