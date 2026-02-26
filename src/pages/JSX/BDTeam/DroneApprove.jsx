import React, { useEffect, useState } from "react";
import "../../CSS/BDteam/droneApprove.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

export default function DroneApprove() {
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${config.baseURL}/clients/`);
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    fetchClients();
  }, []);

  // ---------------- FETCH ALL DRONES ----------------
  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const res = await fetch(`${config.baseURL}/drone_registration/`);
        const data = await res.json();

        const clientDrones = data
          .filter((d) => d.client && d.client.length > 0)
          .map((d) => {
            const serial = d.client?.[0]?.c_drone_serial_number;

            // find client using serial
            const matchedClient = clients.find((c) =>
              c.drones?.includes(serial),
            );

            return {
              ...d,
              clientName: matchedClient?.name || "Unknown",
              status:
                d.status ??
                (d.is_active === true
                  ? "approved"
                  : d.is_active === false
                    ? "rejected"
                    : null),
              remarks: d.remarks ?? "",
            };
          });

        setDrones(clientDrones);
      } catch (err) {
        console.error("Error fetching drones:", err);
      }
    };

    if (clients.length > 0) {
      fetchDrones();
    }
  }, [clients]);

  // ---------------- OPEN MODAL ----------------
  const handleDroneClick = (drone) => {
    setSelectedDrone({
      ...drone,
    });
    setRemarks(""); // reset remarks for new modal
    setShowApprovalModal(true);
  };

  // ---------------- APPROVE DRONE ----------------
  const handleApprove = async () => {
    if (!selectedDrone) return;

    try {
      const payload = { is_active: true, status: "approved" };

      const res = await fetch(
        `${config.baseURL}/drone_registration/${selectedDrone.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Approve failed");

      const updated = await res.json();

      setDrones(
        drones.map((d) =>
          d.id === updated.id
            ? { ...d, is_active: true, status: "approved" }
            : d,
        ),
      );

      setSelectedDrone((prev) => ({
        ...prev,
        is_active: true,
        status: "approved",
      }));

      setShowApprovalModal(false);
      alert("Drone approved successfully!");
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
        is_active: false,
        status: "rejected",
        remarks,
      };

      const res = await fetch(
        `${config.baseURL}/drone_registration/${selectedDrone.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Reject failed");

      const updated = await res.json();

      setDrones(
        drones.map((d) =>
          d.id === updated.id
            ? { ...d, is_active: false, status: "rejected", remarks }
            : d,
        ),
      );

      setSelectedDrone((prev) => ({
        ...prev,
        is_active: false,
        status: "rejected",
        remarks,
      }));

      setShowApprovalModal(false);
      setRemarks("");
      alert("Drone rejected successfully!");
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
                    <td>{drone.clientName}</td>

                    <td>
                      <button
                        className="link-btn"
                        onClick={() => handleDroneClick(drone)}
                      >
                        {drone.client[0].c_drone_serial_number}
                      </button>
                    </td>
                    <td>{drone.model_name}</td>
                    <td>
                      <span
                        className={`bdapprove-status-badge ${
                          drone.status === "rejected"
                            ? "status-rejected"
                            : drone.status === "approved"
                              ? "status-approved"
                              : "status-pending"
                        }`}
                      >
                        {drone.status ?? "pending"}
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
              className="approve-close-btn"
              onClick={() => setShowApprovalModal(false)}
            >
              ×
            </button>

            <h3>
              Drone Approval - {selectedDrone.client[0].c_drone_serial_number}
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
                    {
                      label: "Model Name",
                      bd: "model_name",
                      client: "c_model_name",
                    },
                    {
                      label: "Drone Type",
                      bd: "drone_type",
                      client: "c_drone_type",
                    },
                    { label: "Manufacturer", bd: "manufacturer", client: "-" },
                    {
                      label: "UIN Number",
                      bd: "uin_number",
                      client: "c_uin_number",
                    },
                    {
                      label: "Drone Serial",
                      bd: "drone_serial_number",
                      client: "c_drone_serial_number",
                    },
                    {
                      label: "Flight Controller Serial",
                      bd: "flight_controller_serial_number",
                      client: "c_flight_controller_serial_number",
                    },
                    {
                      label: "Remote Controller",
                      bd: "remote_controller",
                      client: "c_remote_controller",
                    },
                    {
                      label: "Battery Charger Serial",
                      bd: "battery_charger_serial_number",
                      client: "c_battery_charger_serial_number",
                    },
                    {
                      label: "Battery 1 Serial",
                      bd: "battery_serial_number_1",
                      client: "c_battery_serial_number_1",
                    },
                    {
                      label: "Battery 2 Serial",
                      bd: "battery_serial_number_2",
                      client: "c_battery_serial_number_2",
                    },
                    {
                      label: "Attachments",
                      bd: "attachment",
                      client: "c_attachment",
                    },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="field-label">{row.label}</td>

                      {/* BD Drone */}
                      <td>
                        {row.bd !== "attachment" ? (
                          selectedDrone[row.bd] || "-"
                        ) : selectedDrone.attachment ? (
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

                      {/* Client Drone */}
                      <td>
                        {row.client !== "c_attachment" ? (
                          selectedDrone.client?.[0]?.[row.client] || "-"
                        ) : selectedDrone.client?.[0]?.c_attachment ? (
                          <a
                            href={selectedDrone.client[0].c_attachment}
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
                      ? selectedDrone.remarks
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

              {/* Action Buttons */}
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
