import React, { useEffect, useState } from "react";
import "../../CSS/BDteam/bdOnlineList.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";
import { useNavigate } from "react-router-dom";

export default function OnlineSupportList() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${config.baseURL}/support/threads/`)
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error(err));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bd-online-container">
      <div className="bd-support-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="bd-title">Client Tickets</h2>

      <div className="bd-online-list">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="bd-online-card"
            onClick={() => navigate(`/bd/online-support/${t.id}`)}
          >
            <span className="bd-ticket-date">
              {formatDate(t.created_at)}
            </span>

            <h3 className="bd-ticket-subject">{t.ticket_id}</h3>

            <p>
              <strong>Client:</strong> {t.created_by_name}
            </p>

            <p>
              <strong>Status: </strong>
              <span className={`bd-ticket-status ${t.status === "OPEN" ? "open" : "closed"}`}>
                {t.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
