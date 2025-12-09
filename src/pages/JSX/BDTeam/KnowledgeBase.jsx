import React, { useState, useEffect } from "react";
import "../../CSS/BDTeam/knowledgeBase.css";
import {
  FaEdit,
  FaChevronRight,
  FaChevronLeft,
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
} from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";
import { useNavigate } from "react-router-dom";
import config from "../../../config";

export default function KnowledgeBase() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [uploadPopup, setUploadPopup] = useState(false);

  const [kbItems, setKbItems] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);

  const [uploadStatus, setUploadStatus] = useState("");
  const [sliderIndex, setSliderIndex] = useState(0);

  // ---------------- NEW DRONE -----------------
  const [newDrone, setNewDrone] = useState({
    name: "",
    image: null,
  });

  // ---------------- EXTRA DATA POPUP ----------------
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
    images: [],
  });

  // -------------------------------------------------------
  // LOAD DRONES LIST
  // -------------------------------------------------------
  useEffect(() => {
    loadDroneList();
  }, []);

  const loadDroneList = async () => {
    try {
      const res = await fetch(`${config.baseURL}/drone_images/`);
      const data = await res.json();

      const parsed = data.map((item) => ({
        ...item,
        specification:
          typeof item.specification === "string"
            ? JSON.parse(item.specification)
            : item.specification || {},
      }));

      setKbItems(parsed);
    } catch (err) {
      console.error("Failed to load drones", err);
    }
  };

  // -------------------------------------------------------
  // ADD DRONE
  // -------------------------------------------------------
  const handleNewDroneChange = (e) => {
    const { name, value, files } = e.target;

    setNewDrone((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const saveNewDrone = async () => {
    if (!newDrone.name.trim()) return alert("Enter drone name");

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
        alert("Failed to add drone");
      }
    } catch (err) {
      console.error("Add drone error:", err);
    }
  };

  // -------------------------------------------------------
  // EXTRA DATA CHANGE HANDLERS
  // -------------------------------------------------------
  const handleExtraChange = (e, isSpec = false) => {
    const { name, value, files } = e.target;

    if (isSpec) {
      setExtraData((prev) => ({
        ...prev,
        specification: { ...prev.specification, [name]: value },
      }));
      return;
    }

    if (name === "images") {
      setExtraData((prev) => ({
        ...prev,
        images: [...files],
      }));
      return;
    }

    setExtraData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // -------------------------------------------------------
  // SAVE EXTRA DATA (PATCH)
  // -------------------------------------------------------
  const saveExtraData = async () => {
    if (!selectedDrone) return;

    try {
      let res;

      // If no files, send JSON
      if (
        !(
          extraData.tutorial_video instanceof File ||
          extraData.troubleshooting_video instanceof File ||
          extraData.images.length > 0
        )
      ) {
        // PATCH with JSON
        res = await fetch(
          `${config.baseURL}/drone_images/${selectedDrone.id}/`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              specification: extraData.specification,
            }),
          }
        );
      } else {
        // PATCH with FormData if files exist
        const fd = new FormData();
        fd.append("specification", JSON.stringify(extraData.specification));

        if (extraData.tutorial_video instanceof File) {
          fd.append("tutorial_video", extraData.tutorial_video);
        }

        if (extraData.troubleshooting_video instanceof File) {
          fd.append("troubleshooting_video", extraData.troubleshooting_video);
        }

        extraData.images.forEach((file) => fd.append("images_upload[]", file));

        res = await fetch(
          `${config.baseURL}/drone_images/${selectedDrone.id}/`,
          {
            method: "PATCH",
            body: fd,
          }
        );
      }

      if (!res.ok) {
        console.log(await res.text());
        setUploadStatus("Upload Failed ✘");
        return;
      }

      setUploadStatus("Uploaded Successfully ✔");
      await loadDroneList();

      setTimeout(() => {
        setUploadPopup(false);
        setUploadStatus("");
      }, 600);
    } catch (err) {
      console.error("PATCH error:", err);
      setUploadStatus("Upload Failed ✘");
    }
  };

  // -------------------------------------------------------
  // OPEN POPUP WITH MATCHING DATA
  // -------------------------------------------------------
  const openUploadPopup = async (item) => {
    try {
      const res = await fetch(`${config.baseURL}/drone_images/${item.id}/`);
      const drone = await res.json();

      const spec =
        typeof drone.specification === "string"
          ? JSON.parse(drone.specification)
          : drone.specification || {};

      setSelectedDrone(drone);

      setExtraData({
        specification: {
          weight: spec.weight || "",
          dimensions: spec.dimensions || "",
          speed: spec.speed || "",
          takeoff_altitude: spec.takeoff_altitude || "",
          flight_time: spec.flight_time || "",
          flight_distance: spec.flight_distance || "",
        },
        tutorial_video: null,
        troubleshooting_video: null,
        images: [],
      });

      setUploadPopup(true);
    } catch (err) {
      console.error("Popup error:", err);
    }
  };

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
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

      {/* DRONE CARDS */}
      <div className="kb-grid">
        {kbItems.map((item) => (
          <div key={item.id} className="kb-card glass-style">
            <button
              className="kb-card-add-btn"
              onClick={(e) => {
                e.stopPropagation();
                openUploadPopup(item);
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

      {/* ADD DRONE POPUP */}
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

      {uploadPopup && (
        <div className="kb-popup-overlay">
          <div className="kb-popup">
            <h3>Upload Extra Info for {selectedDrone?.name}</h3>

            <div className="slider-wrapper">
              <div className="nav-arrows-wrapper">
                {sliderIndex > 0 && (
                  <FaChevronLeft
                    className="nav-arrow left"
                    onClick={() => setSliderIndex((prev) => prev - 1)}
                  />
                )}
                {sliderIndex < 1 && (
                  <FaChevronRight
                    className="nav-arrow right"
                    onClick={() => setSliderIndex((prev) => prev + 1)}
                  />
                )}
              </div>
              <div className="slide-container">
                {sliderIndex === 0 && (
                  <div className="slide">
                    {Object.keys(extraData.specification).map((key) => (
                      <div key={key} className="spec-input-wrapper">
                        <label className="spec-label">
                          {key
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </label>
                        <input
                          type="text"
                          name={key}
                          value={extraData.specification[key]}
                          onChange={(e) => handleExtraChange(e, true)}
                          placeholder={key.replace("_", " ")}
                          className="kb-input"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {sliderIndex === 1 && (
                  <div className="slide">
                    {/* Tutorial Video */}
                    <label className="kb-file-label">
                      Upload Tutorial Video
                      <input
                        type="file"
                        name="tutorial_video"
                        accept="video/*"
                        onChange={handleExtraChange}
                        className="kb-file-input"
                      />
                    </label>
                    {extraData.tutorial_video && (
                      <ul className="file-name">
                        <li>
                          {extraData.tutorial_video.name ||
                            extraData.tutorial_video.url.split("/").pop()}
                          <span
                            className="remove-file"
                            onClick={() =>
                              setExtraData((prev) => ({
                                ...prev,
                                tutorial_video: null,
                              }))
                            }
                          >
                            ✖
                          </span>
                        </li>
                      </ul>
                    )}

                    {/* Troubleshooting Video */}
                    <label className="kb-file-label">
                      Upload Troubleshooting Video
                      <input
                        type="file"
                        name="troubleshooting_video"
                        accept="video/*"
                        onChange={handleExtraChange}
                        className="kb-file-input"
                      />
                    </label>
                    {extraData.troubleshooting_video && (
                      <ul className="file-name">
                        <li>
                          {extraData.troubleshooting_video.name ||
                            extraData.troubleshooting_video.url
                              .split("/")
                              .pop()}
                          <span
                            className="remove-file"
                            onClick={() =>
                              setExtraData((prev) => ({
                                ...prev,
                                troubleshooting_video: null,
                              }))
                            }
                          >
                            ✖
                          </span>
                        </li>
                      </ul>
                    )}

                    {/* Extra Images */}
                    <label className="kb-file-label">
                      Upload Extra Images
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleExtraChange}
                        className="kb-file-input"
                      />
                    </label>
                    {extraData.images.length > 0 && (
                      <ul className="file-name">
                        {extraData.images.map((img, i) => (
                          <li key={i}>
                            {img.name || img.url.split("/").pop()}
                            <span
                              className="remove-file"
                              onClick={() =>
                                setExtraData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_, index) => index !== i
                                  ),
                                }))
                              }
                            >
                              ✖
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

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
                  setSliderIndex(0);
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
