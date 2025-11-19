import React from "react";
import { useNavigate } from "react-router-dom";

// Import all images from assets
import deliveryImg from "../../../assets/delivered.png";
import pendingdeliver from "../../../assets/pendingdeliver.png";
import knowledgeImg from "../../../assets/Knowledge_base.svg";
import storeImg from "../../../assets/shopping-cart.png";
import supportImg from "../../../assets/call.png";
import profileImg from "../../../assets/profile.png";
import pendingImg from "../../../assets/pending.png";
import DroneApprove from "../../../assets/apporrej.png";
import orderForm from "../../../assets/orderForm.png";
import "../../CSS/Pilot/Dashboard.css";

export default function PilotDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    window.location.href = "/";
  };

  const tiles = [
        { title: "Pending Delivery", image: pendingdeliver, path: "/bd/drone-details" },

    { title: "Delivered", image: deliveryImg, path: "/bd/client-list" },
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
