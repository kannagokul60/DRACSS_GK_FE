import React, { useState, useEffect } from "react";
import "../../CSS/BDteam/orderForm.css";
import { format } from "date-fns";
import config from "../../../config"

export default function OrderFormPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [backendItems, setBackendItems] = useState([]);
  const [formState, setFormState] = useState({});
  const [manualAccessories, setManualAccessories] = useState([]);

  const [droneName, setDroneName] = useState("");
  const [cusName, setCusName] = useState("");
  const [droneQty, setDroneQty] = useState(1);

  const [viewOrder, setViewOrder] = useState(null);

  // Fetch existing orders
  useEffect(() => {
    fetch(`${config.baseURL}/orders/`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Order fetch error:", err));
  }, []);

  // Fetch checklist items from backend
  useEffect(() => {
    fetch(`${config.baseURL}/checklist-items/`)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => a.sort_order - b.sort_order);
        setBackendItems(data);

        const init = {};
        data.forEach((it) => {
          init[it.id] = {
            checked: it.is_mandatory,
            remark: "",
          };
        });

        setFormState(init);
      })
      .catch((err) => console.error("Checklist fetch error:", err));
  }, []);

  // Group backend items
  const grouped = backendItems.reduce((acc, item) => {
    const key = item.category_label || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const toggleCheckbox = (id) => {
    setFormState((prev) => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id].checked },
    }));
  };

  const updateRemark = (id, value) => {
    setFormState((prev) => ({
      ...prev,
      [id]: { ...prev[id], remark: value },
    }));
  };

  const addAccessoryRow = () => {
    setManualAccessories((prev) => [
      ...prev,
      { name: "", qty: 1, remark: "", checked: false },
    ]);
  };

  const updateAccessory = (index, field, value) => {
    setManualAccessories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // SAVE ORDER
  const handleSave = async () => {
    const qtyMultiplier = Number(droneQty) || 1;

    const checklist = backendItems.map((item) => ({
      id: item.id,
      description: item.description,
      // multiply default by number of drones
      quantity_ordered: (Number(item.default_quantity) || 0) * qtyMultiplier,
      is_checked: formState[item.id]?.checked || false,
      remarks: formState[item.id]?.remark || "",
      category: item.category_label,
    }));

    manualAccessories.forEach((acc) => {
      if (!acc.name.trim()) return;

      checklist.push({
        id: null,
        description: acc.name,
        quantity_ordered: (Number(acc.qty) || 1) * qtyMultiplier, // also multiply manual items
        is_checked: !!acc.checked,
        remarks: acc.remark,
        category: "Additional Accessories",
      });
    });

    const payload = {
      customer_name: cusName,
      drone_model: droneName,
      drone_qty: qtyMultiplier, // include the drone count explicitly
status: "REQUESTED",
      items: checklist,
    };

    try {
      const res = await fetch(`${config.baseURL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error(await res.text());
        alert("Failed to save order!");
        return;
      }

      const saved = await res.json();
      setOrders((prev) => [...prev, saved]);

      setShowPopup(false);
      setManualAccessories([]);
      setCusName("");
      setDroneName("");
      setDroneQty(1);

      alert("Order saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div className="orderform-page">
      <div className="orderform-header-wrapper">
        <h2 className="orderform-header">Order Forms</h2>
        <button
          className="plus-btn orderform-plus-btn"
          onClick={() => setShowPopup(true)}
        >
          +
        </button>
      </div>

      {/* TABLE LIST */}
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
              <tr key={o.id}>
                <td>{i + 1}</td>
                <td>{o.order_number}</td>
                <td>{o.customer_name}</td>
                <td>{format(new Date(o.order_date), "dd-MM-yyyy")}</td>
               <td>
                  <span
                    className={`status-badge-assigned ${
                      o.status
                        ? `status-${o.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                        : "status-default"
                    }`}
                  >
                    {o.status ? o.status.toLowerCase() : "unknown"}
                  </span>
                </td>
                <td>
                  <button className="view-btn" onClick={() => setViewOrder(o)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================== VIEW POPUP ====================== */}
      {viewOrder && (
        <div className="popup-bg">
          <div className="popup-box big-box">
            <h3 className="popup-title-centered">Order Details</h3>

            {/* infer drone qty from viewOrder or backendItems */}
            {(() => {
              // prefer backend value if present
              const backendDroneQty = viewOrder.drone_qty;
              let inferredDroneQty = backendDroneQty;

              if (inferredDroneQty == null) {
                try {
                  // build map of template default quantities by description
                  const templateMap = {};
                  backendItems.forEach((t) => {
                    templateMap[t.description] =
                      Number(t.default_quantity) || 1;
                  });

                  // compute ratios quantity_ordered / default_quantity for items that match template
                  const ratios = viewOrder.items
                    .map((it) => {
                      const def = templateMap[it.description];
                      if (!def) return null;
                      const ratio = (Number(it.quantity_ordered) || 0) / def;
                      return Number.isFinite(ratio) ? ratio : null;
                    })
                    .filter((r) => r != null && r > 0);

                  // if all ratios are same integer, use it
                  if (ratios.length) {
                    const allEqual = ratios.every(
                      (r) => Math.abs(r - ratios[0]) < 1e-6
                    );
                    if (allEqual) {
                      inferredDroneQty = Math.round(ratios[0]);
                    }
                  }
                } catch (e) {
                  inferredDroneQty = undefined;
                }
              }

              return (
                <div className="popup-input-row">
                  <div className="input-group">
                    <label>Customer Name</label>
                    <input
                      type="text"
                      className="top-input"
                      value={viewOrder.customer_name}
                      readOnly
                    />
                  </div>

                  <div className="input-group">
                    <label>Drone Model</label>
                    <input
                      type="text"
                      className="top-input"
                      value={
                        viewOrder.drone_model || viewOrder.drone_name || ""
                      }
                      readOnly
                    />
                  </div>

                  <div className="input-group">
                    <label>No. of Drones</label>
                    <input
                      type="text"
                      className="top-input"
                      value={inferredDroneQty ?? "-"}
                      readOnly
                    />
                  </div>
                </div>
              );
            })()}

            {/* ... rest of view popup rendering unchanged */}

            {/* GROUPED VIEW ITEMS */}
            {Object.values(
              viewOrder.items.reduce((acc, it) => {
                const key = it.category || "Other";
                if (!acc[key]) acc[key] = { title: key, items: [] };
                acc[key].items.push(it);
                return acc;
              }, {})
            ).map((group, index) => (
              <div className="section" key={index}>
                <h4>{group.title}</h4>

                {group.items.map((it, idx) => (
                  <div className="form-row" key={idx}>
                    <div className="item-name">{it.description}</div>
                    <div className="item-qty">Qty: {it.quantity_ordered}</div>
                    <input
                      type="text"
                      className="readOnly-input"
                      value={it.remarks || "Nil"}
                      readOnly
                    />

                    {/* <input type="checkbox" checked={it.is_checked} readOnly /> */}
                  </div>
                ))}
              </div>
            ))}

            <div className="popup-actions">
              <button className="cancel-btn" onClick={() => setViewOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== CREATE POPUP ====================== */}
      {showPopup && (
        <div className="popup-bg">
          <div className="popup-box big-box">
            <h3 className="popup-title-centered">Delivery Checklist Form</h3>

            <div className="popup-input-row">
              <div className="input-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  className="top-input"
                  value={cusName}
                  onChange={(e) => setCusName(e.target.value)}
                  placeholder="customer name"
                />
              </div>

              <div className="input-group">
                <label>Drone Name</label>
                <input
                  type="text"
                  className="top-input"
                  value={droneName}
                  onChange={(e) => setDroneName(e.target.value)}
                  placeholder="drone name"
                />
              </div>

              <div className="input-group">
                <label>No. of Drones</label>
                <input
                  type="number"
                  className="top-input"
                  min="1"
                  value={droneQty}
                  onChange={(e) => setDroneQty(e.target.value)}
                />
              </div>
            </div>

            {/* CHECKLIST */}
            {Object.keys(grouped).map((cat) => (
              <div className="section" key={cat}>
                <h4>{cat}</h4>

                {grouped[cat].map((item) => (
                  <div className="order-form-row" key={item.id}>
                    <div className="item-name">{item.description}</div>
                    <div className="item-qty">Qty: {item.default_quantity}</div>

                    <input
                      type="text"
                      className="remarks-input"
                      placeholder="Remarks"
                      value={formState[item.id]?.remark || ""}
                      onChange={(e) => updateRemark(item.id, e.target.value)}
                    />

                    <input
                      type="checkbox"
                      checked={formState[item.id]?.checked}
                      onChange={() => toggleCheckbox(item.id)}
                    />
                  </div>
                ))}
              </div>
            ))}

            {/* Additional Accessories */}
            <div className="section">
              <h4>Additional Accessories</h4>

              {manualAccessories.map((row, idx) => (
                <div className="form-row" key={idx}>
                  <input
                    type="text"
                    className="item-name-input"
                    placeholder="Name"
                    value={row.name}
                    onChange={(e) =>
                      updateAccessory(idx, "name", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    className="item-qty-input"
                    value={row.qty}
                    onChange={(e) =>
                      updateAccessory(idx, "qty", e.target.value)
                    }
                  />

                  <input
                    type="text"
                    className="remarks-input"
                    placeholder="Remarks"
                    value={row.remark}
                    onChange={(e) =>
                      updateAccessory(idx, "remark", e.target.value)
                    }
                  />

                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={(e) =>
                      updateAccessory(idx, "checked", e.target.checked)
                    }
                  />
                </div>
              ))}

              <button className="add-row-btn" onClick={addAccessoryRow}>
                + Add Accessory
              </button>
            </div>

            <div className="popup-actions">
              <button className="save-btn" onClick={handleSave}>
                Save Order
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
