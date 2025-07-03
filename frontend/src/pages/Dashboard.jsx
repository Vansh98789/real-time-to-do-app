// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ActivityLog from "../components/ActivityLog";

const socket = io(import.meta.env.VITE_BACKEND_URL);
const COLUMN_ORDER = ["Todo", "In Progress", "Done"];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  /* ───── Fetch tasks once on mount ───── */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  /* ───── Socket listeners (real‑time sync) ───── */
  useEffect(() => {
    socket.on("taskCreated", (task) => setTasks((p) => [...p, task]));
    socket.on("taskUpdated", (task) =>
      setTasks((p) => p.map((t) => (t._id === task._id ? task : t)))
    );
    socket.on("taskDeleted", (id) =>
      setTasks((p) => p.filter((t) => t._id !== id))
    );

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  /* ───── Add task ───── */
  const handleAddTask = async (status) => {
    const title = prompt("Enter task title:");
    if (!title) return;

    const newTask = {
      title,
      description: "New task",
      status,
      priority: "Medium",
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, newTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      /* No setTasks here; socket "taskCreated" will update everyone */
    } catch {
      alert("Failed to create task.");
    }
  };

  /* ───── Drag‑and‑drop handlers ───── */
  const handleDragStart = (id) => setDraggedTaskId(id);

  const handleDrop = async (newStatus) => {
    if (!draggedTaskId) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${draggedTaskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch {
      alert("Failed to move task.");
    }
    setDraggedTaskId(null);
  };

  /* ───── Delete task (Done column) ───── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch {
      alert("Failed to delete task.");
    }
  };

  /* ───── Column renderer ───── */
  const renderColumn = (status) => (
    <div
      key={status}
      className="bg-gray-200 p-4 w-full rounded-md min-h-[300px]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDrop(status)}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold">{status}</h2>
        <button
          onClick={() => handleAddTask(status)}
          className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
        >
          + Add
        </button>
      </div>

      {tasks
        .filter((t) => t.status === status)
        .map((task) => (
          <div
            key={task._id}
            className="bg-white p-3 rounded shadow mb-2 text-sm cursor-move"
            draggable
            onDragStart={() => handleDragStart(task._id)}
          >
            <h4 className="font-semibold">{task.title}</h4>
            <p className="text-gray-600">{task.description}</p>

            {task.status === "Done" && (
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-500 hover:text-red-700 text-xs mt-2"
              >
                Delete
              </button>
            )}
          </div>
        ))}
    </div>
  );

  /* ───── JSX ───── */
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Board */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Realtime Collaborative Board
        </h1>
        <div className="flex gap-4">{COLUMN_ORDER.map(renderColumn)}</div>
      </div>

      {/* Activity Log */}
      <div className="w-72 bg-white border-l p-4">
        <h2 className="font-bold mb-4">Activity Log</h2>
        <ActivityLog />
      </div>
    </div>
  );
};

export default Dashboard;
