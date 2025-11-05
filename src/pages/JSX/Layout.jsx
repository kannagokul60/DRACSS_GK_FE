import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../CSS/layout.css"; // separate CSS for layout

export default function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1 className="layout-title" onClick={() => navigate("/dashboard")}>
          DRACSS
        </h1>
        <button className="layout-logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}
