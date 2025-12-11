import React, { useEffect, useState } from "react";
import "../../CSS/BDteam/droneApprove.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

export default function DroneApprove() {
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [bdDrone, setBdDrone] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [remarks, setRemarks] = useState("");

  // ---------------- FETCH ALL DRONES ----------------
  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const res = await fetch(`${config.baseURL}/drone_registration/`);
        const data = await res.json();

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

  // ---------------- FETCH BD DRONE ----------------
  const fetchBdDrone = async (droneSerial) => {
    try {
      const res = await fetch(
        `${config.baseURL}/drone_registration/?drone_serial_number=${droneSerial}`
      );
      const data = await res.json();
      setBdDrone(data[0] || null);
    } catch (err) {
      console.error("Error fetching BD Drone:", err);
      setBdDrone(null);
    }
  };

  // ---------------- OPEN MODAL ----------------
  const handleDroneClick = (drone) => {
    setSelectedDrone(drone);
    fetchBdDrone(drone.client[0].drone_serial_number);
    setShowApprovalModal(true);
  };

  // ---------------- APPROVE DRONE ----------------
  const handleApprove = async () => {
    if (!selectedDrone) return;

    try {
      const payload = { registered: true, status: "approved" };

      const res = await fetch(
        `${config.baseURL}/drone_registration/${selectedDrone.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Approve failed");

      setDrones(
        drones.map((d) =>
          d.id === selectedDrone.id
            ? { ...d, registered: true, status: "approved" }
            : d
        )
      );

      alert("Drone approved successfully!");
      setShowApprovalModal(false);
      setSelectedDrone(null);
    } catch (err) {
      console.error(err);
      alert("Error approving drone.");
    }
  };

  // ---------------- REJECT DRONE ----------------
  const handleReject = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks.");
      return;
    }

    try {
      const payload = {
        registered: false,
        status: "rejected",
        remarks,
      };

      const res = await fetch(
        `${config.baseURL}/drone_registration/${selectedDrone.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Reject failed");

      const updated = await res.json();

      setDrones(drones.map((d) => (d.id === updated.id ? updated : d)));

      alert("Drone rejected successfully!");
      setShowApprovalModal(false);
      setRemarks("");
      setSelectedDrone(null);
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

      {/* --------- DRONE LIST TABLE --------- */}
      <div className="drone-table-wrapper">
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

                    {/* truncate text */}
                    <td
                      title={drone.client[0].model_name}
                      className="truncate-text"
                    >
                      {drone.client[0].model_name}
                    </td>

                    <td>
                      <button
                        className="link-btn"
                        onClick={() => handleDroneClick(drone)}
                      >
                        {drone.client[0].drone_serial_number}
                      </button>
                    </td>

                    <td>{drone.model_name}</td>

                    <td>
                      <span
                        className={`bdapprove-status-badge ${
                          drone.status === "rejected"
                            ? "status-rejected"
                            : drone.registered
                            ? "status-approved"
                            : "status-pending"
                        }`}
                      >
                        {drone.status === "rejected"
                          ? "rejected"
                          : drone.registered
                          ? "approved"
                          : "pending"}
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
      </div>

      {/* --------- APPROVAL MODAL --------- */}
      {showApprovalModal && selectedDrone && (
        <div
          className="modal-overlay"
          onClick={() => setShowApprovalModal(false)}
        >
          <div className="approval-modal" onClick={(e) => e.stopPropagation()}>
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
                      <td className="field-label">{field.label}</td>

                      <td>
                        {field.key !== "attachment"
                          ? selectedDrone[field.key] || "-"
                          : selectedDrone.attachment ? (
                              <a
                                href={selectedDrone.attachment}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View Attachment
                              </a>
                            ) : (
                              "-"
                            )}
                      </td>

                      <td>
                        {field.key !== "attachment"
                          ? selectedDrone.client?.[0]?.[field.key] || "-"
                          : selectedDrone.client?.[0]?.attachment ? (
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

              {/* Remarks */}
              <div className="approval-actions">
  <textarea
    placeholder="Enter rejection remarks"
    value={
      selectedDrone.status === "rejected"
        ? selectedDrone.remarks || "No remarks added"
        : remarks
    }
    onChange={(e) =>
      selectedDrone.status === "rejected"
        ? null
        : setRemarks(e.target.value)
    }
    readOnly={selectedDrone.status === "rejected"}
  />
</div>


              {/* Buttons */}
             <div className="action-buttons">
  {selectedDrone.status === "approved" ? (
    <div className="approved-text">Approved</div>
  ) : selectedDrone.status === "rejected" ? (
    <div className="rejected-text">Rejected</div>
  ) : (
    <>
      <button className="approve-btn" onClick={handleApprove}>
        Approve
      </button>
      <button className="reject-btn" onClick={handleReject}>
        Reject
      </button>
    </>
  )}
</div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
