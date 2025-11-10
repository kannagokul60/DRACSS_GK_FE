import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import droneBg from "../../assets/drone_image.png";
import "../CSS/register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    employeeId: "",
    phone: "",
    designation: "",
    address: "",
    clientType: null,
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          employee_id: form.employeeId,
          phone: form.phone,
          designation: form.designation,
          address: form.address,
          client_type: form.clientType, // can be null or a value
          password: form.password,
          confirm_password: form.confirmPassword,
          is_active: true, // optional — depends on backend defaults
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("✅ Account created successfully!");
        console.log("Response:", data);
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("❌ Registration failed! Check console for details.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("⚠️ Unable to connect to server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${droneBg})` }}
    >
      <div className="register-overlay"></div>

      <form onSubmit={handleSubmit} className="register-card">
        <h2 className="register-title">Create DRACSS Account</h2>

        <div className="register-grid">
          <div className="register-field">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="register-field">
            <label>Email ID</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="register-field">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder="Enter employee ID"
            />
          </div>

          <div className="register-field">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="register-field">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Enter designation"
            />
          </div>

          <div className="register-field">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          <div className="register-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="register-field">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="register-link">
          Already have an account?{" "}
          <u onClick={() => navigate("/login")}>Login</u>
        </p>
      </form>
    </div>
  );
}
