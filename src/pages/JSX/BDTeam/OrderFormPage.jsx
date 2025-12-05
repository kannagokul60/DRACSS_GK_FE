import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "../../CSS/BDteam/orderForm.css";
import { format } from "date-fns";
import config from "../../../config";

export default function OrderFormPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [backendItems, setBackendItems] = useState([]);
  const [formState, setFormState] = useState({});
  const [manualAccessories, setManualAccessories] = useState([]);

  const [droneName, setDroneName] = useState("");
  const [cusName, setCusName] = useState("");
  const [number_of_drone, setNumberOfDrone] = useState(1);

  const [viewOrder, setViewOrder] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const fromPilot = location.state?.fromPilot || false;
  const [endDate, setEndDate] = useState("");

  // LOAD DELIVERY INFO IF COMING FROM PILOT
  useEffect(() => {
    if (fromPilot && orderId) {
      loadOrCreateDeliveryInfo(orderId);
    }
  }, [fromPilot, orderId]);

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

        // Initialize formState for remarks and checkbox
        const initState = {};
        data.forEach((it) => {
          initState[it.id] = { checked: it.is_mandatory || false, remark: "" };
        });
        setFormState(initState);
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

  async function loadOrCreateDeliveryInfo(orderID) {
    try {
      const res = await fetch(
        `${config.baseURL}/order-delivery-info/${orderID}/`
      );
      if (res.ok) return;

      await fetch(`${config.baseURL}/order-delivery-info/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: orderID,
          ready_for_delivery: false,
          pilot_checks: [],
          manufacturer_attachments: [],
          testing_attachments: [],
          uin_registration_number: "",
        }),
      });
    } catch (err) {
      console.error("Delivery info create/load error:", err);
    }
  }

  // Reset form when opening new popup
  const openNewOrderPopup = () => {
    setShowPopup(true);
    setFormState(
      backendItems.reduce((acc, it) => {
        acc[it.id] = { checked: it.is_mandatory || false, remark: "" };
        return acc;
      }, {})
    );
    setManualAccessories([]);
    setCusName("");
    setDroneName("");
    setNumberOfDrone(1);
  };

  const handleSave = async () => {
    const qtyMultiplier = Number(number_of_drone) || 1;

    const checklist = backendItems.map((item) => ({
      id: item.id,
      description: item.description,
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
        quantity_ordered: (Number(acc.qty) || 1) * qtyMultiplier,
        is_checked: acc.checked || false,
        remarks: acc.remark,
        category: "Additional Accessories",
      });
    });

    const payload = {
      customer_name: cusName,
      drone_model: droneName,
      number_of_drone: Number(number_of_drone),
      required_by_date: endDate,
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

      // Create empty delihvery info
      await fetch(`${config.baseURL}/order-delivery-info/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: saved.id,
          ready_for_delivery: false,
          pilot_checks: [],
          manufacturer_attachments: [],
          testing_attachments: [],
          uin_registration_number: "",
        }),
      });

      setOrders((prev) => [...prev, saved]);
      setShowPopup(false);
      setManualAccessories([]);
      setFormState({});
      setCusName("");
      setDroneName("");
      setNumberOfDrone(1);

      alert("Order saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save order!");
    }
  };

  return (
    <div className="orderform-page">
      <div className="orderform-header-wrapper">
        <h2 className="orderform-header">Order Forms</h2>

        <button className="orderform-plus-btn" onClick={openNewOrderPopup}>
          + ADD
        </button>
      </div>

      {/* ================= TABLE ================= */}
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
                <td>
                  {o.created_at && !isNaN(new Date(o.created_at))
                    ? format(new Date(o.created_at), "dd-MM-yyyy")
                    : "N/A"}
                </td>
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

      {/* VIEW POPUP */}
      {viewOrder && (
        <div className="popup-bg">
          <div className="popup-box big-box">
            <h3 className="popup-title-centered">Order Details</h3>
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
                  value={viewOrder.drone_model}
                  readOnly
                />
              </div>
              <div className="input-group">
                <label>No. of Drones</label>
                <input
                  type="text"
                  className="top-input"
                  value={viewOrder.number_of_drone}
                  readOnly
                />
              </div>
              <div className="input-group">
                <label>Requested Date</label>
                <input
                  type="text"
                  className="top-input"
                  value={
                    viewOrder.required_by_date &&
                    !isNaN(new Date(viewOrder.required_by_date))
                      ? format(
                          new Date(viewOrder.required_by_date),
                          "dd-MM-yyyy"
                        )
                      : "N/A"
                  }
                  readOnly
                />
              </div>
            </div>

            {/* ITEMS GROUP */}
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

      {/* CREATE POPUP */}
      {showPopup && (
        <div className="popup-bg">
          <div className="popup-box big-box">
            <h3 className="popup-title-centered">Delivery Checklist Form</h3>

            <div className="popup-input-row">
              <div className="input-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  className="top-inputs"
                  value={cusName}
                  onChange={(e) => setCusName(e.target.value)}
                  placeholder="customer name"
                />
              </div>

              <div className="input-group">
                <label>Drone Name</label>
                <input
                  type="text"
                  className="top-inputs"
                  value={droneName}
                  onChange={(e) => setDroneName(e.target.value)}
                  placeholder="drone name"
                />
              </div>

              <div className="input-group">
                <label>No. of Drones</label>
                <input
                  type="number"
                  className="top-inputs"
                  min="1"
                  value={number_of_drone}
                  onChange={(e) => setNumberOfDrone(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>End Date</label>
                <input
                  type="date"
                  className="top-inputs"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* CHECKLIST GROUPS */}
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
                  </div>
                ))}
              </div>
            ))}

            {/* ADDITIONAL ACCESSORIES */}
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
