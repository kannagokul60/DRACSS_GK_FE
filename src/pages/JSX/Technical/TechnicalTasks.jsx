import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import "../../CSS/Technical/task.css";
import BreadCrumbs from "../BreadCrumbs";


export default function TechnicalTasks() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get("status") || "pending";

  const allTasks = [
    {
      id: 401,
      requestType: "Drone Repair (Client A)",
      mode: "Onsite",
      requestedDate: "15-11-2025",
      assignedPerson: "Ravi Kumar",
      status: "pending",
    },
    {
      id: 402,
      requestType: "Battery Maintenance (Client B)",
      mode: "Online",
      requestedDate: "12-11-2025",
      assignedPerson: "Suresh",
      status: "assigned",
    },
    {
      id: 403,
      requestType: "Firmware Upgrade (Client C)",
      mode: "RTB",
      requestedDate: "10-11-2025",
      assignedPerson: "Ravi Kumar",
      status: "completed",
    },
  ];

  // Filter tasks by status
  const filteredTasks = useMemo(
    () => allTasks.filter((t) => t.status === statusFilter),
    [statusFilter]
  );

  const titleMap = {
    pending: "Pending Tasks",
    assigned: "Assigned Tasks",
    completed: "Completed Tasks",
  };

  return (
    <div className="bd-pending-wrap">
        <div className="drone-breadcrumb-wrapper">
                      <BreadCrumbs />
                    </div>
      <h2 className="bd-pending-header">
        Technical Team – {titleMap[statusFilter]}
      </h2>

      <div className="table-container">
        <table className="bd-pending-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Request Type</th>
              <th>Mode</th>
              <th>Requested Date</th>
              {statusFilter !== "pending" && <th>Assigned To</th>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.requestType}</td>
                  <td>{t.mode}</td>
                  <td>{t.requestedDate}</td>
                  {statusFilter !== "pending" && <td>{t.assignedPerson}</td>}
                  <td>
                    <span
                      className={`status-badge ${
                        t.status === "completed"
                          ? "completed"
                          : t.status === "assigned"
                          ? "inprogress"
                          : "pending"
                      }`}
                    >
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={statusFilter !== "pending" ? 6 : 5}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No {statusFilter} tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
