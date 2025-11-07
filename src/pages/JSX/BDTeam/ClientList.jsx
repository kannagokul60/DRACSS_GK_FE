import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaHome } from "react-icons/fa";
import "../../CSS/BDteam/clientList.css";
import phoneImg from "../../../assets/group.png";
import BreadCrumbs from "../BreadCrumbs";


export default function ClientList() {
  const navigate = useNavigate();

  const clients = [
    {
      id: 1,
      name: "Aero Vision Pvt Ltd",
      phone: "+91 9876543210",
      location: "Chennai, Tamil Nadu",
      address: "123 Skyview Park, Velachery, Chennai - 600042",
    },
    {
      id: 2,
      name: "DroneX Solutions",
      phone: "+91 9988776655",
      location: "Bangalore, Karnataka",
      address: "45 Tech Boulevard, Whitefield, Bangalore - 560066",
    },
    {
      id: 3,
      name: "FlyHigh Innovations",
      phone: "+91 9123456789",
      location: "Hyderabad, Telangana",
      address: "7 Cloud Tower, Banjara Hills, Hyderabad - 500034",
    },
  ];

  const handleViewDetails = (client) => {
    navigate(`/bd/client-drone-list/${client.id}`, { state: client });
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
            <h3 className="client-name">{c.name}</h3>

            <div className="client-info-line">
              <img src={phoneImg} alt="" srcset="" className="info-icon" />
              <span>{c.phone}</span>
            </div>

            <p>
              <FaMapMarkerAlt className="info-icon" /> {c.location}
            </p>

            <p>
              <FaHome className="info-icon" /> {c.address}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
