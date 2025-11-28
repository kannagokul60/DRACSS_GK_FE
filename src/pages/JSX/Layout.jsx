import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../CSS/layout.css";
import Profile from "../../assets/profile_icon.png";
import Logout from "../../assets/logout.png";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef(null);

  // ------------------- GET ROLE FROM URL -------------------
  const getRoleFromPath = (path) => {
    if (path.startsWith("/bd")) return "BD Team";
    if (path.startsWith("/technical")) return "Technical";
    if (path.startsWith("/pilot")) return "Pilot";
    return "Client";
  };

  const [selectedRole, setSelectedRole] = useState(
    getRoleFromPath(location.pathname)
  );

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSelectedRole(getRoleFromPath(location.pathname));
  }, [location.pathname]);

  // ------------------- LOGOUT -------------------
  const logout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  // ------------------- CLICK OUTSIDE CLOSE -------------------
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

    const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);

    if (newRole === "Client") navigate("/client/dashboard");
    else if (newRole === "BD Team") navigate("/bd/dashboard");
    else if (newRole === "Technical") navigate("/technical/dashboard");
    else if (newRole === "Pilot") navigate("/pilot/dashboard");
  };

  return (
    <div className="layout-container">
      {/* ===== HEADER ===== */}
      <header className="layout-header">
        <h1
          className="layout-title"
          onClick={() =>
            navigate(
              `/${selectedRole.toLowerCase().replace(" ", "")}/dashboard`
            )
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

            {showProfilePopup && (
              <div className="profile-dropdown">
                <h4>Profile</h4>

                <p>
                  <strong>Name:</strong> Gokul Kanna
                </p>
                <p>
                  <strong>User ID:</strong> 20ISR013
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

          {/* LOGOUT ICON */}
          {/* <img
            src={Logout}
            alt="logout"
            className="logout-profile-icon"
            onClick={logout}
            title="Logout"
          /> */}
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
