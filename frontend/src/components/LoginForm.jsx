// LoginForm.jsx – Handles login UI + link to Register
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        form
      );
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md w-full max-w-sm"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <input
        type="text"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        required
        className="input-field"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="input-field mt-2"
      />

      <button type="submit" className="btn-primary w-full mt-4">
        Login
      </button>

      {/* ---- Switch to Register ---- */}
      <Link
        to="/register"
        className="block text-center mt-4 text-blue-600 hover:underline"
      >
        Don’t have an account? Register
      </Link>
    </form>
  );
};

export default LoginForm;
