import React, { useState, useEffect } from "react";
// import Pagination from "../../../components/Pagination";
import "../../CSS/Client/OnSiteSupport.css";
import { FaPlus, FaTools } from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";
import axios from "axios";

import config from "../../../config";
const BASE_URL = `${config.baseURL}/onsite-support`;

export default function OnSiteSupport() {
const formatStatus = (status) => {
  if (!status) return "-";

  return status
    .toLowerCase()
    .replace(/_/g, " ") // replace underscore with space
    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize words
};
const [showForm, setShowForm] = useState(false);
const [requests, setRequests] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
const [viewPopup, setViewPopup] = useState(false);
const [selectedRequest, setSelectedRequest] = useState(null);

   const handleView = (request) => {
        setSelectedRequest(request);
        setViewPopup(true);
      };

const getOnsiteRequests = async (page = 1) => {
  try {
    const employee_id = localStorage.getItem("employee_id");
    const client_type = localStorage.getItem("client_type");

    const response = await axios.get(
      `${BASE_URL}/?page=${page}&employee_id=${employee_id}&client_type=${client_type}`
    );

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

const addOnsiteRequest = async (requestData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/`,
      requestData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateOnsiteRequest = async (id, payload) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/${id}/`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

    const [formData, setFormData] = useState({
    model: "",
    flightController: "",
    serial: "",
    date: "",
    totalHours: "",
    description: "",
    subsystem: "",
    symptoms: "",
    environment: "",
    actions: "",
    consequence: "",
    correctiveActions: "",
    reportedBy: "",
    reportedDate: "",
    address: "",
    remarks: "",
    });

    const [errors, setErrors] = useState({});


 
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));


      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: false }));
      }
    };



      const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;


        if (scrollHeight - scrollTop <= clientHeight + 5 && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      };


