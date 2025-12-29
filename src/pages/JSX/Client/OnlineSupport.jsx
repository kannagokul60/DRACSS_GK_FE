import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaCommentDots } from "react-icons/fa";
import "../../CSS/Client/onlineSupport.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

export default function ClientOnlineSupport() {
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [droneSerial, setDroneSerial] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const THREAD_API = `${config.baseURL}/support/threads/`;
  const MESSAGE_API = `${config.baseURL}/support/messages/`;

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userName = storedUser?.name || "support_guest";

  const buildChatMessages = (thread, backendMessages) => {
    const subjectMessage = {
      id: `subject-${thread.id}`,
      message: thread.subject,
      sender_type: "client",
      created_by_name: thread.created_by_name,
      created_at: thread.created_at,
    };
    return [subjectMessage, ...backendMessages];
  };

  const fetchTicket = async () => {
    try {
      const res = await fetch(THREAD_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;

      const tickets = await res.json();
      if (!tickets.length) return;

      const t = tickets[0]; // thread object
      setTicket(t);

      const msgRes = await fetch(MESSAGE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!msgRes.ok) return;

      const data = await msgRes.json();
      const threadObj = data.find((item) => item.id === t.id);
      const replies = threadObj?.replies ?? [];

      const normalizedReplies = replies.map((reply) => ({
        id: reply.id,
        message: reply.message,
        sender_type:
          reply.sender_name === t.created_by_name
            ? "client"
            : reply.sender_name === "BDTeam"
            ? "bdteam"
            : "bot",
        created_by_name: reply.sender_name,
        created_at: reply.created_at,
      }));

setMessages((prev) => {
  const existingIds = new Set(prev.map((m) => m.id));

  const merged = buildChatMessages(t, normalizedReplies).filter(
    (m) => !existingIds.has(m.id)
  );

  return [...prev, ...merged];
});
    } catch (err) {
      console.error("Fetch ticket error:", err);
    }
  };

  useEffect(() => {
  fetchTicket();

  const interval = setInterval(() => {
    fetchTicket();
  }, 3000);

  return () => clearInterval(interval);
}, []);


  const handleSend = async () => {
    if (!message.trim() || !ticket || ticket.status === "CLOSED") return;

    try {
      const res = await fetch(MESSAGE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          thread: ticket.id,
          message,
          attachment: null,
        }),
      });

      if (!res.ok) throw new Error("Send failed");
      const saved = await res.json();

      const newMsg = {
        id: saved.id,
        message: saved.message,
        sender_type:
          saved.sender_name === ticket.created_by_name
            ? "client"
            : saved.sender_name === "BDTeam"
            ? "bdteam"
            : "bot",
        created_by_name: saved.sender_name,
        created_at: saved.created_at,
      };

      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="online-support-container">
      <div className="online-breadcrumbs-wrapper">
        <BreadCrumbs />
      </div>

      <div className="chat-box">
        <div className="chat-header">
          <FaCommentDots />
          <h3>Online Support</h3>
          {ticket && (
            <span
              className={`ticket-status ${
                ticket.status === "OPEN" ? "open" : "closed"
              }`}
            >
              Status: {ticket.status}
            </span>
          )}
        </div>

        {!ticket && (
          <button
            className="raise-ticket-btn"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            {loading ? "Creating Ticket..." : "Raise Ticket"}
          </button>
        )}

        {ticket && (
          <>
            <div className="chat-body">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${
                    msg.sender_type === "client"
                      ? "user"
                      : msg.sender_type === "bdteam"
                      ? "bdteam"
                      : "bot"
                  }`}
                >
                  <strong>
                    {msg.sender_type === "client"
                      ? "You:"
                      : msg.sender_type === "bdteam"
                      ? "BDTeam:"
                      : `${msg.created_by_name}:`}
                  </strong>{" "}
                  {msg.message}
                </div>
              ))}
            </div>

            {ticket.status === "OPEN" ? (
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend}>
                  <FaPaperPlane />
                </button>
              </div>
            ) : (
              <div className="chat-ended-msg">
                <p>Chat has ended. You cannot send messages anymore.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
