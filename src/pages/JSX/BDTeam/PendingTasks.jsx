import React, { useState } from "react";
import "../../CSS/BDteam/pendingTasks.css";
import BreadCrumbs from "../BreadCrumbs";

export default function PendingTasks({ role = "manager" }) {
  const [tasks, setTasks] = useState([
    {
      id: 101,
      requestType: "Drone Repair (Client A)",
      mode: "Onsite",
      requestedDate: "15-11-2025",
      managerStatus: "Not Sent",
      taskStatus: "Draft",
    },
    {
      id: 102,
      requestType: "Battery Maintehnance (Client B)",
      mode: "Online",
      requestedDate: "12-11-2025",
      managerStatus: "Sent for Approval",
      taskStatus: "Awaiting Manager Review",
    },
    {
      id: 103,
      requestType: "Firmware Update (Client C)",
      mode: "RTB",
      requestedDate: "05-11-2025",
      managerStatus: "Approved",
      taskStatus: "Completed",
    },
  ]);

  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignedPerson, setAssignedPerson] = useState("");
  const [remarks, setRemarks] = useState("");

  // Mock list of technical persons
  const technicalPersons = [
    "Ravi Kumar (Online)",
    "Anita Sharma (Online)",
    "Suresh Singh (Online)",
    "Priya Nair (Online)",
  ];

  // ===== BD Team Action =====
  const handleShareToManager = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              managerStatus: "Sent for Approval",
              taskStatus: "Awaiting Manager Review",
            }
          : t
      )
    );
  };

  // ===== Manager Actions =====
  const handleApprove = (taskId) => {
    setSelectedTask(taskId);
    setShowAssignPopup(true);
  };

  const handleReject = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              managerStatus: "Rejected",
              taskStatus: "Returned to BD Team",
            }
          : t
      )
    );
  };

  const handleAssignSubmit = () => {
    if (!assignedPerson) {
      alert("Please select a technical person before submitting.");
      return;
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask
          ? {
              ...t,
              managerStatus: "Approved",
              taskStatus: "Assigned to Technician",
              assignedPerson,
              remarks,
            }
          : t
      )
    );

    setShowAssignPopup(false);
    setAssignedPerson("");
    setRemarks("");
    setSelectedTask(null);
  };

  return (
    <div className="bd-pending-wrap">
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>
      <h2 className="bd-pending-header">
        Pending Tasks – {role === "manager" ? "Manager" : "BD Team"}
      </h2>

      <div className="table-container">
        <table className="bd-pending-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Request Type</th>
              <th>Mode</th>
              <th>Requested Date</th>
              <th>Manager Status</th>
              <th>Task Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.requestType}</td>
                <td>{t.mode}</td>
                <td>{t.requestedDate}</td>

                <td>
                  <span
                    className={`status-badge ${
                      t.managerStatus === "Approved"
                        ? "approved"
                        : t.managerStatus === "Sent for Approval"
                        ? "pending"
                        : t.managerStatus === "Rejected"
                        ? "rejected"
                        : "awaiting"
                    }`}
                  >
                    {t.managerStatus}
                  </span>
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      t.taskStatus === "Completed"
                        ? "completed"
                        : t.taskStatus === "Awaiting Manager Review"
                        ? "inprogress"
                        : "awaiting"
                    }`}
                  >
                    {t.taskStatus}
                  </span>
                </td>

                <td>
                  {role === "bd" ? (
                    t.managerStatus === "Not Sent" ? (
                      <button
                        className="share-btn"
                        onClick={() => handleShareToManager(t.id)}
                      >
                        Share to Manager
                      </button>
                    ) : (
                      <button className="view-btn">View Details</button>
                    )
                  ) : role === "manager" ? (
                    t.managerStatus === "Sent for Approval" ? (
                      <div className="manager-actions">
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(t.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleReject(t.id)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button className="view-btn">View Details</button>
                    )
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====== ASSIGN POPUP ====== */}
      {showAssignPopup && (
        <div className="assign-popup-overlay">
          <div className="assign-popup">
            <h3>Assign Technical Person</h3>

            <label>Select Technician:</label>
            <select
              value={assignedPerson}
              onChange={(e) => setAssignedPerson(e.target.value)}
            >
              <option value="">-- Select Technician --</option>
              {technicalPersons.map((person, index) => (
                <option key={index} value={person}>
                  {person}
                </option>
              ))}
            </select>

            <label>Remarks:</label>
            <textarea
              placeholder="Enter any remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>

            <div className="popup-actions">
              <button className="submit-btn" onClick={handleAssignSubmit}>
                Assign
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowAssignPopup(false)}
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
