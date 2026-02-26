import React, { useEffect, useState } from "react";
import "../../CSS/Technical/assignedDroneList.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";


const BASE_URL = `${config.baseURL}/onsite-support`;

const getOnsiteRequests = async (page = 1) => {
  try {
    const employee_id = localStorage.getItem("employee_id");
    const client_type = localStorage.getItem("client_type");

    const response = await axios.get(
      `${BASE_URL}/?page=${page}&employee_id=${employee_id}&client_type=${client_type}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export default function OnSiteSupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


const formatStatus = (status) => {
  if (!status) return "-";

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1).toLowerCase()
  );
};
useEffect(() => {
  const fetchTechnicalRequests = async () => {
    setLoading(true);
    try {
      const data = await getOnsiteRequests(1);
      const items = Array.isArray(data)
        ? data
        : data.results || [];

      // ✅ Show only tickets assigned to tech
      const techTickets = items.filter(
        (ticket) =>
          ticket.status === "ASSIGNED_TO_TECH" ||
          ticket.status === "COMPLETED"
      );

      // ✅ Convert status for UI
      const updatedTickets = techTickets.map((ticket) => {
        if (ticket.status === "ASSIGNED_TO_TECH") {
          return { ...ticket, display_status: "PENDING" };
        }

        if (ticket.status === "COMPLETED") {
          return { ...ticket, display_status: "COMPLETED" };
        }

        return ticket;
      });

      setTickets(updatedTickets);
    } catch (err) {
      console.error("Failed to load technical tickets", err);
    } finally {
      setLoading(false);
    }
  };

  fetchTechnicalRequests();
}, []);
  return (
    <div className="assigned-page">
      <h2 className="assigned-header">On-Site Requests</h2>

      <div className="assigned-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Order ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Status</th>
              <th>RCA</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 && !loading && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Assigned Requests
                </td>
              </tr>
            )}

            {tickets.map((ticket, i) => (
              <tr key={ticket.id}>
                <td>{i + 1}</td>

                <td
                  className="clickable-td"
                  style={{
                    color: "#2875ce",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  onClick={() => setSelectedRequest(ticket)}
                >
                  {ticket.ticket_number || "-"}
                </td>

                <td>{ticket.reported_by || "-"}</td>

                <td>
                  {ticket.assigned_date
                    ? format(
                        new Date(ticket.assigned_date + "T00:00:00"),
                        "dd-MM-yyyy",
                      )
                    : "-"}
                </td>

<td>
  <span
    className={`tech-status-badge ${
      ticket.display_status
        ? `tech-status-${ticket.display_status
            .toLowerCase()
            .replace(/[\s_]+/g, "-")}`
        : "tech-status-default"
    }`}
  >
    {formatStatus(ticket.display_status)}
  </span>
</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate("/technical/rca-report", {
                      state: {
                        ticketId: ticket.id,

                      }
                      })
                    }
                  >
                    RCA Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="onsite-popup-overlay">
          <div className="onsite-popup">
            <div className="onsite-popup-header">
              <h3>On-Site Request Details</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedRequest(null)}
              >
                ✕
              </button>
            </div>

            <div className="onsite-form-scroll">
              <label>UAS Model</label>
              <input value={selectedRequest.model || ""} disabled />

              <label>Flight Controller</label>
              <input value={selectedRequest.flight_controller || ""} disabled />

              <label>Serial Number</label>
              <input value={selectedRequest.serial || ""} disabled />

              <label>Date of Occurrence</label>
              <input value={selectedRequest.date_of_occurance || ""} disabled />

              <label>Total Accumulated Hours</label>
              <input value={selectedRequest.total_hours || ""} disabled />

              <label>Description of Difficulty</label>
              <textarea value={selectedRequest.description || ""} disabled />

              <label>Affected Subsystem</label>
              <input value={selectedRequest.subsystem || ""} disabled />

              <label>Symptoms Observed</label>
              <input value={selectedRequest.symptoms || ""} disabled />

              <label>Environmental Conditions</label>
              <input value={selectedRequest.environment || ""} disabled />

              <label>Operator Actions Taken</label>
              <input value={selectedRequest.actions || ""} disabled />

              <label>Immediate Consequence</label>
              <input value={selectedRequest.consequence || ""} disabled />

              <label>Corrective Actions</label>
              <input
                value={selectedRequest.corrective_actions || ""}
                disabled
              />

              <label>Reported By</label>
              <input value={selectedRequest.reported_by || ""} disabled />

              <label>Reported Date</label>
              <input value={selectedRequest.reported_date || ""} disabled />

              <label>Address</label>
              <textarea value={selectedRequest.address || ""} disabled />

              <label>Remarks</label>
              <textarea value={selectedRequest.remarks || ""} disabled />
            </div>

            <div className="onsite-popup-actions">
              <button
                className="cancel-btn"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
