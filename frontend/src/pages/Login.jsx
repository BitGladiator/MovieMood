import React, { useState } from "react";
import { login } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-3 w-full bg-black/30 border border-white/20 rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-3 w-full bg-black/30 border border-white/20 rounded"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 w-full py-3 rounded">Login</button>
      </form>
    </div>
  );
}
