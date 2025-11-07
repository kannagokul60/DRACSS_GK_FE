import React, { useState } from "react";
import { FaPlus, FaCalendarAlt, FaTools, FaUser } from "react-icons/fa";
import "../../CSS/OnSiteSupport.css";
import BreadCrumbs from "../BreadCrumbs";

export default function OnSiteSupport() {
  const [showForm, setShowForm] = useState(false);
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
      serial: "00340049 30325118 33383839",
      reportedBy: "Beautus",
      status: "inprogress",
      description: "Pump not working",
    },
     {
      date: "22-05-2025",
      model: "Bhumi A10E",
      serial: "00340049 30325118 33383839",
      reportedBy: "Beautus",
      status: "completed",
      description: "Pump not working",
    },
  ]);

  const [formData, setFormData] = useState({
    model: "",
    serial: "",
    date: "",
    reportedBy: "",
    description: "",
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

  return (
    <div className="onsite-container">
       <div className="onsite-breadcrumb-wrapper">
                <BreadCrumbs />
              </div>
      {/* Header */}
      <div className="onsite-header">
        <h2>On-Site Support Requests</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> New Request
        </button>
      </div>

      {/* Cards Section */}
      <div className="onsite-cards">
        {requests.length === 0 ? (
          <p className="no-data">No On-Site Requests Yet</p>
        ) : (
          requests.map((req, index) => (
            <div className="onsite-card" key={index}>
              <div className="onsite-card-header">
                <div className="onsite-card-title">
                  <FaTools className="onsite-card-icon" />
                  <h3>{req.model}</h3>
                </div>
                <span className={`status-badge ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </div>

              <div className="onsite-card-body">
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

              <div className="onsite-description">
                <strong>Issue:</strong> {req.description}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="onsite-popup-overlay">
          <div className="onsite-popup">
            <div className="onsite-popup-header">
              <h3>On-Site Support Request</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="onsite-form-scroll">
              <label>UAS Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                required
              />

              <label>Flight Controller</label>
              <input
                type="text"
                value={formData.flightController || ""}
                onChange={(e) =>
                  setFormData({ ...formData, flightController: e.target.value })
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

              <label>Total Accumulated Hours</label>
              <input
                type="text"
                value={formData.totalHours || ""}
                onChange={(e) =>
                  setFormData({ ...formData, totalHours: e.target.value })
                }
                required
              />

              <label>Description of Difficulty</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              ></textarea>

              <label>Affected Subsystem/Component</label>
              <input
                type="text"
                value={formData.subsystem || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subsystem: e.target.value })
                }
                required
              />

              <label>Symptoms Observed</label>
              <input
                type="text"
                value={formData.symptoms || ""}
                onChange={(e) =>
                  setFormData({ ...formData, symptoms: e.target.value })
                }
                required
              />

              <label>Environmental Conditions</label>
              <input
                type="text"
                value={formData.environment || ""}
                onChange={(e) =>
                  setFormData({ ...formData, environment: e.target.value })
                }
                required
              />

              <label>Operator Actions Taken</label>
              <input
                type="text"
                value={formData.actions || ""}
                onChange={(e) =>
                  setFormData({ ...formData, actions: e.target.value })
                }
                required
              />

              <label>Immediate Consequence (Flight Outcome)</label>
              <input
                type="text"
                value={formData.consequence || ""}
                onChange={(e) =>
                  setFormData({ ...formData, consequence: e.target.value })
                }
                required
              />

              <label>Corrective Actions Taken</label>
              <input
                type="text"
                value={formData.correctiveActions || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    correctiveActions: e.target.value,
                  })
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

              <label>Reported Date</label>
              <input
                type="date"
                value={formData.reportedDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, reportedDate: e.target.value })
                }
                required
              />

              <label>Address</label>
              <textarea
                rows="3"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              ></textarea>

              <label>Remarks</label>
              <textarea
                rows="3"
                value={formData.remarks || ""}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
              ></textarea>

              <div className="onsite-popup-actions">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
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
