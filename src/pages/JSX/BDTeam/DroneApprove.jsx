import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/BDteam/droneApprove.css";
import BreadCrumbs from "../BreadCrumbs";


export default function DroneApprove() {
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [showRemarksPopup, setShowRemarksPopup] = useState(false);
  const [showAttachmentsPopup, setShowAttachmentsPopup] = useState(false);
  const [attachments, setAttachments] = useState([]);

  //Fetch registered drones (dummy for now)
  useEffect(() => {
    // Dummy data with attachments
    const dummyDrones = [
      {
        id: 1,
        register_date: "2025-11-10",
        name: "AeroX Falcon",
        model_name: "Falcon X1",
        drone_type: "Quadcopter",
        manufacturer: "AeroX Systems",
        uin_number: "UIN-98765",
        drone_serial_number: "DRN-AXF-1122",
        attachments: [
          { name: "UIN_Certificate.pdf", url: "#" },
          { name: "Drone_Photo.jpg", url: "#" },
        ],
      },
      {
        id: 2,
        register_date: "2025-11-11",
        name: "SkyLink Eagle",
        model_name: "Eagle Pro 2",
        drone_type: "Hexacopter",
        manufacturer: "SkyLink Technologies",
        uin_number: "UIN-45678",
        drone_serial_number: "DRN-SLK-9876",
        attachments: [
          { name: "Purchase_Bill.pdf", url: "#" },
          { name: "Drone_Serial_Image.png", url: "#" },
          { name: "UIN_Cert.pdf", url: "#" },
        ],
      },
    ];
    setDrones(dummyDrones);
  }, []);

  const handleApprove = async (id) => {
    alert(`Drone ID ${id} approved (dummy flow).`);
    setDrones(drones.filter((d) => d.id !== id));
  };

  const handleReject = (drone) => {
    setSelectedDrone(drone);
    setShowRemarksPopup(true);
  };

  const submitRejection = () => {
    if (!remarks.trim()) {
      alert("Please enter remarks for rejection.");
      return;
    }
    alert(`Drone ${selectedDrone.model_name} rejected for: ${remarks}`);
    setShowRemarksPopup(false);
    setRemarks("");
    setDrones(drones.filter((d) => d.id !== selectedDrone.id));
  };

  const handleViewAttachments = (files) => {
    setAttachments(files);
    setShowAttachmentsPopup(true);
  };

  return (
    <div className="drone-approve-page">
      <div className="drone-approve-breadcrumb-wrapper">
              <BreadCrumbs />
            </div>
      <h2 className="drone-approve-header">Drone Approval Dashboard</h2>

      <div className="drone-table">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Register On</th>
              <th>Name</th>
              <th>Model Name</th>
              <th>Drone Type</th>
              <th>Manufacturer</th>
              <th>UIN Number</th>
              <th>Serial No</th>
              <th>Attachments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drones.length > 0 ? (
              drones.map((drone, index) => (
                <tr key={drone.id}>
                  <td>{index + 1}</td>
                  <td>{drone.register_date}</td>
                  <td>{drone.name}</td>
                  <td>{drone.model_name}</td>
                  <td>{drone.drone_type}</td>
                  <td>{drone.manufacturer}</td>
                  <td>{drone.uin_number}</td>
                  <td>{drone.drone_serial_number}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleViewAttachments(drone.attachments)}
                    >
                      View Attachments
                    </button>
                  </td>
                  <td>
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(drone.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(drone)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No pending drones found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Remarks Popup */}
      {showRemarksPopup && (
        <div className="remarks-popup">
          <div className="popup-content">
            <h3>Reject Drone</h3>
            <p>
              Reason for rejecting <strong>{selectedDrone?.model_name}</strong>:
            </p>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter rejection remarks"
            ></textarea>
            <div className="popup-actions">
              <button className="submit-btn" onClick={submitRejection}>
                Submit
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowRemarksPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachments Popup */}
   {showAttachmentsPopup && (
  <div className="assign-popup-overlay">
    <div className="assign-popup">
           <button
          className="close-btn"
          onClick={() => setShowAttachmentsPopup(false)}
        >
          ✕
        </button>
      <div className="popup-header">
        <h3>Drone Related Attachments</h3>
     
      </div>

      {attachments.length > 0 ? (
        <ul>
          {attachments.map((file, idx) => (
            <li key={idx}>
            {" "}
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No attachments available</p>
      )}
    </div>
  </div>
)}

    </div>
  );
}
