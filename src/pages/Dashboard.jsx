import React from "react";
import "./dashboard.css";

// Import all images from assets
import clientImg from "../assets/client_details.png";
import droneImg from "../assets/drone_details.png";
import knowledgeImg from "../assets/knowledgebase_data.png";
import storeImg from "../assets/store.png";
import supportImg from "../assets/support_request.png";
import profileImg from "../assets/profile_details.png";

export default function Dashboard() {
  const logout = () => {
    localStorage.removeItem("access");
    window.location.href = "/"; // redirect to login
  };

  const tiles = [
    { title: "Client Details", image: clientImg },
    { title: "Drone Details", image: droneImg },
    { title: "Knowledge Base", image: knowledgeImg },
    { title: "Aero360 Store", image: storeImg },
    { title: "Support Request", image: supportImg },
    { title: "Profile Details", image: profileImg },
  ];

  return (
    <div className="dash-wrap">
      <header className="dash-header">
        <h1 className="brand">DRACSS Dashboard</h1>
        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dash-main">
        <div className="tile-grid">
          {tiles.map((t, i) => (
            <div key={i} className="tile">
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
