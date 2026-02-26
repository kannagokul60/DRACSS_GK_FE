

import React, { useState, useEffect } from "react";
import "../../CSS/Technical/RCAreport.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../../../config";

export default function RCAReportPage() {

  const navigate = useNavigate();
  const location = useLocation();
  const ticketId = location.state?.ticketId;

  const [activeTab, setActiveTab] = useState(0);

  const BASE_URL = config.baseURL;
  const MEDIA_BASE_URL = config.baseURL.replace("/api", "");

  const [formData, setFormData] = useState({
    model_name: "",
    serial_number: "",
    incident_date: "",
    location: "",
    pilot_operator_name: "",
    issue_reported_by: "",
    impact_minor: false,
    impact_moderate: false,
    impact_critical: false,
    impact_safety_concern: false,
    issue_description: "",
    flight_log_file: [],
    flight_log_key_points: "",
    screenshots: [],
    videos: [],
    physical_findings: [
      { s_no: 1, component: "Airframe", description: "", accumulated_hours: "" },
      { s_no: 2, component: "Propulsion system", description: "", accumulated_hours: "" },
      { s_no: 3, component: "Battery", description: "", accumulated_hours: "" },
      { s_no: 4, component: "Payload", description: "", accumulated_hours: "" },
      { s_no: 5, component: "Propeller", description: "", accumulated_hours: "" },
      { s_no: 6, component: "Sensor/Electronics", description: "", accumulated_hours: "" },
    ],
    environmental_findings: [
    {
      date:  new Date().toISOString().split("T")[0],
      temperature: "",
      visibility: "",
      wind_speed: "",
      condition: "",
    },
    ],
    report_made_by: "",
    oem_name: "",

    possible_causes_mechanical: false,
    possible_causes_electrical: false,
    possible_causes_software: false,
    possible_causes_environmental: false,
    possible_causes_human_error: false,
    root_cause_identification: "",
    immediate_actions_taken: "",
    reviewed_by: "",
    review_date: "",
    temporary_fixes: "",
    
    test_flight_description: "",
    test_flights_conducted: "",
    test_flight_results: "",
    additional_recommendations: "",
    conclusion_physical_findings: "",
    conclusion_software_issue: "",
    conclusion_drone_flight_after_crash: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

const handleFileChange = (e) => {
  const { name, files } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: Array.from(files),
  }));
};

  const handlePhysicalChange = (index, field, value) => {
    const updated = [...formData.physical_findings];
    updated[index][field] = value;
    setFormData({ ...formData, physical_findings: updated });
  };

  const tabs = [
    "Basic Details",
    "Issue Report",
    "Collection of Evidence",
    "Physical Findings",
    "Environmental Condition",
    "RCA",
    "Corrective Actions",
    "Conclusions",
  ];

  const goNext = () => {
    if (activeTab < tabs.length - 1) setActiveTab(activeTab + 1);
  };

  const goBack = () => {
    if (activeTab > 0) setActiveTab(activeTab - 1);
  };


  const handleEnvChange = (index, field, value) => {
  const updated = [...formData.environmental_findings];
  updated[index][field] = value;

  setFormData({
    ...formData,
    environmental_findings: updated,
  });
};


