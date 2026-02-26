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
import config from "../../../config";

export default function DroneRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH DRONES ----------------
  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const res = await fetch(`${config.baseURL}/drone_registration/`);
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

  // ---------------- STATUS HELPER ----------------
  const getStatusFromActive = (isActive) => {
    if (isActive === true) return "approved";
    if (isActive === false) return "rejected";
    return "pending";
  };

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

  // ---------------- HANDLE CARD CLICK ----------------
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

      {/* Drone Cards */}
      {loading ? (
        <p>Loading drones...</p>
      ) : drones.filter((d) => d.client && d.client.length > 0).length === 0 ? (
        <p>No drones registered yet.</p>
      ) : (
        <div className="drone-cards-wrapper">
          <div className="drone-cards-grid">
            {drones
              .filter((d) => d.client && d.client.length > 0)
              .map((drone) => {
                const clientList = drone.client;
                const latestClient = clientList[clientList.length - 1]; // Use last entry

                const status = getStatusFromActive(drone.is_active);

                return (
                  <div
                    key={drone.id}
                    className="drone-register-card"
                    onClick={() => handleCardClick(drone)}
                  >
                    <div className="drone-card-header">
                      <h3>{latestClient.model_name || drone.model_name}</h3>
                      <span className={`status-badge ${status}`}>
                        {getStatusIcon(status)}{" "}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    <div className="drone-card-body">
                      <p>
                        <FaCalendarAlt /> Registered On:{" "}
                        <strong>
                          {latestClient.updated_at
                            ? new Date(
                                latestClient.updated_at,
                              ).toLocaleDateString()
                            : new Date(drone.updated_at).toLocaleDateString()}
                        </strong>
                      </p>

                      <p>
                        <FaPaperPlane /> Drone Serial:{" "}
                        <strong>{latestClient.c_drone_serial_number}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Drone Registration / View Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DroneRegistrationForm
              drone={selectedDrone} // full drone object
              client={
                selectedDrone?.client?.length > 0
                  ? selectedDrone.client[selectedDrone.client.length - 1]
                  : null
              }
              onClose={() => setShowForm(false)}
              onSubmit={
                selectedDrone
                  ? null
                  : (newDrone) => setDrones((prev) => [...prev, newDrone])
              }
              viewOnly={!!selectedDrone}
            />
          </div>
        </div>
      )}
    </div>
  );
}
