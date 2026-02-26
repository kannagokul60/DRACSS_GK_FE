import React, { useEffect, useState, useRef } from "react";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import "../../CSS/BDteam/bdOnlineSupport.css";
import config from "../../../config";
import { useParams, useNavigate } from "react-router-dom";

export default function BDOnlineSupportPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [closing, setClosing] = useState(false);

  const messagesEndRef = useRef(null); //AUTO-SCROLL REF
  const token = localStorage.getItem("token");

  //AUTO SCROLL FUNCTION
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ---------------- FETCH THREAD + MESSAGES ----------------
  const fetchThread = () => {
    fetch(`${config.baseURL}/support/threads/${ticketId}/`)
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const fresh = (data.messages || []).filter(
            (m) => !existingIds.has(m.id),
          );
          return [...prev, ...fresh];
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchThread();
    const interval = setInterval(fetchThread, 3000);
    return () => clearInterval(interval);
  }, [ticketId]);

  //AUTO SCROLL WHEN MESSAGES CHANGE
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ---------------- SEND MESSAGE ----------------
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
          message,
          sender_type: "bdteam",
        }),
      });

      const saved = await res.json();
      if (!res.ok) return;

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

  // ---------------- END CHAT ----------------
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
        },
      );

      if (!res.ok) {
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

  const handleOnsite = async () => {
    if (!ticket || ticket.status === "CLOSED") return;

    try {
      //  SEND AUTO MESSAGE
      const res = await fetch(`${config.baseURL}/support/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          thread: ticket.id,
          message:
            "Issue resolved by onsite. Please raise request in onsite support page.",
          sender_type: "bdteam",
        }),
      });

      const saved = await res.json();

      if (res.ok) {
        // ADD MESSAGE TO UI
        setMessages((prev) => [
          ...prev,
          {
            id: saved.id,
            sender_name: "BDTeam",
            message: saved.message,
            created_at: saved.created_at,
          },
        ]);
      }

      // SAVE ENABLE ONSITE FLAG
      localStorage.setItem("enableOnSite", "true");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturnToService = async () => {
    if (!ticket || ticket.status === "CLOSED") return;

    try {
      //  SEND AUTO MESSAGE
      const res = await fetch(`${config.baseURL}/support/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          thread: ticket.id,
          message:
            "Issue resolved by return to service. Please raise request in return to service support page.",
          sender_type: "bdteam",
        }),
      });

      const saved = await res.json();

      if (res.ok) {
        // ADD MESSAGE TO UI
        setMessages((prev) => [
          ...prev,
          {
            id: saved.id,
            sender_name: "BDTeam",
            message: saved.message,
            created_at: saved.created_at,
          },
        ]);
      }

      // ENABLE RETURN TO SERVICE FLAG (optional)
      localStorage.setItem("enableReturnService", "true");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bd-chat-wrapper">
      {/* HEADER */}
      <div className="bd-chat-header">
        <div className="bd-chat-header-left">
          <FaArrowLeft className="bd-back-icon" onClick={() => navigate(-1)} />
          <span className="bd-ticket-id">{ticket?.ticket_id}</span>
        </div>

        <h3 className="bd-ticket-subject">{ticket?.subject}</h3>

        <div className="bd-chat-header-right">
          <span
            className={`bd-status ${
              ticket?.status === "OPEN" ? "open" : "closed"
            }`}
          >
            Status: {ticket?.status}
          </span>

          {ticket?.status === "OPEN" && (
            <>
              {/* ✅ ONSITE BUTTON */}
              <button className="bd-onsite-btn" onClick={handleOnsite}>
                Onsite
              </button>

              {/* ✅ RETURN TO SERVICE BUTTON */}
              <button className="bd-return-btn" onClick={handleReturnToService}>
                Return to Service
              </button>

              {/* EXISTING END CHAT */}
              <button
                className="bd-end-chat-btn"
                onClick={handleEndChat}
                disabled={closing}
              >
                {closing ? "Ending..." : "End Chat"}
              </button>
            </>
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

        <div ref={messagesEndRef} />
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
