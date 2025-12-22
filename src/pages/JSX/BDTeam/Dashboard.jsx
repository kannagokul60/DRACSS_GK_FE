import React from "react";
import { useNavigate } from "react-router-dom";

// Import all images from assets
import clientImg from "../../../assets/community.png";
import droneImg from "../../../assets/drone.png";
import knowledgeImg from "../../../assets/Knowledge_base.svg";
import storeImg from "../../../assets/shopping-cart.png";
import supportImg from "../../../assets/call.png";
import profileImg from "../../../assets/profile.png";
import pendingImg from "../../../assets/pending.png";
import DroneApprove from  "../../../assets/apporrej.png";
import orderForm from "../../../assets/orderForm.png";
import "../../CSS/BDteam/bdDashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    window.location.href = "/";
  };

  const tiles = [
  { title: "Clients", image: clientImg, path: "/bd/client-list" },
    { title: "Drone Details", image: droneImg, path: "/bd/drone-details" },
        { title: "Order Form", image: orderForm, path: "/bd/orderform" },

    { title: "Drone Approve", image: DroneApprove, path: "/bd/drone-approve" },
  { title: "Knowledge Base", image: knowledgeImg, path: "/bd/knowledge-base" },
    { title: "Aero360 Store", image: storeImg },
{ title: "Support Request", image: supportImg, path: "/bd/support" },
{ title: "Pending Task", image: pendingImg, path: "/bd/pending-tasks" },
{ title: "Profile Details", image: profileImg, path: "/bd/profile-details" },

  ];

  const handleTileClick = (path) => {
    if (path) navigate(path);
  };

  return (
    <div className="bd-dash-wrap">
      <main className="bd-dash-main">
        <div className="bd-tile-grid">
          {tiles.map((t, i) => (
            <div
              key={i}
              className="bd-tile"
              onClick={() => handleTileClick(t.path)}
              style={{ cursor: t.path ? "pointer" : "default" }}
            >
              <div className="bd-tile-image">
                <img src={t.image} alt={t.title} />
              </div>
              <div className="bd-tile-title">{t.title}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
