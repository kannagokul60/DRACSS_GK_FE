// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaMapMarkerAlt,
//   FaPhone,
//   FaHome,
//   FaInfoCircle,
//   FaIdCard,
//   FaBuilding,
//   FaPaperPlane,
// } from "react-icons/fa";
// import "../../CSS/BDteam/clientList.css";
// import phoneImg from "../../../assets/group.png";
// import BreadCrumbs from "../BreadCrumbs";

// export default function ClientList() {
//   const navigate = useNavigate();
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [selectedDrone, setSelectedDrone] = useState(null);

//   const clients = [
//     {
//       id: 1,
//       name: "Aero Vision Pvt Ltd",
//       phone: "+91 9876543210",
//       location: "Chennai, Tamil Nadu",
//       address: "123 Skyview Park, Velachery, Chennai - 600042",
//       company: "AeroTech Pvt Ltd",
//       idProof: "Aadhar - 2345 6789 1234",
//       joinedDate: "12-03-2024",
//       status: "Active",
//       photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//       drones: [
//         {
//           id: 1,
//           name: "Bhumi-X1",
//           date: "14-04-2024",
//           type: "Agriculture",
//           status: "Active",
//         },
//         {
//           id: 2,
//           name: "Vajra-V2",
//           date: "10-05-2024",
//           type: "Survey",
//           status: "Active",
//         },
//         {
//           id: 3,
//           name: "Agni-Z3",
//           date: "22-06-2024",
//           type: "Inspection",
//           status: "Inactive",
//         },
//         {
//           id: 4,
//           name: "Garuda-X5",
//           date: "01-08-2024",
//           type: "Delivery",
//           status: "Active",
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: "DroneX Solutions",
//       phone: "+91 9988776655",
//       location: "Bangalore, Karnataka",
//       address: "45 Tech Boulevard, Whitefield, Bangalore - 560066",
//       idProof: "GSTIN: 29AAECD7654L1Z2",
//       company: "DroneX Solutions Pvt Ltd",
//       joinedDate: "25 July 2024",
//       status: "Inactive",
//       photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//       drones: [
//         {
//           id: 1,
//           name: "Bhumi-X1",
//           date: "14-04-2024",
//           type: "Agriculture",
//           status: "Active",
//         },
//         {
//           id: 2,
//           name: "Vajra-V2",
//           date: "10-05-2024",
//           type: "Survey",
//           status: "Active",
//         },
//         {
//           id: 3,
//           name: "Agni-Z3",
//           date: "22-06-2024",
//           type: "Inspection",
//           status: "Inactive",
//         },
//         {
//           id: 4,
//           name: "Garuda-X5",
//           date: "01-08-2024",
//           type: "Delivery",
//           status: "Active",
//         },
//       ],
//     },
//     {
//       id: 3,
//       name: "FlyHigh Innovations",
//       phone: "+91 9123456789",
//       location: "Hyderabad, Telangana",
//       address: "7 Cloud Tower, Banjara Hills, Hyderabad - 500034",
//       idProof: "GSTIN: 36AAEFI9812K1Z3",
//       company: "FlyHigh Innovations LLP",
//       joinedDate: "15 January 2025",
//       status: "Active",
//       photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//       drones: [
//         {
//           id: 1,
//           name: "Bhumi-X1",
//           date: "14-04-2024",
//           type: "Agriculture",
//           status: "Active",
//         },
//         {
//           id: 2,
//           name: "Vajra-V2",
//           date: "10-05-2024",
//           type: "Survey",
//           status: "Active",
//         },
//         {
//           id: 3,
//           name: "Agni-Z3",
//           date: "22-06-2024",
//           type: "Inspection",
//           status: "Inactive",
//         },
//         {
//           id: 4,
//           name: "Garuda-X5",
//           date: "01-08-2024",
//           type: "Delivery",
//           status: "Active",
//         },
//       ],
//     },
//   ];

//   const handleViewDetails = (client) => {
//     navigate(`/bd/client-drone-list/${client.id}`, { state: client });
//   };

//   const handleInfoClick = (client, e) => {
//     e.stopPropagation(); // prevent card click navigation
//     setSelectedClient(client);
//   };

//   return (
//     <div className="client-list-container">
//       <div className="clientlist-breadcrumb-wrapper">
//         <BreadCrumbs />
//       </div>

//       <h2 className="client-list-title">Client Directory</h2>

//       <div className="client-card-grid">
//         {clients.map((c) => (
//           <div
//             key={c.id}
//             className="client-card"
//             onClick={() => handleViewDetails(c)}
//           >
//             {/* Status Badge */}
//             <span className={`status-badge ${c.status?.toLowerCase()}`}>
//               {c.status}
//             </span>

