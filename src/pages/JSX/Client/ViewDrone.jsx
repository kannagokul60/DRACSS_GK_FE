import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaChevronRight,
  FaChevronLeft,
  FaArrowLeft,
} from "react-icons/fa";
import "../../CSS/viewdrone.css";
import BreadCrumbs from "../BreadCrumbs";

const ViewDrone = () => {
  const { droneName } = useParams();
  const navigate = useNavigate();

  // Sample drone list
  const drones = ["Bhumi V.1.0.1", "Vajra", "Agni"];

  const currentIndex = drones.findIndex(
    (name) => name.toLowerCase() === droneName.toLowerCase()
  );

  const prevDrone = currentIndex > 0 ? drones[currentIndex - 1] : null;
  const nextDrone =
    currentIndex < drones.length - 1 ? drones[currentIndex + 1] : null;

  const handleNextClick = () => {
    if (nextDrone) navigate(`/view-drone/${nextDrone}`);
  };

  const handlePrevClick = () => {
    if (prevDrone) navigate(`/view-drone/${prevDrone}`);
  };

  return (
    <div className="drone-details-page">
      
      <div className="drone-breadcrumb-wrapper">
        <BreadCrumbs title="View Drone" />
      </div>
      <div className="drone-card-view">
        {/* ==== Background Drone Image ==== */}
        <img
          src="https://droneentry.com/wp-content/uploads/2024/03/Agriculture-Spraying-Drone.png"
          alt="Drone Background"
          className="drone-bg-image"
        />

        {/* ==== Header ==== */}

        <div className="drone-card-header">
          <h2 className="drone-title">{droneName} - Drone Details</h2>
          <FaEdit className="edit-icon" title="Edit Drone Info" />
        </div>

        {/* ==== Drone Info Section ==== */}
        <div className="drone-main-content">
          <div className="drone-info-grid">
            <div className="info-row">
              <div>
                <strong>Drone Type:</strong> Agriculture
              </div>
              <div>
                <strong>Model Name:</strong> Bhumi
              </div>
            </div>

            <div className="info-row">
              <div>
                <strong>UIN:</strong> 33ABCDE1234F5Z9
              </div>
              <div>
                <strong>Drone Serial Number:</strong> BHUMI_2025_00001
              </div>
            </div>

            <div className="info-row">
              <div>
                <strong>Flight Controller:</strong> FC202500001
              </div>
              <div>
                <strong>Remote Controller:</strong> RC202500001
              </div>
            </div>

            <div className="info-row">
              <div>
                <strong>Battery Serial Number 1:</strong> BATT202500001
              </div>
              <div>
                <strong>Battery Serial Number 2:</strong> BATT202500002
              </div>
            </div>

            <div className="info-row">
              <div>
                <strong>Battery Charger Serial Number:</strong> BATT_CH202500001
              </div>
            </div>
          </div>

          {/* ==== Navigation Arrows ==== */}
          <div
            className={`nav-icons ${
              currentIndex === 0
                ? "only-right"
                : currentIndex === drones.length - 1
                ? "only-left"
                : "both"
            }`}
          >
            {currentIndex > 0 && (
              <FaChevronLeft
                className="nav-icon left"
                title={`Previous Drone: ${prevDrone}`}
                onClick={handlePrevClick}
              />
            )}
            {currentIndex < drones.length - 1 && (
              <FaChevronRight
                className="nav-icon right"
                title={`Next Drone: ${nextDrone}`}
                onClick={handleNextClick}
              />
            )}
          </div>
        </div>

        {/* ==== Flight Log Section ==== */}
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
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>20.09.2025</td>
                <td>11:00 AM</td>
                <td>11:20 AM</td>
                <td>20 Min</td>
                <td>Normal Operation</td>
              </tr>
              <tr>
                <td>2</td>
                <td>25.09.2025</td>
                <td>10:30 AM</td>
                <td>11:10 AM</td>
                <td>40 Min</td>
                <td>Survey Completed</td>
              </tr>
              <tr>
                <td>2</td>
                <td>25.09.2025</td>
                <td>10:30 AM</td>
                <td>11:10 AM</td>
                <td>40 Min</td>
                <td>Survey Completed</td>
              </tr>{" "}
              <tr>
                <td>2</td>
                <td>25.09.2025</td>
                <td>10:30 AM</td>
                <td>11:10 AM</td>
                <td>40 Min</td>
                <td>Survey Completed</td>
              </tr>{" "}
              <tr>
                <td>2</td>
                <td>25.09.2025</td>
                <td>10:30 AM</td>
                <td>11:10 AM</td>
                <td>40 Min</td>
                <td>Survey Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewDrone;
