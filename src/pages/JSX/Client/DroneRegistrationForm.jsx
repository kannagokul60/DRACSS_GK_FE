import { useState, useEffect } from "react";
import { FaPaperclip, FaTimes } from "react-icons/fa";
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
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  // Prefill form if drone or client exists
  useEffect(() => {
    if (drone) {
      setFormData({
        model_name: client?.c_model_name || drone.model_name || "",
        drone_type: client?.c_drone_type || drone.drone_type || "",
        manufacturer: drone.manufacturer || "AERO 360",
        uin_number: client?.c_uin_number || "",
        drone_serial_number:
          client?.c_drone_serial_number || drone.drone_serial_number || "",
        flight_controller_serial_number:
          client?.c_flight_controller_serial_number ||
          drone.flight_controller_serial_number ||
          "",
        remote_controller:
          client?.c_remote_controller || drone.remote_controller || "",
        battery_charger_serial_number:
          client?.c_battery_charger_serial_number ||
          drone.battery_charger_serial_number ||
          "",
        battery_serial_number_1:
          client?.c_battery_serial_number_1 ||
          drone.battery_serial_number_1 ||
          "",
        battery_serial_number_2:
          client?.c_battery_serial_number_2 ||
          drone.battery_serial_number_2 ||
          "",
        attachment: client?.c_attachment || drone.attachment || null,
        remarks: drone?.remarks || "",
      });
    }
  }, [drone, client]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch all drones
      const res = await fetch(`${config.baseURL}/drone_registration/`);
      const existingDrones = await res.json();

      // Match serial number
      const matchingDrone = existingDrones.find(
        (d) =>
          String(d.drone_serial_number).trim() ===
          String(formData.drone_serial_number).trim()
      );

      if (!matchingDrone) {
        alert("Drone Serial Number not found in master list!");
        return;
      }

      // Prevent duplicate client
      const existingClient = (matchingDrone.client || []).find(
        (c) =>
          String(c.c_drone_serial_number).trim() ===
          String(formData.drone_serial_number).trim()
      );

      if (existingClient) {
        alert("This Serial Number is already registered for a client!");
        return;
      }

      // Prepare client object (NO FILE)
      const newClientEntry = {
        c_model_name: formData.model_name,
        c_drone_type: formData.drone_type || matchingDrone.drone_type,
        c_uin_number: formData.uin_number,
        c_drone_serial_number: formData.drone_serial_number,
        c_flight_controller_serial_number:
          formData.flight_controller_serial_number,
        c_remote_controller: formData.remote_controller,
        c_battery_charger_serial_number: formData.battery_charger_serial_number,
        c_battery_serial_number_1: formData.battery_serial_number_1,
        c_battery_serial_number_2: formData.battery_serial_number_2,
      };

      // Merge clients
      const updatedClientArray = [
        ...(matchingDrone.client || []),
        newClientEntry,
      ];

      // PATCH client JSON
      const clientUpdateRes = await fetch(
        `${config.baseURL}/drone_registration/${matchingDrone.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ client: updatedClientArray }),
        }
      );

      if (!clientUpdateRes.ok) {
        throw new Error("Failed to update client details");
      }

      //READ RESPONSE
      let updatedDrone = await clientUpdateRes.json();

      // PATCH attachment separately
      if (formData.attachment instanceof File) {
        const attachmentPayload = new FormData();
        attachmentPayload.append("c_attachment", formData.attachment);

        const attachmentRes = await fetch(
          `${config.baseURL}/drone_registration/${matchingDrone.id}/`,
          {
            method: "PATCH",
            body: attachmentPayload,
          }
        );

        if (!attachmentRes.ok) {
          throw new Error("Failed to upload attachment");
        }

        // VERY IMPORTANT: override with latest response
        updatedDrone = await attachmentRes.json();
      }

      // Success
      alert("Client registered successfully!");

      if (onSubmit) onSubmit(updatedDrone);
      onClose();
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
              {viewOnly ? (
                formData.attachment ? (
                  <a
                    href={formData.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Attachment
                  </a>
                ) : (
                  <span>No attachment</span>
                )
              ) : (
                <div className="attach-field">
                  <input
                    type="file"
                    name="attachment"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                  />
                  <FaPaperclip className="attach-icon" />
                </div>
              )}
            </div>
            {viewOnly && drone?.is_active === false && (
              <div className="form-group full-width">
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  readOnly
                ></textarea>
              </div>
            )}
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
