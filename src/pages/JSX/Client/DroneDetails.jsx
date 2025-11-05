import React from "react";
import { FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../CSS/dronedetails.css";
import drone1 from "../../../assets/drone_image.png";
import drone2 from "../../../assets/drone_image.png";

export default function DroneDetails() {
  const navigate = useNavigate();

  const drones = [
    {
      name: "Bhumi V.1.0.1",
      purchaseDate: "2024-06-10",
      count: 3,
      image: drone1,
    },
    { name: "Vajra", purchaseDate: "2023-12-22", count: 2, image: drone2 },
    { name: "Agni", purchaseDate: "2025-02-18", count: 1, image: drone2 },
  ];

  const handleDroneClick = (droneName) => {
    navigate(`/view-drone/${droneName}`);
  };

  return (
    <div className="drone-page">
      <div className="drone-header">
        <h2 className="drone-title">Drone Details</h2>
      </div>

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
                <p>
                  Purchase Date: <strong>{drone.purchaseDate}</strong>
                </p>
                <p>
                  Count: <strong>{drone.count} pcs</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
