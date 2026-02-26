import React, { useEffect, useState } from "react";
import "../../CSS/BDteam/bdSupportPage.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SupportPage() {
  const navigate = useNavigate();

  const [openCount, setOpenCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const employee_id = localStorage.getItem("employee_id");
        const client_type = localStorage.getItem("client_type");

        const response = await axios.get(
          `${config.baseURL}/onsite-support/?employee_id=${employee_id}&client_type=${client_type}`
        );

        const tickets = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        // ✅ Only tickets assigned to tech
        const techTickets = tickets.filter(
          (ticket) =>
            ticket.status === "ASSIGNED_TO_TECH" ||
            ticket.status === "COMPLETED"
        );

        // ✅ Count logic
        const open = techTickets.filter(
          (ticket) => ticket.status === "ASSIGNED_TO_TECH"
        ).length;

        const closed = techTickets.filter(
          (ticket) => ticket.status === "COMPLETED"
        ).length;

        setOpenCount(open);
        setClosedCount(closed);
      } catch (error) {
        console.error("Failed to fetch ticket counts", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="bd-online-container">
      <div className="bd-support-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="bd-title">Support Page</h2>

      <div className="bd-online-list">
        {/* ON-SITE SUPPORT CARD */}
        <div
          className="bd-card online-card"
          onClick={() => navigate("/technical/on-site-support-tickets")}
        >
          <h3>On-Site Support</h3>
          <div className="bd-count-wrapper">
            <span className="open-count">Open: {openCount}</span>
            <span className="closed-count">Closed: {closedCount}</span>
          </div>
        </div>

        {/* RETURN TO SERVICE CARD */}
        <div
          className="bd-card return-card"
          onClick={() => navigate("/technical/return-to-service")}
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