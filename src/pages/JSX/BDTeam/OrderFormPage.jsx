import React, { useState, useEffect } from "react";
import "../../CSS/BDteam/orderForm.css";

export default function OrderFormPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [checked, setChecked] = useState({});
  const [orders, setOrders] = useState([]);
  const [manualAccessories, setManualAccessories] = useState([]);


  useEffect(() => {
    // Fetch previous order form data from backend
    fetch("/api/bd/order-forms")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(() => {});
  }, []);

  const openChecklist = () => {
    setChecked({});
    setShowPopup(true);
  };

  const addAccessoryRow = () => {
  setManualAccessories([
    ...manualAccessories,
    { name: "", qty: "", remark: "", checked: false }
  ]);
};

const updateAccessory = (index, field, value) => {
  const updated = [...manualAccessories];
  updated[index][field] = value;
  setManualAccessories(updated);
};
                

  const toggleItem = (item) => {
    setChecked({ ...checked, [item]: !checked[item] });
  };

  const handleSave = () => {
    const selectedItems = Object.keys(checked).filter((k) => checked[k]);

    const newRecord = {
      orderId: "ORD" + Date.now(),
      client: "Client Name",
      date: new Date().toLocaleDateString(),
      status: "Moved to Inventory",
      items: selectedItems,
    };

    setOrders([...orders, newRecord]);
    setShowPopup(false);
  };

  return (
   <div className="orderform-page">

<div className="orderform-header-wrapper">
  <h2 className="orderform-header">Order Forms</h2>
  <button className="plus-btn orderform-plus-btn" onClick={openChecklist}>
    +
  </button>
</div>


   {/* ORDER FORM TABLE */}
<div className="order-table-wrapper">  
  <table>
    <thead>
      <tr>
        <th>S.No</th>
        <th>Order ID</th>
        <th>Client</th>
        <th>Date</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {orders.map((o, i) => (
        <tr key={i}>
          <td>{i + 1}</td>  {/* S.No */}
          <td>{o.orderId}</td>
          <td>{o.client}</td>
          <td>{o.date}</td>
          <td className={`status ${o.status.toLowerCase()}`}>
            {o.status}
          </td>
          <td>
            <button className="view-btn" onClick={() => alert("Open view page")}>
              View
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* CHECKLIST POPUP (INSIDE SAME FILE) */}
 {showPopup && (
  <div className="popup-bg">
    <div className="popup-box big-box">

    {/* ===== TITLE CENTERED ===== */}
      <h3 className="popup-title-centered">Delivery Checklist Form</h3>

      {/* ===== DRONE NAME + QTY BELOW TITLE (RIGHT SIDE) ===== */}
      <div className="popup-input-row">
        <div className="input-group">
          <label>Drone Name</label>
          <input
            type="text"
            className="top-input"
            placeholder="Enter Drone Name"
          />
        </div>

        <div className="input-group">
          <label>No. of Drones</label>
          <input
            type="number"
            className="top-input"
            placeholder="Qty"
            min="1"
          />
        </div>
      </div>

      {/* =========================== SECTIONS BELOW =========================== */}

      <div className="section">
        <h4>Standard Kit</h4>

        {[
          { name: "Propeller Set (1 CW; 1 CCW)", qty: 3 },
          { name: "Batteries Set (2 Nos.)", qty: 1 },
          { name: "GPS System", qty: 1 },
          { name: "Set complete accessories required for flight 1", qty: 1 },
          { name: "Communication Air Module", qty: 1 },
          { name: "Tool Kit", qty: 1 },
          { name: "User Manual", qty: 1 },
          { name: "Transportation Box", qty: 1 }
        ].map((item, i) => (
          <div className="form-row" key={i}>
            <div className="item-name">{item.name}</div>
            <div className="item-qty">Qty: {item.qty}</div>

            <input type="text" className="remarks-input" placeholder="Remarks" />

            <input
              type="checkbox"
              className="included-check"
              onChange={() => toggleItem(item.name)}
            />
          </div>
        ))}
      </div>

      {/* PAYLOAD */}
      <div className="section">
        <h4>Payload</h4>

        {[
          { name: "10 Litre Pesticide Tank", qty: 1 },
          { name: "Camera for Video Feed", qty: 1 }
        ].map((item, i) => (
          <div className="form-row" key={i}>
            <div className="item-name">{item.name}</div>
            <div className="item-qty">Qty: {item.qty}</div>

            <input type="text" className="remarks-input" placeholder="Remarks" />

            <input
              type="checkbox"
              className="included-check"
              onChange={() => toggleItem(item.name)}
            />
          </div>
        ))}
      </div>

      {/* GCS */}
      <div className="section">
        <h4>Ground Control Station</h4>

        <div className="form-row">
          <div className="item-name">
            Ground Control Station with joystick, Integrated display
          </div>
          <div className="item-qty">Qty: 1</div>

          <input type="text" className="remarks-input" placeholder="Remarks" />

          <input
            type="checkbox"
            className="included-check"
            onChange={() => toggleItem("GCS")}
          />
        </div>
      </div>

      {/* ACCESSORIES */}
 <div className="section">
  <h4>Accessories</h4>

  {/* DEFAULT ACCESSORY LIST */}
  {[
    { name: "Propeller Set (1 CW; 1 CCW)", qty: 4 },
    { name: "Nozzles", qty: 4 },
    { name: "Batteries Set (2 Nos.)", qty: 1 }
  ].map((item, i) => (
    <div className="form-row" key={i}>
      <div className="item-name">{item.name}</div>
      <div className="item-qty">Qty: {item.qty}</div>

      <input
        type="text"
        className="remarks-input"
        placeholder="Remarks"
      />

      <input
        type="checkbox"
        className="included-check"
        onChange={() => toggleItem(item.name)}
      />
    </div>
  ))}

  {/* MANUALLY ADDED ACCESSORY ROWS */}
  {manualAccessories.map((row, index) => (
    <div className="form-row" key={`manual-${index}`}>
      <input
        type="text"
        className="item-name-input"
        placeholder="Accessory Name"
        value={row.name}
        onChange={(e) => updateAccessory(index, "name", e.target.value)}
      />

      <input
        type="number"
        className="item-qty-input"
        placeholder="Qty"
        value={row.qty}
        onChange={(e) => updateAccessory(index, "qty", e.target.value)}
      />

      <input
        type="text"
        className="remarks-input"
        placeholder="Remarks"
        value={row.remark}
        onChange={(e) => updateAccessory(index, "remark", e.target.value)}
      />

      <input
        type="checkbox"
        className="included-check"
        checked={row.checked}
        onChange={(e) => updateAccessory(index, "checked", e.target.checked)}
      />
    </div>
  ))}

  {/* ADD NEW ACCESSORY BUTTON */}
  <button className="add-row-btn" onClick={addAccessoryRow}>
    + Add Accessory
  </button>
</div>


      {/* SOFTWARE */}
      <div className="section">
        <h4>Software</h4>

        {[{ name: "Perpetual Ground Control Software for Mission Planning , LiveFeed, And Data Status installed on GCS", qty: 4 }].map((item, i) => (
          <div className="form-row" key={i}>
            <div className="item-name">{item.name}</div>
            <div className="item-qty">Qty: {item.qty}</div>

            <input type="text" className="remarks-input" placeholder="Remarks" />

            <input
              type="checkbox"
              className="included-check"
              onChange={() => toggleItem(item.name)}
            />
          </div>
        ))}
      </div>

      {/* TRAINING */}
      <div className="section">
        <h4>Field Training</h4>

        {["Hands on Training will be Provided at your Location"].map((item, i) => (
          <div className="form-row" key={i}>
            <div className="item-name">{item}</div>
            <input type="text" className="remarks-input" placeholder="Remarks" />
            <input
              type="checkbox"
              className="included-check"
              onChange={() => toggleItem(item)}
            />
          </div>
        ))}
      </div>

      {/* RPC */}
      <div className="section">
        <h4>RPC Program</h4>

        {["Pilot training Program DGCA Certified"].map((item, i) => (
          <div className="form-row" key={i}>
            <div className="item-name">{item}</div>
            <input type="text" className="remarks-input" placeholder="Remarks" />
            <input
              type="checkbox"
              className="included-check"
              onChange={() => toggleItem(item)}
            />
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="popup-actions">
        <button className="save-btn" onClick={handleSave}>Move to Inventory</button>
        <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}
