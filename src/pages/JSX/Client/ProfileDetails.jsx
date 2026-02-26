import React, { useState } from "react";
import "../../CSS/Client/profiledetails.css";
import {
  FaUser,
  FaUniversity,
  FaHome,
  FaMapMarkerAlt,
} from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";

export default function ProfileDetails() {

  const [activeTab, setActiveTab] = useState("personal");

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    address: "123, Green Valley, Coimbatore",
    accountNumber: "123456789012",
    ifsc: "HDFC0001234",
    branch: "Gandhipuram Branch",
    bankName: "SBI of India",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile details saved successfully ✅");
  };

  return (
    <div className="client-profile-page">

      <div className="client-profile-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <div className="client-profile-card">

        <h2 className="client-profile-header">
          <FaUser /> My Profile
        </h2>

        <div className="client-profile-tabs">

          <button
            className={activeTab === "personal" ? "active" : ""}
            onClick={() => setActiveTab("personal")}
          >
            <FaHome /> Personal Info
          </button>

          <button
            className={activeTab === "bank" ? "active" : ""}
            onClick={() => setActiveTab("bank")}
          >
            <FaUniversity /> Bank Details
          </button>

          <button
            className={activeTab === "shipping" ? "active" : ""}
            onClick={() => setActiveTab("shipping")}
          >
            <FaMapMarkerAlt /> Shipping Address
          </button>

        </div>

        <div className="client-profile-tab-content">

          {activeTab === "personal" && (
            <div className="client-form-section">

              <label>Full Name
                <input name="name" value={profile.name} onChange={handleChange}/>
              </label>

              <label>Email
                <input name="email" value={profile.email} onChange={handleChange}/>
              </label>

              <label>Phone
                <input name="phone" value={profile.phone} onChange={handleChange}/>
              </label>

              <label>Address
                <textarea name="address" value={profile.address} onChange={handleChange}/>
              </label>

            </div>
          )}

          {activeTab === "bank" && (
            <div className="client-form-section">

              <label>Bank Name
                <input name="bankName" value={profile.bankName} onChange={handleChange}/>
              </label>

              <label>Account Number
                <input name="accountNumber" value={profile.accountNumber} onChange={handleChange}/>
              </label>

              <label>IFSC Code
                <input name="ifsc" value={profile.ifsc} onChange={handleChange}/>
              </label>

              <label>Branch Name
                <input name="branch" value={profile.branch} onChange={handleChange}/>
              </label>

            </div>
          )}

          {activeTab === "shipping" && (
            <div className="client-form-section">

              <label>Pin Code
                <input />
              </label>

              <label>House / Block
                <input />
              </label>

              <label>Address
                <textarea />
              </label>

              <label>City
                <input />
              </label>

              <label>State
                <input />
              </label>

            </div>
          )}

        </div>

        <div className="client-profile-btn-group">
          <button className="client-save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}