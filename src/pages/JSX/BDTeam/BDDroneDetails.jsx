import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumbs from "../BreadCrumbs";
import { FaPlus } from "react-icons/fa";
import "../../CSS/BDTeam/bdDroneDetails.css";
import config from "../../../config";

export default function BDDroneDetails() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [unsoldCounts, setUnsoldCounts] = useState({});
  const [soldCounts, setSoldCounts] = useState({});
  const [addPopup, setAddPopup] = useState(false);
  const [droneImages, setDroneImages] = useState([]);

  useEffect(() => {
  fetchDroneImages();
}, []);

const fetchDroneImages = async () => {
  try {
    const res = await fetch(`${config.baseURL}/drone_images/`);
    const data = await res.json();
    setDroneImages(data);
  } catch (error) {
    console.error("Error loading drone images", error);
  }
};


useEffect(() => {
  if (droneImages.length > 0) {
    loadCounts();
  }
}, [droneImages]);


const loadCounts = async () => {
  try {
    const res = await fetch(`${config.baseURL}/drone_registration/`);
    const data = await res.json();

    const unsoldResult = {};
    const soldResult = {};

    droneImages.forEach((d) => {
      const unsold = data.filter(
        (item) => item.registered === false && item.model_name === d.name
      );

      const sold = data.filter(
        (item) => item.registered === true && item.model_name === d.name
      );

      unsoldResult[d.name] = unsold.length;
      soldResult[d.name] = sold.length;
    });

    setUnsoldCounts(unsoldResult);
    setSoldCounts(soldResult);

  } catch (err) {
    console.error("Count load error", err);
  }
};


  const [form, setForm] = useState({
    model_name: "",
    uin_number: "",
    drone_serial_number: "",
    flight_controller_serial_number: "",
    remote_controller: "",
    battery_charger_serial_number: "",
    battery_serial_number_1: "",
    battery_serial_number_2: "",
    attachment: null,
  });
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, attachment: e.target.files[0] });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      for (const key in form) {
        if (form[key]) formData.append(key, form[key]);
      }

      // If backend expects "registered"
      formData.append("registered", false);

      const res = await fetch(`${config.baseURL}/drone_registration/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (!res.ok) {
        alert("Failed to save: " + JSON.stringify(data));
        return;
      }

      alert("Drone Registered Successfully!");
      setShowPopup(false);
    } catch (error) {
      console.log("Error:", error);
      alert("Error while saving");
    }
  };

  const handleViewDetails = (drone) => {
    navigate(`/bd/drone-details/${drone.id}`, { state: { drone } });
  };

  const [unsoldCount, setUnsoldCount] = useState(0);

  useEffect(() => {
    fetchUnsoldCount();
  }, []);

  const fetchUnsoldCount = async (droneName) => {
    const res = await fetch(`${config.baseURL}/drone_registration/`);
    const data = await res.json();

    // Filter unsold drones for THIS MODEL only
    const unsold = data.filter(
      (d) => d.registered === false && d.model_name === droneName
    );

    return unsold.length;
  };

  const [addForm, setAddForm] = useState({
  name: "",
  image: null,
});

const handleAddInput = (e) => {
  setAddForm({ ...addForm, [e.target.name]: e.target.value });
};

const handleAddFile = (e) => {
  setAddForm({ ...addForm, image: e.target.files[0] });
};

const handleAddDrone = async () => {
  try {
    const formData = new FormData();
    formData.append("name", addForm.name);
    if (addForm.image) formData.append("image", addForm.image);

    const res = await fetch(`${config.baseURL}/drone_images/`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to upload: " + JSON.stringify(data));
      return;
    }

    alert("Drone Image Added Successfully!");

    // 🔥 ADD NEW DRONE IMAGE DIRECTLY INTO STATE (Instant UI update)
    setDroneImages((prev) => [...prev, data]);

    setAddPopup(false);
    setAddForm({ name: "", image: null });
  } catch (err) {
    console.error(err);
    alert("Error uploading drone image");
  }
};


  return (
    <div className="bd-drone-container">
      <div className="bd-drone-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <div className="bd-drone-header-row">
        <h2 className="bd-drone-heading">Company Drone Fleet</h2>

        <button className="bd-add-main-btn" onClick={() => setAddPopup(true)}>
          + Add
        </button>
      </div>
      <div className="bd-drone-grid">
{droneImages.map((drone) => (
          <div key={drone.id} className="bd-drone-card">
            {/* --- NEW: + BUTTON INSIDE EACH CARD --- */}
            <button
              className="bd-add-card-btn"
              onClick={() => {
                setSelectedDrone(drone);
                setForm((prev) => ({ ...prev, model_name: drone.name })); // auto fill model
                setShowPopup(true);
              }}
            >
              <FaPlus size={14} />
            </button>

            <div className="bd-drone-image-wrapper">
              <img
                src={drone.image}
                alt={drone.name}
                className="bd-drone-image"
              />
            </div>

            <div className="bd-drone-info">
              <h3 className="bd-drone-name">{drone.name}</h3>

              <div className="bd-drone-info-row">
                <button
                  className="info-sold-btn"
                  onClick={() =>
                    navigate("/bd/sold-drones", {
                      state: { droneName: drone.name }, // Pass only the model name
                    })
                  }
                >
                  Sold : {soldCounts[drone.name] || 0}
                </button>

                <button
                  className="info-unsold-btn"
                  onClick={() =>
                    navigate("/bd/unsold-drones", {
                      state: { droneName: drone.name }, // Pass only the model name
                    })
                  }
                >
                  Unsold : {unsoldCounts[drone.name] || 0}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="bd-popup-overlay">
          <div className="bd-popup">
            <h3>Add New Drone – {selectedDrone?.name}</h3>

            <div className="bd-popup-fields">
              <label>Drone Model</label>
              <input
                type="text"
                name="model_name"
                value={form.model_name}
                readOnly
              />

              <label>Drone Serial Number</label>
              <input
                type="text"
                name="drone_serial_number"
                placeholder="Enter Drone Serial Number"
                onChange={handleInputChange}
              />

              <label>UIN Number</label>
              <input
                type="text"
                name="uin_number"
                placeholder="Enter UIN Number"
                onChange={handleInputChange}
              />

              <label>Flight Controller Serial Number</label>
              <input
                type="text"
                name="flight_controller_serial_number"
                placeholder="Enter Flight Controller Serial Number"
                onChange={handleInputChange}
              />

              <label>Remote Controller Serial Number</label>
              <input
                type="text"
                name="remote_controller"
                placeholder="Enter Remote Controller Serial Number"
                onChange={handleInputChange}
              />

              <label>Battery Charger Serial Number</label>
              <input
                type="text"
                name="battery_charger_serial_number"
                placeholder="Enter Battery Charger Serial Number"
                onChange={handleInputChange}
              />

              <label>Battery Serial Number 1</label>
              <input
                type="text"
                name="battery_serial_number_1"
                placeholder="Enter Battery Serial Number 1"
                onChange={handleInputChange}
              />

              <label>Battery Serial Number 2</label>
              <input
                type="text"
                name="battery_serial_number_2"
                placeholder="Enter Battery Serial Number 2"
                onChange={handleInputChange}
              />

              <label>Attachments</label>
              <input
                type="file"
                name="attachment"
                onChange={handleFileChange}
              />
            </div>

            <div className="bd-popup-actions">
              <button className="bd-save-btn" onClick={handleSave}>
                Save
              </button>

              <button
                className="bd-cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

     {addPopup && (
  <div className="bd-popup-overlay">
    <div className="bd-popup">
      <h3>Add New Drone</h3>

      <div className="bd-popup-fields">
        <label>Upload Drone Image</label>
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleAddFile}
        />

        <label>Drone Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter drone name"
          value={addForm.name}
          onChange={handleAddInput}
        />
      </div>

      <div className="bd-popup-actions">
        <button className="bd-save-btn" onClick={handleAddDrone}>
          Submit
        </button>
        <button
          className="bd-cancel-btn"
          onClick={() => setAddPopup(false)}
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
