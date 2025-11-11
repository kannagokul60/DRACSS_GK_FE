import React, { useState } from "react";
import "../../CSS/Client/profiledetails.css";
import {
  FaUser,
  FaUniversity,
  FaSave,
  FaPhone,
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
    setIsEditing(false);
  };
  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
    alert("Changes canceled ❌");
  };

  return (
    <div className="profile-page">
      <div className="profile-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>
      <div className="profile-card">
        <h2 className="profile-header">
          <FaUser /> My Profile
        </h2>

        <div className="tab-buttons">
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

        <div className="tab-content">
          {activeTab === "personal" && (
            <div className="form-section">
              <label>
                Full Name
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Phone
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                Address
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                ></textarea>
              </label>
            </div>
          )}

          {activeTab === "bank" && (
            <div className="form-section">
              <label>
                Bank Name
                <input
                  type="text"
                  name="accountNumber"
                  value={profile.bankName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Account Number
                <input
                  type="text"
                  name="accountNumber"
                  value={profile.accountNumber}
                  onChange={handleChange}
                />
              </label>
              <label>
                IFSC Code
                <input
                  type="text"
                  name="ifsc"
                  value={profile.ifsc}
                  onChange={handleChange}
                />
              </label>
              <label>
                Branch Name
                <input
                  type="text"
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                />
              </label>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="form-section">
              <label>
                Pin Code
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </label>
              <label>
                House No/Tower/Block
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Address(building,street)
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                ></textarea>
              </label>
              <label>
                Locality/Town
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                City/District{" "}
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                State{" "}
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </label>
            </div>
          )}
        </div>

        <div className="profile-btn-group">
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
          {/* <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button> */}
        </div>
      </div>
    </div>
  );
}
