import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaUser,
  FaHeadset,
  FaTasks,
  FaUsers,
  FaClipboardCheck,
  FaBars,
  FaInfoCircle,
} from "react-icons/fa";
import "../CSS/sidebar.css";

export default function Sidebar({ setIsSidebarCollapsed }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Detect base path and role

  const pathParts = location.pathname.split("/");
  const basePath = `/${pathParts[1] || "client"}`;

  const role = basePath.includes("bd")
    ? "BD Team"
    : basePath.includes("technical")
    ? "Technical"
    : basePath.includes("pilot")
    ? "Pilot"
    : "Client";

  const menus = {
    Client: [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: `${basePath}/dashboard`,
      },

      {
        name: "Drone Registration",
        icon: <FaBars />, // Best for registration / adding drone
        path: `${basePath}/drone-registration`,
      },
      {
        name: "Drone Details",
        icon: <FaInfoCircle />, // Best for viewing drone information
        path: `${basePath}/drone-details`,
      },
      {
        name: "Knowledge Base",
        icon: <FaBook />,
        path: `${basePath}/knowledge-base`,
      },
      { name: "Support", icon: <FaHeadset />, path: `${basePath}/support` },
      {
        name: "Profile",
        icon: <FaUser />,
        path: `${basePath}/profile-details`,
      },
    ],
    "BD Team": [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: `${basePath}/dashboard`,
      },
      {
        name: "Client List",
        icon: <FaUsers />,
        path: `${basePath}/client-list`,
      },
      {
        name: "Drone Approval",
        icon: <FaTachometerAlt />,
        path: `${basePath}/drone-approve`,
      },
      { name: "Order Form", icon: <FaBook />, path: `${basePath}/orderform` },
      {
        name: "Drone Details",
        icon: <FaTachometerAlt />,
        path: `${basePath}/drone-details`,
      },
      { name: "Support", icon: <FaHeadset />, path: `${basePath}/support` },
      {
        name: "Knowledge Base",
        icon: <FaBook />,
        path: `${basePath}/knowledge-base`,
      },
      {
        name: "Pending Tasks",
        icon: <FaTasks />,
        path: `${basePath}/pending-tasks`,
      },
      {
        name: "Profile",
        icon: <FaUser />,
        path: `${basePath}/profile-details`,
      },
    ],
    Technical: [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: `${basePath}/dashboard`,
      },
      {
        name: "Pending Work",
        icon: <FaUser />,
        path: `${basePath}/assigned-drones`,
      },
            {
        name: "Support Tickets",
        icon: <FaHeadset />,
        path: `${basePath}/support-tech`,
      },
      {
        name: "Completed Work",
        icon: <FaUser />,
        path: `${basePath}/completed-work`,
      },
      {
        name: "Profile",
        icon: <FaUser />,
        path: `${basePath}/profile`,
      },
    ],
    Pilot: [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: `${basePath}/dashboard`,
      },
      {
        name: "Pending Deliveries",
        icon: <FaClipboardCheck />,
        path: `${basePath}/pending-delivery`,
      },
      {
        name: "Pilot Delivered",
        icon: <FaClipboardCheck />,
        path: `${basePath}/pilot-delivered`,
      },

      {
        name: "Profile",
        icon: <FaUser />,
        path: `${basePath}/profile-details`,
      },
    ],
  };

  const menuItems = menus[role] || [];

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      setIsSidebarCollapsed(newState);
      return newState;
    });
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* ===== Header ===== */}
      <div className="sidebar-header">
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
          title="Toggle Sidebar"
        >
          <FaBars />
        </button>
        {!isCollapsed && <h2 className="sidebar-title">{role} Menu</h2>}
      </div>

      {/* ===== Menu List ===== */}
      <ul className="sidebar-list">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
