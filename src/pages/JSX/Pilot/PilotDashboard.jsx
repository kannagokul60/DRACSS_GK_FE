import React from "react";
import { useNavigate } from "react-router-dom";

// Import all images from assets
import deliveryImg from "../../../assets/delivered.png";
import pendingdeliver from "../../../assets/pendingdeliver.png";

import "../../CSS/Pilot/Dashboard.css";

export default function PilotDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    window.location.href = "/";
  };

const tiles = [
  { title: "Pending Delivery", image: pendingdeliver, path: "/pilot/pending-delivery" },
  { title: "Delivered", image: deliveryImg, path: "/pilot/pilot-delivered" },
];


  const handleTileClick = (path) => {
    if (path) navigate(path);
  };

  return (
    <div className="pilot-dash-wrap">
      <main className="pilot-dash-main">
        <div className="pilot-tile-grid">
          {tiles.map((t, i) => (
            <div
              key={i}
              className="pilot-tile"
              onClick={() => handleTileClick(t.path)}
              style={{ cursor: t.path ? "pointer" : "default" }}
            >
              <div className="pilot-tile-image">
                <img src={t.image} alt={t.title} />
              </div>
              <div className="pilot-tile-title">{t.title}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