//             <h3 className="client-name">{c.name}</h3>

//             <div className="client-info-line">
//               <img src={phoneImg} alt="" className="info-icon" />
//               <span>{c.phone}</span>
//             </div>

//             <p>
//               <FaMapMarkerAlt className="info-icon" /> {c.location}
//             </p>
//             <p>
//               <FaHome className="info-icon" /> {c.address}
//             </p>

//             <FaInfoCircle
//               className="info-popup-icon"
//               title="View Client Details"
//               onClick={(e) => handleInfoClick(c, e)}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Popup Modal */}
//       {selectedClient && (
//         <div className="popup-overlay" onClick={() => setSelectedClient(null)}>
//           <div className="popup-card" onClick={(e) => e.stopPropagation()}>
//             <div className="popup-header">
//               <h3>Client Details</h3>
//               <button
//                 className="close-btn"
//                 onClick={() => setSelectedClient(null)}
//               >
//                 ✖
//               </button>
//             </div>

//             <div className="popup-image-wrapper">
//               <img
//                 src={selectedClient.photo}
//                 alt={selectedClient.name}
//                 className="popup-profile-img"
//               />
//             </div>

//             <div className="popup-body">
//               <p>
//                 <strong>
//                    Name:
//                 </strong>{" "}
//                 {selectedClient.name}
//               </p>
//               <p>
//                 <strong>
//                    Phone:
//                 </strong>{" "}
//                 {selectedClient.phone}
//               </p>
//               <p>
//                 <strong>
//                    Location:
//                 </strong>{" "}
//                 {selectedClient.location}
//               </p>
//               <p>
//                 <strong>
//                    Address:
//                 </strong>{" "}
//                 {selectedClient.address}
//               </p>
//               <p>
//                 <strong>
//                   Company:
//                 </strong>{" "}
//                 {selectedClient.company}
//               </p>
//               <p>
//                 <strong>ID Proof:</strong> {selectedClient.idProof}
//               </p>
//               <p>
//                 <strong>Joined On:</strong> {selectedClient.joinedDate}
//               </p>
//               {/* <div className="drone-purchase-section">
//                 <p className="drone-purchase-header">
//                   <strong>
//                      Drones Purchased:
//                   </strong>{" "}
//                   {selectedClient.drones.length}
//                 </p>

//                 <select
//                   className="drone-select"
//                   onChange={(e) =>
//                     setSelectedDrone(
//                       selectedClient.drones.find(
//                         (d) => d.id === Number(e.target.value)
//                       )
//                     )
//                   }
//                 >
//                   <option value="">-- Select Drone --</option>
//                   {selectedClient.drones.map((drone) => (
//                     <option key={drone.id} value={drone.id}>
//                       {drone.name} ({drone.date})
//                     </option>
//                   ))}
//                 </select>

//                 {selectedDrone && (
//                   <div className="drone-details">
//                     <p>
//                       <strong>Drone Name:</strong> {selectedDrone.name}
//                     </p>
//                     <p>
//                       <strong>Purchase Date:</strong> {selectedDrone.date}
//                     </p>
//                     <p>
//                       <strong>Type:</strong> {selectedDrone.type}
//                     </p>
//                     <p>
//                       <strong>Status:</strong> {selectedDrone.status}
//                     </p>
//                   </div>
//                 )}
//               </div> */}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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

// Optional: keep this only as reference; not used for rendering now
// const initialClients = [ ... ];

