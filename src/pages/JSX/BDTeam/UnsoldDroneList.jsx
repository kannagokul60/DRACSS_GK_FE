import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/BDTeam/unsoldDroneList.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

export default function UnsoldDroneList() {
  const navigate = useNavigate();

  // ---------------- STATES ----------------
  const [unsoldDrones, setUnsoldDrones] = useState([]);

  // DETAILS POPUP STATE
  const [detailsDrone, setDetailsDrone] = useState(null);
  const [detailsPopupOpen, setDetailsPopupOpen] = useState(false);

  // MOVE TO SOLD POPUP STATE
  const [moveDrone, setMoveDrone] = useState(null);
  const [movePopupOpen, setMovePopupOpen] = useState(false);

  // FORM DATA FOR MOVE TO SOLD
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    purchaseDate: "",
    warranty: "",
    partsReplaced: "",
    supportHistory: "",
    serialNumber: "",
    uinNumber: "",
  });

  // ---------------- FETCH UNSOLD DRONES ----------------
  useEffect(() => {
    fetchUnsoldDrones();
  }, []);

  const fetchUnsoldDrones = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/drone_registration/");
      const data = await res.json();

      const unsold = data.filter((d) => d.registered === false);

      const mapped = unsold.map((d) => ({
        id: d.id,
        name: d.model_name,
        model: d.model_name,
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
      console.log("Error loading unsold drones:", error);
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

  // ---------------- MOVE TO SOLD POPUP ----------------
  const handleMoveToSoldClick = (drone) => {
    setMoveDrone(drone);
    setMovePopupOpen(true);

    setFormData({
      name: drone.name || "",
      location: "",
      address: "",
      purchaseDate: drone.purchaseDate || "",
      warranty: drone.warranty || "",
      partsReplaced: "",
      supportHistory: "",
      serialNumber: drone.serialNumber,
      uinNumber: drone.uinNumber,
    });
  };

  const closeMovePopup = () => {
    setMovePopupOpen(false);
    setMoveDrone(null);
  };

  const handleSaveAndMove = () => {
    if (!moveDrone) return;

    navigate("/bd/sold-drones", {
      state: {
        soldDrone: {
          ...formData,
          id: moveDrone.id,
        },
      },
    });

    closeMovePopup();
  };

  return (
    <div className="unsold-drone-container">
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="unsold-drone-heading">Unsold Drones Inventory</h2>

      {unsoldDrones.length === 0 ? (
        <p className="unsold-no-drones">No unsold drones available.</p>
      ) : (
        <div className="unsold-drone-grid">
          {unsoldDrones.map((drone) => (
            <div className="unsold-drone-card" key={drone.id}>
              {/* DATE - CLICK FOR DETAILS */}
              <span
                className="unsold-drone-date"
                onClick={() => handleOpenDetails(drone)}
              >
                {drone.date}
              </span>

              <h3 className="unsold-drone-name">{drone.name}</h3>

              <div className="unsold-drone-scroll">
                <div className="section-title">General Info</div>
                <div className="unsold-drone-info">
                  <p><strong>Type:</strong> {drone.droneType}</p>
                  <p><strong>Manufacturer:</strong> {drone.manufacturer}</p>
                  <p><strong>Serial No:</strong> {drone.serialNumber}</p>
                  <p><strong>UIN:</strong> {drone.uinNumber}</p>
                </div>

                <div className="section-title">Parts</div>
                <div className="unsold-drone-info">
                  <p><strong>Flight Controller:</strong> {drone.flightController}</p>
                  <p><strong>Remote Controller:</strong> {drone.remoteController}</p>
                </div>
              </div>

              <button
                className="unsold-move-btn"
                onClick={(e) => {
                  e.stopPropagation(); // stop opening details popup
                  handleMoveToSoldClick(drone);
                }}
              >
                Move to Sold
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- DETAILS POPUP ---------------- */}
   {detailsPopupOpen && detailsDrone && (
  <div className="drone-details-overlay" onClick={closeDetailsPopup}>
    <div className="drone-details-popup" onClick={(e) => e.stopPropagation()}>
      <h2>Drone Details</h2>

      <p><strong>Battery Charger:</strong> {detailsDrone.batteryCharger}</p>
      <p><strong>Battery 1:</strong> {detailsDrone.battery1}</p>
      <p><strong>Battery 2:</strong> {detailsDrone.battery2}</p>
      <p><strong>Purchase Date:</strong> {detailsDrone.purchaseDate}</p>
      <p><strong>Warranty:</strong> {detailsDrone.warranty}</p>

      {detailsDrone.attachment && (
        <p>
          <strong>Attachment:</strong>{" "}
          <a href={detailsDrone.attachment} target="_blank" rel="noopener noreferrer">
            {detailsDrone.attachment.split("/").pop()}
          </a>
        </p>
      )}

      <button className="drone-details-close-btn" onClick={closeDetailsPopup}>
        Close
      </button>
    </div>
  </div>
)}


      {/* ---------------- MOVE TO SOLD POPUP ---------------- */}
      {movePopupOpen && moveDrone && (
        <div className="unsold-popup-overlay">
          <div className="unsold-popup">
            <h3>Enter Client Details</h3>

            <div className="popup-body">
              <label>
                Location:
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Enter location"
                />
              </label>

              <label>
                Address:
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter address"
                />
              </label>

              <label>
                Purchase Date:
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                />
              </label>

              <label>
                Warranty:
                <input
                  type="text"
                  value={formData.warranty}
                  onChange={(e) =>
                    setFormData({ ...formData, warranty: e.target.value })
                  }
                  placeholder="Enter warranty"
                />
              </label>

              <label>
                Parts Replaced:
                <input
                  type="text"
                  value={formData.partsReplaced}
                  onChange={(e) =>
                    setFormData({ ...formData, partsReplaced: e.target.value })
                  }
                  placeholder="Enter parts replaced"
                />
              </label>

              <label>
                Support History:
                <input
                  type="text"
                  value={formData.supportHistory}
                  onChange={(e) =>
                    setFormData({ ...formData, supportHistory: e.target.value })
                  }
                  placeholder="Enter support history"
                />
              </label>
            </div>

            <div className="popup-actions">
              <button className="popup-save-btn" onClick={handleSaveAndMove}>
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
