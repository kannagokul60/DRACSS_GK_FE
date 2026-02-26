import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import droneBg from "../../assets/drone_image.png";
import "../CSS/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Fetch all accounts
   const response = await fetch("http://127.0.0.1:8000/api/accounts/");
const accounts = await response.json();

console.log("Accounts:", accounts);
console.log("Form:", form);

      // Find account by email
      const user = accounts.find(
        (acc) => acc.email.toLowerCase() === form.email.toLowerCase()
      );

      if (!user) {
        setError("❌ Email not found!");
      } else {
        // Compare entered password with the plain password from API
        if (form.password !== user.password) {
          setError("❌ Incorrect password!");
        } else {
          // Save user in localStorage
          localStorage.setItem("user", JSON.stringify(user));

          // Redirect based on client_type
          switch (user.client_type) {
            case "client":
              navigate("/client/dashboard");
              break;
            case "admin":
  console.log("Navigating to admin");
  navigate("/admin/dashboard");
  break;

            case "bd":
              navigate("/bd/dashboard");
              break;
            case "technical":
              navigate("/technical/dashboard");
              break;
            case "pilot":
              navigate("/pilot/dashboard");
              break;
            case "inventory":
              navigate("/inventory/dashboard");
              break;
            default:
              navigate("/dashboard");
          }
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("⚠️ Unable to fetch accounts. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${droneBg})` }}
    >
      <div className="login-overlay"></div>

      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">DRACSS Login</h2>

        {error && <p className="login-error">{error}</p>}

<label className="login-label">Email</label>
<input
  className="login-input"
  type="email"
  value={form.email}
  onChange={(e) => setForm({ ...form, email: e.target.value })}
  placeholder="Enter email"
  autoComplete="username"
  required
/>

<label className="login-label">Password</label>
<input
  className="login-input"
  type="password"
  value={form.password}
  onChange={(e) => setForm({ ...form, password: e.target.value })}
  placeholder="Enter password"
  autoComplete="current-password"
  required
/>


        <p>
          <u style={{ cursor: "pointer" }}>Forgot Password?</u>
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
