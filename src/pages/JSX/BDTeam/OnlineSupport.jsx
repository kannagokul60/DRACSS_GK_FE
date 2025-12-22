import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaCommentDots, FaArrowLeft } from "react-icons/fa";
import "../../CSS/BDteam/bdOnlineSupport.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

export default function OnlineSupport() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ----------------- FETCH TICKETS -----------------
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${config.baseURL}/support/threads/`);
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------- FETCH MESSAGES -----------------
  const fetchMessages = async (ticketId) => {
    try {
      const res = await fetch(`${config.baseURL}/support/threads/${ticketId}/messages/`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ----------------- SELECT TICKET -----------------
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
    setMessage("");
  };

  // ----------------- SEND BD MESSAGE -----------------
  const handleSend = async () => {
    if (!message.trim() || !selectedTicket || selectedTicket.status === "CLOSED") return;

    try {
      const res = await fetch(`${config.baseURL}/support/threads/${selectedTicket.id}/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------- CLOSE TICKET -----------------
  const handleClose = async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`${config.baseURL}/support/threads/${selectedTicket.id}/close/`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to close ticket");
      setSelectedTicket({ ...selectedTicket, status: "CLOSED" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bd-online-container">
      <div className="bd-online-breadcrumb">
        <BreadCrumbs />
      </div>

    {!selectedTicket && (
  <>
    <h2 className="bd-title">Client Tickets</h2>
    <div className="bd-online-list">
      {tickets.map((t) => (
        <div
          key={t.id}
          className="bd-online-card"
          onClick={() => handleSelectTicket(t)}
        >
          <h3>{t.subject}</h3>
          <p>
            <strong>Client:</strong>{" "}
            {t.created_by?.username || "Anonymous"}
          </p>
          <p>
            <strong>Status:</strong> {t.status}
          </p>
        </div>
      ))}
    </div>
  </>
)}


      {selectedTicket && (
        <div className="bd-chat-wrapper">
          <div className="bd-chat-header">
            <FaArrowLeft className="bd-back-icon" onClick={() => setSelectedTicket(null)} />
            <FaCommentDots />
            <h3>{selectedTicket.subject}</h3>
            <p>Status: {selectedTicket.status}</p>
          </div>

          <div className="bd-chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`bd-chat-msg ${msg.sender === "bd" ? "bd" : "client"}`}>
                {msg.message}
              </div>
            ))}
          </div>

          {selectedTicket.status !== "CLOSED" && (
            <div className="bd-chat-input">
              <input
                type="text"
                placeholder="Type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>
                <FaPaperPlane />
              </button>
            </div>
          )}

          {selectedTicket.status !== "CLOSED" && (
            <button className="bd-close-ticket-btn" onClick={handleClose}>
              Close Ticket
            </button>
          )}
        </div>
      )}
    </div>
  );
}
