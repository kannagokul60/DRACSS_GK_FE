import React from "react";
import "../../CSS/BDTeam/knowledgeBase.css";
import { FaArrowRight } from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";
import { useNavigate } from "react-router-dom";

export default function KnowledgeBase() {
  const navigate = useNavigate();

  const kbItems = [
    {
      id: 1,
      title: "BHUMI DRONE GUIDE",
      image:
        "https://dronelife.com/wp-content/uploads/2022/12/Garuda-Aerospace-Agri-drone.png",
      path: "/bd/knowledge/bhumi",
    },
    {
      id: 2,
      title: "VAJRA DRONE MANUAL",
      image:
        "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      path: "/bd/knowledge/vajra",
    },
    {
      id: 3,
      title: "AGNI DRONE TIPS",
      image: "https://tropogo.com/blogs/images/blog/bg_spraying.png",
      path: "/bd/knowledge/agni",
    },
  ];

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
