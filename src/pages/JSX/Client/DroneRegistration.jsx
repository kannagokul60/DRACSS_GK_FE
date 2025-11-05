import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import "../../CSS/droneRegistration.css";
import DroneRegistrationForm from "./DroneRegistrationForm";
import BreadCrumbs from "../BreadCrumbs";

export default function DroneRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);

  // Dummy drone data
  const [drones, setDrones] = useState([
    {
      id: 1,
      regDate: "04-01-2025",
      modelName: "Bhumi",
      type: "Agriculture",
      status: "Pending",
    },
    {
      id: 2,
      regDate: "24-04-2025",
      modelName: "Vajra",
      type: "Survey",
      status: "Approved",
    },
    {
      id: 3,
      regDate: "13-06-2025",
      modelName: "Agni",
      type: "Agriculture",
      status: "Rejected",
      remarks: "Battery issue detected",
    },
    {
      id: 4,
      regDate: "17-10-2025",
      modelName: "Agni",
      type: "Agriculture",
      status: "Approved",
    },
  ]);

  // Status icon helper
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle className="status-icon approved" />;
      case "Rejected":
        return <FaTimesCircle className="status-icon rejected" />;
      case "Pending":
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  // Handle card click (view only)
  const handleCardClick = (drone) => {
    setSelectedDrone(drone);
    setShowForm(true);
  };

  // Handle new drone form submission
  const handleFormSubmit = (formData) => {
    const newDrone = { ...formData, id: Date.now(), status: "Pending" };
    setDrones((prev) => [...prev, newDrone]);
    setShowForm(false);
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
            setSelectedDrone(null); // new registration
            setShowForm(true);
          }}
        >
          + Register Drone
        </button>
      </div>

      {/* Drone Cards */}
      <div className="drone-cards-grid">
        {drones.map((drone) => (
          <div
            key={drone.id}
            className="drone-card"
            onClick={() => handleCardClick(drone)}
          >
            <div className="drone-card-header">
              <h3>{drone.modelName}</h3>
              <span className={`status-badge ${drone.status.toLowerCase()}`}>
                {getStatusIcon(drone.status)} {drone.status}
              </span>
            </div>

            <div className="drone-card-body">
              <p>
                <FaCalendarAlt /> Reg. Date: <strong>{drone.regDate}</strong>
              </p>
              <p>
                <FaPaperPlane /> Type: <strong>{drone.type}</strong>
              </p>
              {drone.status === "Rejected" && (
                <p>
                  <strong>Remarks:</strong> {drone.remarks}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DroneRegistrationForm
              drone={selectedDrone}
              onClose={() => setShowForm(false)}
              onSubmit={selectedDrone ? undefined : handleFormSubmit} // only for new
              viewOnly={!!selectedDrone} // true for existing drone
            />
          </div>
        </div>
      )}
    </div>
  );
}
