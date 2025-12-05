import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../CSS/BDTeam/viewknowledge.css";
import {
  FaPlay,
  FaDownload,
  FaCogs,
  FaWifi,
  FaMicrochip,
} from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";

const droneData = {
  "BHUMI A10E": {
    images: [
      "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
      "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg",
    ],
    manualVideo: "https://www.youtube.com/embed/Dn7Q4oIrP3I",
    manualPDF: "#",
    subtitle: "Precision Agriculture Drone for Smart Farming Solutions.",
  },

  "BHIMA-M": {
    images: [
      "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
      "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg",
    ],
    manualVideo: "https://www.youtube.com/embed/example1",
    manualPDF: "#",
    subtitle: "Heavy-duty drone for agricultural spraying.",
  },
  "VAJRA-M": {
    images: [
      "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
      "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg",
    ],
    manualVideo: "https://www.youtube.com/embed/example1",
    manualPDF: "#",
    subtitle: "Heavy-duty drone for agricultural spraying.",
  },
  "VAJRA-S": {
    images: [
      "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
      "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg",
    ],
    manualVideo: "https://www.youtube.com/embed/example1",
    manualPDF: "#",
    subtitle: "Heavy-duty drone for agricultural spraying.",
  },
  "VYOMA-M": {
    images: [
      "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
      "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg",
    ],
    manualVideo: "https://www.youtube.com/embed/example1",
    manualPDF: "#",
    subtitle: "Heavy-duty drone for agricultural spraying.",
  },
  "VYOMA-S": {
    images: [
      "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
      "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg",
    ],
    manualVideo: "https://www.youtube.com/embed/example1",
    manualPDF: "#",
    subtitle: "Heavy-duty drone for agricultural spraying.",
  },
  "ASTRA-M": {
    images: [
      "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
      "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg",
    ],
    manualVideo: "https://www.youtube.com/embed/example1",
    manualPDF: "#",
    subtitle: "Heavy-duty drone for agricultural spraying.",
  },
  "ASTRA-S": {
    images: [
      "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
      "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg",
    ],
    manualVideo: "https://www.youtube.com/embed/example1",
    manualPDF: "#",
    subtitle: "Heavy-duty drone for agricultural spraying.",
  },
    "CHAKRA": {
    images: [
      "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
      "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
      "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg",
    ],
    manualVideo: "https://www.youtube.com/embed/example1",
    manualPDF: "#",
    subtitle: "Heavy-duty drone for agricultural spraying.",
  },

  // Add other drone entries here...
};

export default function ViewKnowledge() {
  const { drone } = useParams();
  const decodedName = decodeURIComponent(drone);

  const droneInfo = droneData[decodedName];

  if (!droneInfo) {
    return <h2 style={{ padding: "20px" }}>Drone data not found</h2>;
  }

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % droneInfo.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [decodedName, droneInfo.images.length]);

  return (
    <div className="kb-main-page light-theme">
      <div className="kb-drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{decodedName}</h1>
          <p className="hero-subtitle">{droneInfo.subtitle}</p>
          <button className="hero-btn">Explore More</button>
        </div>

        <div className="hero-image-wrapper">
          {droneInfo.images.map((img, index) => (
            <img
              key={index}
              src={img}
              className={`hero-image ${index === current ? "active" : ""}`}
            />
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-text">
          <h2>About the Drone</h2>
          <p>
            This drone is designed for efficient aerial spraying, mapping, and
            analysis.
          </p>
        </div>

        <img
          src="https://dronelife.com/wp-content/uploads/2022/12/Garuda-Aerospace-Agri-drone.png"
          className="about-image"
        />
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <FaWifi className="step-icon" />
            <h4>1. Connect</h4>
            <p>Link your controller or mobile.</p>
          </div>

          <div className="step-card">
            <FaMicrochip className="step-icon" />
            <h4>2. Calibrate</h4>
            <p>AI adjusts sensors.</p>
          </div>

          <div className="step-card">
            <FaPlay className="step-icon" />
            <h4>3. Launch</h4>
            <p>Start automated missions.</p>
          </div>

          <div className="step-card">
            <FaCogs className="step-icon" />
            <h4>4. Analyze</h4>
            <p>View insights.</p>
          </div>
        </div>
      </section>

      <section className="manual-section">
        <div className="manual-content">
          <h2>Drone Manual & Guide</h2>
          <p>Watch video or download PDF.</p>

          <a href={droneInfo.manualPDF} className="download-btn">
            <FaDownload /> Download Manual
          </a>
        </div>

        <div className="manual-video">
          <iframe src={droneInfo.manualVideo} allowFullScreen></iframe>
        </div>
      </section>
    </div>
  );
}
