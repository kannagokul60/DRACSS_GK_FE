import React, { useEffect, useState } from "react";
import "../../CSS/BDteam/bdSupportPage.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";
import { useNavigate } from "react-router-dom";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${config.baseURL}/support/threads/`)
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bd-online-container">
     <div className="bd-support-breadcrumb-wrapper">
             <BreadCrumbs />
           </div>
      <h2 className="bd-title">Client Tickets</h2>

      <div className="bd-online-list">
        {tickets.map(t => (
          <div
            key={t.id}
            className="bd-online-card"
            onClick={() => navigate(`/bd/support/${t.id}`)}
          >
            <h3>{t.subject}</h3>
            <p><strong>Client:</strong> {t.created_by_name}</p>
            <p><strong>Status:</strong> {t.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
