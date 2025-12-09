import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../CSS/BDTeam/viewknowledge.css";
import { FaPlay, FaDownload, FaCogs, FaWifi, FaMicrochip } from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

export default function ViewKnowledge() {
  const { drone } = useParams();
  const decodedName = decodeURIComponent(drone);

  const [droneInfo, setDroneInfo] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${config.baseURL}/drone_images/`);
        const data = await res.json();

        const matched = data.find((item) => item.name === decodedName);

        if (matched) {
          const imagesArray = [];
          if (matched.image) imagesArray.push(matched.image);

          setDroneInfo({
            ...matched,
            images: imagesArray,
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, [decodedName]);

  useEffect(() => {
    if (!droneInfo || !droneInfo.images || droneInfo.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % droneInfo.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [droneInfo]);

  if (!droneInfo) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div className="kb-main-page light-theme">
      <div className="kb-drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{droneInfo.name}</h1>
          <p className="hero-subtitle">Drone Information</p>
        </div>

        <div className="hero-image-wrapper">
          {droneInfo.images.map((img, index) => (
            <img
              key={index}
              src={img}
              className={`hero-image ${index === current ? "active" : ""}`}
              alt={droneInfo.name}
            />
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section">
        <div className="about-text">
          <h2>About the Drone</h2>
          <p>This drone is designed for advanced agricultural and industrial operations.</p>
        </div>

        <img src={droneInfo.image} className="about-image" alt="About drone" />
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <FaWifi className="step-icon" />
            <h4>1. Connect</h4>
            <p>Connect your controller or mobile app.</p>
          </div>

          <div className="step-card">
            <FaMicrochip className="step-icon" />
            <h4>2. Calibrate</h4>
            <p>Drone auto-calibrates sensors.</p>
          </div>

          <div className="step-card">
            <FaPlay className="step-icon" />
            <h4>3. Launch</h4>
            <p>Start autonomous missions.</p>
          </div>

          <div className="step-card">
            <FaCogs className="step-icon" />
            <h4>4. Analyze</h4>
            <p>View flight data & reports.</p>
          </div>
        </div>
      </section>

{droneInfo.specification && (
  <section className="spec-section">
    <h2 className="spec-title">
      Drone Specifications
    </h2>
    <div className="spec-cards">
      {(typeof droneInfo.specification === "string"
        ? Object.entries(JSON.parse(droneInfo.specification))
        : Object.entries(droneInfo.specification)
      ).map(([key, value]) => (
        <div key={key} className="spec-card">
          <h3 className="spec-key">{key.replace("_", " ")}</h3>
          <p className="spec-value">{value}</p>
        </div>
      ))}
    </div>
  </section>
)}


      {/* MANUAL + VIDEOS SECTION */}
      <section className="manual-section">
        <div className="manual-content">
          <h2>Drone Manual & Guide</h2>
          <p>Watch tutorial or troubleshooting video, or download manual.</p>

          <a href={droneInfo.manualPDF || "#"} className="download-btn">
            <FaDownload /> Download Manual
          </a>
        </div>

        <div className="manual-video">
          {droneInfo.tutorial_video && (
            <>
              <h3>Tutorial Video</h3>
              <video src={droneInfo.tutorial_video} controls />
            </>
          )}

          {droneInfo.troubleshooting_video && (
            <>
              <h3>Troubleshooting Video</h3>
              <video src={droneInfo.troubleshooting_video} controls />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
