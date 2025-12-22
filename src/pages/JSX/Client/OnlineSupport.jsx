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

  const API = `${config.baseURL}/support/threads/`;

  // ✅ GET LOGGED-IN USER NAME
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.name || "Guest";

  // ---------------- FETCH EXISTING TICKET ----------------
  const fetchTicket = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) return;

      const tickets = await res.json();

      if (tickets.length > 0) {
        const t = tickets[0];
        setTicket(t);

        const msgsRes = await fetch(`${API}${t.id}/messages/`);
        const msgs = msgsRes.ok ? await msgsRes.json() : [];

        // ✅ SUBJECT ALWAYS FIRST MESSAGE
        setMessages([
          {
            id: "subject",
            message: t.subject,
            sender_type: "client",
            created_by_name: t.created_by_name || userName,
          },
          ...msgs,
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  // ---------------- RAISE TICKET ----------------
  const handleRaiseTicket = async () => {
    if (ticket || loading) return;
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Hi, I have some issue",
          created_by_name: userName,
        }),
      });

      if (!res.ok) throw new Error("Ticket creation failed");

      const newTicket = await res.json();
      setTicket(newTicket);

      // ✅ SHOW SUBJECT AS FIRST CHAT MESSAGE
      setMessages([
        {
          id: "subject",
          message: newTicket.subject,
          sender_type: "client",
          created_by_name: userName,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const handleSend = async () => {
    if (!message.trim() || !ticket) return;

    try {
      const res = await fetch(
        `${API}${ticket.id}/messages/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            created_by_name: userName,
          }),
        }
      );

      if (!res.ok) throw new Error("Message failed");

      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="online-support-container">
      <BreadCrumbs />

      <div className="chat-box">
        <div className="chat-header">
          <FaCommentDots />
          <h3>Online Support</h3>
        </div>

        {!ticket && (
          <button
            className="raise-ticket-btn"
            onClick={handleRaiseTicket}
            disabled={loading}
          >
            {loading ? "Creating Ticket..." : "Raise Ticket"}
          </button>
        )}

        {ticket && (
          <>
            <div className="chat-body">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-message ${
                    msg.sender_type === "client" ? "user" : "bot"
                  }`}
                >
                  <strong>{msg.created_by_name}:</strong> {msg.message}
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
    </div>
  );
}
