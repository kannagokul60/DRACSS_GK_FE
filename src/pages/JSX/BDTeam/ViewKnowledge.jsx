import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../CSS/BDTeam/viewknowledge.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";
import { FaPlay, FaDownload, FaCogs, FaWifi, FaMicrochip } from "react-icons/fa";


export default function ViewKnowledge() {
  const { drone } = useParams();
  const decodedName = decodeURIComponent(drone);

  const [droneInfo, setDroneInfo] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showManualPopup, setShowManualPopup] = useState(false);
const [manualFiles, setManualFiles] = useState([]);


  // Fetch drone details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${config.baseURL}/drone_images/`);
        const data = await res.json();

        const matched = data.find((item) => item.name === decodedName);

        if (matched) {
          // Correct merging: main image + extra images
          const allImages = [
            matched.image,                   // main image (string)
            ...(matched.images?.map((i) => i.image) || []) // extract URLs
          ];

          setDroneInfo({
            ...matched,
            allImages, // store final array for slideshow
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, [decodedName]);

  // Auto slideshow
  useEffect(() => {
    if (!droneInfo || droneInfo.allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % droneInfo.allImages.length);
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

        {/* FIXED IMAGE SLIDER */}
        <div className="hero-image-wrapper">
          {droneInfo.allImages.map((url, index) => (
            <img
              key={index}
              src={url}
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

      {/* SPECIFICATIONS */}
      {droneInfo.specification && (
        <section className="spec-section">
          <h2 className="spec-title">Drone Specifications</h2>

          <div className="spec-cards">
            {Object.entries(droneInfo.specification).map(([key, value]) => (
              <div key={key} className="spec-card">
                <h3 className="spec-key">{key.replace("_", " ")}</h3>
                <p className="spec-value">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MANUAL + VIDEOS */}
      <section className="manual-section">
        <div className="manual-content">
          <h2>Drone Manual & Guide</h2>
          <p>Watch tutorial or troubleshooting video, or download manual.</p>

<a
  className="download-btn"
  onClick={() => {
    const files = droneInfo.attachments || []; // <-- FIXED HERE

    if (files.length === 1) {
      window.open(files[0].file, "_blank");
    } else if (files.length > 1) {
      setManualFiles(files);
      setShowManualPopup(true);
    } else {
      alert("No manual available");
    }
  }}
>
  <FaDownload /> Drone Manual
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
{showManualPopup && (
  <div className="manual-popup-overlay">
    <div className="manual-popup">

      {/* X Close Button */}
      <button
        className="popup-close-x"
        onClick={() => setShowManualPopup(false)}
      >
        ✕
      </button>

      <h3>Select Manual</h3>

      {manualFiles.map((file, idx) => (
        <div key={idx} className="manual-item">
          <button
            onClick={() => window.open(file.file, "_blank")}
            className="manual-link"
          >
            {file.title || `Manual ${idx + 1}`}
          </button>
        </div>
      ))}
    </div>
  </div>
)}


    </div>
  );
}
