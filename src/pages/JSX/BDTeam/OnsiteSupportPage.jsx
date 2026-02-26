import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";
import "../../CSS/BDTeam/bdOnSiteSupport.css";
import axios from "axios";
import config from "../../../config";
import { useRef } from "react";

const BASE_URL = `${config.baseURL}/onsite-support`;
const ACCOUNTS_URL = `${config.baseURL}/accounts`;

export default function OnSiteSupport() {
  const formatStatus = (status) => {
    if (!status) return "";
    return status.toUpperCase();
  };
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [reviewData, setReviewData] = useState({
    bdReview: "",
    assignedTeam: "Technical",
    assignedTechnicianId: "",
  });
  const [user, setUser] = useState(null);
  const tableBodyRef = useRef(null);
  const [viewPopup, setViewPopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [formData, setFormData] = useState({
    model: "",
    flightController: "",
    serial: "",
    date_of_occurance: "",
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
  const [reviewPopup, setReviewPopup] = useState(false);
  const [clients, setClients] = useState([]);

  const getOnsiteRequests = async (page = 1) => {
    try {
      const employee_id = localStorage.getItem("employee_id");
      const client_type = localStorage.getItem("client_type");

      const response = await axios.get(
        `${BASE_URL}/?page=${page}&employee_id=${employee_id}&client_type=${client_type}`,
      );

      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const addOnsiteRequest = async (requestData) => {
    try {
      const response = await axios.post(`${BASE_URL}/`, requestData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Add Request Error:",
        error.response?.data || error.message,
      );
      throw error.response?.data || error;
    }
  };

  const updateOnsiteRequest = async (id, payload) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      throw error;
    }
  };

  const [usedTechnicians, setUsedTechnicians] = useState([]);

  useEffect(() => {
    if (currentRequest?.assigned_technician) {
      setUsedTechnicians((prev) =>
        prev.includes(currentRequest.assigned_technician)
          ? prev
          : [...prev, currentRequest.assigned_technician],
      );
    }
  }, [currentRequest]);

  const AssignTechnician = ({
    technicians = [],
    reviewData,
    setReviewData,
    currentRequest,
  }) => {
    const filteredTechnicians = technicians.filter(
      (tech) =>
        tech.client_type === "technical" && !usedTechnicians.includes(tech.id),
    );
    return (
      <div className="form-group">
        <label>Assign Technician</label>
        <select
          className="technician-select"
          value={reviewData.assignedTechnicianId || ""}
          onChange={(e) =>
            setReviewData({
              ...reviewData,
              assignedTechnicianId: e.target.value,
            })
          }
        >
          <option value="">-- Select Technician --</option>
          {filteredTechnicians.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${ACCOUNTS_URL}/?client_type=client`);

        setClients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setClients([]);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await axios.get(`${ACCOUNTS_URL}/?client_type=technical`);

        setTechnicians(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching technicians:", err);
        setTechnicians([]);
      }
    };

    fetchTechnicians();
  }, []);

useEffect(() => {
  if (!user) return;

  const fetchRequests = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const data = await getOnsiteRequests(page);

      const items = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
        ? data
        : [];

const normalizedItems = items.map((item) => ({
  ...item,
  reported_by: Array.isArray(item.reported_by)
    ? item.reported_by[0] || "-"
    : item.reported_by || "-",
  assigned_technician:
    item.status === "ASSIGNED_TO_TECH"
      ? item.assigned_technician
      : null,
}));

      setRequests((prev) => {
        const prevMap = new Map(prev.map((r) => [r.id, r]));
        normalizedItems.forEach((item) => {
          prevMap.set(item.id, item);
        });
        return Array.from(prevMap.values());
      });

      setHasMore(!!data?.next);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, [page, user]);

useEffect(() => {
  if (user) {
    setPage(1);
    setHasMore(true);
    setRequests([]);
  }
}, [user]);

  const handleView = (request) => {
    setSelectedRequest(request);
    setViewPopup(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const curDate = new Date();
  const formattedDate = curDate.toISOString().slice(0, 10); // "2026-02-13"

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "serial" && !value) newErrors[key] = true;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const exists = clients.some(
      (client) =>
        client.employee_id === formData.clientId &&
        client.client_type === "client",
    );

    if (!exists) {
      alert("Invalid Client ID. Only users with client role are allowed.");
      return;
    }

    const payload = {
      client_id: formData.clientId,
      model: formData.model,
      flight_controller: formData.flightController,
      serial: formData.serial,
      date_of_occurance: formData.date_of_occurance,
      total_hours: formData.totalHours,
      description: formData.description,
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
      status: "PENDING",
      bd_team: null,
    };

    try {
      const newRequest = await addOnsiteRequest(payload);
      const normalizedRequest = {
        ...newRequest,
        reported_by: Array.isArray(newRequest.reported_by)
          ? newRequest.reported_by[0] || "-"
          : newRequest.reported_by || "-",
      };
      setRequests((prev) => [normalizedRequest, ...prev]);
      setShowForm(false);
      setFormData({
        clientId: "",
        model: "",
        flightController: "",
        serial: "",
        date_of_occurance: "",
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

  const openReview = (request) => {
    setCurrentRequest(request);
    setReviewData({
      bdReview: request.bd_review || "",
      assignedTeam: request.assigned_team || "Technical",
      assignedTechnicianId: "",
    });
    setReviewPopup(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentRequest) return;
    const payload = {
      bd_review: reviewData.bdReview || "",
      assigned_team: "ASSIGNED_TO_TECH", // 🔥 CHANGE HERE
      bd_team: user?.name || null,
      status: "ASSIGNED_TO_TECH", // 🔥 MATCH BACKEND ENUM
      assigned_date: formattedDate,
      assigned_technician: reviewData.assignedTechnicianId
        ? parseInt(reviewData.assignedTechnicianId, 10)
        : null,
    };
    if (reviewData.assignedTechnicianId)
      payload.assigned_technician = parseInt(
        reviewData.assignedTechnicianId,
        10,
      );

    try {
      const updated = await updateOnsiteRequest(currentRequest.id, payload);
      setRequests((prev) =>
        prev.map((r) => (r.id === currentRequest.id ? updated : r)),
      );
      setCurrentRequest(updated);
      setReviewPopup(false);
    } catch (err) {
      alert("Request failed. Please check all fields.", err);
    }
  };

  useEffect(() => {
  const checkAndLoadMore = () => {
    const container = tableBodyRef.current;
    if (!container || loading || !hasMore) return;

    if (container.scrollHeight <= container.clientHeight) {
      setPage((prev) => prev + 1);
    }
  };

  checkAndLoadMore();
}, [requests, loading, hasMore]);

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;

  if (
    scrollHeight - scrollTop <= clientHeight + 10 &&
    hasMore &&
    !loading
  ) {
    setPage((prev) => prev + 1);
  }
};

  return (
    <div className="bd-onsite-container">
      {/* ================= TOP HEADER ================= */}
      <div className="bd-onsite-header-row">
        {/* LEFT - Breadcrumb */}
        <div className="bd-onsite-breadcrumb">
          <BreadCrumbs />
        </div>

        {/* CENTER - Title */}
        <h2 className="bd-onsite-title">On-Site Support Requests</h2>

        {/* RIGHT - New Request Button */}
        <button className="bd-onsite-add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> New Request
        </button>
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className="bd-onsite-table-container">
        {/* Table Header */}
        <table className="bd-onsite-table">
          <thead className="bd-onsite-table-head">
            <tr>
              <th>S.no</th>
              <th>Model</th>
              <th>Date</th>
              <th>Serial No</th>
              <th>Reported By</th>
              <th>Issue</th>
              <th>Status</th>
              <th>BD Team</th>
              <th>View</th>
              <th>Action</th>
            </tr>
          </thead>
        </table>

        {/* Scrollable Body */}
<div
  className="bd-onsite-table-body"
  onScroll={handleScroll}
  ref={tableBodyRef}
>          <table className="bd-onsite-table">
            <tbody className="bd-onsite-table-tbody">
              {requests.length === 0 && !loading && (
                <tr>
                  <td colSpan={10} className="bd-onsite-no-data">
                    No requests found
                  </td>
                </tr>
              )}

              {requests.map((req, index) => (
                <tr key={req.id} className="bd-onsite-row">
                  <td>{index + 1}</td>
                  <td>{req.model}</td>
                  <td>{req.date_of_occurance}</td>
                  <td>{req.serial}</td>
                  <td>{req.reported_by}</td>
                  <td>{req.description}</td>

                  <td>
                    <span
                      className={`bd-onsite-status-badge ${
                        req.status
                          ? req.status.toLowerCase().replace(/[_\s]/g, "-")
                          : ""
                      }`}
                    >
                      {req.status
                        ? req.status.charAt(0).toUpperCase() +
                          req.status.slice(1).toLowerCase()
                        : "-"}
                    </span>
                  </td>

                  <td>{req.bd_team || "-"}</td>

                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleView(req)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className="review-button"
                      onClick={() => openReview(req)}
                    >
                      Review & Assign
                    </button>
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td colSpan={10} className="bd-onsite-loading">
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
              <h3>New On-Site Request</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="onsite-form-scroll">
              <div className="form-group">
                <label>Client ID</label>
                <input
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  className={errors.clientId ? "input-error" : ""}
                />
                {errors.clientId && (
                  <div className="error-text">{errors.clientId}</div>
                )}
              </div>

              <div className="form-group">
                <label>UAS Model</label>
                <input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={errors.model ? "input-error" : ""}
                />
                {errors.model && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Serial Number</label>
                <input
                  name="serial"
                  value={formData.serial}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Flight Controller</label>
                <input
                  name="flightController"
                  value={formData.flightController}
                  onChange={handleChange}
                  className={errors.flightController ? "input-error" : ""}
                />
                {errors.flightController && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Date of Occurrence</label>
                <input
                  type="date"
                  name="date_of_occurance"
                  value={formData.date_of_occurance}
                  onChange={handleChange}
                  className={errors.date_of_occurance ? "input-error" : ""}
                />
                {errors.date_of_occurance && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Total Accumulated Hours</label>
                <input
                  name="totalHours"
                  value={formData.totalHours}
                  onChange={handleChange}
                  className={errors.totalHours ? "input-error" : ""}
                />
                {errors.totalHours && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description of Difficulty</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? "input-error" : ""}
                />
                {errors.description && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Affected Subsystem</label>
                <input
                  name="subsystem"
                  value={formData.subsystem}
                  onChange={handleChange}
                  className={errors.subsystem ? "input-error" : ""}
                />
                {errors.subsystem && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Symptoms Observed</label>
                <input
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  className={errors.symptoms ? "input-error" : ""}
                />
                {errors.symptoms && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Environmental Conditions</label>
                <input
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  className={errors.environment ? "input-error" : ""}
                />
                {errors.environment && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Operator Actions Taken</label>
                <input
                  name="actions"
                  value={formData.actions}
                  onChange={handleChange}
                  className={errors.actions ? "input-error" : ""}
                />
                {errors.actions && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Immediate Consequence</label>
                <input
                  name="consequence"
                  value={formData.consequence}
                  onChange={handleChange}
                  className={errors.consequence ? "input-error" : ""}
                />
                {errors.consequence && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Corrective Actions Taken</label>
                <input
                  name="correctiveActions"
                  value={formData.correctiveActions}
                  onChange={handleChange}
                  className={errors.correctiveActions ? "input-error" : ""}
                />
                {errors.correctiveActions && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Reported By</label>
                <input
                  name="reportedBy"
                  value={formData.reportedBy}
                  onChange={handleChange}
                  className={errors.reportedBy ? "input-error" : ""}
                />
                {errors.reportedBy && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Reported Date</label>
                <input
                  type="date"
                  name="reportedDate"
                  value={formData.reportedDate}
                  onChange={handleChange}
                  className={errors.reportedDate ? "input-error" : ""}
                />
                {errors.reportedDate && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "input-error" : ""}
                />
                {errors.address && (
                  <div className="error-text">
                    * Please fill the required field
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>

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

      {reviewPopup && currentRequest && (
        <div className="Onsite-popup1">
          <div className="Onsite-popup2">
            <div className="Onsite-popup3">
              <h3>Review & Assign Request</h3>
              <button
                className="close-btn"
                onClick={() => setReviewPopup(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="onsite-form-scroll">
              <div className="bd-team-field">
                <label>BD Team</label>
                <div className="bd-team-box">{user?.name}</div>
              </div>
              <AssignTechnician
                technicians={technicians}
                reviewData={reviewData}
                setReviewData={setReviewData}
                currentRequest={currentRequest}
              />
              <label>BD Review Notes</label>
              <textarea
                value={reviewData.bdReview || ""}
                onChange={(e) =>
                  setReviewData({ ...reviewData, bdReview: e.target.value })
                }
              />
              <div className="onsite-popup-actions">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setReviewPopup(false)}
                >
                  Close
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
              <button className="close-btn" onClick={() => setViewPopup(false)}>
                ✕
              </button>
            </div>
            <div className="onsite-form-scroll">
              <label>Client ID</label>
              <input
                value={selectedRequest.client_detail?.employee_id || ""}
                disabled
              />

              <label>UAS Model</label>
              <input value={selectedRequest.model || ""} disabled />
              <label>Flight Controller</label>
              <input value={selectedRequest.flight_controller || ""} disabled />
              <label>Serial Number</label>
              <input value={selectedRequest.serial || ""} disabled />
              <label>Date of Occurrence</label>
              <input value={selectedRequest.date_of_occurance || ""} disabled />
              <label>Total Accumulated Hours</label>
              <input value={selectedRequest.total_hours || ""} disabled />
              <label>Description of Difficulty</label>
              <textarea value={selectedRequest.description || ""} disabled />
              <label>Affected Subsystem</label>
              <input value={selectedRequest.subsystem || ""} disabled />
              <label>Symptoms Observed</label>
              <input value={selectedRequest.symptoms || ""} disabled />
              <label>Environmental Conditions</label>
              <input value={selectedRequest.environment || ""} disabled />
              <label>Operator Actions Taken</label>
              <input value={selectedRequest.actions || ""} disabled />
              <label>Immediate Consequence</label>
              <input value={selectedRequest.consequence || ""} disabled />
              <label>Corrective Actions</label>
              <input
                value={selectedRequest.corrective_actions || ""}
                disabled
              />
              <label>Reported By</label>
              <input value={selectedRequest.reported_by || ""} disabled />
              <label>Reported Date</label>
              <input value={selectedRequest.reported_date || ""} disabled />
              <label>Address</label>
              <textarea value={selectedRequest.address || ""} disabled />
              <label>Remarks</label>
              <textarea value={selectedRequest.remarks || ""} disabled />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
