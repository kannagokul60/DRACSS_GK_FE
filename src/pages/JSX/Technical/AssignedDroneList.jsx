import React, { useEffect, useState } from "react";
import "../../CSS/Technical/assignedDroneList.css"

export default function AssignedDroneList() {
  const [assignedList, setAssignedList] = useState([]);
  const [details, setDetails] = useState(null); // When this is filled → show checklist

  // Load Assigned Drones
  useEffect(() => {
    const data = [
      { id: 101, drone_name: "X12 Agri Drone", qty: 1, date: "18 Nov 2025" },
      { id: 102, drone_name: "AERO S8", qty: 2, date: "18 Nov 2025" },
    ];
    setAssignedList(data);
  }, []);

  // Handle "View Details"
  const openChecklist = (itemId) => {
    // Replace this with API call for particular item details

    setDetails({
      drone_name: "X12 Agri Drone",
      qty: 1,
      checklist: {
        standard: [
          { name: "Propeller Set (1 CW; 1 CCW)", qty: 3, remark: "", checked: true },
          { name: "Batteries Set (2 Nos.)", qty: 1, remark: "", checked: true },
          { name: "GPS System", qty: 1, remark: "", checked: true },
        ],
        payload: [
          { name: "10 Litre Pesticide Tank", qty: 1, remark: "", checked: true },
          { name: "Camera for Video Feed", qty: 1, remark: "", checked: false },
        ],
      },
    });
  };

  // Close the checklist and return to table
  const closeChecklist = () => {
    setDetails(null);
  };

  return (
    <div className="assigned-wrap">

      {/* ============================
          SHOW TABLE IF NO DETAILS
      ============================== */}
      {!details && (
        <>
          <h2 className="assigned-title">New Drones Assigned for Assembly</h2>

          <table className="assigned-table">
            <thead>
              <tr>
                <th>Assigned ID</th>
                <th>Drone Name</th>
                <th>Quantity</th>
                <th>Assigned Date</th>
                <th>View Details</th>
              </tr>
            </thead>

            <tbody>
              {assignedList.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.drone_name}</td>
                  <td>{item.qty}</td>
                  <td>{item.date}</td>
                  <td>
                    <button className="view-btn" onClick={() => openChecklist(item.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ============================
          SHOW DELIVERY CHECKLIST FORM
      ============================== */}
     {details && (
  <div className="delivery-popup-overlay">
 <div className="delivery-popup">

  {/* BACK BUTTON (TOP-LEFT) */}
  <button className="delivery-back-btn" onClick={closeChecklist}>
    ← Back
  </button>

  {/* TITLE */}
  <h3 className="delivery-title">Delivery Checklist Form</h3>

  {/* TOP INPUTS */}
  <div className="delivery-input-row">
    <div className="delivery-input-group">
      <label>Drone Name</label>
      <input type="text" value={details.drone_name} disabled />
    </div>

    <div className="delivery-input-group">
      <label>No. of Drones</label>
      <input type="number" value={details.qty} disabled />
    </div>
  </div>

  {/* --- STANDARD KIT --- */}
  <div className="delivery-section">
    <h4>Standard Kit</h4>

    {details.checklist.standard.map((item, i) => (
      <div className="delivery-row" key={i}>
        <div className="delivery-item-name">{item.name}</div>
        <div className="delivery-item-qty">Qty: {item.qty}</div>
        <input
          type="text"
          value={item.remark}
          disabled
          className="delivery-remark"
          placeholder="make it fast"
        />
      </div>
    ))}
  </div>

  {/* --- PAYLOAD --- */}
  <div className="delivery-section">
    <h4>Payload</h4>

    {details.checklist.payload.map((item, i) => (
      <div className="delivery-row" key={i}>
        <div className="delivery-item-name">{item.name}</div>
        <div className="delivery-item-qty">Qty: {item.qty}</div>
        <input
          type="text"
          value={item.remark}
          disabled
          className="delivery-remark"
          placeholder="make it fast"
        />
      </div>
    ))}
  </div>

</div>

  </div>
)}

    </div>
  );
}
