import React, { useEffect, useState } from "react";
import "../../CSS/BDteam/bdSupportPage.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";
import { useNavigate } from "react-router-dom";

export default function SupportPage() {
  const navigate = useNavigate();

  const [onlineTickets, setOnlineTickets] = useState([]);
  const [onsiteTickets, setOnsiteTickets] = useState([]);

  // ✅ Fetch Online Support
  useEffect(() => {
    fetch(`${config.baseURL}/support/threads/`)
      .then((res) => res.json())
      .then((data) => setOnlineTickets(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Fetch Onsite Support
  useEffect(() => {
    fetch(`${config.baseURL}/onsite-support/`)
      .then((res) => res.json())
      .then((data) => {
        const tickets = Array.isArray(data)
          ? data
          : data.results || [];
        setOnsiteTickets(tickets);
      })
      .catch((err) => console.error(err));
  }, []);

  // =========================
  // ONLINE COUNTS
  // =========================
  const onlineOpenCount = onlineTickets.filter(
    (t) => t.status === "OPEN"
  ).length;

  const onlineClosedCount = onlineTickets.filter(
    (t) => t.status === "CLOSED"
  ).length;

  // =========================
  // ONSITE COUNTS
  // =========================
  const onsiteOpenCount = onsiteTickets.filter(
    (t) =>
      t.status === "pending" ||
      t.status === "ASSIGNED_TO_TECH"
  ).length;

  const onsiteClosedCount = onsiteTickets.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  return (
    <div className="bd-online-container">
      <div className="bd-support-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="bd-title">Support Page</h2>

      <div className="bd-online-list">
        {/* ONLINE SUPPORT CARD */}
        <div
          className="bd-card online-card"
          onClick={() => navigate("/bd/online-support")}
        >
          <h3>Online Support</h3>
          <div className="bd-count-wrapper">
            <span className="open-count">
              Open: {onlineOpenCount}
            </span>
            <span className="closed-count">
              Closed: {onlineClosedCount}
            </span>
          </div>
        </div>

        {/* ONSITE SUPPORT CARD */}
        <div
          className="bd-card onsite-card"
          onClick={() => navigate("/bd/onsite-support")}
        >
          <h3>Onsite Support</h3>
          <div className="bd-count-wrapper">
            <span className="open-count">
              Open: {onsiteOpenCount}
            </span>
            <span className="closed-count">
              Closed: {onsiteClosedCount}
            </span>
          </div>
        </div>

        {/* RETURN TO SERVICE CARD */}
        <div
          className="bd-card return-card"
          onClick={() => navigate("/bd/support/return")}
        >
          <h3>Return To Service</h3>
          <div className="bd-count-wrapper">
            <span className="open-count">Open: 0</span>
            <span className="closed-count">Closed: 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}