useEffect(() => {
  const fetchRequests = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await getOnsiteRequests(page);

      setRequests((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newItems = data.filter(
          (r) => !existingIds.has(r.id)
        );
        return [...prev, ...newItems];
      });

      setHasMore(data.next !== null);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, [page]);

const handleSubmit = async (e) => {
  e.preventDefault(); 


const client_id = localStorage.getItem("employee_id"); 
const client_type = localStorage.getItem("client_type");
if (!client_id) {
  console.error("Client ID not found in localStorage");
  return; 
}


 const newErrors = {};
  Object.entries(formData).forEach(([key, value]) => {
    if (key !== "serial" && !value) {
      newErrors[key] = true;
    }
  });

  setErrors(newErrors);

  
  if (Object.keys(newErrors).length > 0) {
    const firstErrorField = Object.keys(newErrors)[0];
    const element = document.getElementsByName(firstErrorField)[0];
    if (element) {
      
      setTimeout(() => {
        element.focus();
        element.reportValidity();
      }, 0);
    }
    return;
  }


  const payload = {
    client_id: client_id,
    model: formData.model,
    serial: formData.serial,
    date_of_occurance: formData.date,
    flight_controller: formData.flightController,
    total_hours: formData.totalHours,
    subsystem: formData.subsystem,
    symptoms: formData.symptoms,
    environment: formData.environment,
    actions: formData.actions,
    consequence: formData.consequence,
    corrective_actions: formData.correctiveActions,
    reported_by: formData.reportedBy,
    reported_date: formData.reportedDate,
    address: formData.address,
    remarks: formData.remarks,
    description: formData.description,
    status: "PENDING",
  };

  try {
    const savedRequest = await addOnsiteRequest(payload);
    setRequests((prev) => [savedRequest, ...prev]);
    setPage(1);
    setHasMore(true);
    setShowForm(false);
    setFormData({

      model: "",
      flightController: "",
      serial: "",
      date: "",
      totalHours: "",
      description: "",
      subsystem: "",
      symptoms: "",
      environment: "",
      actions: "",
      consequence: "",
      correctiveActions: "",
      reportedBy: "",
      reportedDate: "",
      address: "",
      remarks: "",
    });
    setErrors({});
  } catch (error) {
    if (error.serial) {
      alert(error.serial[0]);
      return;
    }
    if (error.address) {
      alert(error.address[0]);
      return;
    }
    if (error.detail) {
      alert(error.detail);
      return;
    }
    alert("Something went wrong. Please check the form.");
  }
};



return (
<div className="client-onsite-container">

  {/* TOP BAR */}
  <div className="client-onsite-topbar">
    
    <div className="client-top-left">
      <BreadCrumbs />
    </div>

    <div className="client-top-center">
      <h2>On-Site Support Requests</h2>
    </div>

    <div className="client-top-right">
      <button
        className="client-add-btn"
        onClick={() => setShowForm(true)}
      >
        <FaPlus /> New Request
      </button>
    </div>

  </div>

  {/* TABLE SECTION */}
    <div className="client-onsite-table-wrapper">
      
      {/* Sticky Header */}
      <table className="client-onsite-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Model</th>
            <th>Date</th>
            <th>Serial No</th>
            <th>Reported By</th>
            <th>Issue</th>
            <th>Status</th>
          
            <th>View</th>
        
          </tr>
        </thead>
      </table>

      {/* Scrollable Body */}
      <div
        className="client-onsite-table-body"
        onScroll={handleScroll}
      >
        <table className="client-onsite-table">
          <tbody>

            {requests.length === 0 && !loading && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center" }}>
                  No requests found
                </td>
              </tr>
            )}

            {requests.map((req, index) => (
              <tr key={req.id}>
                <td>{index + 1}</td>
                <td>{req.model}</td>
                <td>{req.date_of_occurance}</td>
                <td>{req.serial}</td>
                <td>{req.reported_by}</td>
                <td>{req.description}</td>

                <td>
                  <span
                    className={`client-status-badge ${
                      req.status ? req.status.toLowerCase().replaceAll("_", "-") : ""
                    }`}
                  >
                    {formatStatus(req.status)}
                  </span>
                </td>

           

                <td>
                  <button
                    className="client-view-btn"
                    onClick={() => handleView(req)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
{showForm && (
  <div className="onsite-popup-overlay">
    <div className="onsite-popup">
      <div className="onsite-popup-header">
        <h3>On-Site Support Request</h3>
        <button
          type="button"
          className="close-btn"
          onClick={() => setShowForm(false)}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="onsite-form-scroll">
       
        <div className="form-group">
          <label>UAS Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={errors.model ? "input-error" : ""}
          />
          {errors.model && (
            <div className="error-text">* Please fill the required field</div>
          )}
        </div>

        
        <div className="form-group">
          <label>Serial Number</label>
          <input
            type="text"
            name="serial"
            value={formData.serial}
            onChange={handleChange}
          />
        </div>

    
{[
  { label: "Flight Controller", name: "flightController", type: "text" },
  { label: "Date of Occurrence", name: "date", type: "date" },
  { label: "Total Accumulated Hours", name: "totalHours", type: "text" },
  { label: "Description of Difficulty", name: "description", type: "textarea", rows: 3 },
  { label: "Affected Subsystem / Component", name: "subsystem", type: "text" },
  { label: "Symptoms Observed", name: "symptoms", type: "text" },
  { label: "Environmental Conditions", name: "environment", type: "text" },
  { label: "Operator Actions Taken", name: "actions", type: "text" },
  { label: "Immediate Consequence (Flight Outcome)", name: "consequence", type: "text" },
  { label: "Corrective Actions Taken", name: "correctiveActions", type: "text" },
  { label: "Reported By", name: "reportedBy", type: "text" },
  { label: "Reported Date", name: "reportedDate", type: "date" },
  { label: "Address", name: "address", type: "textarea", rows: 3 },
  { label: "Remarks", name: "remarks", type: "textarea", rows: 3 }, 
].map((field) => (
  <div key={field.name} className="form-group">
    <label>{field.label}</label>
    {field.type === "textarea" ? (
      <textarea
        name={field.name}
        rows={field.rows || 3}
        value={formData[field.name]}
        onChange={handleChange}
        className={field.name !== "remarks" && errors[field.name] ? "input-error" : ""}
      />
    ) : (
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        className={field.name !== "remarks" && errors[field.name] ? "input-error" : ""}
      />
    )}
    {field.name !== "remarks" && errors[field.name] && (
      <div className="error-text">* Please fill the required field</div>
    )}
  </div>
))}


        <div className="onsite-popup-actions">
          <button type="submit" className="submit-btn">
            Submit
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {viewPopup && selectedRequest && (
  <div className="onsite-popup-overlay">
    <div className="onsite-popup">
      <div className="onsite-popup-header">
        <h3>On-Site Request Details</h3>
        <button
          className="close-btn"
          onClick={() => setViewPopup(false)}
        >
          ✕
        </button>
      </div>

      <div className="onsite-form-scroll">

        <label>UAS Model</label>
        <input value={selectedRequest.model} disabled />

        <label>Flight Controller</label>
        <input value={selectedRequest.flight_controller} disabled />

        <label>Serial Number</label>
        <input value={selectedRequest.serial} disabled />

        <label>Date</label>
        <input value={selectedRequest.date_of_occurance} disabled />

        <label>Total Hours</label>
        <input value={selectedRequest.total_hours} disabled />

        <label>Description</label>
        <textarea value={selectedRequest.description} disabled />

        <label>Subsystem</label>
        <input value={selectedRequest.subsystem} disabled />

        <label>Symptoms</label>
        <input value={selectedRequest.symptoms} disabled />

        <label>Environment</label>
        <input value={selectedRequest.environment} disabled />

        <label>Actions Taken</label>
        <input value={selectedRequest.actions} disabled />

        <label>Consequence</label>
        <input value={selectedRequest.consequence} disabled />

        <label>Corrective Actions</label>
        <input value={selectedRequest.corrective_actions} disabled />

        <label>Reported By</label>
        <input value={selectedRequest.reported_by} disabled />

        <label>Reported Date</label>
        <input value={selectedRequest.reported_date} disabled />

        <label>Address</label>
        <textarea value={selectedRequest.address} disabled />

        <label>Remarks</label>
        <textarea value={selectedRequest.remarks} disabled />

      </div>
    </div>
  </div>
)}
</div>
);
}
