import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../CSS/Client/viewdrone.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";

const ViewDrone = () => {
  const { droneId } = useParams();
  const [drone, setDrone] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drone details from drone_registration API
        const resDrone = await fetch(
          `${config.baseURL}/drone_registration/${droneId}/`
        );
        const droneData = await resDrone.json();

        // Fetch main image from drone_images API
        const resImage = await fetch(
          `${config.baseURL}/drone_images/${droneId}/`
        );
        const imageData = await resImage.json();

        setDrone(droneData);
        setImage(imageData.image); // main image from drone-images API
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

  return (
    <div className="drone-details-page">
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs title="View Drone" />
      </div>

      {/* Main image from drone-images API */}
      <img
        src={image}
        alt={latestClient.model_name || drone.model_name}
        className="drone-bg-image"
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

      {/* Flight Log Section */}
      {drone.flight_logs?.length > 0 && (
        <div className="flight-log-section">
          <h3>Flight Log Data</h3>
          <table className="flight-log-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Total Duration</th>
              </tr>
            </thead>
            <tbody>
              {drone.flight_logs.map((log, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{log.date}</td>
                  <td>{log.start_time}</td>
                  <td>{log.end_time}</td>
                  <td>{log.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewDrone;