// Helper to map API client object to UI shape
const mapApiClientToUi = (c) => ({
  id: c.id,
  name: c.name,
  phone: c.phone,
  email: c.email,
  location: c.location,
  idProof: c.id_proof || "",
  joinedDate: c.joined_date || "",
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

  // Start with an empty list; will be filled from API
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDrone, setSelectedDrone] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Add Client modal state
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
  });

  // 🔹 Fetch clients from backend on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/clients/");
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to fetch clients");
        }
        const data = await res.json();
        // If your API is paginated, use data.results instead
        const list = Array.isArray(data) ? data : data.results || [];
        setClients(list.map(mapApiClientToUi));
      } catch (err) {
        console.error("Error loading clients:", err);
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
    e.stopPropagation(); // prevent card click navigation
    setSelectedClient(client);
  };

  // 🔹 Handle input change for Add Client form
  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Submit new client -> POST to API and update local state
  const handleAddClientSubmit = async (e) => {
    e.preventDefault();

    // Simple validation: Name & Phone required
    if (!newClient.name.trim() || !newClient.phone.trim()) {
      alert("Name and Phone are required.");
      return;
    }

    // Map form state -> backend payload (snake_case for DRF)
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
      // Add address/company/status/joined_date if your API expects them
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/clients/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // if you use auth
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create client:", errorText);
        alert("Failed to save client. Check console for details.");
        return;
      }

      const created = await response.json();
      const clientToAdd = mapApiClientToUi(created);

      setClients((prev) => [...prev, clientToAdd]);
      setShowAddModal(false);

      // Reset form
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
      });
    } catch (err) {
      console.error("Error while saving client:", err);
      alert("Something went wrong while saving client.");
    }
  };

  return (
    <div className="client-list-container">
      <div className="clientlist-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      {/* Header with title + + button on right corner */}
      <div className="client-list-header">
        <h2 className="client-list-title">Client Directory</h2>
        <button
          className="add-client-btn"
          onClick={() => setShowAddModal(true)}
          title="Add New Client"
        >
          <FaPlus className="add-client-icon" />{" "}
          <span className="add-client-text">New Client</span>
        </button>
      </div>

      {/* Loading / Error states */}
      {loading && <p>Loading clients...</p>}
      {loadError && <p className="error-text">{loadError}</p>}

      <div className="client-card-grid">
        {!loading &&
          !loadError &&
          clients.map((c) => (
            <div
              key={c.id}
              className="client-card"
              onClick={() => handleViewDetails(c)}
            >
              {/* Status Badge */}
              <span className={`status-badge ${c.status?.toLowerCase()}`}>
                {c.status}
              </span>

              <h3 className="client-name">{c.name}</h3>

              <div className="client-info-line">
                <img src={phoneImg} alt="" className="info-icon" />
                <span>{c.phone}</span>
              </div>

              <p>
                <FaEnvelope className="info-icon" /> {c.email}
              </p>
              <p>
                <FaHome className="info-icon" /> {c.location}
              </p>

              <FaInfoCircle
                className="info-popup-icon"
                title="View Client Details"
                onClick={(e) => handleInfoClick(c, e)}
              />
            </div>
          ))}
      </div>

      {/* Existing Client Details Popup Modal */}
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
              <img
                src={selectedClient.photo}
                alt={selectedClient.name}
                className="popup-profile-img"
              />
            </div>

            <div className="popup-body">
              <p>
                <strong>Name:</strong> {selectedClient.name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedClient.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedClient.email || "-"}
              </p>
              <p>
                <strong>Location:</strong> {selectedClient.location}
              </p>
              {/* <p>
                <strong>Address:</strong> {selectedClient.address}
              </p> */}
              {/* <p>
                <strong>Company:</strong> {selectedClient.company || "-"}
              </p> */}
              <p>
                <strong>ID Proof:</strong> {selectedClient.idProof}
              </p>
              <p>
                <strong>Joined On:</strong> {selectedClient.joinedDate}
              </p>
              <p>
                <strong>Bank Name:</strong> {selectedClient.bankName || "-"}
              </p>
              <p>
                <strong>Account Number:</strong>{" "}
                {selectedClient.accountNumber || "-"}
              </p>
              <p>
                <strong>IFSC Code:</strong> {selectedClient.ifscCode || "-"}
              </p>
              <p>
                <strong>Branch Name:</strong> {selectedClient.branchName || "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add New Client Popup Modal */}
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

            <form
              className="popup-body add-client-form"
              onSubmit={handleAddClientSubmit}
            >
              <div className="form-row">
                <label>
                  Name *
                  <input
                    type="text"
                    name="name"
                    value={newClient.name}
                    onChange={handleNewClientChange}
                    required
                  />
                </label>
                <label>
                  Phone *
                  <input
                    type="text"
                    name="phone"
                    value={newClient.phone}
                    onChange={handleNewClientChange}
                    required
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={newClient.email}
                    onChange={handleNewClientChange}
                  />
                </label>
                <label>
                  Location
                  <input
                    type="text"
                    name="location"
                    value={newClient.location}
                    onChange={handleNewClientChange}
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  ID Proof
                  <input
                    type="text"
                    name="idProof"
                    value={newClient.idProof}
                    onChange={handleNewClientChange}
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Bank Name
                  <input
                    type="text"
                    name="bankName"
                    value={newClient.bankName}
                    onChange={handleNewClientChange}
                  />
                </label>
                <label>
                  Account Number
                  <input
                    type="text"
                    name="accountNumber"
                    value={newClient.accountNumber}
                    onChange={handleNewClientChange}
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  IFSC Code
                  <input
                    type="text"
                    name="ifscCode"
                    value={newClient.ifscCode}
                    onChange={handleNewClientChange}
                  />
                </label>
                <label>
                  Branch Name
                  <input
                    type="text"
                    name="branchName"
                    value={newClient.branchName}
                    onChange={handleNewClientChange}
                  />
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
