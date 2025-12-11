import React, { useEffect, useState } from "react";
import "../../CSS/Client/knowledgeBase.css";
import { FaArrowRight } from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";
import { useNavigate } from "react-router-dom";
import config from "../../../config"; // make sure this points to your backend URL

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const [kbItems, setKbItems] = useState([]);

  useEffect(() => {
    loadKbItems();
  }, []);

  const loadKbItems = async () => {
    try {
      const res = await fetch(`${config.baseURL}/drone_images/`);
      const data = await res.json();

      // normalize data to include id, title, and image
      const parsed = data.map((item) => ({
        id: item.id,
        title: item.name, // BD team uses 'name' for drone title
        image: item.image.startsWith("http")
          ? item.image
          : config.baseURL + item.image,
        path: `/client/knowledge/${encodeURIComponent(item.name)}`,
      }));

      setKbItems(parsed);
    } catch (err) {
      console.error("Failed to load client knowledge base", err);
    }
  };

  return (
    <div className="kb-page">
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="kb-title">Knowledge Base</h2>

      <div className="kb-grid">
        {kbItems.map((item) => (
          <div
            key={item.id}
            className="kb-card glass-style"
            onClick={() => navigate(item.path)}
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
    </div>
  );
}
