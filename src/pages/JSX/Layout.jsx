import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "../CSS/layout.css";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current role based on URL
  const currentRole = location.pathname.startsWith("/bd") ? "BD Team" : "Client";

  const [selectedRole, setSelectedRole] = useState(currentRole);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);

    // Navigate to respective dashboard
    if (newRole === "Client") {
      navigate("/client/dashboard");
    } else if (newRole === "BD Team") {
      navigate("/bd/dashboard");
    }
    else if (newRole === "Technical") {
      navigate("/technical/dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1 className="layout-title" onClick={() => navigate("/client/dashboard")}>
          DRACSS
        </h1>

        <div className="layout-right-controls">
          {/* Role Dropdown */}
          <select
            className="layout-role-dropdown"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="Client">Client</option>
            <option value="BD Team">BD Team</option>
            <option value="Technical">Technical</option>
          </select>

          {/* Logout Button */}
          <button className="layout-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}
