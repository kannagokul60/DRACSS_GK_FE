import React, { useEffect, useState } from "react";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import "../../CSS/BDteam/bdOnlineSupport.css";
import config from "../../../config";
import { useParams, useNavigate } from "react-router-dom";

export default function OnlineSupport() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ FETCH THREAD + MESSAGES TOGETHER
  useEffect(() => {
    fetch(`${config.baseURL}/support/threads/${ticketId}/`)
      .then(res => res.json())
      .then(data => {
        setTicket(data);
        setMessages(data.messages || []); // ✅ HERE
      })
      .catch(err => console.error(err));
  }, [ticketId]);

  // ✅ SEND MESSAGE
  const handleSend = async () => {
    if (!message.trim()) return;

    const res = await fetch(
      `${config.baseURL}/support/threads/${ticketId}/messages/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }
    );

    const msg = await res.json();

    // ✅ append new message
    setMessages(prev => [...prev, msg]);
    setMessage("");
  };

  return (
    <div className="bd-chat-wrapper">
      {/* HEADER */}
      <div className="bd-chat-header">
        <FaArrowLeft className="bd-back-icon" onClick={() => navigate(-1)} />
        <h3>{ticket?.subject}</h3>
      </div>

      {/* CHAT BODY */}
      <div className="bd-chat-body">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`bd-chat-msg ${
              msg.sender_name === "bdteam" ? "bd" : "client"
            }`}
          >
            <strong>{msg.sender_name}:</strong> {msg.message}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="bd-chat-input">
        <input
          placeholder="Type message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
