import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import drone1 from "../../../assets/drone_image.png";
import BreadCrumbs from "../BreadCrumbs";
import "../../CSS/BDteam/clientDroneList.css";

export default function ClientDroneList() {
  const location = useLocation();
  const client = location.state;

  const [showPopup, setShowPopup] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [formData, setFormData] = useState({
    serial: "",
    model: "",
    flightController: "",
    battery: "",
    firmware: "",
    remarks: "",
  });

  // Dummy drones data
  const drones = [
    {
      id: 1,
      name: "Phantom 4 Pro",
      count: 2,
      image: "https://www.bhphotovideo.com/images/fb/dji_cp_pt_00000244_01_phantom_4_pro_version_1406921.jpg",
      units: [
        {
          serial: "P4P-001",
          model: "Phantom 4 Pro",
          flightController: "DJI N3",
          battery: "5000 mAh",
          firmware: "v1.2.3",
          remarks: "No issues",
        },
        {
          serial: "P4P-002",
          model: "Phantom 4 Pro",
          flightController: "DJI N3",
          battery: "4900 mAh",
          firmware: "v1.2.3",
          remarks: "Minor scratches",
        },
      ],
    },
    {
      id: 2,
      name: "DJI Mavic 3",
      count: 3,
      image: "https://cdn.shopify.com/s/files/1/1398/4647/files/DJI-Mavic-3-featured4-1300x750_1.jpg?v=1637060796",
      units: [
        {
          serial: "M3-001",
          model: "Mavic 3",
          flightController: "DJI C2",
          battery: "4500 mAh",
          firmware: "v2.0.1",
          remarks: "Newly purchased",
        },
        {
          serial: "M3-002",
          model: "Mavic 3",
          flightController: "DJI C2",
          battery: "4400 mAh",
          firmware: "v2.0.1",
          remarks: "Minor damage on prop",
        },
        {
          serial: "M3-003",
          model: "Mavic 3",
          flightController: "DJI C2",
          battery: "4300 mAh",
          firmware: "v2.0.1",
          remarks: "Battery replacement required",
        },
      ],
    },
    {
      id: 3,
      name: "Autel EVO II",
      count: 1,
      image: "https://cdn.mos.cms.futurecdn.net/okaQysb5mN2Ck6uGiEKuhC.jpg",
      units: [
        {
          serial: "EVO-001",
          model: "EVO II",
          flightController: "Autel AC",
          battery: "6000 mAh",
          firmware: "v3.1.0",
          remarks: "Good condition",
        },
      ],
    },
  ];

  const handleCardClick = (drone, unitIndex = 0) => {
    setSelectedDrone(drone);
    setSelectedUnit(unitIndex);
    setFormData({ ...drone.units[unitIndex] });
    setShowPopup(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved Data:", formData);
    setShowPopup(false);
  };

  return (
    <div className="client-drone-container">
      <div className="client-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <div className="client-drone-header">
        <h2>{client?.name} - Purchased Drones </h2>
      </div>

      {/* Drone List */}
      <div className="drone-list">
        {drones.map((d) => (
          <div className="drone-card">
            {/* Quantity Badge on top-right */}
            <div
              className="drone-qty-badge"
              onClick={() => handleCardClick(d, 0)} // open popup for first unit
            >
              {d.count} Units
            </div>

            <img src={d.image} alt={d.name} className="drone-image" />
            <div className="drone-info">
              <h3>{d.name}</h3>
            </div>

            {/* View Details Button */}
            <button
              className="view-details-btn"
              onClick={() => handleCardClick(d, 0)} // same as badge
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Popup Form */}
      {showPopup && selectedDrone && (
        <div className="popup-overlay">
          <div className="client-popup-content">
            <div className="popup-header">
              <h3>{selectedDrone.name}</h3>

              {selectedDrone.units.length > 1 && (
                <div className="unit-dropdown-wrapper">
                  <select
                    value={selectedUnit}
                    onChange={(e) => {
                      const index = Number(e.target.value);
                      setSelectedUnit(index);
                      setFormData({ ...selectedDrone.units[index] });
                    }}
                    className="unit-dropdown-popup"
                  >
                    {selectedDrone.units.map((_, idx) => (
                      <option key={idx} value={idx}>
                        Unit {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* <button className="close-btn" onClick={() => setShowPopup(false)}>
                ✕
              </button> */}
            </div>

            <form className="popup-body" onSubmit={handleSubmit}>
              <label>Serial Number</label>
              <input
                type="text"
                name="serial"
                value={formData.serial}
                onChange={handleInputChange}
                required
              />

              <label>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
              />

              <label>Flight Controller</label>
              <input
                type="text"
                name="flightController"
                value={formData.flightController}
                onChange={handleInputChange}
                required
              />

              <label>Battery</label>
              <input
                type="text"
                name="battery"
                value={formData.battery}
                onChange={handleInputChange}
              />

              <label>Firmware Version</label>
              <input
                type="text"
                name="firmware"
                value={formData.firmware}
                onChange={handleInputChange}
              />

              <label>Remarks</label>
              <textarea
                rows="3"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
              ></textarea>

              <div style={{ marginTop: "15px", textAlign: "right" }}>
                <button type="submit" className="view-details-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
