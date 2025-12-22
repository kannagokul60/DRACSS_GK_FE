import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import droneBg from "../../assets/drone_image.png";
import "../CSS/register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    address: "",
    clientType: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Match Django model choices (lowercase keys)
  const clientOptions = [
    { value: "client", label: "Client" },
    { value: "admin", label: "Admin" },
    { value: "technical", label: "Technical" },
    { value: "pilot", label: "Pilot" },
    { value: "inventory", label: "Inventory" },
    { value: "bd", label: "BD Team" },
  ];

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          designation: form.designation,
          address: form.address,
          client_type: form.clientType || null, // must be lowercase key
          password: form.password,
          confirm_password: form.confirmPassword,
          is_active: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Account created successfully! Employee ID: ${data.employee_id}`);
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
    <div className="register-container" style={{ backgroundImage: `url(${droneBg})` }}>
      <div className="register-overlay"></div>

      <form onSubmit={handleSubmit} className="register-card">
        <h2 className="register-title">Create DRACSS Account</h2>

        <div className="register-grid">
          <div className="register-field">
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>

          <div className="register-field">
            <label>Email ID</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="register-field">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="register-field">
            <label>Designation</label>
            <input type="text" name="designation" value={form.designation} onChange={handleChange} />
          </div>

          <div className="register-field">
            <label>Address</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} />
          </div>

          <div className="register-field">
            <label>Client Type</label>
            <select name="clientType" value={form.clientType} onChange={handleChange} required>
              <option value="">Select Type</option>
              {clientOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="register-field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="register-field">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="register-link">
          Already have an account? <u onClick={() => navigate("/login")}>Login</u>
        </p>
      </form>
    </div>
  );
}
