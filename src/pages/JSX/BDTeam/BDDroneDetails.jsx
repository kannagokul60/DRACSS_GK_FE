import React from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumbs from "../BreadCrumbs";
import "../../CSS/BDTeam/bdDroneDetails.css";

export default function BDDroneDetails() {
  const navigate = useNavigate();

  const drones = [
    {
      id: 1,
      name: "AeroScout X1",
      image: "https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/HbMAAOSwHxJkbRf7/$_32.JPG?set_id=880000500F",
    },
    {
      id: 2,
      name: "AgriFlyer V2",
      image: "https://image.mono.ipros.com/public/product/image/2073529/IPROS2626387104845531324.png",
    },
    {
      id: 3,
      name: "SkyGuard Pro",
      image: "https://flytechaviation.aero/wp-content/uploads/2025/09/drone-1-1.jpg",
    },
  ];

  const handleViewDetails = (drone) => {
    navigate(`/bd/drone-details/${drone.id}`, { state: { drone } });
  };

  return (
    <div className="bd-drone-container">
      <div className="bd-drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="bd-drone-heading">Company Drone Fleet</h2>

      <div className="bd-drone-grid">
        {drones.map((drone) => (
          <div key={drone.id} className="bd-drone-card">
            <div className="bd-drone-image-wrapper">
              <img src={drone.image} alt={drone.name} className="bd-drone-image" />
            </div>
            <div className="bd-drone-info">
              <h3 className="bd-drone-name">{drone.name}</h3>
              <button className="bd-drone-btn" onClick={() => handleViewDetails(drone)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
