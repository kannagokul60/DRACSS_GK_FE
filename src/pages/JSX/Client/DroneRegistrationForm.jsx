import { useState, useEffect } from "react";
import { FaPlus, FaPaperclip, FaTimes } from "react-icons/fa";
import "../../CSS/Client/DroneRegistrationForm.css";

export default function DroneRegistrationForm({ drone, onClose, onSubmit, viewOnly }) {
  // Form state
  const [formData, setFormData] = useState({
    modelName: "",
    type: "",
    manufacturer: "",
    uin: "",
    droneSerial: "",
    flightController: "",
    remoteController: "",
    batteryCharger: "",
    battery1: "",
    battery2: "",
    attachment: "",
    remarks: "",
  });

  // Prefill if drone exists
  useEffect(() => {
    if (drone) {
      setFormData({
        modelName: drone.modelName || "",
        type: drone.type || "",
        manufacturer: drone.manufacturer || "",
        uin: drone.uin || "",
        droneSerial: drone.droneSerial || "",
        flightController: drone.flightController || "",
        remoteController: drone.remoteController || "",
        batteryCharger: drone.batteryCharger || "",
        battery1: drone.battery1 || "",
        battery2: drone.battery2 || "",
        attachment: drone.attachment || "",
        remarks: drone.status === "Rejected" ? drone.remarks || "" : "",
      });
    } else {
      setFormData({
        modelName: "",
        type: "",
        manufacturer: "",
        uin: "",
        droneSerial: "",
        flightController: "",
        remoteController: "",
        batteryCharger: "",
        battery1: "",
        battery2: "",
        attachment: "",
        remarks: "",
      });
    }
  }, [drone]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="drone-registration-wrapper">
      <div className="drone-registration-card">
        <div className="form-header">
          <h2 className="form-title">{drone ? "Drone Details" : "Drone Registration"}</h2>
          <FaTimes className="close-icon" onClick={onClose} title="Close" />
        </div>

        <form className="drone-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/** Form fields */}
            <div className="form-group">
              <label>Model Name</label>
              <input
                type="text"
                name="modelName"
                value={formData.modelName}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter model name"
              />
            </div>

            <div className="form-group">
              <label>Drone Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter drone type"
              />
            </div>

            <div className="form-group">
              <label>Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter manufacturer"
              />
            </div>

            <div className="form-group">
              <label>UIN Number</label>
              <input
                type="text"
                name="uin"
                value={formData.uin}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter UIN number"
              />
            </div>

            <div className="form-group">
              <label>Drone Serial Number</label>
              <input
                type="text"
                name="droneSerial"
                value={formData.droneSerial}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter serial number"
              />
            </div>

            <div className="form-group">
              <label>Flight Controller Serial Number</label>
              <input
                type="text"
                name="flightController"
                value={formData.flightController}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter controller serial"
              />
            </div>

            <div className="form-group">
              <label>Remote Controller</label>
              <input
                type="text"
                name="remoteController"
                value={formData.remoteController}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter remote controller"
              />
            </div>

            <div className="form-group">
              <label>Battery Charger Serial Number</label>
              <input
                type="text"
                name="batteryCharger"
                value={formData.batteryCharger}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter charger serial"
              />
            </div>

            <div className="form-group">
              <label>Battery Serial Number 1</label>
              <input
                type="text"
                name="battery1"
                value={formData.battery1}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter battery serial"
              />
            </div>

            <div className="form-group">
              <label>Battery Serial Number 2</label>
              <input
                type="text"
                name="battery2"
                value={formData.battery2}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter battery serial"
              />
            </div>

            <div className="form-group attachment">
              <label>Attachment</label>
              <div className="attach-field">
                <input
                  type="text"
                  name="attachment"
                  value={formData.attachment}
                  onChange={handleChange}
                  readOnly={viewOnly}
                  placeholder="Attach document"
                />
                <FaPaperclip className="attach-icon" />
              </div>
            </div>

            {drone?.status === "Rejected" && (
              <div className="form-group">
                <label>Rejection Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  readOnly={viewOnly}
                  placeholder="Why was this drone rejected?"
                />
              </div>
            )}
          </div>

          {!viewOnly && (
            <div className="form-actions">
             
              <div>
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* {viewOnly && (
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Close
              </button>
            </div>
          )} */}
        </form>
      </div>
    </div>
  );
}
