import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import droneBg from "../../assets/drone_image.png";
import "../CSS/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem("access", "sample-token");
    navigate("/client/dashboard");
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${droneBg})` }}>
      <div className="login-overlay"></div>

      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">DRACSS Login</h2>

        <label className="login-label">Username</label>
        <input
          className="login-input"
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Enter username"
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Enter password"
        />
        <p>
          <u>Forgot Password?</u>
        </p>

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p>
          New user?{" "}
          <u
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "#ff6600" }}
          >
            Create Your Account
          </u>
        </p>
      </form>
    </div>
  );
}
