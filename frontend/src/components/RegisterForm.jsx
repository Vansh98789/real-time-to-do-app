// RegisterForm.jsx – Handles registration UI + link to Login
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        form
      );
      setSuccess(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md w-full max-w-sm"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm mb-3">
          Registration successful! You can now log in.
        </p>
      )}

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
        Register
      </button>

      {/* ---- Switch to Login ---- */}
      <Link
        to="/login"
        className="block text-center mt-4 text-blue-600 hover:underline"
      >
        Already have an account? Login
      </Link>
    </form>
  );
};

export default RegisterForm;
