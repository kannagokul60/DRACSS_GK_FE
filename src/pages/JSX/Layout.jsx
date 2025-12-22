import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../CSS/layout.css";
import Profile from "../../assets/profile_icon.png";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef(null);

  const [user, setUser] = useState(null); // store logged-in user

  // Get role from URL path
  const getRoleFromPath = (path) => {
    if (path.startsWith("/bd")) return "BD Team";
    if (path.startsWith("/technical")) return "Technical";
    if (path.startsWith("/pilot")) return "Pilot";
    return "Client";
  };

  const [selectedRole, setSelectedRole] = useState(getRoleFromPath(location.pathname));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load logged-in user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Update selectedRole when URL changes
  useEffect(() => {
    setSelectedRole(getRoleFromPath(location.pathname));
  }, [location.pathname]);

  // Close popup on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };

    if (showProfilePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfilePopup]);

  const logout = () => {
    localStorage.removeItem("user"); // remove user from localStorage
    navigate("/");
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);

    switch (newRole) {
      case "Client":
        navigate("/client/dashboard");
        break;
      case "BD Team":
        navigate("/bd/dashboard");
        break;
      case "Technical":
        navigate("/technical/dashboard");
        break;
      case "Pilot":
        navigate("/pilot/dashboard");
        break;
      default:
        navigate("/dashboard");
    }
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
          {/* ROLE DROPDOWN */}
          <select
            className="layout-role-dropdown"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="Client">Client</option>
            <option value="BD Team">BD Team</option>
            <option value="Technical">Technical</option>
            <option value="Pilot">Pilot</option>
          </select>

          {/* PROFILE SECTION */}
          <div className="profile-dropdown-wrapper" ref={popupRef}>
            <img
              src={Profile}
              alt="profile"
              className="layout-profile-icon"
              onClick={() => setShowProfilePopup((prev) => !prev)}
              title="View Profile"
            />

            {showProfilePopup && user && (
              <div className="profile-dropdown">
                <h4>Profile</h4>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Employee ID:</strong> {user.employee_id}
                </p>
                <p>
                  <strong>Role:</strong> {selectedRole}
                </p>

                <button className="profile-logout-btn" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* OVERLAY – ONLY WHEN POPUP OPEN */}
      {showProfilePopup && <div className="profile-overlay"></div>}

      {/* ===== BODY ===== */}
      <div className="layout-body">
        <Sidebar setIsSidebarCollapsed={setIsSidebarCollapsed} />

        <main
          className={`layout-content ${isSidebarCollapsed ? "expanded" : ""}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
