import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../CSS/Client/viewdrone.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";
import { format } from "date-fns";

const ViewDrone = () => {
  const { droneId } = useParams();
  const [drone, setDrone] = useState(null);
  const [image, setImage] = useState("");
  const [manualLogs, setManualLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch drone registration details
        const resDrone = await fetch(
          `${config.baseURL}/drone_registration/${droneId}/`,
        );
        const droneData = await resDrone.json();

        // 2️⃣ Fetch ALL drone images
        const resImages = await fetch(`${config.baseURL}/drone_images/`);
        const imagesData = await resImages.json();

        const latestClient =
          droneData.client && droneData.client.length > 0
            ? droneData.client[droneData.client.length - 1]
            : null;

        const droneName =
          latestClient?.model_name || droneData.model_name || "";

        // 3️⃣ Match image by model name
        const matchedImage = imagesData.find((img) => img.name === droneName);

        setDrone(droneData);
        setImage(matchedImage?.image || "");
      } catch (err) {
        console.error("Error fetching drone data:", err);
      }
    };

    fetchData();
  }, [droneId]);

  

  if (!drone) return <p>Loading drone...</p>;

  const latestClient =
    drone.client && drone.client.length > 0
      ? drone.client[drone.client.length - 1]
      : {};

  const calculateDuration = (start, end) => {
    if (!start || !end) return "";

    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);

    if (endTime <= startTime) return "";

    const diffMs = endTime - startTime;
    const minutes = Math.floor(diffMs / 60000);
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const addLogRow = () => {
    setManualLogs((prev) => [
      ...prev,
      {
        date: getTodayDate(),
        start_time: "",
        end_time: "",
        duration: "",
        remarks: "",
      },
    ]);
  };

  const handleLogChange = (index, field, value) => {
    const updatedLogs = [...manualLogs];
    updatedLogs[index][field] = value;

    if (field === "start_time" || field === "end_time") {
      updatedLogs[index].duration = calculateDuration(
        updatedLogs[index].start_time,
        updatedLogs[index].end_time,
      );
    }

    setManualLogs(updatedLogs);
  };

  const formatDate = (date) => {
    return date ? format(new Date(date), "dd-MM-yyyy") : "";
  };

  const handleSaveLogs = () => {
    console.log("Saved Flight Logs:", manualLogs);
    alert("Flight logs saved (frontend only)");
  };

  const handleCancelLogs = (index) => {
    setManualLogs((prevLogs) => prevLogs.filter((_, i) => i !== index));
  };

  

  return (
    <div className="drone-details-page">
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs title="View Drone" />
      </div>

      {/* ✅ Main Drone Image */}
      <img
        src={image || "/no-image.png"}
        alt={latestClient.model_name || drone.model_name}
        className="drone-bg-image"
        onError={(e) => {
          e.target.src = "/no-image.png";
        }}
      />

      <div className="drone-card-header">
        <h2 className="drone-title">
          {latestClient.model_name || drone.model_name} - Drone Details
        </h2>
      </div>

      <div className="drone-main-content">
        <div className="drone-info-grid">
          <div className="info-row">
            <div>
              <strong>Drone Type:</strong>{" "}
              {latestClient.drone_type || drone.drone_type}
            </div>
            <div>
              <strong>Model Name:</strong>{" "}
              {latestClient.model_name || drone.model_name}
            </div>
          </div>

          <div className="info-row">
            <div>
              <strong>UIN:</strong>{" "}
              {latestClient.uin_number || drone.uin_number}
            </div>
            <div>
              <strong>Drone Serial Number:</strong>{" "}
              {latestClient.drone_serial_number || drone.drone_serial_number}
            </div>
          </div>

          <div className="info-row">
            <div>
              <strong>Flight Controller:</strong>{" "}
              {latestClient.flight_controller_serial_number ||
                drone.flight_controller_serial_number}
            </div>
            <div>
              <strong>Remote Controller:</strong>{" "}
              {latestClient.remote_controller || drone.remote_controller}
            </div>
          </div>

          <div className="info-row">
            <div>
              <strong>Battery 1:</strong>{" "}
              {latestClient.battery_serial_number_1 ||
                drone.battery_serial_number_1}
            </div>
            <div>
              <strong>Battery 2:</strong>{" "}
              {latestClient.battery_serial_number_2 ||
                drone.battery_serial_number_2}
            </div>
          </div>

          <div className="info-row">
            <div>
              <strong>Battery Charger:</strong>{" "}
              {latestClient.battery_charger_serial_number ||
                drone.battery_charger_serial_number}
            </div>
          </div>

          <div className="info-row">
            <div>
              <strong>Attachment:</strong>{" "}
              {latestClient.attachment || drone.attachment ? (
                <a
                  href={latestClient.attachment || drone.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Attachment
                </a>
              ) : (
                <span>No Attachment</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FLIGHT LOG SECTION */}
      <div className="flight-log-section">
        <div className="flight-log-header">
          <h3>Flight Log Data</h3>
          <button className="add-log-btn" onClick={addLogRow}>
            + Add Log
          </button>
        </div>
        <div className="flight-log-table-wrapper">
          <table className="flight-log-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Total Duration</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {manualLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No flight logs added
                  </td>
                </tr>
              ) : (
                manualLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formatDate(log.date)}</td>

                    <td>
                      <input
                        type="time"
                        value={log.start_time}
                        onChange={(e) =>
                          handleLogChange(index, "start_time", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="time"
                        value={log.end_time}
                        onChange={(e) =>
                          handleLogChange(index, "end_time", e.target.value)
                        }
                      />
                    </td>

                    <td>{log.duration || "--"}</td>

                    <td>
                      <input
                        type="text"
                        placeholder="Remarks"
                        value={log.remarks}
                        onChange={(e) =>
                          handleLogChange(index, "remarks", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <button className="save-log-btn" onClick={handleSaveLogs}>
                        Save
                      </button>
                      <button
                        className="cancel-log-btn"
                        onClick={() => handleCancelLogs(index)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewDrone;
