import React, { useState } from "react";
import "../../CSS/BDTeam/knowledgeBase.css";
import { FaArrowRight } from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";
import { useNavigate } from "react-router-dom";

import Bhumi from "../../../assets/bhumi.png";
import Bhima from "../../../assets/bhima.png";
import Vajra from "../../../assets/Vajra.png";
import VajraS from "../../../assets/Vajra-s.png";
import VyomaM from "../../../assets/Vyoma-m.webp";
import VyomaS from "../../../assets/Vyoma-s.webp";
import AstraM from "../../../assets/AstraM.png";
import AstraS from "../../../assets/AstraS.png";
import Chakra from "../../../assets/Chakra.png";

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const kbItems = [
    { id: 1, title: "BHUMI A10E DRONE GUIDE", image: Bhumi, drone: "BHUMI A10E" },
    { id: 2, title: "BHIMA-M DRONE MANUAL", image: Bhima, drone: "BHIMA-M" },
    { id: 3, title: "VAJRA-M DRONE MANUAL", image: Vajra, drone: "VAJRA-M" },
    { id: 4, title: "VAJRA-S DRONE MANUAL", image: VajraS, drone: "VAJRA-S" },
    { id: 5, title: "VYOMA-M DRONE MANUAL", image: VyomaM, drone: "VYOMA-M" },
    { id: 6, title: "VYOMA-S DRONE MANUAL", image: VyomaS, drone: "VYOMA-S" },
    { id: 7, title: "ASTRA-M DRONE MANUAL", image: AstraM, drone: "ASTRA-M" },
    { id: 8, title: "ASTRA-S DRONE MANUAL", image: AstraS, drone: "ASTRA-S" },
    { id: 9, title: "CHAKRA DRONE MANUAL", image: Chakra, drone: "CHAKRA" },
  ];

  return (
    <div className="kb-page">

      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <div className="kb-header">
        <h2 className="kb-title">Knowledge Base</h2>

        <button className="kb-add-btn" onClick={() => setShowPopup(true)}>
          + Add
        </button>
      </div>

      <div className="kb-grid">
        {kbItems.map((item) => (
          <div
            key={item.id}
            className="kb-card glass-style"
            onClick={() => navigate(`/bd/knowledge/${encodeURIComponent(item.drone)}`)}
          >
            <div className="kb-image-wrapper">
              <img src={item.image} alt={item.title} className="kb-image" />
              <div className="kb-overlay">
                <h3 className="kb-card-title">{item.title}</h3>
                <div className="kb-more">
                  <span>Explore More</span>
                  <FaArrowRight className="kb-more-icon" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="kb-popup-overlay">
          <div className="kb-popup">
            <h3>Add Drone Manual</h3>

            <input type="text" className="kb-input" placeholder="Enter Drone Name" />

            <input type="text" className="kb-input" placeholder="Enter Manual Title" />

            <textarea className="kb-input kb-textarea" placeholder="Short Description" />

            <label className="kb-file-label">
              Upload Manual PDF
              <input type="file" accept="application/pdf" className="kb-file-input" />
            </label>

            <div className="kb-btn-row">
              <button className="kb-save">Upload Manual</button>
              <button className="kb-close" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
