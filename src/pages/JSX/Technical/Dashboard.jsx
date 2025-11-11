import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import all images
import pendingImg from "../../../assets/pending.png";
import completedImg from "../../../assets/completed.png";
import assignedImg from "../../../assets/assigned.png";
import profileImg from "../../../assets/profile.png";
import "../../CSS/Technical/dashboard.css";

export default function TechnicalDashboard() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);

  const tiles = [
    { title: "Pending Work", image: pendingImg, type: "pending" },
    { title: "Assigned Work", image: assignedImg, type: "assigned" },
    { title: "Completed Work", image: completedImg, type: "completed" },
    { title: "Profile Details", image: profileImg, type: "profile" },
  ];

  const handleTileClick = (type) => {
    if (type === "profile") {
      navigate("/technical/profile-details");
    } else {
      navigate(`/technical/tasks?status=${type}`);
    }
  };

  return (
    <div className="dash-wrap">
      {/* ===== ONLINE/OFFLINE SWITCH ===== */}
      <div className="status-toggle-top">
        <span className={`status-text ${isOnline ? "online" : "offline"}`}>
          {isOnline ? "Online" : "Offline"}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={() => setIsOnline(!isOnline)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="dash-main">
        <div className="tile-grid">
          {tiles.map((t, i) => (
            <div
              key={i}
              className="tile"
              onClick={() => handleTileClick(t.type)}
              style={{ cursor: "pointer" }}
            >
              <div className="tile-image">
                <img src={t.image} alt={t.title} />
              </div>
              <div className="tile-title">{t.title}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
