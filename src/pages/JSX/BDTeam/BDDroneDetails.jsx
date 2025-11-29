import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumbs from "../BreadCrumbs";
import { FaPlus } from "react-icons/fa";
import "../../CSS/BDTeam/bdDroneDetails.css";
import config from "../../../config";
import Bhumi from "../../../assets/bhumi.png";
import Bhima from "../../../assets/bhima.png";
import Vajra from "../../../assets/Vajra.png";
import VajraS from "../../../assets/Vajra-s.png";
import VyomaM from "../../../assets/Vyoma-m.webp";
import VyomaS from "../../../assets/Vyoma-s.webp";

export default function BDDroneDetails() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);

  const [form, setForm] = useState({
    model_name: "",
    uin_number: "",
    drone_serial_number: "",
    flight_controller_serial_number: "",
    remote_controller: "",
    battery_charger_serial_number: "",
    battery_serial_number_1: "",
    battery_serial_number_2: "",
    attachment: null,
  });
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, attachment: e.target.files[0] });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      for (const key in form) {
        if (form[key]) formData.append(key, form[key]);
      }

      // If backend expects "registered"
      formData.append("registered", false);

      const res = await fetch(`${config.baseURL}/drone_registration/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (!res.ok) {
        alert("Failed to save: " + JSON.stringify(data));
        return;
      }

      alert("Drone Registered Successfully!");
      setShowPopup(false);
    } catch (error) {
      console.log("Error:", error);
      alert("Error while saving");
    }
  };

  const drones = [
    {
      id: 1,
      name: "BHUMI A10E",
      image: Bhumi,
    },
    {
      id: 2,
      name: "BHIMA - M",
      image: Bhima,
    },
    {
      id: 3,
      name: "VAJRA-M",
      image: Vajra,
    },
    {
      id: 4,
      name: "VAJRA-S",
      image: VajraS,
    },
    {
      id: 5,
      name: "VYOMA-M",
      image: VyomaM,
    },
    {
      id: 5,
      name: "VYOMA-S",
      image: VyomaS,
    },
  ];

  // // Example clients — can be fetched from backend later
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

  const handleViewDetails = (drone) => {
    navigate(`/bd/drone-details/${drone.id}`, { state: { drone } });
  };

  const [unsoldCount, setUnsoldCount] = useState(0);

  useEffect(() => {
    fetchUnsoldCount();
  }, []);

  const fetchUnsoldCount = async () => {
    const res = await fetch(`${config.baseURL}/drone_registration/`);
    const data = await res.json();

    const unsold = data.filter((d) => d.registered === false);
    setUnsoldCount(unsold.length);
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
              onClick={() => {
                setSelectedDrone(drone);
                setForm((prev) => ({ ...prev, model_name: drone.name })); // auto fill model
                setShowPopup(true);
              }}
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
                  onClick={() =>
                    navigate(`/bd/drone-details/${drone.id}`, {
                      state: { drone, clients },
                    })
                  }
                >
                  Sold : {clients.length}
                </button>

                <button
                  className="info-unsold-btn"
                  onClick={() => navigate("/bd/unsold-drones")}
                >
                  Unsold : {unsoldCount}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="bd-popup-overlay">
          <div className="bd-popup">
            <h3>Add New Drone – {selectedDrone?.name}</h3>

            <div className="bd-popup-fields">
              <label>Drone Model</label>
              <input
                type="text"
                name="model_name"
                value={form.model_name}
                readOnly
              />

              <label>Drone Serial Number</label>
              <input
                type="text"
                name="drone_serial_number"
                placeholder="Enter Drone Serial Number"
                onChange={handleInputChange}
              />

              <label>UIN Number</label>
              <input
                type="text"
                name="uin_number"
                placeholder="Enter UIN Number"
                onChange={handleInputChange}
              />

              <label>Flight Controller Serial Number</label>
              <input
                type="text"
                name="flight_controller_serial_number"
                placeholder="Enter Flight Controller Serial Number"
                onChange={handleInputChange}
              />

              <label>Remote Controller Serial Number</label>
              <input
                type="text"
                name="remote_controller"
                placeholder="Enter Remote Controller Serial Number"
                onChange={handleInputChange}
              />

              <label>Battery Charger Serial Number</label>
              <input
                type="text"
                name="battery_charger_serial_number"
                placeholder="Enter Battery Charger Serial Number"
                onChange={handleInputChange}
              />

              <label>Battery Serial Number 1</label>
              <input
                type="text"
                name="battery_serial_number_1"
                placeholder="Enter Battery Serial Number 1"
                onChange={handleInputChange}
              />

              <label>Battery Serial Number 2</label>
              <input
                type="text"
                name="battery_serial_number_2"
                placeholder="Enter Battery Serial Number 2"
                onChange={handleInputChange}
              />

              <label>Attachments</label>
              <input
                type="file"
                name="attachment"
                onChange={handleFileChange}
              />
            </div>

            <div className="bd-popup-actions">
              <button className="bd-save-btn" onClick={handleSave}>
                Save
              </button>

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
