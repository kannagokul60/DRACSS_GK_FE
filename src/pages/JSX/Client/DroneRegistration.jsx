import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import "../../CSS/Client/droneRegistration.css";
import DroneRegistrationForm from "./DroneRegistrationForm";
import BreadCrumbs from "../BreadCrumbs";

export default function DroneRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  //Fetch drones from backend
  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/drone_registration/"
        );
        const data = await res.json();
        setDrones(data);
      } catch (error) {
        console.error("Error fetching drones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrones();
  }, []);

  // Handle form submission (POST to backend)
  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/drone_registration/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model_name: formData.modelName,
            drone_type: formData.type,
            manufacturer: formData.manufacturer,
            uin_number: formData.uin,
            drone_serial_number: formData.droneSerial,
            flight_controller_serial_number: formData.flightController,
            remote_controller: formData.remoteController,
            battery_charger_serial_number: formData.batteryCharger,
            battery_serial_number_1: formData.battery1,
            battery_serial_number_2: formData.battery2,
            attachment: formData.attachment || null,
            is_active: true,
          }),
        }
      );

      if (response.ok) {
        const newDrone = await response.json();
        setDrones((prev) => [...prev, newDrone]);
        setShowForm(false);
      } else {
        console.error("Failed to register drone:", response.statusText);
      }
    } catch (err) {
      console.error("Error submitting drone:", err);
    }
  };

  // Status icon helper
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <FaCheckCircle className="status-icon approved" />;
      case "rejected":
        return <FaTimesCircle className="status-icon rejected" />;
      case "pending":
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  // Handle card click (View only)
  const handleCardClick = (drone) => {
    setSelectedDrone(drone);
    setShowForm(true);
  };

  return (
    <div className="drone-reg-page">
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      {/* Header */}
      <div className="drone-reg-header">
        <h2>Drone Registration</h2>
        <button
          className="register-btn"
          onClick={() => {
            setSelectedDrone(null);
            setShowForm(true);
          }}
        >
          + Register Drone
        </button>
      </div>

      {/* Drone List */}
      {loading ? (
        <p>Loading drones...</p>
      ) : drones.length === 0 ? (
        <p>No drones registered yet.</p>
      ) : (
        <div className="drone-cards-grid">
          {drones.map((drone) => (
            <div
              key={drone.id}
              className="drone-card"
              onClick={() => handleCardClick(drone)}
            >
              <div className="drone-card-header">
                <h3>{drone.model_name}</h3>
                <span
                  className={`status-badge ${
                    drone.status ? drone.status.toLowerCase().trim() : "pending"
                  }`}
                >
                  {getStatusIcon(drone.status)} {drone.status || "Pending"}
                </span>
              </div>

              <div className="drone-card-body">
                <p>
                  <FaCalendarAlt /> Registered On:{" "}
                  <strong>
                    {drone.created_at
                      ? new Date(drone.created_at).toLocaleDateString()
                      : "N/A"}
                  </strong>
                </p>
                <p>
                  <FaPaperPlane /> Type: <strong>{drone.drone_type}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DroneRegistrationForm
              drone={selectedDrone}
              onClose={() => setShowForm(false)}
              onSubmit={!selectedDrone ? handleFormSubmit : undefined}
              viewOnly={!!selectedDrone}
            />
          </div>
        </div>
      )}
    </div>
  );
}
