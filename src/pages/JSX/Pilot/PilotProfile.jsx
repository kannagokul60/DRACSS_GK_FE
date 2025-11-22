import React, { useState } from "react";
import "../../CSS/BDTeam/profile.css";
import { FaUser, FaPhone, FaHome, FaSave, FaEdit, FaTimesCircle } from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";

export default function PilotProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [originalProfile] = useState({
    name: "Gokul Kanna",
    email: "gokul@example.com",
    phone: "+91 9876543210",
    address: "DroneTech Park, Coimbatore",
    role: "Pilot",
    empId: "PD1023",
  });

  const [profile, setProfile] = useState({ ...originalProfile });

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
        <div className="profile-header-row">
          <h2 className="profile-header">
            <FaUser /> Pilot Team Profile
          </h2>
          {!isEditing && (
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
              title="Edit Profile"
            >
              <FaEdit />
            </button>
          )}
        </div>

        {/* ===== VIEW MODE ===== */}
        {!isEditing ? (
          <div className="profile-view">
            <p><strong>Full Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone Number:</strong> {profile.phone}</p>
            <p><strong>Role / Designation:</strong> {profile.role}</p>
            <p><strong>Employee ID:</strong> {profile.empId}</p>
            <p><strong>Address:</strong> {profile.address}</p>
          </div>
        ) : (
          // ===== EDIT MODE =====
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
              Phone Number
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </label>

            <label>
              Role / Designation
              <input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleChange}
              />
            </label>

            <label>
              Employee ID
              <input
                type="text"
                name="empId"
                value={profile.empId}
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

            <div className="profile-btn-group">
              <button className="save-btn" onClick={handleSave}>
                <FaSave /> Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <FaTimesCircle /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
