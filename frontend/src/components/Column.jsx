// Column.jsx - A column on the Kanban board for a specific status
import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ title, tasks }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-md w-80 min-w-[18rem]">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
