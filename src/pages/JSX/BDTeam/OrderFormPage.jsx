import React, { useState, useEffect } from "react";
import "../../CSS/BDteam/orderForm.css";

export default function OrderFormPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [backendItems, setBackendItems] = useState([]); // raw items from API
  const [formState, setFormState] = useState({}); // { [id]: { checked, remark } }
  const [manualAccessories, setManualAccessories] = useState([]);
  const [droneName, setDroneName] = useState("");
  const [droneQty, setDroneQty] = useState(1);
  const API_URL = "http://127.0.0.1:8000/api/checklist-items/";

  // Load previously saved orders (if you have endpoint; fallback empty)
  useEffect(() => {
    // if you have an orders endpoint you can replace this fetch
    setOrders([]); // start empty
  }, []);

  // Fetch checklist items from backend and initialize formState
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch checklist items");
        return res.json();
      })
      .then((data) => {
        // sort by sort_order to keep sections ordered
        data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setBackendItems(data);

        // initialize formState per item id
        const init = {};
        data.forEach((item) => {
          init[item.id] = {
            checked: !!item.checklist,
            remark: ""
          };
        });
        setFormState(init);
      })
      .catch((err) => {
        console.error("Fetch checklist error:", err);
        setBackendItems([]); // keep UI robust
      });
  }, []);

  // Helpers for grouped rendering by description (section)
  const groupByDescription = () => {
    const groups = {};
    backendItems.forEach((it) => {
      const key = it.description || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(it);
    });
    return groups;
  };

  const openChecklist = () => {
    setShowPopup(true);
  };

  const toggleCheckbox = (id) => {
    setFormState((prev) => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id].checked }
    }));
  };

  const updateRemark = (id, value) => {
    setFormState((prev) => ({
      ...prev,
      [id]: { ...prev[id], remark: value }
    }));
  };

  const addAccessoryRow = () => {
    setManualAccessories((prev) => [
      ...prev,
      { name: "", qty: 1, remark: "", checked: false }
    ]);
  };

  const updateAccessory = (index, field, value) => {
    setManualAccessories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Build payload (array of items) and POST to backend
  const handleSave = async () => {
    // Build payload array from backendItems and manual accessories
    const payload = backendItems.map((item) => ({
      id: item.id, // existing id
      description: item.description,
      bhumi_a10e_drone: item.bhumi_a10e_drone,
      nos: item.nos,
      checklist: !!(formState[item.id] && formState[item.id].checked),
      sort_order: item.sort_order,
      remark: (formState[item.id] && formState[item.id].remark) || ""
    }));

    // Append manual accessories as new items (id = null)
    manualAccessories.forEach((acc, idx) => {
      // only include non-empty accessory names (skip blank rows)
      if (!acc.name?.trim()) return;
      payload.push({
        id: null,
        description: "Accessories",
        bhumi_a10e_drone: acc.name,
        nos: Number(acc.qty) || 1,
        checklist: !!acc.checked,
        sort_order: 1000 + idx, // arbitrary large sort for manual items
        remark: acc.remark || ""
      });
    });

    // Also include drone-level metadata as a separate object? 
    // Your backend sample is item-level; if you need top-level metadata adjust backend to accept combined object.
    // We're posting array of items as your last examples showed earlier.

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Save failed:", text);
        alert("Failed to save checklist. See console for details.");
        return;
      }

      // server response (depending on your API might return created objects)
      const resData = await res.json();
      console.log("Saved response:", resData);

      // add a simple order row to UI for user's table
      setOrders((prev) => [
        ...prev,
        {
          orderId: "ORD" + Date.now(),
          client: "Client Name",
          date: new Date().toLocaleDateString(),
          status: "Moved to Inventory"
        }
      ]);

      // reset popup related state (keep backendItems)
      setShowPopup(false);
      setManualAccessories([]);
      setDroneName("");
      setDroneQty(1);

      alert("Checklist saved & moved to inventory.");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving checklist (see console).");
    }
  };

  const grouped = groupByDescription();

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
                <td>{i + 1}</td>
                <td>{o.orderId}</td>
                <td>{o.client}</td>
                <td>{o.date}</td>
                <td className={`status ${o.status.toLowerCase()}`}>{o.status}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => alert("Open view page (implement as needed)")}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CHECKLIST POPUP */}
      {showPopup && (
        <div className="popup-bg">
          <div className="popup-box big-box">
            <h3 className="popup-title-centered">Delivery Checklist Form</h3>

            {/* Top inputs */}
            <div className="popup-input-row">
              <div className="input-group">
                <label>Drone Name</label>
                <input
                  type="text"
                  className="top-input"
                  placeholder="Enter Drone Name"
                  value={droneName}
                  onChange={(e) => setDroneName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>No. of Drones</label>
                <input
                  type="number"
                  className="top-input"
                  placeholder="Qty"
                  min="1"
                  value={droneQty}
                  onChange={(e) => setDroneQty(e.target.value)}
                />
              </div>
            </div>

            {/* Render each section in the order received */}
            {Object.keys(grouped).map((sectionTitle) => (
              <div className="section" key={sectionTitle}>
                <h4>{sectionTitle}</h4>

                {grouped[sectionTitle].map((item) => (
                  <div className="form-row" key={item.id}>
                    <div className="item-name">{item.bhumi_a10e_drone}</div>
                    <div className="item-qty">Qty: {item.nos}</div>

                    <input
                      type="text"
                      className="remarks-input"
                      placeholder="Remarks"
                      value={formState[item.id]?.remark || ""}
                      onChange={(e) => updateRemark(item.id, e.target.value)}
                    />

                    <input
                      type="checkbox"
                      className="included-check"
                      checked={!!formState[item.id]?.checked}
                      onChange={() => toggleCheckbox(item.id)}
                    />
                  </div>
                ))}
              </div>
            ))}

            {/* Manual accessories section */}
            <div className="section">
              <h4>Additional Accessories</h4>

              {manualAccessories.map((row, idx) => (
                <div className="form-row" key={`manual-${idx}`}>
                  <input
                    type="text"
                    className="item-name-input"
                    placeholder="Accessory Name"
                    value={row.name}
                    onChange={(e) => updateAccessory(idx, "name", e.target.value)}
                  />

                  <input
                    type="number"
                    className="item-qty-input"
                    placeholder="Qty"
                    value={row.qty}
                    onChange={(e) => updateAccessory(idx, "qty", e.target.value)}
                  />

                  <input
                    type="text"
                    className="remarks-input"
                    placeholder="Remarks"
                    value={row.remark}
                    onChange={(e) => updateAccessory(idx, "remark", e.target.value)}
                  />

                  <input
                    type="checkbox"
                    className="included-check"
                    checked={!!row.checked}
                    onChange={(e) => updateAccessory(idx, "checked", e.target.checked)}
                  />
                </div>
              ))}

              <button className="add-row-btn" onClick={addAccessoryRow}>
                + Add Accessory
              </button>
            </div>

            {/* Action buttons */}
            <div className="popup-actions">
              <button className="save-btn" onClick={handleSave}>
                Move to Inventory
              </button>
              <button className="cancel-btn" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
