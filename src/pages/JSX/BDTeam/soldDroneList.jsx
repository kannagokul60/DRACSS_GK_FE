import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BreadCrumbs from "../BreadCrumbs";
import { FaInfoCircle } from "react-icons/fa";
import "../../CSS/BDteam/soldDroneList.css";

export default function SoldDroneList() {
  const navigate = useNavigate();
  const location = useLocation();
  const droneName = location.state?.droneName || ""; // Get model name if passed

  const [soldDrones, setSoldDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrone, setSelectedDrone] = useState(null);

  useEffect(() => {
    fetchSoldDrones();
  }, [droneName]); // re-fetch if droneName changes

  const fetchSoldDrones = async () => {
    try {
      const clientsRes = await fetch("http://127.0.0.1:8000/api/clients/");
      const clientsData = await clientsRes.json();

      const dronesRes = await fetch("http://127.0.0.1:8000/api/drone_registration/");
      const dronesData = await dronesRes.json();

      const soldList = [];

      clientsData.forEach((client) => {
        (client.drones || []).forEach((serial) => {
          const droneDetails = dronesData.find(
            (d) =>
              d.drone_serial_number === serial &&
              (!droneName || d.model_name === droneName) // filter by selected drone
          );
          if (droneDetails) {
            soldList.push({
              ...droneDetails,
              clientName: client.name,
              phone: client.phone,
              email: client.email,
              location: client.location,
              logo: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png", // placeholder logo
            });
          }
        });
      });

      setSoldDrones(soldList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sold drones:", error);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading sold drones...</p>;

  return (
    <div className="bd-drone-container">
      <div className="bd-drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="client-list-title">
        Sold Drones Inventory {droneName ? `- ${droneName}` : ""}
      </h2>

      {soldDrones.length === 0 && (
  <div className="no-data-message">
    No sold drones found for {droneName || "this model"}.
  </div>
)}


      {/* CLIENT GRID */}
      <div className="client-grid">
        {soldDrones.map((drone, index) => (
          <div key={index} className="client-card">
            <img src={drone.logo} alt={drone.clientName} className="client-logo" />
            <h4 className="client-name">{drone.clientName}</h4>
            <p className="client-location">{drone.location}</p>
            <p className="client-serial">
              <strong>Serial:</strong> {drone.drone_serial_number}
            </p>
            <p className="client-uin">
              <strong>UIN:</strong> {drone.uin_number}
            </p>

            <FaInfoCircle
              className="bd-info-icon"
              title="View More Details"
              onClick={() => setSelectedDrone(drone)}
            />
          </div>
        ))}
      </div>

      {/* POPUP */}
      {selectedDrone && (
        <div className="client-popup-overlay">
          <div className="client-popup">
            <div className="popup-header">
              <h3>{selectedDrone.clientName} - Drone Details</h3>
              <button className="close-btn" onClick={() => setSelectedDrone(null)}>
                ✖
              </button>
            </div>

            <div className="popup-body">
              <img
                src={selectedDrone.logo}
                alt={selectedDrone.clientName}
                className="popup-logo"
              />
              <p><strong>Phone:</strong> {selectedDrone.phone}</p>
              <p><strong>Email:</strong> {selectedDrone.email}</p>
              <p><strong>Location:</strong> {selectedDrone.location}</p>
              <p><strong>Serial:</strong> {selectedDrone.drone_serial_number}</p>
              <p><strong>UIN:</strong> {selectedDrone.uin_number}</p>
              <p><strong>Flight Controller:</strong> {selectedDrone.flight_controller_serial_number}</p>
              <p><strong>Remote Controller:</strong> {selectedDrone.remote_controller}</p>
              <p><strong>Battery Charger:</strong> {selectedDrone.battery_charger_serial_number}</p>
              <p><strong>Battery 1:</strong> {selectedDrone.battery_serial_number_1}</p>
              <p><strong>Battery 2:</strong> {selectedDrone.battery_serial_number_2}</p>
              {selectedDrone.attachment && (
                <p>
                  <strong>Attachment:</strong>{" "}
                  <a
                    href={selectedDrone.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedDrone.attachment.split("/").pop()}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
