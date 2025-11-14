import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../CSS/layout.css";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleFromPath = (path) => {
    if (path.startsWith("/bd")) return "BD Team";
    if (path.startsWith("/technical")) return "Technical";
    return "Client";
  };

  const [selectedRole, setSelectedRole] = useState(getRoleFromPath(location.pathname));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSelectedRole(getRoleFromPath(location.pathname));
  }, [location.pathname]);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);

    if (newRole === "Client") navigate("/client/dashboard");
    else if (newRole === "BD Team") navigate("/bd/dashboard");
    else if (newRole === "Technical") navigate("/technical/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  return (
    <div className="layout-container">
      {/* ===== HEADER ===== */}
      <header className="layout-header">
        <h1
          className="layout-title"
          onClick={() =>
            navigate(`/${selectedRole.toLowerCase().replace(" ", "")}/dashboard`)
          }
        >
          DRACSS
        </h1>

        <div className="layout-right-controls">
          <select
            className="layout-role-dropdown"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="Client">Client</option>
            <option value="BD Team">BD Team</option>
            <option value="Technical">Technical</option>
          </select>

          <button className="layout-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="layout-body">
        <Sidebar setIsSidebarCollapsed={setIsSidebarCollapsed} />
        <main
          className={`layout-content ${
            isSidebarCollapsed ? "expanded" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
