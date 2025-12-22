import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaCommentDots } from "react-icons/fa";
import "../../CSS/Client/onlineSupport.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config"; // baseURL defined here

export default function OnlineSupport() {
  const [ticket, setTicket] = useState(null); // single ticket for client
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ----------------- FETCH TICKET -----------------
  const fetchTicket = async () => {
    try {
      const res = await fetch(`${config.baseURL}/support/threads/`);
      const tickets = await res.json();
      if (tickets.length > 0) {
        setTicket(tickets[0]); // assuming only one open ticket per client
        fetchMessages(tickets[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------- FETCH MESSAGES -----------------
  const fetchMessages = async (threadId) => {
    try {
      const res = await fetch(`${config.baseURL}/support/threads/${threadId}/messages/`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  // ----------------- SEND MESSAGE -----------------
  const handleSend = async () => {
    if (!message.trim() || !ticket || ticket.status === "CLOSED") return;

    try {
      const res = await fetch(`${config.baseURL}/support/threads/${ticket.id}/messages/`, {
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

  // ----------------- RAISE TICKET -----------------
  const handleRaiseTicket = async () => {
    if (ticket) return; // only one ticket per client
    const subject = prompt("Enter issue subject:");

    if (!subject) return;

    setLoading(true);
    try {
      const res = await fetch(`${config.baseURL}/support/threads/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject }),
      });

      if (!res.ok) throw new Error("Failed to raise ticket");
      const newTicket = await res.json();
      setTicket(newTicket);
      setMessages([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="online-support-container">
      <div className="online-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <div className="chat-box">
        <div className="chat-header">
          <FaCommentDots className="chat-icon" />
          <h3>Online Support</h3>
        </div>

        {!ticket && (
          <div style={{ padding: "20px" }}>
            <button onClick={handleRaiseTicket} disabled={loading}>
              {loading ? "Raising..." : "Raise Ticket"}
            </button>
          </div>
        )}

        {ticket && (
          <>
            <div className="chat-body">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-message ${msg.sender === "client" ? "user" : "bot"}`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder={ticket.status === "CLOSED" ? "Ticket closed" : "Type here..."}
                value={message}
                disabled={ticket.status === "CLOSED"}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend} disabled={ticket.status === "CLOSED"}>
                <FaPaperPlane />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
