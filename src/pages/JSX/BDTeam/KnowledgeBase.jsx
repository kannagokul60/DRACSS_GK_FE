import React, { useState, useEffect } from "react";
import "../../CSS/BDTeam/knowledgeBase.css";
import {
  FaChevronRight,
  FaChevronLeft,
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
  const [newImages, setNewImages] = useState([]);

  const [newDrone, setNewDrone] = useState({
    name: "",
    image: null,
  });

  const truncateText = (text, maxLength = 25) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const [extraData, setExtraData] = useState({
    specification: {
      weight: "",
      dimensions: "",
      speed: "",
      takeoff_altitude: "",
      flight_time: "",
      flight_distance: "",
    },
    tutorial_videos: [],
    troubleshooting_videos: [],
    images: [],
    attachments: [], 
  });

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

  const getFileName = (file) => {
    if (!file) return "Unknown File";

    // If backend gives a URL string
    if (typeof file === "string") {
      return file.split("/").pop();
    }

    // If File object
    if (file.name) return file.name;

    return "Unknown File";
  };

  // handleExtraChange: unified and predictable
  const handleExtraChange = (e, isSpec = false) => {
    const { name, files, value } = e.target;

    if (isSpec) {
      setExtraData((prev) => ({
        ...prev,
        specification: { ...prev.specification, [name]: value },
      }));
      return;
    }

    // multiple files fields (we expect "images", "attachments", "tutorial_videos", "troubleshooting_videos")
    if (files && files.length) {
      const fileArray = Array.from(files);
      setExtraData((prev) => ({
        ...prev,
        [name]: prev[name] ? [...prev[name], ...fileArray] : fileArray,
      }));
      // keep newImages in sync if user used the 'images' field
      if (name === "images") {
        setNewImages((prev) => [...prev, ...fileArray]);
      }
      return;
    }

    // fallback for single value fields (not used often in extraData)
    setExtraData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveExtraData = async () => {
    if (!selectedDrone) return;

    try {
      const hasNewFiles =
        extraData.images.some((f) => f instanceof File) ||
        extraData.attachments.some((f) => f instanceof File) ||
        extraData.tutorial_videos.some((f) => f instanceof File) ||
        extraData.troubleshooting_videos.some((f) => f instanceof File);

      // 1) Update Specification Only
      if (!hasNewFiles) {
        const res = await fetch(
          `${config.baseURL}/drone_images/${selectedDrone.id}/`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ specification: extraData.specification }),
          }
        );

        if (!res.ok) {
          setUploadStatus("Upload Failed ✘");
          return;
        }

        setUploadStatus("Uploaded Successfully ✔");
        await loadDroneList();
        return;
      }

      // 2) PATCH base drone (specification)
      const fd = new FormData();
      fd.append("specification", JSON.stringify(extraData.specification));

      const patchRes = await fetch(
        `${config.baseURL}/drone_images/${selectedDrone.id}/`,
        { method: "PATCH", body: fd }
      );

      if (!patchRes.ok) {
        console.log(await patchRes.text());
        setUploadStatus("Upload Failed ✘");
        return;
      }

      // 3) Upload tutorial videos
      for (let file of extraData.tutorial_videos) {
        if (!(file instanceof File)) continue;

        const fd = new FormData();
        fd.append("video", file);
        fd.append("drone", selectedDrone.id);

        await fetch(`${config.baseURL}/drone_tutorial_videos/`, {
          method: "POST",
          body: fd,
        });
      }

      // 4) Upload troubleshooting videos
      for (let file of extraData.troubleshooting_videos) {
        if (!(file instanceof File)) continue;

        const fd = new FormData();
        fd.append("video", file);
        fd.append("drone", selectedDrone.id);

        await fetch(`${config.baseURL}/drone_troubleshooting_videos/`, {
          method: "POST",
          body: fd,
        });
      }

      // 5) Upload extra images
      for (let file of extraData.images) {
        if (!(file instanceof File)) continue;

        const fd = new FormData();
        fd.append("image", file);
        fd.append("drone", selectedDrone.id);

        await fetch(`${config.baseURL}/drone_extra_images/`, {
          method: "POST",
          body: fd,
        });
      }

      // 6) Upload attachments
      for (let file of extraData.attachments) {
        if (!(file instanceof File)) continue;

        const fd = new FormData();
        fd.append("file", file);
        fd.append("drone", selectedDrone.id);

        await fetch(`${config.baseURL}/drone_attachments/`, {
          method: "POST",
          body: fd,
        });
      }

      // 7) SUCCESS
      setUploadStatus("Uploaded Successfully ✔");
      await loadDroneList();

      setTimeout(() => {
        setUploadPopup(false);
        setUploadStatus("");
        setSliderIndex(0);
      }, 600);
    } catch (err) {
      console.error("PATCH error:", err);
      setUploadStatus("Upload Failed ✘");
    }
  };

  const openUploadPopup = async (item) => {
    try {
      const res = await fetch(`${config.baseURL}/drone_images/${item.id}/`);
      const drone = await res.json();

      const spec =
        typeof drone.specification === "string"
          ? JSON.parse(drone.specification)
          : drone.specification || {};

      setSelectedDrone(drone);

      // normalize existing media arrays into the same shape the UI expects
      setExtraData({
        specification: {
          weight: spec.weight || "",
          dimensions: spec.dimensions || "",
          speed: spec.speed || "",
          takeoff_altitude: spec.takeoff_altitude || "",
          flight_time: spec.flight_time || "",
          flight_distance: spec.flight_distance || "",
        },

        tutorial_videos: Array.isArray(drone.tutorial_videos)
          ? drone.tutorial_videos.map((v) => ({
              id: v.id,
              name: getFileName(v.video),
              url: v.video, // use full URL directly
            }))
          : [],

        troubleshooting_videos: Array.isArray(drone.troubleshooting_videos)
          ? drone.troubleshooting_videos.map((v) => ({
              id: v.id,
              name: getFileName(v.video),
              url: v.video,
            }))
          : [],

        images: Array.isArray(drone.images)
          ? drone.images.map((img) => ({
              id: img.id,
              name: getFileName(img.image),
              url: img.image.startsWith("http")
                ? img.image
                : config.baseURL + img.image,
            }))
          : [],

        attachments: Array.isArray(drone.attachments)
          ? drone.attachments.map((f) => ({
              id: f.id,
              name: getFileName(f.file),
              url: f.file, // use as-is because backend gives full URL
            }))
          : [],
      });

      setUploadPopup(true);
    } catch (err) {
      console.error("Popup error:", err);
    }
  };

  const confirmDelete = (message) => {
    return new Promise((resolve) => {
      const yes = window.confirm(message);
      resolve(yes);
    });
  };

  // UI render
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

      {/* UPLOAD/EDIT POPUP */}
      {uploadPopup && (
        <div className="kb-popup-overlay">
          <div className="kb-popup">
            <h3>Additional Info for {selectedDrone?.name}</h3>

            <div className="slider-wrapper">
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
                          value={extraData.specification[key] || ""}
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
                    {/* Tutorial Videos */}
                    <label className="kb-file-label">
                      Upload Tutorial Videos
                      <input
                        type="file"
                        name="tutorial_videos"
                        accept="video/*"
                        multiple
                        onChange={handleExtraChange}
                        className="kb-file-input"
                      />
                    </label>

                    {(extraData.tutorial_videos || []).length > 0 && (
                      <ul className="file-name">
                        {extraData.tutorial_videos.map((file, i) => (
                          <li key={i}>
                            {file.url ? (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="view-link"
                                title={file.name || file.url.split("/").pop()} // show full name on hover
                              >
                                {truncateText(
                                  file.name || file.url.split("/").pop()
                                )}
                              </a>
                            ) : (
                              <span title={file.name}>
                                {truncateText(file.name)}
                              </span>
                            )}

                            <span
                              className="remove-file"
                              onClick={async () => {
                                const ok = await confirmDelete(
                                  "Delete this tutorial video?"
                                );
                                if (!ok) return;

                                if (file.id) {
                                  await fetch(
                                    `${config.baseURL}/drone_tutorial_videos/${file.id}/`,
                                    { method: "DELETE" }
                                  );
                                }

                                setExtraData((prev) => ({
                                  ...prev,
                                  tutorial_videos: prev.tutorial_videos.filter(
                                    (_, idx) => idx !== i
                                  ),
                                }));
                              }}
                            >
                              ✖
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Troubleshooting Videos (multiple) */}
                    <label className="kb-file-label">
                      Upload Troubleshooting Videos
                      <input
                        type="file"
                        name="troubleshooting_videos"
                        accept="video/*"
                        multiple
                        onChange={handleExtraChange}
                        className="kb-file-input"
                      />
                    </label>

                    {(extraData.troubleshooting_videos || []).length > 0 && (
                      <ul className="file-name">
                        {extraData.troubleshooting_videos.map((file, i) => (
                          <li key={i}>
                            {file.url ? (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="view-link"
                                title={file.name || file.url.split("/").pop()} // full name on hover
                              >
                                {truncateText(
                                  file.name || file.url.split("/").pop()
                                )}
                              </a>
                            ) : (
                              <span title={file.name}>
                                {truncateText(file.name)}
                              </span>
                            )}

                            <span
                              className="remove-file"
                              onClick={async () => {
                                const ok = await confirmDelete(
                                  "Delete this troubleshooting video?"
                                );
                                if (!ok) return;

                                if (file.id) {
                                  await fetch(
                                    `${config.baseURL}/drone_troubleshooting_videos/${file.id}/`,
                                    { method: "DELETE" }
                                  );
                                }

                                setExtraData((prev) => ({
                                  ...prev,
                                  troubleshooting_videos:
                                    prev.troubleshooting_videos.filter(
                                      (_, idx) => idx !== i
                                    ),
                                }));
                              }}
                            >
                              ✖
                            </span>
                          </li>
                        ))}
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

                    {(extraData.images || []).length > 0 && (
                      <ul className="file-name">
                        {extraData.images.map((img, i) => (
                          <li key={i}>
                            <a
                              href={img.url || URL.createObjectURL(img)}
                              target="_blank"
                              rel="noreferrer"
                              className="view-link"
                            >
                              {img.name || img.url?.split("/").pop()}
                            </a>

                            <span
                              className="remove-file"
                              onClick={async () => {
                                const ok = await confirmDelete(
                                  "Delete this image?"
                                );
                                if (!ok) return;

                                // delete only if existing
                                if (img.id) {
                                  await fetch(
                                    `${config.baseURL}/drone_extra_images/${img.id}/`,
                                    { method: "DELETE" }
                                  );
                                }

                                setExtraData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_, idx) => idx !== i
                                  ),
                                }));
                              }}
                            >
                              ✖
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Attachments */}
                    <label className="kb-file-label">
                      Upload Attachments
                      <input
                        type="file"
                        name="attachments"
                        multiple
                        onChange={handleExtraChange}
                        className="kb-file-input"
                      />
                    </label>

                    {(extraData.attachments || []).length > 0 && (
                      <ul className="file-name">
                        {extraData.attachments.map((f, i) => (
                          <li key={i}>
                            <a
                              href={f.url || URL.createObjectURL(f)}
                              target="_blank"
                              rel="noreferrer"
                              className="view-link"
                            >
                              {f.name || f.url?.split("/").pop()}
                            </a>

                            <span
                              className="remove-file"
                              onClick={async () => {
                                const ok = await confirmDelete(
                                  "Delete this attachment?"
                                );
                                if (!ok) return;

                                if (f.id) {
                                  await fetch(
                                    `${config.baseURL}/drone_attachments/${f.id}/`,
                                    {
                                      method: "DELETE",
                                    }
                                  );
                                }

                                setExtraData((prev) => ({
                                  ...prev,
                                  attachments: prev.attachments.filter(
                                    (_, idx) => idx !== i
                                  ),
                                }));
                              }}
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

              {/* Navigation arrows overlay */}
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
