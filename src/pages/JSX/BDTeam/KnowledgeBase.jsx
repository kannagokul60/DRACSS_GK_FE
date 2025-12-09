import React, { useState, useEffect } from "react";
import "../../CSS/BDTeam/knowledgeBase.css";
import { FaArrowRight, FaPlus } from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";
import { useNavigate } from "react-router-dom";
import config from "../../../config";

export default function KnowledgeBase() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [uploadPopup, setUploadPopup] = useState(false);

  const [selectedDrone, setSelectedDrone] = useState(null);
  const [kbItems, setKbItems] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  // Add Drone form
  const [newDrone, setNewDrone] = useState({
    name: "",
    image: null,
  });

  // Upload Extra Data
  const [extraData, setExtraData] = useState({
    specification: {
      weight: "",
      dimensions: "",
      speed: "",
      takeoff_altitude: "",
      flight_time: "",
      flight_distance: "",
    },
    tutorial_video: null,
    troubleshooting_video: null,
  });

  // Load Drone List
  useEffect(() => {
    loadDroneList();
  }, []);

  const loadDroneList = async () => {
    try {
      const res = await fetch(`${config.baseURL}/drone_images/`);
      const data = await res.json();
      setKbItems(data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  // Handle Add Drone Input
  const handleNewDroneChange = (e) => {
    const { name, value, files } = e.target;
    setNewDrone((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Save New Drone (Name + Image)
  const saveNewDrone = async () => {
    if (!newDrone.name) return alert("Enter drone name");

    const fd = new FormData();
    fd.append("name", newDrone.name);
    if (newDrone.image) fd.append("image", newDrone.image);

    try {
      const res = await fetch(`${config.baseURL}/drone_images/`, {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        setShowPopup(false);
        setNewDrone({ name: "", image: null });
        loadDroneList();
      } else {
        alert("Failed to add drone!");
      }
    } catch (error) {
      console.error("Add Drone Error:", error);
    }
  };

  // Handle Extra Data Change
  const handleExtraChange = (e, isSpec = false) => {
    const { name, value, files } = e.target;

    if (isSpec) {
      setExtraData((prev) => ({
        ...prev,
        specification: {
          ...prev.specification,
          [name]: value,
        },
      }));
    } else {
      setExtraData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const saveExtraData = async () => {
    if (!selectedDrone) return;

    const specToSend = Object.fromEntries(
      Object.entries(extraData.specification).filter(
        ([_, v]) => v && v.trim() !== ""
      )
    );

    if (
      Object.keys(specToSend).length === 0 &&
      !extraData.tutorial_video &&
      !extraData.troubleshooting_video
    ) {
      alert("Please upload at least one field");
      return;
    }

    const fd = new FormData();
    if (Object.keys(specToSend).length > 0) {
      fd.append("specification", JSON.stringify(specToSend));
    }

    if (extraData.tutorial_video)
      fd.append("tutorial_video", extraData.tutorial_video);
    if (extraData.troubleshooting_video)
      fd.append("troubleshooting_video", extraData.troubleshooting_video);

    try {
      setUploadStatus("Uploading…");

      const res = await fetch(
        `${config.baseURL}/drone_images/${selectedDrone.id}/`,
        {
          method: "PATCH",
          body: fd,
        }
      );

      if (res.ok) {
        setUploadStatus("Uploaded Successfully ✔");

        setTimeout(() => {
          setUploadPopup(false);
          setUploadStatus("");
        }, 1200);

        setExtraData({
          specification: {
            weight: "",
            dimensions: "",
            speed: "",
            takeoff_altitude: "",
            flight_time: "",
            flight_distance: "",
          },
          tutorial_video: null,
          troubleshooting_video: null,
        });

        loadDroneList();
      } else {
        setUploadStatus("Upload Failed ✘");
        console.error("Response Status:", res.status);
      }
    } catch (error) {
      setUploadStatus("Upload Failed ✘");
      console.error("Upload Error:", error);
    }
  };

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

      {/* Drone Cards */}
      <div className="kb-grid">
        {kbItems.map((item) => (
          <div key={item.id} className="kb-card glass-style">
            <button
              className="kb-card-add-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDrone(item);

                // Prefill extraData with existing specification
                setExtraData({
                  specification: {
                    weight: item.specification?.weight || "",
                    dimensions: item.specification?.dimensions || "",
                    speed: item.specification?.speed || "",
                    takeoff_altitude:
                      item.specification?.takeoff_altitude || "",
                    flight_time: item.specification?.flight_time || "",
                    flight_distance: item.specification?.flight_distance || "",
                  },
                  tutorial_video: null,
                  troubleshooting_video: null,
                });

                setUploadPopup(true);
              }}
            >
              <FaPlus />
            </button>

            <div
              className="kb-image-wrapper"
              onClick={() =>
                navigate(`/bd/knowledge/${encodeURIComponent(item.name)}`)
              }
            >
              <img src={item.image} alt={item.name} className="kb-image" />
              <div className="kb-overlay">
                <h3 className="kb-card-title">{item.name} Manual</h3>
                <div className="kb-more">
                  <span>Explore More</span>
                  <FaArrowRight className="kb-more-icon" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD NEW DRONE POPUP */}
      {showPopup && (
        <div className="kb-popup-overlay">
          <div className="kb-popup">
            <h3>Add New Drone</h3>

            <input
              type="text"
              name="name"
              className="kb-input"
              value={newDrone.name}
              onChange={handleNewDroneChange}
              placeholder="Enter Drone Name"
            />

            <label className="kb-file-label">
              Upload Drone Image
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleNewDroneChange}
                className="kb-file-input"
              />
            </label>

            <div className="kb-btn-row">
              <button className="kb-save" onClick={saveNewDrone}>
                Save Drone
              </button>
              <button className="kb-close" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD EXTRA INFO POPUP */}
      {uploadPopup && (
        <div className="kb-popup-overlay">
          <div className="kb-popup">
            <h3>Upload Extra Info for {selectedDrone?.name}</h3>

            <div className="spec-inputs">
              {Object.keys(extraData.specification).map((key) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  value={extraData.specification[key]}
                  onChange={(e) => handleExtraChange(e, true)}
                  placeholder={key.replace("_", " ")}
                  className="kb-input"
                />
              ))}
            </div>

            <label className="kb-file-label">
              Upload Tutorial Video
              <input
                type="file"
                name="tutorial_video"
                accept="video/*"
                onChange={handleExtraChange}
                className="kb-file-input"
              />
              {extraData.tutorial_video && (
                <p className="file-name">{extraData.tutorial_video.name}</p>
              )}
            </label>

            <label className="kb-file-label">
              Upload Troubleshooting Video
              <input
                type="file"
                name="troubleshooting_video"
                accept="video/*"
                onChange={handleExtraChange}
                className="kb-file-input"
              />
              {extraData.troubleshooting_video && (
                <p className="file-name">
                  {extraData.troubleshooting_video.name}
                </p>
              )}
            </label>

            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

            <div className="kb-btn-row">
              <button className="kb-save" onClick={saveExtraData}>
                Save
              </button>
              <button
                className="kb-close"
                onClick={() => {
                  setUploadPopup(false);
                  setUploadStatus("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
