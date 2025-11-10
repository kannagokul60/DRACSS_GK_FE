import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumbs from "../BreadCrumbs";
import { FaInfoCircle } from "react-icons/fa";

import "../../CSS/BDteam/bdDroneProfile.css";

export default function BDDroneProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const drone = location.state?.drone;

  const [selectedClient, setSelectedClient] = useState(null);
    const handleClientClick = (client) => {
    setSelectedClient(client);
  };

  if (!drone) {
    return (
      <div className="bd-drone-container">
        <p>Drone data not available. Please return to the main list.</p>
        <button
          className="back-btn"
          onClick={() => navigate("/bd-drone-details")}
        >
          ← Back
        </button>
      </div>
    );
  }

  // Example clients — can be fetched from backend later
  const clients = [
    {
      name: "SkyView Technologies Pvt Ltd",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      location: "Bangalore, Karnataka",
      address: "45, MG Road, Bangalore, Karnataka, India",
      purchaseDate: "10 June 2024",
      warranty: "1 Year (till June 2025)",
      partsReplaced: "Propeller Set, Flight Controller",
      supportHistory: "2 on-site maintenance visits in 2024",
      serialNumber: "DRN-AEROX1-20240610-001",
      uinNumber: "UIN-IND-4567X1",
    },
    {
      name: "AeroWorks Solutions",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
      location: "Pune, Maharashtra",
      address: "23 Tech Park, Hinjewadi Phase II, Pune, India",
      purchaseDate: "22 March 2023",
      warranty: "Expired (was 1 year)",
      partsReplaced: "Battery Module (once)",
      supportHistory: "3 software updates & calibration done",
      serialNumber: "DRN-AEROX1-20240610-001",
      uinNumber: "UIN-IND-4567X1",
    },
    {
      name: "AeroWorks Solutions",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
      location: "Pune, Maharashtra",
      address: "23 Tech Park, Hinjewadi Phase II, Pune, India",
      purchaseDate: "22 March 2023",
      warranty: "Expired (was 1 year)",
      partsReplaced: "Battery Module (once)",
      supportHistory: "3 software updates & calibration done",
      serialNumber: "DRN-AEROX1-20240610-001",
      uinNumber: "UIN-IND-4567X1",
    },
    {
      name: "AeroWorks Solutions",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
      location: "Pune, Maharashtra",
      address: "23 Tech Park, Hinjewadi Phase II, Pune, India",
      purchaseDate: "22 March 2023",
      warranty: "Expired (was 1 year)",
      partsReplaced: "Battery Module (once)",
      supportHistory: "3 software updates & calibration done",
      serialNumber: "DRN-AEROX1-20240610-001",
      uinNumber: "UIN-IND-4567X1",
    },
    {
      name: "AeroWorks Solutions",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
      location: "Pune, Maharashtra",
      address: "23 Tech Park, Hinjewadi Phase II, Pune, India",
      purchaseDate: "22 March 2023",
      warranty: "Expired (was 1 year)",
      partsReplaced: "Battery Module (once)",
      supportHistory: "3 software updates & calibration done",
      serialNumber: "DRN-AEROX1-20240610-001",
      uinNumber: "UIN-IND-4567X1",
    },
    {
      name: "AeroWorks Solutions",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
      location: "Pune, Maharashtra",
      address: "23 Tech Park, Hinjewadi Phase II, Pune, India",
      purchaseDate: "22 March 2023",
      warranty: "Expired (was 1 year)",
      partsReplaced: "Battery Module (once)",
      supportHistory: "3 software updates & calibration done",
      serialNumber: "DRN-AEROX1-20240610-001",
      uinNumber: "UIN-IND-4567X1",
    },
    {
      name: "FarmLink Drones",
      logo: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
      location: "Coimbatore, Tamil Nadu",
      address: "12, Green Valley, Coimbatore, Tamil Nadu, India",
      purchaseDate: "18 November 2024",
      warranty: "2 Years (till November 2026)",
      partsReplaced: "No replacements yet",
      supportHistory: "Regular online support and firmware upgrades",
      serialNumber: "DRN-AEROX1-20240610-001",
      uinNumber: "UIN-IND-4567X1",
    },
  ];

  return (
    <div className="bd-drone-container">
      <div className="bd-drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="client-list-title">{drone.name} - Purchased By</h2>

      {/* ======= CLIENT GRID ======= */}
      <div className="client-grid">
        {clients.map((client, index) => (
          <div key={index} className="client-card">
            <img src={client.logo} alt={client.name} className="client-logo" />
            <h4 className="client-name">{client.name}</h4>
            <p className="client-location">{client.location}</p>
            <p className="client-serial">
              <strong>Serial:</strong> {client.serialNumber}
            </p>
            <p className="client-uin">
              <strong>UIN:</strong> {client.uinNumber}
            </p>

            <FaInfoCircle
              className="bd-info-icon"
              title="View More Details"
              onClick={() => handleClientClick(client)}
            />
          </div>
        ))}
      </div>

      {/* ======= POPUP ======= */}
      {selectedClient && (
        <div className="client-popup-overlay">
          <div className="client-popup">
            <div className="popup-header">
              <h3>{selectedClient.name} - Full Details</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedClient(null)}
              >
                ✖
              </button>
            </div>

            <div className="popup-body">
              <img
                src={selectedClient.logo}
                alt={selectedClient.name}
                className="popup-logo"
              />
              <p>
                <strong>Location:</strong> {selectedClient.location}
              </p>
              <p>
                <strong>Address:</strong> {selectedClient.address}
              </p>
              <p>
                <strong>Purchase Date:</strong> {selectedClient.purchaseDate}
              </p>
              <p>
                <strong>Warranty:</strong> {selectedClient.warranty}
              </p>
              <p>
                <strong>Parts Replaced:</strong> {selectedClient.partsReplaced}
              </p>
              <p>
                <strong>Support History:</strong>{" "}
                {selectedClient.supportHistory}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
