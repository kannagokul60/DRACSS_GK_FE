import React, { useEffect, useState } from "react";
import { FaHeadset, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../CSS/Client/supportPage.css";
import BreadCrumbs from "../BreadCrumbs";
import returnImg from "../../../assets/return_base.png";
import config from "../../../config";

export default function SupportPage() {
  const navigate = useNavigate();
  const [onlineStatus, setOnlineStatus] = useState(null);

  const token = localStorage.getItem("token");

  //Fetch Online Support ticket status
  useEffect(() => {
    const fetchOnlineSupportStatus = async () => {
      try {
        const res = await fetch(`${config.baseURL}/support/threads/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const tickets = await res.json();
        if (!tickets.length) {
          setOnlineStatus(null);
          return;
        }

        // assuming latest ticket is first
        setOnlineStatus(tickets[0].status);
      } catch (err) {
        console.error("Failed to fetch support status", err);
      }
    };

    fetchOnlineSupportStatus();
  }, []);

  const supports = [
    {
      title: "Online Support",
      description:
        "Connect instantly with our expert team for troubleshooting, guidance, or drone software issues.",
      icon: <FaHeadset />,
      color: "linear-gradient(90deg, #0d5bb4, #29568a)",
    },
    {
      title: "On-Site Support",
      description:
        "Book a certified technician for on-site maintenance or hardware issues at your preferred location.",
      icon: <FaTools />,
      color: "linear-gradient(90deg, #0d5bb4, #29568a)",
    },
    {
      title: "Return to Service",
      description:
        "Send your drone for professional servicing or part replacement and get it back in top shape.",
      image: returnImg,
      color: "linear-gradient(90deg, #0d5bb4, #29568a)",
    },
  ];

  return (
    <div className="support-container">
      <div className="support-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <div className="support-top">
        <h2 className="support-title">Support Center</h2>
      </div>

      <div className="support-card-grid">
        {supports.map((item, index) => {
          const isOnline = item.title === "Online Support";
          const isActive = isOnline && onlineStatus === "OPEN";

          return (
            <div key={index} className="support-card">
              <div
                className="support-icon"
                style={{ background: item.color }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="support-img"
                  />
                ) : (
                  item.icon
                )}
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <button
                className={`support-btn ${isActive ? "active-support" : ""}`}
                style={{ background: item.color }}
                onClick={() => {
                  if (item.title === "Online Support")
                    navigate("/client/online-support");
                  else if (item.title === "On-Site Support")
                    navigate("/client/onsite-support");
                  else if (item.title === "Return to Service")
                    navigate("/client/Return-to-base");
                }}
              >
                {isActive ? "Support : Active" : `Request ${item.title}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
