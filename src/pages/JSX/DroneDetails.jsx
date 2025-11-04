import React from "react";
import { FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../CSS/dronedetails.css";
import drone1 from "../../assets/drone_image.png";
import drone2 from "../../assets/drone_image.png";

export default function DroneDetails() {
  const navigate = useNavigate();

  const drones = [
    { name: "Bhumi V.1.0.1", sales: 100, image: drone1 },
    { name: "Vajra", sales: 30, image: drone2 },
    { name: "Agni", sales: 50, image: drone2 },
  ];

  const handleDroneClick = (droneName) => {
    navigate(`/view-drone/${droneName}`);
  };

  return (
    <div className="drone-page">
      <h2 className="drone-title">Drone Details</h2>

      <div className="drone-container">
        {drones.map((drone, i) => (
          <div
            className="drone-cards"
            key={i}
            onClick={() => handleDroneClick(drone.name)}
          >
                          <FaShare className="icon" title="View Drone" />

            <div className="drone-card-content">
              <img src={drone.image} alt={drone.name} className="drone-img" />
              <div className="drone-info">
                <h3>{drone.name}</h3>
                <p>Sales Count: {drone.sales}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
