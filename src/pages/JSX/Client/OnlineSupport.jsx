import React, { useState } from "react";
import { FaPaperPlane, FaPhoneAlt, FaVideo, FaCommentDots } from "react-icons/fa";
import "../../CSS/Client/onlineSupport.css";
import BreadCrumbs from "../BreadCrumbs";


export default function OnlineSupport() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { from: "bot", text: "Hi, how can I assist you today?" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChat([...chat, { from: "user", text: message }]);
    setMessage("");
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

        <div className="chat-body">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}
            >
              {msg.text}
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
      </div>

      <div className="support-actions">
        <div className="support-action">
          <FaPhoneAlt />
          <span>Call Support</span>
        </div>
        <div className="support-action">
          <FaCommentDots />
          <span>Live Chat</span>
        </div>
        <div className="support-action">
          <FaVideo />
          <span>Video Call</span>
        </div>
      </div>
    </div>
  );
}
