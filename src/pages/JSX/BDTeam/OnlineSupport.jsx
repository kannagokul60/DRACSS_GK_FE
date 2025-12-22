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

  // 🔐 Get token (adjust if you store it differently)
  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };

  // ----------------- FETCH TICKETS -----------------
  const fetchTickets = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/support/threads/",
        { headers: authHeaders }
      );

      if (!res.ok) throw new Error("Failed to fetch tickets");

      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Fetch tickets error:", err);
    }
  };

  // ----------------- FETCH MESSAGES -----------------
  const fetchMessages = async (ticketId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/support/threads/${ticketId}/messages/`,
        { headers: authHeaders }
      );

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Fetch messages error:", err);
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

  // ----------------- SEND MESSAGE (BD) -----------------
  const handleSend = async () => {
    if (!message.trim() || !selectedTicket) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/support/threads/${selectedTicket.id}/messages/`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ message }),
        }
      );

      if (!res.ok) throw new Error("Failed to send message");

      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // ----------------- CLOSE TICKET -----------------
  const handleClose = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/support/threads/${selectedTicket.id}/close/`,
        {
          method: "POST",
          headers: authHeaders,
        }
      );

      if (!res.ok) throw new Error("Failed to close ticket");

      setSelectedTicket({ ...selectedTicket, status: "CLOSED" });
      fetchTickets();
    } catch (err) {
      console.error("Close ticket error:", err);
    }
  };

  return (
    <div className="bd-online-container">
      <BreadCrumbs />

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
                  <strong>Client:</strong> {t.created_by_name}
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
            <FaArrowLeft onClick={() => setSelectedTicket(null)} />
            <FaCommentDots />
            <h3>{selectedTicket.subject}</h3>
            <p>Status: {selectedTicket.status}</p>
          </div>

          <div className="bd-chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bd-chat-msg ${
                  msg.sender_type === "bd" ? "bd" : "client"
                }`}
              >
                <strong>{msg.sender_name}:</strong> {msg.message}
              </div>
            ))}
          </div>

          {selectedTicket.status !== "CLOSED" && (
            <>
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

              <button className="bd-close-ticket-btn" onClick={handleClose}>
                Close Ticket
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
