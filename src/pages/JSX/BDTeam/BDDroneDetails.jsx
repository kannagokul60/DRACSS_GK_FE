import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumbs from "../BreadCrumbs";
import { FaPlus } from "react-icons/fa";
import "../../CSS/BDTeam/bdDroneDetails.css";

export default function BDDroneDetails() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const drones = [
    {
      id: 1,
      name: "AeroScout X1",
      image:
        "https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/HbMAAOSwHxJkbRf7/$_32.JPG?set_id=880000500F",
    },
    {
      id: 2,
      name: "AgriFlyer V2",
      image:
        "https://image.mono.ipros.com/public/product/image/2073529/IPROS2626387104845531324.png",
    },
    {
      id: 3,
      name: "SkyGuard Pro",
      image:
        "https://flytechaviation.aero/wp-content/uploads/2025/09/drone-1-1.jpg",
    },
  ];

  const handleViewDetails = (drone) => {
    navigate(`/bd/drone-details/${drone.id}`, { state: { drone } });
  };

  return (
    <div className="bd-drone-container">
      <div className="bd-drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="bd-drone-heading">Company Drone Fleet</h2>

      <div className="bd-drone-grid">
        {drones.map((drone) => (
          <div key={drone.id} className="bd-drone-card">
            {/* --- NEW: + BUTTON INSIDE EACH CARD --- */}
            <button
              className="bd-add-card-btn"
              onClick={() => setShowPopup(true)}
            >
              <FaPlus size={14} />
            </button>

            <div className="bd-drone-image-wrapper">
              <img
                src={drone.image}
                alt={drone.name}
                className="bd-drone-image"
              />
            </div>

            <div className="bd-drone-info">
              <h3 className="bd-drone-name">{drone.name}</h3>

              <div className="bd-drone-info-row">
                <button
                  className="info-sold-btn"
                  onClick={() => handleViewDetails(drone)}
                >
                  Sold : 10
                </button>

                <button className="info-unsold-btn">Unsold : 5</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="bd-popup-overlay">
          <div className="bd-popup">
            <h3>Add New Drone</h3>

            <div className="bd-popup-fields">
              <label>Drone Name</label>
              <input type="text" placeholder="Enter Drone Name" />

              <label>Serial Number</label>
              <input type="text" placeholder="Enter Serial Number" />

              <label>Manufacturer</label>
              <input type="text" placeholder="Enter Manufacturer" />

              <label>Purchase Date</label>
              <input type="date" />

              <label>Upload Image</label>
              <input type="file" />
            </div>

            <div className="bd-popup-actions">
              <button className="bd-save-btn">Save</button>
              <button
                className="bd-cancel-btn"
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
