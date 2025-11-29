import { useState, useEffect } from "react";
import { FaPlus, FaPaperclip, FaTimes } from "react-icons/fa";
import "../../CSS/Client/DroneRegistrationForm.css";
import config from "../../../config";

export default function DroneRegistrationForm({
  drone,
  client,
  onClose,
  onSubmit,
  viewOnly,
}) {
  const [formData, setFormData] = useState({
    model_name: "",
    drone_type: "",
    manufacturer: "",
    uin_number: "",
    drone_serial_number: "",
    flight_controller_serial_number: "",
    remote_controller: "",
    battery_charger_serial_number: "",
    battery_serial_number_1: "",
    battery_serial_number_2: "",
    attachment: null,
  });

  const [loading, setLoading] = useState(false);

  // Prefill form if drone or client exists
  useEffect(() => {
    if (drone) {
      setFormData({
        model_name: client?.model_name || drone.model_name || "",
        drone_type: client?.drone_type || drone.drone_type || "",
        manufacturer: drone.manufacturer || "",
        uin_number: client?.uin_number || drone.uin_number || "",
        drone_serial_number: client?.drone_serial_number || drone.drone_serial_number || "",
        flight_controller_serial_number: client?.flight_controller_serial_number || drone.flight_controller_serial_number || "",
        remote_controller: client?.remote_controller || drone.remote_controller || "",
        battery_charger_serial_number: client?.battery_charger_serial_number || drone.battery_charger_serial_number || "",
        battery_serial_number_1: client?.battery_serial_number_1 || drone.battery_serial_number_1 || "",
        battery_serial_number_2: client?.battery_serial_number_2 || drone.battery_serial_number_2 || "",
        attachment: client?.attachment || drone.attachment || null,
      });
    }
  }, [drone, client]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${config.baseURL}/drone_registration/`);
      const existingDrones = await res.json();

      const matchingDrone = existingDrones.find(
        (d) => d.drone_serial_number === formData.drone_serial_number
      );

      if (matchingDrone) {
        // Prepare new client data
        const clientData = {
          model_name: formData.model_name,
          uin_number: formData.uin_number,
          drone_serial_number: formData.drone_serial_number,
          flight_controller_serial_number: formData.flight_controller_serial_number,
          remote_controller: formData.remote_controller,
          battery_charger_serial_number: formData.battery_charger_serial_number,
          battery_serial_number_1: formData.battery_serial_number_1,
          battery_serial_number_2: formData.battery_serial_number_2,
          drone_type: formData.drone_type,
        };

        const updatedClientArray = [...matchingDrone.client, clientData];

        // Use FormData for file upload
        const data = new FormData();
        data.append("client", JSON.stringify(updatedClientArray));
        data.append("drone_type", formData.drone_type);
        if (formData.attachment instanceof File) {
          data.append("attachment", formData.attachment);
        }

        const updateRes = await fetch(
          `${config.baseURL}/drone_registration/${matchingDrone.id}/`,
          {
            method: "PATCH",
            body: data,
          }
        );

        if (!updateRes.ok) throw new Error("Failed to update drone");
        const result = await updateRes.json();
        alert("Drone updated successfully!");
        if (onSubmit) onSubmit(result);
        onClose();
      } else {
        // New drone creation
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== "") data.append(key, value);
        });

        const createRes = await fetch(`${config.baseURL}/drone_registration/`, {
          method: "POST",
          body: data,
        });

        if (!createRes.ok) throw new Error("Failed to create new drone");
        const newDrone = await createRes.json();
        alert("New drone registered successfully!");
        if (onSubmit) onSubmit(newDrone);
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving drone. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drone-registration-wrapper">
      <div className="drone-registration-card">
        <div className="form-header">
          <h2 className="form-title">
            {drone ? "Drone Details" : "Drone Registration"}
          </h2>
          <FaTimes className="close-icon" onClick={onClose} title="Close" />
        </div>

        <form className="drone-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Model Name</label>
              <input
                type="text"
                name="model_name"
                value={formData.model_name}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter model name"
              />
            </div>

            <div className="form-group">
              <label>Drone Type</label>
              <input
                type="text"
                name="drone_type"
                value={formData.drone_type}
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
                name="uin_number"
                value={formData.uin_number}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter UIN number"
              />
            </div>

            <div className="form-group">
              <label>Drone Serial Number</label>
              <input
                type="text"
                name="drone_serial_number"
                value={formData.drone_serial_number}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter serial number"
              />
            </div>

            <div className="form-group">
              <label>Flight Controller Serial Number</label>
              <input
                type="text"
                name="flight_controller_serial_number"
                value={formData.flight_controller_serial_number}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter flight controller serial"
              />
            </div>

            <div className="form-group">
              <label>Remote Controller</label>
              <input
                type="text"
                name="remote_controller"
                value={formData.remote_controller}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter remote controller"
              />
            </div>

            <div className="form-group">
              <label>Battery Charger Serial Number</label>
              <input
                type="text"
                name="battery_charger_serial_number"
                value={formData.battery_charger_serial_number}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter charger serial"
              />
            </div>

            <div className="form-group">
              <label>Battery Serial Number 1</label>
              <input
                type="text"
                name="battery_serial_number_1"
                value={formData.battery_serial_number_1}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter battery serial 1"
              />
            </div>

            <div className="form-group">
              <label>Battery Serial Number 2</label>
              <input
                type="text"
                name="battery_serial_number_2"
                value={formData.battery_serial_number_2}
                onChange={handleChange}
                readOnly={viewOnly}
                placeholder="Enter battery serial 2"
              />
            </div>

            <div className="form-group attachment">
              <label>Attachment</label>
              <div className="attach-field">
                <input
                  type="file"
                  name="attachment"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  disabled={viewOnly}
                />
                <FaPaperclip className="attach-icon" />
              </div>
            </div>
          </div>

          {!viewOnly && (
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
