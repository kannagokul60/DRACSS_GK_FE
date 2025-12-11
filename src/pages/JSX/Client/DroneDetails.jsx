import React, { useEffect, useState } from "react";
import { FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../CSS/Client/dronedetails.css";
import BreadCrumbs from "../BreadCrumbs";
import bhumi from "../../../assets/bhumi.png";
import config from "../../../config";

export default function DroneDetails() {
  const navigate = useNavigate();
  const [drones, setDrones] = useState([]);

  useEffect(() => {
    const fetchRegisteredDrones = async () => {
      try {
        const res = await fetch(`${config.baseURL}/drone_registration/`);
        const data = await res.json();

        // Only include drones with registered: true
        const registeredDrones = data.filter((d) => d.registered === true);

        setDrones(
          registeredDrones.map((d) => ({
            name: d.model_name,
            purchaseDate: d.created_at.split("T")[0],
            count: d.client?.length || 1,
            image: d.image || bhumi,
          }))
        );
      } catch (err) {
        console.error("Error fetching registered drones:", err);
      }
    };

    fetchRegisteredDrones();
  }, []);

  const handleDroneClick = (droneName) => {
    navigate(`/client/view-drone/${encodeURIComponent(droneName)}`);
  };

  return (
    <div className="drone-page">
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs title="Drone Details" />
      </div>

      <div className="drone-header">
        <h2 className="drone-title">Registered Drones</h2>
      </div>

      <div className="drone-container">
        {drones.length > 0 ? (
          drones.map((drone, i) => (
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
          ))
        ) : (
          <p>No registered drones available.</p>
        )}
      </div>
    </div>
  );
}
