import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BreadCrumbs from "../BreadCrumbs";
import { FaInfoCircle } from "react-icons/fa";
import "../../CSS/BDteam/soldDroneList.css";
import config from "../../../config";

export default function SoldDroneList() {
  const navigate = useNavigate();
  const location = useLocation();
  const droneName = location.state?.droneName || ""; // Get model name if passed

  const [soldDrones, setSoldDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrone, setSelectedDrone] = useState(null);

  useEffect(() => {
    fetchSoldDrones();
  }, [droneName]); // re-fetch if droneName chuanges

  const fetchSoldDrones = async () => {
    try {
      const clientsRes = await fetch(`${config.baseURL}/clients/`);
      const clientsData = await clientsRes.json();

      const dronesRes = await fetch(`${config.baseURL}/drone_registration/`);
      const dronesData = await dronesRes.json();

      const soldList = [];

      clientsData.forEach((client) => {
        (client.drones || []).forEach((serial) => {
          const droneDetails = dronesData.find(
            (d) =>
              d.drone_serial_number === serial &&
              (!droneName || d.model_name === droneName), // filter by selected drone
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

      {/* ===== TABLE VIEW ===== */}
      <div className="sold-drone-table-wrapper">
        <table className="sold-drone-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Client Name</th>
              <th>Serial Number</th>
              <th>UIN Number</th>
              <th>Email</th>
              <th>Location</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {soldDrones.map((drone, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{drone.clientName}</td>
                <td>{drone.drone_serial_number}</td>
                <td>{drone.uin_number}</td>
                <td>{drone.email}</td>
                <td>{drone.location}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedDrone(drone)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      {selectedDrone && (
        <div className="client-popup-overlay">
          <div className="client-popup">
            <div className="popup-header">
              <h3>{selectedDrone.clientName} - Drone Details</h3>
              <button
                className="client-popup-close-btn"
                onClick={() => setSelectedDrone(null)}
              >
                ✖
              </button>
            </div>

            <div className="popup-body">
              <img
                src={selectedDrone.logo}
                alt={selectedDrone.clientName}
                className="popup-logo"
              />
              <p>
                <strong>Phone:</strong> {selectedDrone.phone}
              </p>
              {/* <p>
                <strong>Email:</strong> {selectedDrone.email}
              </p>
              <p>
                <strong>Location:</strong> {selectedDrone.location}
              </p>
              <p>
                <strong>Serial:</strong> {selectedDrone.drone_serial_number}
              </p>
              <p>
                <strong>UIN:</strong> {selectedDrone.uin_number}
              </p> */}
              <p>
                <strong>Flight Controller:</strong>{" "}
                {selectedDrone.flight_controller_serial_number}
              </p>
              <p>
                <strong>Remote Controller:</strong>{" "}
                {selectedDrone.remote_controller}
              </p>
              <p>
                <strong>Battery Charger:</strong>{" "}
                {selectedDrone.battery_charger_serial_number}
              </p>
              <p>
                <strong>Battery 1:</strong>{" "}
                {selectedDrone.battery_serial_number_1}
              </p>
              <p>
                <strong>Battery 2:</strong>{" "}
                {selectedDrone.battery_serial_number_2}
              </p>
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
