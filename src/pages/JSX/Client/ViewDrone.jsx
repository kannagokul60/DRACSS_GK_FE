import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import "../../CSS/viewdrone.css";

const ViewDrone = () => {
  const { droneName } = useParams();
  const navigate = useNavigate();

  return (
    <div className="drone-details-page">
      <div className="drone-card">
        {/* Header with Back Button */}
        <div className="drone-card-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </button>
          </div>
          <h2>{droneName} - Drone Details</h2>
          <FaEdit className="edit-icon" title="Edit Drone Info" />
        </div>

        {/* Main Content */}
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

          <FaChevronRight className="next-icon" />
        </div>

        {/* Flight Log Table */}
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
                <td>Nothing</td>
              </tr>
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
