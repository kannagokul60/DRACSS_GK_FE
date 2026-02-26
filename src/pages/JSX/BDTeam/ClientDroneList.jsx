import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BreadCrumbs from "../BreadCrumbs";
import "../../CSS/BDteam/clientDroneList.css";
import config from "../../../config";

export default function ClientDroneList() {
  const location = useLocation();
  const client = location.state;

  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrone, setSelectedDrone] = useState(null);

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const res = await axios.get(`${config.baseURL}/drone_registration/`);

        const allDrones = res.data;

        // Filter drones where serial matches client.drones array
        const matchedDrones = allDrones.filter((drone) =>
          client?.drones?.includes(drone.drone_serial_number),
        );

        console.log("Matched Drones:", matchedDrones);

        setDrones(matchedDrones);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching drones:", error);
        setLoading(false);
      }
    };

    if (client?.drones?.length) {
      fetchDrones();
    } else {
      setLoading(false);
    }
  }, [client]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="client-drone-container">
      <div className="client-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <div className="client-drone-header">
        <h2>{client?.name} - Purchased Drones</h2>
      </div>

      <div className="drone-list">
        {drones.length === 0 && <p>No drones found for this client.</p>}

        {drones.map((drone) => (
          <div
            className="drone-card"
            key={drone.id}
            onClick={() => setSelectedDrone(drone)}
          >
            {" "}
            {/* Top Right Date */}
            <div className="drone-created-date">
              {new Date(drone.created_at).toLocaleDateString()}
            </div>
            {/* Drone Image */}
            {drone.attachment && (
              <img
                src={drone.attachment}
                alt={drone.model_name}
                className="drone-image"
              />
            )}
            <div className="drone-info">
              <h3>{drone.model_name}</h3>

              <p>
                <strong>Serial:</strong> {drone.drone_serial_number}
              </p>
              <p>
                <strong>UIN:</strong> {drone.uin_number}
              </p>
            </div>
          </div>
        ))}
      </div>
      {selectedDrone && (
        <div className="popup-overlay" onClick={() => setSelectedDrone(null)}>
          <div
            className="client-popup-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="client-popup-header">
              <h3 className="client-popup-title">{selectedDrone.model_name}</h3>

              <span
                className="client-popup-close"
                onClick={() => setSelectedDrone(null)}
              >
                ×
              </span>
            </div>
            {/* FORM BODY */}
            <div className="client-popup-form">
              <div className="client-popup-row">
                <div className="client-input-group">
                  <label>Serial Number</label>
                  <input
                    type="text"
                    value={selectedDrone.drone_serial_number || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>

                <div className="client-input-group">
                  <label>UIN Number</label>
                  <input
                    type="text"
                    value={selectedDrone.uin_number || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>
              </div>

              <div className="client-popup-row">
                <div className="client-input-group">
                  <label>Drone Type</label>
                  <input
                    type="text"
                    value={selectedDrone.drone_type || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>

                <div className="client-input-group">
                  <label>Manufacturer</label>
                  <input
                    type="text"
                    value={selectedDrone.manufacturer || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>
              </div>

              <div className="client-popup-row">
                <div className="client-input-group">
                  <label>Flight Controller</label>
                  <input
                    type="text"
                    value={selectedDrone.flight_controller_serial_number || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>

                <div className="client-input-group">
                  <label>Remote Controller</label>
                  <input
                    type="text"
                    value={selectedDrone.remote_controller || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>
              </div>

              <div className="client-popup-row">
                <div className="client-input-group">
                  <label>Battery Charger</label>
                  <input
                    type="text"
                    value={selectedDrone.battery_charger_serial_number || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>

                <div className="client-input-group">
                  <label>Battery 1</label>
                  <input
                    type="text"
                    value={selectedDrone.battery_serial_number_1 || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>
              </div>

              <div className="client-popup-row">
                <div className="client-input-group">
                  <label>Battery 2</label>
                  <input
                    type="text"
                    value={selectedDrone.battery_serial_number_2 || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>

                <div className="client-input-group">
                  <label>Registered</label>
                  <input
                    type="text"
                    value={selectedDrone.registered ? "Yes" : "No"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>
              </div>

              <div className="client-popup-row">
                <div className="client-input-group client-full-width">
                  <label>Remarks</label>
                  <input
                    type="text"
                    value={selectedDrone.remarks || "-"}
                    disabled
                    className="client-readonly-input"
                  />
                </div>
              </div>

              <div className="client-popup-row">
                <div className="client-input-group client-full-width">
                  <label>Created At</label>
                  <input
                    type="text"
                    value={
                      selectedDrone.created_at
                        ? new Date(selectedDrone.created_at).toLocaleString()
                        : "-"
                    }
                    disabled
                    className="client-readonly-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
