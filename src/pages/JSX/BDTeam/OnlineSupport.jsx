import React, { useEffect, useState } from "react";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import "../../CSS/BDteam/bdOnlineSupport.css";
import config from "../../../config";
import { useParams, useNavigate } from "react-router-dom";

export default function BDOnlineSupport() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [closing, setClosing] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch thread + messages
  const fetchThread = () => {
    fetch(`${config.baseURL}/support/threads/${ticketId}/`)
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const fresh = (data.messages || []).filter(
            (m) => !existingIds.has(m.id)
          );
          return [...prev, ...fresh];
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchThread();

    const interval = setInterval(() => {
      fetchThread();
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [ticketId]);

  // Send message
  const handleSend = async () => {
    if (!message.trim() || !ticket) return;

    try {
      const res = await fetch(`${config.baseURL}/support/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          thread: ticket.id,
          message: message,
          sender_type: "bdteam",
        }),
      });

      const saved = await res.json();

      if (!res.ok) {
        console.error(saved);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: saved.id,
          sender_name: "BDTeam",
          message: saved.message,
          attachment: saved.attachment || null,
          created_at: saved.created_at,
        },
      ]);

      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  // End chat / Close ticket
  const handleEndChat = async () => {
    if (!ticket || ticket.status === "CLOSED") return;
    setClosing(true);

    try {
      const res = await fetch(
        `${config.baseURL}/support/threads/${ticketId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ status: "CLOSED" }),
        }
      );

      const updated = await res.json();
      if (!res.ok) {
        console.error(updated);
        setClosing(false);
        return;
      }

      setTicket((prev) => ({ ...prev, status: "CLOSED" }));
      setClosing(false);
    } catch (err) {
      console.error(err);
      setClosing(false);
    }
  };

  return (
    <div className="bd-chat-wrapper">
      {/* HEADER */}
      <div className="bd-chat-header">
        <FaArrowLeft className="bd-back-icon" onClick={() => navigate(-1)} />
        <h3>{ticket?.subject}</h3>

        <div className="bd-chat-header-right">
          <span
            className={`bd-status ${
              ticket?.status === "OPEN" ? "open" : "closed"
            }`}
          >
            Status: {ticket?.status}
          </span>

          {ticket?.status === "OPEN" && (
            <button
              className="bd-end-chat-btn"
              onClick={handleEndChat}
              disabled={closing}
            >
              {closing ? "Ending..." : "End Chat"}
            </button>
          )}
        </div>
      </div>

      {/* CHAT BODY */}
      <div className="bd-chat-body">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bd-chat-msg ${
              msg.sender_name?.toLowerCase() === "bdteam" ? "bd" : "client"
            }`}
          >
            <strong>{msg.sender_name}:</strong> {msg.message}
          </div>
        ))}
      </div>

      {/* INPUT */}
      {ticket?.status === "OPEN" && (
        <div className="bd-chat-input">
          <input
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
    </div>
  );
}
