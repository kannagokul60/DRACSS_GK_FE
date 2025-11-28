import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/BDTeam/unsoldDroneList.css";
import BreadCrumbs from "../BreadCrumbs";

export default function UnsoldDroneList() {
  const navigate = useNavigate();

  const initialUnsold = [
 {
      id: 1,
      name: "Bhumi V10.1.0",
      date: "23-Nov-25",
      serialNumber: "DRN-002",
      uinNumber: "UIN-002",
      model: "V2 Standard",
      purchaseDate: "15 Mar 2023",
      warranty: "Expired",
      location: "Pune",
      status: "Unsold",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
      partsReplaced: "Battery Module (once)",
      supportHistory: "3 software updates & calibration done",
      address: "23 Tech Park, Hinjewadi Phase II, Pune, India",
    },
    {
      id: 2,
      name: "Bhumi V10.1.0",
      date: "18-Nov-25",
      serialNumber: "DRN-002",
      uinNumber: "UIN-002",
      model: "V2 Standard",
      purchaseDate: "15 Mar 2023",
      warranty: "Expired",
      location: "Pune",
      status: "Unsold",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
      partsReplaced: "Battery Module (once)",
      supportHistory: "3 software updates & calibration done",
      address: "23 Tech Park, Hinjewadi Phase II, Pune, India",
    },
       {
      id: 3,
      name: "Bhumi V10.1.0",
      date: "05-Nov-25",
      serialNumber: "DRN-002",
      uinNumber: "UIN-002",
      model: "V2 Standard",
      purchaseDate: "15 Mar 2023",
      warranty: "Expired",
      location: "Pune",
      status: "Unsold",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
      partsReplaced: "Battery Module (once)",
      supportHistory: "3 software updates & calibration done",
      address: "23 Tech Park, Hinjewadi Phase II, Pune, India",
    },
  ];

  const [unsoldDrones, setUnsoldDrones] = useState(initialUnsold);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleMoveToSoldClick = (drone) => {
    setSelectedDrone(drone);
    setShowPopup(true);
  };

const handleSaveAndMove = () => {
  navigate("/bd/sold-drones", { state: { addedDrone: formData } });
  setShowPopup(false);
};


  const [formData, setFormData] = useState({
  name: "",
  location: "",
  address: "",
  purchaseDate: "",
  warranty: "",
  partsReplaced: "",
  supportHistory: "",
});


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
              <span className="unsold-drone-date">{drone.date}</span>

              <div className="unsold-drone-info">
                <h3 className="unsold-drone-name">{drone.name}</h3>
                <p>
                  <strong>Model:</strong> {drone.model}
                </p>
                <p>
                  <strong>Serial Number:</strong> {drone.serialNumber}
                </p>
                <p>
                  <strong>UIN:</strong> {drone.uinNumber}
                </p>
                <p>
                  <strong>Purchase Date:</strong> {drone.purchaseDate}
                </p>
                <p>
                  <strong>Warranty:</strong> {drone.warranty}
                </p>
                <p>
                  <strong>Location:</strong> {drone.location}
                </p>

                <button
                  className="unsold-move-btn"
                  onClick={() => handleMoveToSoldClick(drone)}
                >
                  Move to Sold
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- POPUP ---------------- */}
    {showPopup && (
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
        <button
          className="popup-cancel-btn"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
