import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaHome,
  FaInfoCircle,
  FaPlus,
  FaEnvelope,
} from "react-icons/fa";
import "../../CSS/BDteam/clientList.css";
import phoneImg from "../../../assets/group.png";
import BreadCrumbs from "../BreadCrumbs";
import { format } from "date-fns";
import config from "../../../config";
         
// Convert API response → UI structure
const mapApiClientToUi = (c) => ({
  id: c.id,
  name: c.name,
  phone: c.phone,
  email: c.email,
  location: c.location,
  address: c.address || "",
  company: c.company || "",
  idProof: c.id_proof || "",
  createdAt: c.created_at || "",
  status: c.status || "Active",
  bankName: c.bank_name || "",
  accountNumber: c.account_number || "",
  ifscCode: c.ifsc_code || "",
  branchName: c.branch_name || "",
  photo: c.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  drones: c.drones || [],
});

export default function ClientList() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDrone, setSelectedDrone] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [showMoveSold, setShowMoveSold] = useState(false);
const [sellDroneSerial, setSellDroneSerial] = useState("");
const [activeClientId, setActiveClientId] = useState(null);


const handleMoveToSold = (client) => {
  setActiveClientId(client.id);
  setShowMoveSold(true);
};


  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    idProof: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    created_at: "",
  });

  // Fetch from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${config.baseURL}/clients/`);
        if (!res.ok) throw new Error("Failed to load clients");

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];

        setClients(list.map(mapApiClientToUi));
      } catch (err) {
        setLoadError("Failed to load clients.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleViewDetails = (client) => {
    navigate(`/bd/client-drone-list/${client.id}`, { state: client });
  };

  const handleInfoClick = (client, e) => {
    e.stopPropagation();
    setSelectedClient(client);
  };

  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  // POST new client
  const handleAddClientSubmit = async (e) => {
    e.preventDefault();

    if (!newClient.name || !newClient.phone) {
      alert("Name & Phone are required.");
      return;
    }

    const payload = {
      name: newClient.name,
      phone: newClient.phone,
      email: newClient.email || "",
      location: newClient.location || "",
      id_proof: newClient.idProof || "",
      bank_name: newClient.bankName || "",
      account_number: newClient.accountNumber || "",
      ifsc_code: newClient.ifscCode || "",
      branch_name: newClient.branchName || "",
      created_at: newClient.created_at || "",
    };

    try {
      const res = await fetch(`${config.baseURL}/clients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to create client.");
        return;
      }

      const created = await res.json();
      setClients((prev) => [...prev, mapApiClientToUi(created)]);
      setShowAddModal(false);

      setNewClient({
        name: "",
        phone: "",
        email: "",
        location: "",
        idProof: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branchName: "",
        created_at: "",
      });
    } catch (err) {
      alert("Error saving client.");
    }
  };

  const formatShortDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "dd-MM-yyyy");
  };

  return (
   <div className="client-list-container">
  <div className="clientlist-breadcrumb-wrapper">
    <BreadCrumbs />
  </div>

  {/* Header */}
  <div className="client-list-header">
    <h2 className="client-list-title">Client Directory</h2>
    <button
      className="add-client-btn"
      onClick={() => setShowAddModal(true)}
    >
      <FaPlus className="add-client-icon" />
      <span className="add-client-text">New Client</span>
    </button>
  </div>

  {loading && <p>Loading clients...</p>}
  {loadError && <p className="error-text">{loadError}</p>}

  {/* Client Table */}
  <div className="client-table-wrapper">
    <table className="client-table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Location</th>
          <th>Status</th>
          <th>ID Proof</th>
          <th>Joined On</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {!loading &&
          clients.map((c, index) => (
            <tr key={c.id}>
              <td>{index + 1}</td>
              <td
                className="client-name-link"
                onClick={() => handleViewDetails(c)}
                style={{ cursor: "pointer", color: "#1565c0" }}
              >
                {c.name}
              </td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{c.location}</td>
              <td>
                <span className={`status-badge ${c.status?.toLowerCase()}`}>
                  {c.status}
                </span>
              </td>
              <td>{c.idProof}</td>
              <td>{formatShortDate(c.createdAt)}</td>
              <td>
                <button
                  className="view-btn"
                  onClick={(e) => handleInfoClick(c, e)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>

  {/* Client Details Popup */}
  {selectedClient && (
    <div className="popup-overlay" onClick={() => setSelectedClient(null)}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Client Details</h3>
          <button
            className="close-btn"
            onClick={() => setSelectedClient(null)}
          >
            ✖
          </button>
        </div>

        <div className="popup-image-wrapper">
          <img src={selectedClient.photo} className="popup-profile-img" />
        </div>

        <div className="popup-body">
          <p>
            <strong>Bank Name:</strong> {selectedClient.bankName}
          </p>
          <p>
            <strong>Account Number:</strong> {selectedClient.accountNumber}
          </p>
          <p>
            <strong>IFSC Code:</strong> {selectedClient.ifscCode}
          </p>
          <p>
            <strong>Branch Name:</strong> {selectedClient.branchName}
          </p>
          <p>
            <strong>Location:</strong> {selectedClient.location}
          </p>
          <p>
            <strong>ID Proof:</strong> {selectedClient.idProof}
          </p>
          <p>
            <strong>Email:</strong> {selectedClient.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedClient.phone}
          </p>
          <p>
            <strong>Joined On:</strong> {formatShortDate(selectedClient.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )}

  {/* Add Client Modal */}
  {showAddModal && (
    <div className="popup-overlay" onClick={() => setShowAddModal(false)}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Add New Client</h3>
          <button
            className="close-btn"
            onClick={() => setShowAddModal(false)}
          >
            ✖
          </button>
        </div>

        <form className="popup-body" onSubmit={handleAddClientSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Client Name"
            onChange={handleNewClientChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleNewClientChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleNewClientChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleNewClientChange}
          />
          <input
            type="text"
            name="idProof"
            placeholder="ID Proof"
            onChange={handleNewClientChange}
          />
          <input
            type="text"
            name="bankName"
            placeholder="Bank Name"
            onChange={handleNewClientChange}
          />
          <input
            type="text"
            name="accountNumber"
            placeholder="Account Number"
            onChange={handleNewClientChange}
          />
          <input
            type="text"
            name="ifscCode"
            placeholder="IFSC Code"
            onChange={handleNewClientChange}
          />
          <input
            type="text"
            name="branchName"
            placeholder="Branch Name"
            onChange={handleNewClientChange}
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  );
}
