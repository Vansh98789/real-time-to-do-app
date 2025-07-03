// TaskCard.jsx - Displays an individual task
import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-3 rounded shadow-md transition-transform hover:scale-[1.02]">
      <h4 className="font-semibold">{task.title}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{task.priority}</span>
        <span>{task.status}</span>
      </div>
    </div>
  );
};

export default TaskCard;
