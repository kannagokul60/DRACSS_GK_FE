import React, { useEffect, useState } from "react";
import "../../CSS/Client/viewknowledge.css";
import {
  FaPlay,
  FaDownload,
  FaCogs,
  FaWifi,
  FaMicrochip,
} from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";

export default function ViewKnowledge() {
  //  Move hooks inside the component
  const images = [
    "https://vaimanikaaerospace.com/wp-content/uploads/2025/05/ImageForArticle_699_17197995980611328.webp",
    "https://hobitech.in/wp-content/uploads/2024/08/Untitled-design-9.png",
    "https://img.freepik.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_35913-2603.jpg?semt=ais_hybrid&w=740&q=80",
    "https://cropim.com/wp-content/uploads/2024/09/agreculter-drone-1024x692.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="kb-main-page light-theme">
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

   {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">BHUMI DRONE</h1>
          <p className="hero-subtitle">
            Precision Agriculture Drone for Smart Farming Solutions.
          </p>
          <button className="hero-btn">Explore More</button>
        </div>

        <div className="hero-image-wrapper">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className={`hero-image ${index === current ? "active" : ""}`}
            />
          ))}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="about-section">
        <div className="about-text">
          <h2>About the Drone</h2>
          <p>
            The Bhumi Drone is designed for efficient aerial spraying, mapping,
            and analysis. Built with AI sensors and autopilot control, it
            ensures high precision and consistency for every mission.
          </p>
        </div>
        <img
          src="https://dronelife.com/wp-content/uploads/2022/12/Garuda-Aerospace-Agri-drone.png"
          alt="About Drone"
          className="about-image"
        />
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <FaWifi className="step-icon" />
            <h4>1. Connect</h4>
            <p>Link your controller or mobile device via WiFi or radio.</p>
          </div>
          <div className="step-card">
            <FaMicrochip className="step-icon" />
            <h4>2. Calibrate</h4>
            <p>AI adjusts sensors, GPS, and flight patterns for precision.</p>
          </div>
          <div className="step-card">
            <FaPlay className="step-icon" />
            <h4>3. Launch</h4>
            <p>Start automated flight missions with real-time monitoring.</p>
          </div>
          <div className="step-card">
            <FaCogs className="step-icon" />
            <h4>4. Analyze</h4>
            <p>Gather crop data and insights directly from the dashboard.</p>
          </div>
        </div>
      </section>

      {/* ===== MANUAL & VIDEO ===== */}
      <section className="manual-section">
        <div className="manual-content">
          <h2>Drone Manual & Guide</h2>
          <p>
            Watch the quick start video or download the full manual to learn
            setup, operation, and maintenance procedures.
          </p>
          <a href="#" className="download-btn">
            <FaDownload /> Download Manual
          </a>
        </div>
        <div className="manual-video">
          <iframe
            src="https://www.youtube.com/embed/Dn7Q4oIrP3I?si=Z8IbaWX_f2MEoOBX"
            title="Drone Manual Video"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* ===== JOYSTICK CONTROLS ===== */}
      <section className="controls-section">
        <h2>Joystick Controls</h2>
        <div className="controls-grid">
          <div className="control-card">↑ Ascend</div>
          <div className="control-card">↓ Descend</div>
          <div className="control-card">← Rotate Left</div>
          <div className="control-card">→ Rotate Right</div>
          <div className="control-card">⭢ Forward</div>
          <div className="control-card">⭠ Backward</div>
        </div>
      </section>

      {/* ===== PRODUCT CONFIGURATION ===== */}
      <section className="config-section">
        <h2>Product Configuration</h2>
        <div className="config-grid">
          <div className="config-card">
            <h4>Battery</h4>
            <p>6000 mAh Lithium Polymer</p>
          </div>
          <div className="config-card">
            <h4>Flight Time</h4>
            <p>Up to 45 minutes</p>
          </div>
          <div className="config-card">
            <h4>Range</h4>
            <p>Up to 10 km</p>
          </div>
          <div className="config-card">
            <h4>Payload Capacity</h4>
            <p>15 kg</p>
          </div>
          <div className="config-card">
            <h4>Camera</h4>
            <p>4K Ultra-HD Sensor</p>
          </div>
          <div className="config-card">
            <h4>AI Module</h4>
            <p>Object & Crop Detection</p>
          </div>
        </div>
      </section>
    </div>
  );
}
