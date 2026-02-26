import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaCommentDots } from "react-icons/fa";
import "../../CSS/Client/onlineSupport.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

export default function ClientOnlineSupport() {
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [droneSerial, setDroneSerial] = useState("");
  const [error, setError] = useState("");
  const [enableOnSite, setEnableOnSite] = useState(false);

  const messagesEndRef = useRef(null); //AUTO-SCROLL REF

  const THREAD_API = `${config.baseURL}/support/threads/`;
  const MESSAGE_API = `${config.baseURL}/support/messages/`;
  const CLIENT_API = `${config.baseURL}/clients/`;
  const DRONE_API = `${config.baseURL}/drone_registration/`;


  const token = localStorage.getItem("token");

  //AUTO SCROLL FUNCTION
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ---------------- FETCH EXISTING TICKET ----------------
  const fetchTicket = async () => {
    try {
      const res = await fetch(THREAD_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;

      const tickets = await res.json();
      if (!tickets.length) {
        setTicket(null);
        setMessages([]);
        return;
      }

      const t = tickets[0];
      setTicket(t);

      if (t.status === "CLOSED") {
        setMessages([]);
        return;
      }

      const msgRes = await fetch(MESSAGE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!msgRes.ok) return;

      const data = await msgRes.json();
      const threadObj = data.find((i) => i.id === t.id);
      const replies = threadObj?.replies ?? [];

const normalized = replies.map((r) => ({
  id: r.id,
  message: r.message,
  sender_type:
    r.sender_name === t.created_by_name ? "client" : "bdteam",
  created_by_name: r.sender_name,
}));

setMessages(normalized);

// ⭐ CHECK IF BD TEAM ENABLED ON-SITE SUPPORT
const onsiteAllowed = normalized.some(
  (m) =>
    m.sender_type === "bdteam" &&
    m.message.toLowerCase().includes("on-site support")
);

setEnableOnSite(onsiteAllowed);

// ⭐ IMPORTANT — SAVE TO LOCAL STORAGE
localStorage.setItem("enableOnSite", onsiteAllowed);

      

      setMessages(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTicket();
    const interval = setInterval(fetchTicket, 3000);
    return () => clearInterval(interval);
  }, []);

  // AUTO-SCROLL WHEN MESSAGES CHANGE
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ---------------- FETCH CLIENT NAME BY DRONE ----------------
  const fetchClientName = async (serial) => {
    try {
      const res = await fetch(CLIENT_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return "support_guest";

      const clients = await res.json();
      const client = clients.find((c) => c.drones.includes(serial));
      return client?.name || "support_guest";
    } catch {
      return "support_guest";
    }
  };

  const validateDrone = async (serial) => {
  try {
    const res = await fetch(DRONE_API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return { valid: false, reason: "api_error" };

    const drones = await res.json();

    const drone = drones.find(
      (d) => d.drone_serial_number === serial
    );

    // NOT FOUND
    if (!drone) {
      return { valid: false, reason: "not_registered" };
    }

    // CHECK STATUS
    if (drone.is_active === null) {
      return { valid: false, reason: "not_registered" };
    }

    if (drone.is_active === false) {
      return { valid: false, reason: "rejected" };
    }

    if (drone.is_active === true) {
      return { valid: true };
    }

  } catch (err) {
    console.error(err);
    return { valid: false, reason: "error" };
  }
};


  // ---------------- CREATE TICKET ----------------
const createTicket = async () => {
  if (!droneSerial.trim()) {
    setError("Drone Serial Number is required");
    return;
  }

  try {
    setLoading(true);
    setError("");

    // ⭐ USE VALIDATION FUNCTION
    const validation = await validateDrone(droneSerial);

    if (!validation.valid) {
      if (validation.reason === "not_registered") {
        alert("Your drone is not registered");
      } else if (validation.reason === "rejected") {
        alert("Your drone is rejected by BD team");
      } else {
        alert("Unable to verify drone");
      }
      return;
    }

    // ⭐ CREATE TICKET
    const clientName = await fetchClientName(droneSerial);

    const res = await fetch(THREAD_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subject: "Online Support Request",
        drone_serial_number: droneSerial,
        created_by_name: clientName,
      }),
    });

    if (!res.ok) throw new Error("Thread create failed");

    const newThread = await res.json();

    // ⭐ FIRST MESSAGE
    const msgRes = await fetch(MESSAGE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        thread: newThread.id,
        message: "Hi, there is an issue",
        attachment: null,
      }),
    });

    const firstMessageSaved = await msgRes.json();

    setTicket(newThread);

    setMessages([
      {
        id: firstMessageSaved.id,
        message: firstMessageSaved.message,
        sender_type: "client",
        created_by_name: clientName,
      },
    ]);

    setDroneSerial("");
    setShowModal(false);

  } catch (err) {
    console.error(err);
    setError("Unable to create ticket");
  } finally {
    setLoading(false);
  }
};



  // ---------------- SEND MESSAGE ----------------
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

      const saved = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: saved.id,
          message: saved.message,
          sender_type: "client",
          created_by_name: saved.sender_name,
        },
      ]);

      setMessage("");
    } catch (err) {
      console.error(err);
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
            <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
              Status: {ticket.status}
            </span>
          )}
        </div>

        {/* RAISE TICKET */}
        {(!ticket || ticket.status === "CLOSED") && !showModal && (
          <button
            className="raise-ticket-btn"
            onClick={() => setShowModal(true)}
          >
            Raise Ticket
          </button>
        )}

        {/* CHAT */}
        {ticket && ticket.status === "OPEN" && (
          <>
            <div className="chat-body">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.sender_type}`}>
                  <strong>
                    {msg.sender_type === "client" ? "You" : msg.created_by_name}
                    :
                  </strong>{" "}
                  {msg.message}
                </div>
              ))}

              {/*AUTO-SCROLL TARGET */}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type here..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>
                <FaPaperPlane />
              </button>
            </div>
          </>
        )}

        {/* CHAT ENDED */}
        {ticket && ticket.status === "CLOSED" && (
          <div className="chat-ended-msg">
            <p>Chat has ended by BD team. If you want to report a new issue, raise
            a new ticket.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter Drone Serial Number</h3>
            <input
              value={droneSerial}
              onChange={(e) => setDroneSerial(e.target.value)}
              placeholder="Drone Serial Number"
            />
            {error && <p className="error-text">{error}</p>}
            <div className="modal-actions">
              <button onClick={createTicket} disabled={loading}>
                {loading ? "Creating..." : "Submit"}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