useEffect(() => {
  const fetchRca = async () => {

    if (!ticketId) return;

    try {
        const res = await axios.get(
          `${BASE_URL}/rca-reports/?onsite_ticket=${ticketId}`
        );

        console.log("RAW RCA RESPONSE:", res.data);

        if (!Array.isArray(res.data) || res.data.length === 0) return;

        // ✅ Find correct ticket instead of taking first index
        const rca = res.data.find(
          (item) => item.onsite_ticket === ticketId
        );

        if (!rca) {
          console.log("❌ No matching RCA found for this ticket");
          return;
        }

        console.log("✅ CORRECT RCA FOUND:", rca);

      setFormData((prev) => ({
        ...prev,
        ...rca,

        test_flights_conducted:
        rca.test_flights_conducted === true
          ? "Yes"
          : rca.test_flights_conducted === false
          ? "No"
          : "",

      test_flight_description:
        rca.test_flight_description || "",

        // ✅ Fix Environmental Date Here
        environmental_findings:
          rca.environmental_findings?.length > 0
            ? rca.environmental_findings.map((item) => ({
                ...item,
                date: item.date || new Date().toISOString().split("T")[0],
              }))
            : [
                {
                  date: new Date().toISOString().split("T")[0],
                  temperature: "",
                  visibility: "",
                  wind_speed: "",
                  condition: "",
                },
              ],

        // ✅ Extract Key Points
        flight_log_key_points:
          rca.collection_of_evidence?.flight_log_key_points || "",

        // ✅ Keep Evidence Object
        collection_of_evidence:
          rca.collection_of_evidence || {},

        // ✅ Reset Upload Arrays
        flight_log_file: [],
        screenshots: [],
        videos: [],
      }));

    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  fetchRca();

}, [ticketId]);


const handleDeleteSavedFile = (type, id) => {
  setFormData((prev) => ({
    ...prev,
    collection_of_evidence: {
      ...prev.collection_of_evidence,
      [type]: prev.collection_of_evidence[type].filter(
        (file) => file.id !== id
      ),
    },
  }));
};


const handleSubmit = async () => {
  try {
    if (!ticketId) {
      alert("Ticket ID missing ❌");
      console.log("Ticket ID:", ticketId);
      return;
    }

    const data = new FormData();

    // 🔹 Append all fields dynamically
      Object.entries(formData).forEach(([key, value]) => {

        if (["flight_log_file", "screenshots", "videos"].includes(key)) return;

        // ✅ Convert Yes/No → boolean
        if (key === "test_flights_conducted") {
          data.append(key, value === "Yes");
        }

  

        // ✅ JSON fields
        else if (key === "physical_findings" || key === "environmental_findings") {
          data.append(key, JSON.stringify(value || []));
        }

        // ✅ Boolean fields
        else if (typeof value === "boolean") {
          data.append(key, value);
        }

        // ✅ Normal fields
        else {
          data.append(key, value ?? "");
        }
      });

    // 🔹 Append files
    formData.flight_log_file?.forEach(file =>
      data.append("flight_log_files", file)
    );

    formData.screenshots?.forEach(file =>
      data.append("screenshot_files", file)
    );

    formData.videos?.forEach(file =>
      data.append("video_files", file)
    );

    // 🔥 VERY IMPORTANT
    data.append("onsite_ticket", ticketId);

    console.log("Submitting RCA...");
    console.log("Ticket ID:", ticketId);
    console.log("FormData:", [...data.entries()]);

    // ✅ Create RCA
// ✅ Create or Update RCA
let response;

if (formData.id) {
  // UPDATE
  response = await axios.patch(
    `${BASE_URL}/rca-reports/${formData.id}/`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
} else {
  // CREATE
  response = await axios.post(
    `${BASE_URL}/rca-reports/`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
}
     
    const rcaId = response.data.id;
    console.log("✅ NEW RCA ID:", rcaId);

// ✅ Upload Flight Logs
if (formData.flight_log_file?.length > 0) {
  const mediaForm = new FormData();
  mediaForm.append("rca_report", rcaId);
  mediaForm.append("media_type", "flight_log");

  formData.flight_log_file.forEach(file => {
    mediaForm.append("files", file);
  });

  await axios.post(
    `${BASE_URL}/rca-report-media/`,
    mediaForm,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
}

// ✅ Upload Screenshots
if (formData.screenshots?.length > 0) {
  const mediaForm = new FormData();
  mediaForm.append("rca_report", rcaId);
  mediaForm.append("media_type", "screenshot");

  formData.screenshots.forEach(file => {
    mediaForm.append("files", file);
  });

  await axios.post(
    `${BASE_URL}/rca-report-media/`,
    mediaForm,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
}

// ✅ Upload Videos
if (formData.videos?.length > 0) {
  const mediaForm = new FormData();
  mediaForm.append("rca_report", rcaId);
  mediaForm.append("media_type", "video");

  formData.videos.forEach(file => {
    mediaForm.append("files", file);
  });

  await axios.post(
    `${BASE_URL}/rca-report-media/`,
    mediaForm,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
}


    console.log("RCA CREATED:", response.data);

    // ✅ Update ticket status ONLY if RCA success
    await axios.patch(
      `${BASE_URL}/onsite-support/${ticketId}/`,
      { status: "COMPLETED" }
    );

    alert("RCA Created & Status Updated ✅");
    navigate("/technical/on-site-support-tickets");

  } catch (error) {
    console.log("FULL ERROR:", error);
    console.log("ERROR DATA:", error.response?.data);
    alert("RCA creation failed ❌ Check console");
  }
};
  console.log("REPORT DATE:", formData.report_date);
  return (
    <div className="rca-page">
      <h2 className="rca-header">RCA Report</h2>

      <div className="rca-tab-wrapper">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`rca-tab ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

            <div
        className={`rca-card ${activeTab === 3 || activeTab === 4 ? "no-padding" : ""}`}
      >
      

        {/* BASIC DETAILS */}
        {activeTab === 0 && (
          <div className="rca-table-layout">

            
            <div className="rca-column">
                          {/* TODAY DATE */}
              <div className="rca-row">
                <span>Date</span><span>:</span>
                <input
                  type="text"
                  value={
                    (formData.report_date ||
                      new Date().toISOString().split("T")[0])
                      .split("-")
                      .reverse()
                      .join("-")
                  }
                  readOnly
                />
              </div>


              <div className="rca-row">
                <span>Serial Number</span><span>:</span>
                <input
                  type="text"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                />
              </div>



              <div className="rca-row">
                <span>Location</span><span>:</span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="rca-column">
              <div className="rca-row">
                <span>Model Name</span><span>:</span>
                <input
                  type="text"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleChange}
                />
              </div>

              <div className="rca-row">
                <span>Incident Date</span><span>:</span>
                <input
                  type="date"
                  name="incident_date"
                  value={formData.incident_date}
                  onChange={handleChange}
                />
              </div>

              <div className="rca-row">
                <span>Pilot Name</span><span>:</span>
                <input
                  type="text"
                  name="pilot_operator_name"
                  value={formData.pilot_operator_name}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

{activeTab === 1 && (
  <div className="rca-table-layout">

    {/* LEFT COLUMN */}
    <div className="rca-column">

      {/* Issue Reported By */}
      <div className="rca-row">
        <span>Issue Reported By</span>
        <span>:</span>
        <input
          type="text"
          name="issue_reported_by"
          value={formData.issue_reported_by}
          onChange={handleChange}
          placeholder="Enter issue reported by"
        />
      </div>

      {/* Description */}
      <div className="rca-row align-top">
        <span>Description</span>
        <span>:</span>
        <textarea
          className="rca-textarea"
          name="issue_description"
          value={formData.issue_description}
          onChange={handleChange}
          placeholder="Describe issue here"
        />
      </div>

    </div>

    {/* RIGHT COLUMN */}
    <div className="rca-column">

      {/* Impact */}
      <div className="rca-row">
        <span>Impact</span>
        <span>:</span>

        <div className="rca-checkbox-group">

          <label>
            <input
              type="checkbox"
              name="impact_minor"
              checked={formData.impact_minor}
              onChange={handleChange}
            />
            Minor
          </label>

          <label>
            <input
              type="checkbox"
              name="impact_moderate"
              checked={formData.impact_moderate}
              onChange={handleChange}
            />
            Moderate
          </label>

          <label>
            <input
              type="checkbox"
              name="impact_critical"
              checked={formData.impact_critical}
              onChange={handleChange}
            />
            Critical
          </label>

          <label>
            <input
              type="checkbox"
              name="impact_safety_concern"
              checked={formData.impact_safety_concern}
              onChange={handleChange}
            />
            Safety Concern
          </label>

        </div>
      </div>

    </div>

  </div>
)}

{activeTab === 2 && (
  <div className="rca-table-layout">

    {/* ================= LEFT COLUMN ================= */}
    <div className="rca-column">

      {/* ================= FLIGHT LOG UPLOAD ================= */}
      <div className="rca-row">
        <label>Flight Log Data</label>
        <span>:</span>

        <div style={{ width: "100%" }}>
          <input
            type="file"
            name="flight_log_file"
            multiple
            accept=".log,.txt,.csv,image/*"
            onChange={handleFileChange}
          />

          {/* ✅ NEWLY SELECTED FILES */}
          {formData?.flight_log_file?.length > 0 && (
            <div className="file-preview">
              {formData.flight_log_file.map((file, index) => (
                <div key={`new-flight-${index}`} className="saved-file-box">
                  {file?.name}

                  <span
                    className="delete-file-btn"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        flight_log_file: prev.flight_log_file.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ✅ SAVED FILES FROM BACKEND */}
          {Array.isArray(
            formData?.collection_of_evidence?.flight_log_data_files
          ) &&
            formData.collection_of_evidence.flight_log_data_files.map(
              (item) =>
                item?.id && (
                  <div
                    key={`flight-${item.id}`}
                    className="saved-file-box"
                  >
                    <a
                      href={`${MEDIA_BASE_URL}${item?.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.file?.split("/").pop()}
                    </a>

                    <span
                      className="delete-file-btn"
                      onClick={() =>
                        handleDeleteSavedFile(
                          "flight_log_data_files",
                          item.id
                        )
                      }
                    >
                      ✕
                    </span>
                  </div>
                )
            )}
        </div>
      </div>

      {/* ================= FLIGHT LOG KEY POINTS ================= */}
      <div className="rca-row align-top">
        <label>Flight Log Key Points</label>
        <span>:</span>

        <textarea
          name="flight_log_key_points"
          placeholder="Key Points"
          className="rca-textarea"
          value={formData?.flight_log_key_points || ""}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* ================= RIGHT COLUMN ================= */}
    <div className="rca-column">

      {/* ================= SCREENSHOTS ================= */}
      <div className="rca-row">
        <label>Screenshot of Log / GCS / UAS</label>
        <span>:</span>

        <div style={{ width: "100%" }}>
          <input
            type="file"
            name="screenshots"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* ✅ NEW FILES */}
          {formData?.screenshots?.length > 0 && (
            <div className="file-preview">
              {formData.screenshots.map((file, index) => (
                <div
                  key={`new-screenshot-${index}`}
                  className="saved-file-box"
                >
                  {file?.name}

                  <span
                    className="delete-file-btn"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        screenshots: prev.screenshots.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ✅ SAVED FROM BACKEND */}
          {Array.isArray(
            formData?.collection_of_evidence?.screenshots
          ) &&
            formData.collection_of_evidence.screenshots.map(
              (item) =>
                item?.id && (
                  <div
                    key={`screenshot-${item.id}`}
                    className="saved-file-box"
                  >
                    <a
                      href={`${MEDIA_BASE_URL}${item?.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.file?.split("/").pop()}
                    </a>

                    <span
                      className="delete-file-btn"
                      onClick={() =>
                        handleDeleteSavedFile("screenshots", item.id)
                      }
                    >
                      ✕
                    </span>
                  </div>
                )
            )}
        </div>
      </div>

      {/* ================= VIDEOS ================= */}
      <div className="rca-row">
        <label>Video</label>
        <span>:</span>

        <div style={{ width: "100%" }}>
          <input
            type="file"
            name="videos"
            multiple
            accept="video/*"
            onChange={handleFileChange}
          />

          {/* ✅ NEW VIDEOS */}
          {formData?.videos?.length > 0 && (
            <div className="file-preview">
              {formData.videos.map((file, index) => (
                <div key={`new-video-${index}`} className="saved-file-box">
                  {file?.name}

                  <span
                    className="delete-file-btn"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        videos: prev.videos.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ✅ SAVED VIDEOS */}
          {Array.isArray(
            formData?.collection_of_evidence?.videos
          ) &&
            formData.collection_of_evidence.videos.map(
              (item) =>
                item?.id && (
                  <div
                    key={`video-${item.id}`}
                    className="saved-file-box"
                  >
                    <a
                      href={`${MEDIA_BASE_URL}${item?.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.file?.split("/").pop()}
                    </a>

                    <span
                      className="delete-file-btn"
                      onClick={() =>
                        handleDeleteSavedFile("videos", item.id)
                      }
                    >
                      ✕
                    </span>
                  </div>
                )
            )}
        </div>
      </div>

    </div>

  </div>
)}
{activeTab === 3 && (
  <div className="rca-table-wrapper">
    <table className="rca-main-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Date</th>
          <th>Component</th>
          <th>Description</th>
          <th>Accumulated Hours</th>
        </tr>
      </thead>

      <tbody>
        {formData.physical_findings.map((item, index) => (
          <tr key={index}>
            <td>{item.s_no}</td>
            <td>{item.date || "22.06.26"}</td>
            <td>{item.component}</td>

            <td>
              <input
                type="text"
                value={item.description}
                placeholder="Enter description"
                onChange={(e) =>
                  handlePhysicalChange(index, "description", e.target.value)
                }
              />
            </td>

            <td>
              <input
                type="number"
                value={item.accumulated_hours}
                placeholder="Enter accumulated hours"
                onChange={(e) =>
                  handlePhysicalChange(
                    index,
                    "accumulated_hours",
                    e.target.value
                  )
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


{activeTab === 4 && (
  <div className="rca-table-container">

    {/* TABLE */}
    <div className="rca-table-wrapper">
      <table className="rca-main-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Temperature</th>
            <th>Visibility (meters)</th>
            <th>WindSpeed (m/sec)</th>
            <th>Condition (Day/Night)</th>
          </tr>
        </thead>

        <tbody>
          {formData.environmental_findings.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>

            <td>
              <input
                type="text"
                value={
                  row.date
                    ? row.date.split("-").reverse().join("-")
                    : new Date().toISOString().split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")
                }
                readOnly
              />
            </td>

              <td>
                <input
                  type="text"
                  placeholder="Enter temperature"
                  value={row.temperature}
                  onChange={(e) =>
                    handleEnvChange(index, "temperature", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="text"
                  placeholder="Enter visibility in meters"
                  value={row.visibility}
                  onChange={(e) =>
                    handleEnvChange(index, "visibility", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="text"
                  placeholder="Enter wind speed in m/sec"
                  value={row.wind_speed}
                  onChange={(e) =>
                    handleEnvChange(index, "wind_speed", e.target.value)
                  }
                />
              </td>

              {/* <td>
                <select
                  value={row.condition}
                  onChange={(e) =>
                    handleEnvChange(index, "condition", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
              </td> */}
               <td>
            <div className="condition-radio">

              <label>
                <input
                  type="radio"
                  name={`condition_${index}`}
                  value="Day"
                  checked={row.condition === "Day"}
                  onChange={(e) =>
                    handleEnvChange(index, "condition", e.target.value)
                  }
                />
                Day
              </label>

              <label>
                <input
                  type="radio"
                  name={`condition_${index}`}
                  value="Night"
                  checked={row.condition === "Night"}
                  onChange={(e) =>
                    handleEnvChange(index, "condition", e.target.value)
                  }
                />
                Night
              </label>

            </div>
          </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ATTACHED BOTTOM SECTION */}
    <div className="rca-bottom-section">
      <div className="rca-bottom-right">

        <div className="rca-row">
          <span>Report made By</span>
          <span>:</span>
          <input
            type="text"
            name="report_made_by"
            value={formData.report_made_by}
            onChange={handleChange}
          />
        </div>

        <div className="rca-row">
          <span>Name of OEM Representative</span>
          <span>:</span>
          <input
            type="text"
            name="oem_name"
            value={formData.oem_name}
            onChange={handleChange}
          />
        </div>

      </div>
    </div>

  </div>
)}



 {/* RCA */}
{activeTab === 5 && (
  <div className="rca-table-layout vertical-layout">

    {/* TOP - POSSIBLE CAUSES IDENTIFICATION */}
    <div className="rca-row full-width">
      <span>Possible Causes Identification</span>
      <span>:</span>

      <div className="rca-checkbox-group vertical">

        <label>
          <input
            type="checkbox"
            name="possible_causes_mechanical"
            checked={formData.possible_causes_mechanical}
            onChange={handleChange}
          />
          Mechanical (e.g., motor failure, propeller damage)
        </label>

        <label>
          <input
            type="checkbox"
            name="possible_causes_electrical"
            checked={formData.possible_causes_electrical}
            onChange={handleChange}
          />
          Electrical (e.g., battery issue, wiring failure)
        </label>

        <label>
          <input
            type="checkbox"
            name="possible_causes_software"
            checked={formData.possible_causes_software}
            onChange={handleChange}
          />
          Software (e.g., firmware bug, sensor calibration)
        </label>

        <label>
          <input
            type="checkbox"
            name="possible_causes_environmental"
            checked={formData.possible_causes_environmental}
            onChange={handleChange}
          />
          Environmental (e.g., strong winds, obstacles)
        </label>

        <label>
          <input
            type="checkbox"
            name="possible_causes_human_error"
            checked={formData.possible_causes_human_error}
            onChange={handleChange}
          />
          Human Error (e.g., pilot mistake, maintenance issue)
        </label>

      </div>
    </div>

    {/* BOTTOM - ROOT CAUSE */}
    <div className="rca-row full-width">
      <span>Root Cause Identification</span>
      <span>:</span>

      <textarea
        name="root_cause_identification"
        value={formData.root_cause_identification}
        onChange={handleChange}
        className="rca-textarea"
        placeholder="Enter root cause details..."
      />
    </div>

  </div>
)}


{activeTab === 6 && (
  <div className="rca-table-layout">

    {/* LEFT COLUMN */}
    <div className="rca-column">

      <div className="rca-row">
        <span>Immediate Actions Taken</span>
        <span>:</span>
        <input
          type="text"
          name="immediate_actions_taken"
          value={formData.immediate_actions_taken}
          onChange={handleChange}
          placeholder="Enter immediate actions taken"
        />
      </div>

      <div className="rca-row">
        <span>Temporary Fixes</span>
        <span>:</span>
        <input
          type="text"
          name="temporary_fixes"
          value={formData.temporary_fixes}
          onChange={handleChange}
          placeholder="Enter temporary fixes"
        />
      </div>

      <div className="rca-row">
        <span>Description of Test Flight</span>
        <span>:</span>
        <textarea
          className="rca-textarea"
          name="test_flight_description"
          value={formData.test_flight_description}
          onChange={handleChange}
          placeholder="Describe test flight"
        />
      </div>

    </div>

    {/* RIGHT COLUMN */}
    <div className="rca-column">

      <div className="rca-row">
        <span>Reviewed By</span>
        <span>:</span>
        <input
          type="text"
          name="reviewed_by"
          value={formData.reviewed_by}
          onChange={handleChange}
          placeholder="Enter reviewer name"
        />
      </div>

      <div className="rca-row">
        <span>Test Flights Conducted</span>
        <span>:</span>

        <div className="rca-radio-group">
          <label>
            <input
              type="radio"
              name="test_flights_conducted"
              value="Yes"
              checked={formData.test_flights_conducted === "Yes"}
              onChange={handleChange}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              name="test_flights_conducted"
              value="No"
              checked={formData.test_flights_conducted === "No"}
              onChange={handleChange}
            />
            No
          </label>
        </div>
      </div>

      <div className="rca-row">
        <span>Results</span>
        <span>:</span>
        <textarea
          className="rca-textarea"
          name="test_flight_results"
          value={formData.test_flight_results}
          onChange={handleChange}
          placeholder="Describe results"
        />
      </div>

      <div className="rca-row">
        <span>Additional Recommendations</span>
        <span>:</span>
        <textarea
          className="rca-textarea"
          name="additional_recommendations"
          value={formData.additional_recommendations}
          onChange={handleChange}
          placeholder="Enter recommendations"
        />
      </div>

    </div>

  </div>
)}

{activeTab === 7 && (
  <div className="rca-table-layout vertical-layout">

    {/* ROW 1 */}
    <div className="rca-row full-width">
      <span>No Fault in FC and barometer of drone</span>
      <span>:</span>
      <textarea
        className="rca-textarea"
        name="conclusion_physical_findings"
        value={formData.conclusion_physical_findings}
        onChange={handleChange}
        placeholder="Describe findings here"
      />
    </div>

    {/* ROW 2 */}
    <div className="rca-row full-width">
      <span>No Software Issue or app killing at the time of crash</span>
      <span>:</span>
      <textarea
        className="rca-textarea"
        name="conclusion_software_issue"
        value={formData.conclusion_software_issue}
        onChange={handleChange}
        placeholder="Describe software verification"
      />
    </div>

    {/* ROW 3 */}
    <div className="rca-row full-width">
      <span>
        Drone has flown after crash by replacing propellers which have no issues
      </span>
      <span>:</span>
      <textarea
        className="rca-textarea"
        name="conclusion_drone_flight_after_crash"
        value={formData.conclusion_drone_flight_after_crash}
        onChange={handleChange}
        placeholder="Describe post-crash flight verification"
      />
    </div>

  </div>
)}
      </div>

      <div className="rca-navigation">
        {activeTab > 0 && (
          <button className="cancel-rca-btn" onClick={goBack}>
            Back
          </button>
        )}

        {activeTab < tabs.length - 1 ? (
          <button className="view-rca-btn" onClick={goNext}>
            Next
          </button>
        ) : (
          <button className="submit-rca-btn" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}