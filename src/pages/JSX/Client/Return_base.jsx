import React, { useState,useEffect } from "react";
import { FaPlus, FaTools } from "react-icons/fa";
import "../../CSS/Client/returnBase.css";
import BreadCrumbs from "../BreadCrumbs";
import returnImg from "../../../assets/returnBase_icon.png";

export default function ReturnToBase() {
  const [showForm, setShowForm] = useState(false);
  const [showShippingPopup, setShowShippingPopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [returnEnabled, setReturnEnabled] = useState(false);

  useEffect(() => {
    setReturnEnabled(localStorage.getItem("enableReturnService") === "true");
  }, []);
  const [requests, setRequests] = useState([
    {
      date: "22-05-2025",
      model: "Bhumi A10E",
      serial: "00340049 30325118 33383839",
      reportedBy: "Beautus",
      status: "Pending",
      description: "Pump not working",
    },
    {
      date: "22-05-2025",
      model: "Bhumi A10E",
      serial: "00340049 30325118 33383840",
      reportedBy: "Beautus",
      status: "In Progress",
      description: "Motor vibration detected",
    },
  ]);

  const [formData, setFormData] = useState({
    model: "",
    serial: "",
    date: "",
    reportedBy: "",
    description: "",
  });

  const [shippingData, setShippingData] = useState({
    details: "",
    trackingId: "",
    photo: null,
    remarks: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setRequests([...requests, { ...formData, status: "Pending" }]);
    setFormData({
      model: "",
      serial: "",
      date: "",
      reportedBy: "",
      description: "",
    });
    setShowForm(false);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const updatedRequests = requests.map((req) =>
      req.serial === selectedRequest.serial
        ? { ...req, status: "Shipped", shipping: shippingData }
        : req,
    );
    setRequests(updatedRequests);
    setShippingData({ details: "", trackingId: "", photo: null, remarks: "" });
    setShowShippingPopup(false);
  };

  const updateStatus = (serial, newStatus) => {
    const updated = requests.map((req) =>
      req.serial === serial ? { ...req, status: newStatus } : req,
    );
    setRequests(updated);
  };

  const openShippingPopup = (req) => {
    setSelectedRequest(req);
    setShowShippingPopup(true);
  };

  return (
    <div className="returnbase-container">
      <div className="return-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>
      {/* Header */}
      <div className="returnbase-header">
        <h2>Return to Base Service Requests</h2>

          <div className="add-btn-wrapper">
        <button
          className="add-btn"
          onClick={() => setShowForm(true)}
          disabled={!returnEnabled}
        >
          <FaPlus /> New Request
        </button>
        
          {!returnEnabled && (
            <span className="tooltip-text">
              Return to base request enabled after BD team approval
            </span>
          )}
        </div>
        
      </div>

      {/* Cards Section */}
      <div className="returnbase-cards">
        {requests.length === 0 ? (
          <p className="returnbase-no-data">No Return Requests Yet</p>
        ) : (
          requests.map((req, index) => (
            <div className="returnbase-card" key={index}>
              <div className="returnbase-card-header">
                <div className="returnbase-card-title">
                  <img
                    src={returnImg}
                    alt="Drone"
                    className="returnbase-card-icon"
                  />
                  <h3>{req.model}</h3>
                </div>

                <span
                  className={`returnbase-status-badge ${req.status.toLowerCase()}`}
                >
                  {req.status}
                </span>
              </div>

              <div className="returnbase-card-body">
                <p>
                  <strong>Date:</strong> {req.date}
                </p>
                <p>
                  <strong>Serial No:</strong> {req.serial}
                </p>
                <p>
                  <strong>Reported By:</strong> {req.reportedBy}
                </p>
              </div>

              <div className="returnbase-description">
                <strong>Issue:</strong> {req.description}
              </div>

              {/* 🔹 Client Actions */}
              <div className="returnbase-actions">
                {req.status === "Pending" && (
                  <button
                    className="returnbase-action-btn ship"
                    onClick={() => openShippingPopup(req)}
                  >
                    Ship Product
                  </button>
                )}

                {req.status === "Shipped" && (
                  <span className="returnbase-info-text">
                    📦 Product shipped — awaiting service center confirmation
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Request Popup */}
      {showForm && (
        <div className="returnbase-popup-overlay">
          <div className="returnbase-popup">
            <div className="returnbase-popup-header">
              <h3>Return to Base Service Request</h3>
              <button
                className="returnbase-close-btn"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="returnbase-form-scroll">
              <label>UAS Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                required
              />

              <label>Serial Number</label>
              <input
                type="text"
                value={formData.serial}
                onChange={(e) =>
                  setFormData({ ...formData, serial: e.target.value })
                }
                required
              />

              <label>Date of Occurrence</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />

              <label>Reported By</label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) =>
                  setFormData({ ...formData, reportedBy: e.target.value })
                }
                required
              />

              <label>Description of Issue</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              ></textarea>

              <div className="returnbase-popup-actions">
                <button type="submit" className="returnbase-submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="returnbase-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shipping Details Popup */}
      {showShippingPopup && (
        <div className="returnbase-popup-overlay">
          <div className="returnbase-popup">
            <div className="returnbase-popup-header">
              <h3>Shipping Details</h3>
              <button
                className="returnbase-close-btn"
                onClick={() => setShowShippingPopup(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleShippingSubmit}>
              <label>Shipping Details</label>
              <textarea
                rows="3"
                value={shippingData.details}
                onChange={(e) =>
                  setShippingData({ ...shippingData, details: e.target.value })
                }
                required
              ></textarea>

              <label>Tracking ID</label>
              <input
                type="text"
                value={shippingData.trackingId}
                onChange={(e) =>
                  setShippingData({
                    ...shippingData,
                    trackingId: e.target.value,
                  })
                }
                required
              />

              <label>Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setShippingData({
                    ...shippingData,
                    photo: e.target.files[0],
                  })
                }
                required
              />

              <label>Remarks</label>
              <textarea
                rows="3"
                value={shippingData.remarks}
                onChange={(e) =>
                  setShippingData({ ...shippingData, remarks: e.target.value })
                }
              ></textarea>

              <div className="returnbase-popup-actions">
                <button type="submit" className="returnbase-submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="returnbase-cancel-btn"
                  onClick={() => setShowShippingPopup(false)}
                >
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
