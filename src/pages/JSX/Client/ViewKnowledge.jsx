import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../CSS/BDTeam/viewknowledge.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";
import { FaPlay, FaDownload } from "react-icons/fa";

export default function ViewKnowledge() {
  const { droneName } = useParams(); // match route param
  const decodedName = decodeURIComponent(droneName);

  const [droneInfo, setDroneInfo] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showManualPopup, setShowManualPopup] = useState(false);
  const [manualFiles, setManualFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${config.baseURL}/drone_images/`);
        const data = await res.json();

        const matched = data.find((item) => item.name === decodedName);
        if (matched) {
          const allImages = [
            matched.image,
            ...(matched.images?.map((i) => i.image) || []),
          ];

          setDroneInfo({
            ...matched,
            allImages,
            attachments: matched.attachments || [],
            tutorial_videos: matched.tutorial_videos || [],
            troubleshooting_videos: matched.troubleshooting_videos || [],
            controls: matched.controls || [],
            configuration: matched.configuration || {},
            description: matched.description || "No description available.",
          });
        } else {
          setDroneInfo({ notFound: true });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setDroneInfo({ error: true });
      }
    };
    fetchData();
  }, [decodedName]);

  // Slideshow
  useEffect(() => {
    if (!droneInfo?.allImages || droneInfo.allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % droneInfo.allImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [droneInfo]);

  if (!droneInfo) return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  if (droneInfo.notFound)
    return <h2 style={{ padding: "20px" }}>Drone not found.</h2>;
  if (droneInfo.error)
    return <h2 style={{ padding: "20px" }}>Error loading drone info.</h2>;

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
          {droneInfo.allImages.map((url, index) => (
            <img
              key={index}
              src={url.startsWith("http") ? url : config.baseURL + url}
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
          <p>
            This drone is designed for advanced agricultural and industrial
            operations.
          </p>
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

      {/* MANUALS */}
      <section className="manual-section">
        <div className="manual-content">
          <h2>Drone Manual & Guide</h2>
          {droneInfo.attachments.length > 0 ? (
            <a
              className="download-btn"
              onClick={() => {
                if (droneInfo.attachments.length === 1) {
                  window.open(droneInfo.attachments[0].file, "_blank");
                } else {
                  setManualFiles(droneInfo.attachments);
                  setShowManualPopup(true);
                }
              }}
            >
              <FaDownload /> Drone Manual
            </a>
          ) : (
            <p>No manuals available</p>
          )}
        </div>
      </section>

      {/* TUTORIAL VIDEOS */}
      {droneInfo.tutorial_videos.length > 0 && (
        <section className="video-section">
          <h2>Tutorial Videos</h2>
          <div className="video-grid">
            {droneInfo.tutorial_videos.map((v, idx) => (
              <div key={idx} className="video-card">
                <video controls src={v.video} />
                <p>{v.name || `Tutorial ${idx + 1}`}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TROUBLESHOOTING VIDEOS */}
      {droneInfo.troubleshooting_videos.length > 0 && (
        <section className="video-section">
          <h2>Troubleshooting Videos</h2>
          <div className="video-grid">
            {droneInfo.troubleshooting_videos.map((v, idx) => (
              <div key={idx} className="video-card">
                <video controls src={v.video} />
                <p>{v.name || `Troubleshooting ${idx + 1}`}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MANUAL POPUP */}
      {showManualPopup && (
        <div className="manual-popup-overlay">
          <div className="manual-popup">
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
