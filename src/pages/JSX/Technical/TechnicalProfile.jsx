import React, { useState } from "react";
import "../../CSS/Technical/profile.css";
import {
  FaUser,
  FaSave,
  FaEdit,
  FaTimesCircle
} from "react-icons/fa";
import BreadCrumbs from "../BreadCrumbs";

export default function TechnicalProfile() {

  const [isEditing, setIsEditing] = useState(false);

  const [originalProfile] = useState({
    name: "Gokul Kanna",
    email: "gokul@example.com",
    phone: "+91 9876543210",
    address: "DroneTech Park, Coimbatore",
    role: "Technical",
    empId: "TECH1023",
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
    <div className="technical-profile-page">

      <div className="technical-profile-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <div className="technical-profile-card">

     <div className="technical-profile-header-row">

  {/* LEFT ICON */}
  <div className="technical-header-left">
    <FaUser />
  </div>

  {/* CENTER TITLE */}
  <h2 className="technical-profile-header">
    Pilot Team Profile
  </h2>

  {/* RIGHT EDIT BUTTON */}
  <div className="technical-header-right">
    {!isEditing && (
      <button
        className="technical-edit-btn"
        onClick={() => setIsEditing(true)}
      >
        <FaEdit />
      </button>
    )}
  </div>

</div>

        {!isEditing ? (

          <div className="technical-profile-view">

            <p><strong>Full Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone Number:</strong> {profile.phone}</p>
            <p><strong>Role / Designation:</strong> {profile.role}</p>
            <p><strong>Employee ID:</strong> {profile.empId}</p>
            <p><strong>Address:</strong> {profile.address}</p>

          </div>

        ) : (

          <div className="technical-form-section">

            <label>
              Full Name
              <input name="name" value={profile.name} onChange={handleChange}/>
            </label>

            <label>
              Email
              <input name="email" value={profile.email} onChange={handleChange}/>
            </label>

            <label>
              Phone Number
              <input name="phone" value={profile.phone} onChange={handleChange}/>
            </label>

            <label>
              Role / Designation
              <input name="role" value={profile.role} onChange={handleChange}/>
            </label>

            <label>
              Employee ID
              <input name="empId" value={profile.empId} onChange={handleChange}/>
            </label>

            <label>
              Address
              <textarea name="address" value={profile.address} onChange={handleChange}/>
            </label>

            <div className="technical-profile-btn-group">

              <button className="technical-save-btn" onClick={handleSave}>
                <FaSave /> Save Changes
              </button>

              <button className="technical-cancel-btn" onClick={handleCancel}>
                <FaTimesCircle /> Cancel
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}