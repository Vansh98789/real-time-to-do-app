import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();               // initial load

    socket.on("actionLogged", (log) => {
      setLogs((prev) => [log, ...prev].slice(0, 20)); // prepend, keep 20
    });

    return () => socket.off("actionLogged");
  }, []);

  return (
    <ul className="space-y-1 text-sm">
      {logs.map((l) => (
        <li key={l._id}>
          <strong>{l.user?.username || "Someone"}</strong> {l.action} (
          {new Date(l.timestamp).toLocaleTimeString()})
        </li>
      ))}
      {logs.length === 0 && <p className="text-gray-500">No activity yet…</p>}
    </ul>
  );
};

export default ActivityLog;
