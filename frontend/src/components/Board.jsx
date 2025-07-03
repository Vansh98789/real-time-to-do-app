// Board.jsx - Renders the Kanban board with three columns
import React, { useEffect, useState } from "react";
import Column from "./Column";
import socket from "../utils/socket";
import axios from "axios";

const columns = ["Todo", "In Progress", "Done"];

const Board = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();

    socket.on("taskCreated", fetchTasks);
    socket.on("taskUpdated", fetchTasks);
    socket.on("taskDeleted", fetchTasks);

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto">
      {columns.map((col) => (
        <Column key={col} title={col} tasks={tasks.filter((t) => t.status === col)} />
      ))}
    </div>
  );
};

export default Board;
