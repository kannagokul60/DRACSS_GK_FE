import React from "react";
import { useNavigate } from "react-router-dom";

// Import all images from assets
import clientImg from "../../../assets/registration.svg";
import droneImg from "../../../assets/drone.png";
import knowledgeImg from "../../../assets/Knowledge_base.svg";
import storeImg from "../../../assets/shopping-cart.png";
import supportImg from "../../../assets/call.png";
import profileImg from "../../../assets/profile.png";
import "../../CSS/Client/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    window.location.href = "/";
  };

  const tiles = [
  { title: "Drone Registration", image: clientImg, path: "/client/drone-registration" },
    { title: "My Drones", image: droneImg, path: "/client/drone-details" },
  { title: "Knowledge Base", image: knowledgeImg, path: "/client/knowledge-base" },
    { title: "Aero360 Store", image: storeImg },
{ title: "Support Request", image: supportImg, path: "/client/support" },
{ title: "Profile Details", image: profileImg, path: "/client/profile-details" },
  ];

  const handleTileClick = (path) => {
    if (path) navigate(path);
  };

  return (
    <div className="client-dash-wrap">
      <main className="client-dash-main">
        <div className="client-tile-grid">
          {tiles.map((t, i) => (
            <div
              key={i}
              className="tile"
              onClick={() => handleTileClick(t.path)}
              style={{ cursor: t.path ? "pointer" : "default" }}
            >
              <div className="client-tile-image">
                <img src={t.image} alt={t.title} />
              </div>
              <div className="client-tile-title">{t.title}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
