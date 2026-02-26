import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../CSS/BDTeam/unsoldDroneList.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

export default function UnsoldDroneList() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedModel = location.state?.droneName || null; // get model from state

  // ---------------- STATES ----------------
  const [unsoldDrones, setUnsoldDrones] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [detailsDrone, setDetailsDrone] = useState(null);
  const [detailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [moveDrone, setMoveDrone] = useState(null);
  const [movePopupOpen, setMovePopupOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    serialNumber: "",
    uinNumber: "",
  });

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchUnsoldDrones();
    fetchClients();
  }, []);

  const fetchUnsoldDrones = async () => {
    try {
      const res = await fetch(`${config.baseURL}/drone_registration/`);
      const data = await res.json();

      const unsold = data.filter(
        (d) =>
          d.registered === false &&
          (!selectedModel || d.model_name === selectedModel),
      );

      const mapped = unsold.map((d) => ({
        id: d.id,
        name: d.model_name,
        date: new Date(d.created_at).toLocaleDateString("en-GB"),
        droneType: d.drone_type ?? "",
        manufacturer: d.manufacturer ?? "",
        serialNumber: d.drone_serial_number ?? "",
        uinNumber: d.uin_number ?? "",
        flightController: d.flight_controller_serial_number ?? "",
        remoteController: d.remote_controller ?? "",
        batteryCharger: d.battery_charger_serial_number ?? "",
        battery1: d.battery_serial_number_1 ?? "",
        battery2: d.battery_serial_number_2 ?? "",
        attachment: d.attachment || "",
        purchaseDate: d.created_at?.split("T")[0] || "",
        warranty: d.is_active ? "Active" : "Expired",
        location: "N/A",
        status: "Unsold",
      }));

      setUnsoldDrones(mapped);
    } catch (error) {
      console.error("Error loading unsold drones:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch(`${config.baseURL}/clients/`);
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  // ---------------- DETAILS POPUP ----------------
  const handleOpenDetails = (drone) => {
    setDetailsDrone(drone);
    setDetailsPopupOpen(true);
  };
  const closeDetailsPopup = () => {
    setDetailsPopupOpen(false);
    setDetailsDrone(null);
  };

  // ---------------- MOVE TO SOLD ----------------
  const handleMoveToSoldClick = (drone) => {
    setMoveDrone(drone);
    setMovePopupOpen(true);
    setSelectedClientId("");
    setFormData({
      name: "",
      phone: "",
      email: "",
      location: "",
      serialNumber: drone.serialNumber,
      uinNumber: drone.uinNumber,
    });
  };
  const closeMovePopup = () => {
    setMovePopupOpen(false);
    setMoveDrone(null);
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);

    if (!clientId) {
      setFormData((prev) => ({
        ...prev,
        name: "",
        phone: "",
        email: "",
        location: "",
      }));
      return;
    }

    const client = clients.find((c) => c.client_id === clientId);
    if (!client) return;

    setFormData((prev) => ({
      ...prev,
      name: client.name || "",
      phone: client.phone || "",
      email: client.email || "",
      location: client.location || "",
    }));
  };

  const handleSaveAndMove = async () => {
    if (!moveDrone) return;

    const selectedClient = clients.find(
      (c) => c.client_id === selectedClientId,
    );
    if (!selectedClient) {
      alert("Please select a valid client.");
      return;
    }

    try {
      const updatedDrones = Array.from(
        new Set([...(selectedClient.drones || []), formData.serialNumber]),
      );

      // Update client
      await fetch(`${config.baseURL}/clients/${selectedClient.client_id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drones: updatedDrones }),
      });

      // Update drone to sold
      await fetch(`${config.baseURL}/drone_registration/${moveDrone.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registered: true,
          client_id: selectedClient.client_id,
        }),
      });

      // Remove from list
      setUnsoldDrones((prev) =>
        prev.filter((d) => d.serialNumber !== moveDrone.serialNumber),
      );

      closeMovePopup();

      navigate("/bd/sold-drones"); // optionaul, sold drones page
    } catch (error) {
      console.error("Error saving drone to client:", error);
      alert("Failed to save drone. Check console for details.");
    }
  };

  return (
    <div className="unsold-drone-container">
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="unsold-drone-heading">
        Unsold Drones Inventory {selectedModel ? `- ${selectedModel}` : ""}
      </h2>

      {/* TABLE VIEW */}
      {unsoldDrones.length === 0 ? (
        <div className="no-data-message">
          No unsold drones found for {selectedModel || "this model"}.
        </div>
      ) : (
        <div className="unsold-table-wrapper">
          <table className="unsold-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Serial Number</th>
                <th>UIN Number</th>
                <th>View</th>
                <th>Move to Sold</th>
              </tr>
            </thead>

            <tbody>
              {unsoldDrones.map((drone, index) => (
                <tr key={drone.id}>
                  <td>{index + 1}</td>
                  <td>{drone.date}</td>

                  <td>{drone.serialNumber}</td>

                  <td>{drone.uinNumber}</td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleOpenDetails(drone)}
                    >
                      View
                    </button>
                  </td>

                  <td>
                    <button
                      className="move-btn"
                      onClick={() => handleMoveToSoldClick(drone)}
                    >
                      Move to Sold
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAILS POPUP */}
      {detailsPopupOpen && detailsDrone && (
        <div className="drone-details-overlay" onClick={closeDetailsPopup}>
      <div
  className="drone-details-popup"
  onClick={(e) => e.stopPropagation()}
>
  {/* TOP RIGHT CLOSE BUTTON */}
  <button
    className="drone-details-close-icon"
    onClick={closeDetailsPopup}
  >
    ✕
  </button>

  <h2>Drone Details</h2>

  <p>
    <strong>Battery Charger:</strong> {detailsDrone.batteryCharger}
  </p>

  <p>
    <strong>Battery 1:</strong> {detailsDrone.battery1}
  </p>

  <p>
    <strong>Battery 2:</strong> {detailsDrone.battery2}
  </p>

  {detailsDrone.attachment && (
    <p>
      <strong>Attachment:</strong>{" "}
      <a
        href={detailsDrone.attachment}
        target="_blank"
        rel="noopener noreferrer"
      >
        {detailsDrone.attachment.split("/").pop()}
      </a>
    </p>
  )}
</div>

        </div>
      )}

      {/* MOVE TO SOLD POPUP */}
      {movePopupOpen && moveDrone && (
        <div className="unsold-popup-overlay">
          <div className="unsold-popup">
            <h3>Enter Client Details</h3>

            <div className="popup-body">
              <label>
                Drone Serial Number:
                <input type="text" value={formData.serialNumber} readOnly />
              </label>

              <label>
                Select Client:
                <select value={selectedClientId} onChange={handleClientChange}>
                  <option value="">-- Select Client --</option>
                  {clients.map((c) => (
                    <option key={c.client_id} value={c.client_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Phone:
                <input type="text" value={formData.phone} readOnly />
              </label>

              <label>
                Email:
                <input type="text" value={formData.email} readOnly />
              </label>

              <label>
                Location:
                <input type="text" value={formData.location} readOnly />
              </label>
            </div>

            <div className="popup-actions">
              <button
                className="popup-save-btn"
                onClick={handleSaveAndMove}
                disabled={!selectedClientId}
              >
                Save & Move
              </button>
              <button className="popup-cancel-btn" onClick={closeMovePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
