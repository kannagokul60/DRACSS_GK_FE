import React, { useEffect, useState } from "react";
import "../../CSS/BDteam/droneApprove.css";
import BreadCrumbs from "../BreadCrumbs";

export default function DroneApprove() {
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [bdDrone, setBdDrone] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [remarks, setRemarks] = useState("");

  // Fetch all drones (from backend)
  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/drone_registration/"
        );
        const data = await res.json();
        // Only keep drones which have client info
        const clientDrones = data.filter(
          (d) => d.client && d.client.length > 0
        );
        setDrones(clientDrones);
      } catch (err) {
        console.error("Error fetching drones:", err);
      }
    };
    fetchDrones();
  }, []);

  // Fetch BD Team Drone info by drone serial
  const fetchBdDrone = async (droneSerial) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/drone_registration/?drone_serial_number=${droneSerial}`
      );
      const data = await res.json();
      setBdDrone(data[0] || null);
    } catch (err) {
      console.error("Error fetching BD Drone:", err);
      setBdDrone(null);
    }
  };

  // Open modal and fetch BD Drone
  const handleDroneClick = (drone) => {
    setSelectedDrone(drone);
    fetchBdDrone(drone.client[0].drone_serial_number);
    setShowApprovalModal(true);
  };

  const handleApprove = async () => {
    // Call backend API to approve drone
    try {
      // Example PATCH request to mark approved
      await fetch(
        `http://127.0.0.1:8000/api/drone_registration/${selectedDrone.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "approved" }),
        }
      );
      alert("Drone approved successfully!");
      setShowApprovalModal(false);
      setDrones(drones.filter((d) => d.id !== selectedDrone.id));
    } catch (err) {
      console.error(err);
      alert("Error approving drone.");
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks for rejection.");
      return;
    }
    try {
      // Example PATCH request to mark rejected with remarks
      await fetch(
        `http://127.0.0.1:8000/api/drone_registration/${selectedDrone.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "rejected", remarks }),
        }
      );
      alert("Drone rejected successfully!");
      setShowApprovalModal(false);
      setRemarks("");
      setDrones(drones.filter((d) => d.id !== selectedDrone.id));
    } catch (err) {
      console.error(err);
      alert("Error rejecting drone.");
    }
  };

  return (
    <div className="drone-approve-page">
      <div className="drone-approve-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>
      <h2 className="drone-approve-header">Client Drone Request Approval</h2>

      {/* Drone List Table */}
      <div className="drone-table">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Client Name</th>
              <th>Drone Serial</th>
              <th>Model Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {drones.length > 0 ? (
              drones.map((drone, index) => (
                <tr key={drone.id}>
                  <td>{index + 1}</td>

                  {/* Client Name */}
                  <td>{drone.client[0].model_name}</td>

                  {/* Drone Serial (Clickable) */}
                  <td>
                    <button
                      className="link-btn"
                      onClick={() => handleDroneClick(drone)}
                    >
                      {drone.client[0].drone_serial_number}
                    </button>
                  </td>

                  {/* Model Name */}
                  <td>{drone.model_name}</td>

                  <td>
                    <span
                      className={`bdapprove-status-badge ${
                        drone.status
                          ? `status-${drone.status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                          : "status-pending"
                      }`}
                    >
                      {drone.status ? drone.status.toLowerCase() : "pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No client drones pending approval</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedDrone && (
        <div
          className="modal-overlay"
          onClick={() => setShowApprovalModal(false)}
        >
          <div className="approval-modal" onClick={(e) => e.stopPropagation()}>
            {/* CLOSE BUTTON (TOP RIGHT) */}
            <button
              className="close-btn"
              onClick={() => setShowApprovalModal(false)}
            >
              ×
            </button>

            <h3>
              Drone Approval - {selectedDrone.client[0].drone_serial_number}
            </h3>

            <div className="approval-table-wrapper">
              <table className="approval-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>BD Drone Info</th>
                    <th>Client Drone Info</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { label: "Model Name", key: "model_name" },
                    { label: "Drone Type", key: "drone_type" },
                    { label: "Manufacturer", key: "manufacturer" },
                    { label: "UIN Number", key: "uin_number" },
                    { label: "Drone Serial", key: "drone_serial_number" },
                    {
                      label: "Flight Controller Serial",
                      key: "flight_controller_serial_number",
                    },
                    { label: "Remote Controller", key: "remote_controller" },
                    {
                      label: "Battery Charger Serial",
                      key: "battery_charger_serial_number",
                    },
                    {
                      label: "Battery 1 Serial",
                      key: "battery_serial_number_1",
                    },
                    {
                      label: "Battery 2 Serial",
                      key: "battery_serial_number_2",
                    },
                    { label: "Attachments", key: "attachment" },
                  ].map((field) => (
                    <tr key={field.key}>
                      {/* FIELD NAME */}
                      <td className="field-label">{field.label}</td>

                      {/* BD DRONE INFO FIRST */}
                      <td>
                        {bdDrone ? (
                          field.key !== "attachment" ? (
                            bdDrone[field.key] || "-"
                          ) : bdDrone.attachment ? (
                            <a
                              href={bdDrone.attachment}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View Attachment
                            </a>
                          ) : (
                            "-"
                          )
                        ) : (
                          "Loading..."
                        )}
                      </td>

                      {/* CLIENT DRONE INFO SECOND */}
                      <td>
                        {field.key !== "attachment" ? (
                          selectedDrone.client[0][field.key] || "-"
                        ) : selectedDrone.client[0].attachment ? (
                          <a
                            href={selectedDrone.client[0].attachment}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Attachment
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ACTION SECTION */}
              <div className="approval-actions">
                <textarea
                  placeholder="Enter rejection remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              <div className="action-buttons">
                <button className="approve-btn" onClick={handleApprove}>
                  Approve
                </button>
                <button className="reject-btn" onClick={handleReject}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
