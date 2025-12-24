import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaCommentDots } from "react-icons/fa";
import "../../CSS/Client/onlineSupport.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

export default function OnlineSupport() {
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

    const t = tickets[0];
    setTicket(t);

    const msgRes = await fetch(MESSAGE_API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!msgRes.ok) return;

    const data = await msgRes.json();

    // ✅ FIX IS HERE
    const threadObj = data.find((item) => item.id === t.id);
    const replies = threadObj?.replies ?? [];

    const normalizedReplies = replies.map((reply) => ({
      id: reply.id,
      message: reply.message,
      sender_type:
        reply.sender_name === t.created_by_name ? "client" : "bot",
      created_by_name: reply.sender_name,
      created_at: reply.created_at,
    }));

    setMessages(buildChatMessages(t, normalizedReplies));
  } catch (err) {
    console.error("Fetch ticket error:", err);
  }
};


  useEffect(() => {
    fetchTicket();
  }, []);

  const handleRaiseTicket = async () => {
    if (!droneSerial.trim()) {
      setError("Drone Serial Number is required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const clientRes = await fetch(`${config.baseURL}/clients/`);
      if (!clientRes.ok) throw new Error("Failed to fetch clients");
      const clients = await clientRes.json();

      const client = clients.find((c) =>
        c.drones.includes(droneSerial.trim())
      );
      if (!client) {
        setError("You have not registered this drone.");
        setLoading(false);
        return;
      }
      const clientName = client.name;

      const res = await fetch(THREAD_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          subject: "Hi, I have some issue",
          drone_serial_number: droneSerial.trim(),
          created_by_name: clientName,
        }),
      });

      const newTicket = await res.json();
      if (!res.ok) {
        setError(newTicket?.drone_serial_number_input?.[0] || "Failed to create ticket");
        return;
      }

      setTicket(newTicket);
      setMessages(buildChatMessages(newTicket, []));
      setShowModal(false);
      setDroneSerial("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !ticket) return;

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
    saved.sender_name === ticket.created_by_name ? "client" : "bot",
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
                    msg.sender_type === "client" ? "user" : "bot"
                  }`}
                >
                  <strong>
                    {msg.sender_type === "client" ? "You" : `${msg.created_by_name}:`}
                  </strong>{" "}
                  {msg.message}
                </div>
              ))}
            </div>

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
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Raise Support Ticket</h3>
            <input
              type="text"
              placeholder="Enter Drone Serial Number"
              value={droneSerial}
              onChange={(e) => setDroneSerial(e.target.value)}
            />
            {error && <p className="error-text">{error}</p>}
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleRaiseTicket} disabled={loading}>
                {loading ? "Creating..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
