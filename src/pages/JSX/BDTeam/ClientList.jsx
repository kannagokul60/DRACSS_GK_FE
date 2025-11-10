import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaHome,
  FaInfoCircle,
  FaIdCard,
  FaBuilding,
  FaPaperPlane,
} from "react-icons/fa";
import "../../CSS/BDteam/clientList.css";
import phoneImg from "../../../assets/group.png";
import BreadCrumbs from "../BreadCrumbs";

export default function ClientList() {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDrone, setSelectedDrone] = useState(null);

  const clients = [
    {
      id: 1,
      name: "Aero Vision Pvt Ltd",
      phone: "+91 9876543210",
      location: "Chennai, Tamil Nadu",
      address: "123 Skyview Park, Velachery, Chennai - 600042",
      company: "AeroTech Pvt Ltd",
      idProof: "Aadhar - 2345 6789 1234",
      joinedDate: "12-03-2024",
      status: "Active",
      photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      drones: [
        {
          id: 1,
          name: "Bhumi-X1",
          date: "14-04-2024",
          type: "Agriculture",
          status: "Active",
        },
        {
          id: 2,
          name: "Vajra-V2",
          date: "10-05-2024",
          type: "Survey",
          status: "Active",
        },
        {
          id: 3,
          name: "Agni-Z3",
          date: "22-06-2024",
          type: "Inspection",
          status: "Inactive",
        },
        {
          id: 4,
          name: "Garuda-X5",
          date: "01-08-2024",
          type: "Delivery",
          status: "Active",
        },
      ],
    },
    {
      id: 2,
      name: "DroneX Solutions",
      phone: "+91 9988776655",
      location: "Bangalore, Karnataka",
      address: "45 Tech Boulevard, Whitefield, Bangalore - 560066",
      idProof: "GSTIN: 29AAECD7654L1Z2",
      company: "DroneX Solutions Pvt Ltd",
      joinedDate: "25 July 2024",
      status: "Inactive",
      photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      drones: [
        {
          id: 1,
          name: "Bhumi-X1",
          date: "14-04-2024",
          type: "Agriculture",
          status: "Active",
        },
        {
          id: 2,
          name: "Vajra-V2",
          date: "10-05-2024",
          type: "Survey",
          status: "Active",
        },
        {
          id: 3,
          name: "Agni-Z3",
          date: "22-06-2024",
          type: "Inspection",
          status: "Inactive",
        },
        {
          id: 4,
          name: "Garuda-X5",
          date: "01-08-2024",
          type: "Delivery",
          status: "Active",
        },
      ],
    },
    {
      id: 3,
      name: "FlyHigh Innovations",
      phone: "+91 9123456789",
      location: "Hyderabad, Telangana",
      address: "7 Cloud Tower, Banjara Hills, Hyderabad - 500034",
      idProof: "GSTIN: 36AAEFI9812K1Z3",
      company: "FlyHigh Innovations LLP",
      joinedDate: "15 January 2025",
      status: "Active",
      photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      drones: [
        {
          id: 1,
          name: "Bhumi-X1",
          date: "14-04-2024",
          type: "Agriculture",
          status: "Active",
        },
        {
          id: 2,
          name: "Vajra-V2",
          date: "10-05-2024",
          type: "Survey",
          status: "Active",
        },
        {
          id: 3,
          name: "Agni-Z3",
          date: "22-06-2024",
          type: "Inspection",
          status: "Inactive",
        },
        {
          id: 4,
          name: "Garuda-X5",
          date: "01-08-2024",
          type: "Delivery",
          status: "Active",
        },
      ],
    },
  ];

  const handleViewDetails = (client) => {
    navigate(`/bd/client-drone-list/${client.id}`, { state: client });
  };

  const handleInfoClick = (client, e) => {
    e.stopPropagation(); // prevent card click navigation
    setSelectedClient(client);
  };

  return (
    <div className="client-list-container">
      <div className="clientlist-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="client-list-title">Client Directory</h2>

      <div className="client-card-grid">
        {clients.map((c) => (
          <div
            key={c.id}
            className="client-card"
            onClick={() => handleViewDetails(c)}
          >
            {/* Status Badge */}
            <span className={`status-badge ${c.status?.toLowerCase()}`}>
              {c.status}
            </span>

            <h3 className="client-name">{c.name}</h3>

            <div className="client-info-line">
              <img src={phoneImg} alt="" className="info-icon" />
              <span>{c.phone}</span>
            </div>

            <p>
              <FaMapMarkerAlt className="info-icon" /> {c.location}
            </p>
            <p>
              <FaHome className="info-icon" /> {c.address}
            </p>

            <FaInfoCircle
              className="info-popup-icon"
              title="View Client Details"
              onClick={(e) => handleInfoClick(c, e)}
            />
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedClient && (
        <div className="popup-overlay" onClick={() => setSelectedClient(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Client Details</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedClient(null)}
              >
                ✖
              </button>
            </div>

            <div className="popup-image-wrapper">
              <img
                src={selectedClient.photo}
                alt={selectedClient.name}
                className="popup-profile-img"
              />
            </div>

            <div className="popup-body">
              <p>
                <strong>
                   Name:
                </strong>{" "}
                {selectedClient.name}
              </p>
              <p>
                <strong>
                   Phone:
                </strong>{" "}
                {selectedClient.phone}
              </p>
              <p>
                <strong>
                   Location:
                </strong>{" "}
                {selectedClient.location}
              </p>
              <p>
                <strong>
                   Address:
                </strong>{" "}
                {selectedClient.address}
              </p>
              <p>
                <strong>
                  Company:
                </strong>{" "}
                {selectedClient.company}
              </p>
              <p>
                <strong>ID Proof:</strong> {selectedClient.idProof}
              </p>
              <p>
                <strong>Joined On:</strong> {selectedClient.joinedDate}
              </p>
              {/* <div className="drone-purchase-section">
                <p className="drone-purchase-header">
                  <strong>
                     Drones Purchased:
                  </strong>{" "}
                  {selectedClient.drones.length}
                </p>

                <select
                  className="drone-select"
                  onChange={(e) =>
                    setSelectedDrone(
                      selectedClient.drones.find(
                        (d) => d.id === Number(e.target.value)
                      )
                    )
                  }
                >
                  <option value="">-- Select Drone --</option>
                  {selectedClient.drones.map((drone) => (
                    <option key={drone.id} value={drone.id}>
                      {drone.name} ({drone.date})
                    </option>
                  ))}
                </select>

                {selectedDrone && (
                  <div className="drone-details">
                    <p>
                      <strong>Drone Name:</strong> {selectedDrone.name}
                    </p>
                    <p>
                      <strong>Purchase Date:</strong> {selectedDrone.date}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedDrone.type}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedDrone.status}
                    </p>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
