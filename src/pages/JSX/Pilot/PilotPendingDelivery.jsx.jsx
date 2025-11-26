import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../../config";
import "../../CSS/Pilot/PendingDelivery.css";
import { format } from "date-fns";
import BreadCrumbs from "../BreadCrumbs";

export default function PilotPendingDelivery() {
  const [pendingList, setPendingList] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [manufacturerDocs, setManufacturerDocs] = useState([]);
  const [testingDocs, setTestingDocs] = useState([]);
  const [uin, setUIN] = useState("");
  const [orderForm, setOrderForm] = useState(null);

  // NEW STATES FOR PATCH LOGIC
  const [selectedItems, setSelectedItems] = useState([]);
  const [alreadySavedItems, setAlreadySavedItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadPendingDeliveries();
  }, []);

  const loadPendingDeliveries = async () => {
    try {
      const ordersRes = await fetch(`${config.baseURL}/orders/`);
      const orders = await ordersRes.json();

      const deliveryRes = await fetch(`${config.baseURL}/order-delivery-info/`);
      const delivery = await deliveryRes.json();

      const pending = orders.filter((o) => {
        const info = delivery.find(
          (d) => d.order === o.id || d.order?.includes?.(`/${o.id}/`)
        );
        return info?.ready_for_delivery === true;
      });

      setPendingList(pending);
    } catch (err) {
      console.error("Failed to load pending deliveries:", err);
    }
  };

  const loadDeliveryInfo = async (orderId) => {
    try {
      const res = await fetch(`${config.baseURL}/order-delivery-info/`);
      const allInfo = await res.json();
      const info = allInfo.find(
        (i) => i.order === orderId || i.order?.includes?.(`/${orderId}/`)
      );

      setDeliveryInfo(info);
      setManufacturerDocs(info?.manufacturer_attachments ?? []);
      setTestingDocs(info?.testing_attachments ?? []);
      setUIN(info?.uin_registration_number ?? "");
    } catch (err) {
      console.error("Failed to load delivery info:", err);
      setDeliveryInfo(null);
      setManufacturerDocs([]);
      setTestingDocs([]);
      setUIN("");
    }
  };

  // SAVE ONLY NEWLY CHECKED ITEMS
  const handleSaveCheckedItems = async () => {
    if (!orderForm) return;

    try {
      const csrftoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      // NEW items that were NOT previously checked in DB
      const newItems = selectedItems.filter(
        (id) => !alreadySavedItems.includes(id)
      );

      if (newItems.length === 0) {
        alert("No new items selected.");
        setOrderForm(null);
        return;
      }

      // PATCH only new items
      for (let id of newItems) {
        await fetch(`${config.baseURL}/order-items/${id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ is_checked: true }),
          credentials: "include",
        });
      }

      alert("Checklist updated successfully!");

      // Refresh order
      const res = await fetch(`${config.baseURL}/orders/${orderForm.id}/`);
      if (res.ok) {
        const updatedOrder = await res.json();
        setPendingList((prev) =>
          prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
      }

      setOrderForm(null);
    } catch (err) {
      console.error("Failed to save checklist:", err);
      alert("Error saving checklist!");
    }
  };

  return (
    <div className="pending-delivery-page">
      <div className="pilot-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>
      <h2 className="page-title">Pending Deliveries</h2>

      <table className="pending-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Order ID</th>
            <th>Client</th>
            <th>Drone</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingList.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No Pending Deliveries
              </td>
            </tr>
          ) : (
            pendingList.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.order_number}</td>
                <td>{order.customer_name}</td>
                <td>{order.drone_model}</td>
                <td>
                  {order.order_date
                    ? format(new Date(order.order_date), "dd-MM-yyyy")
                    : "-"}
                </td>
                <td>
                  <div className="pilot-btn">
                    <button
                      className="view-btn"
                      onClick={async () => {
                        setViewOrder(order);
                        await loadDeliveryInfo(order.id);
                      }}
                    >
                      View
                    </button>

                    <button
                      className="view-btn"
                      onClick={() => {
                        setOrderForm(order);

                        // Load already saved items
                        const saved = order.items
                          .filter((i) => i.is_checked === true)
                          .map((i) => i.id);
                        setAlreadySavedItems(saved);

                        // Set selected items (checked + new)
                        const current = order.items
                          .filter((i) => i.is_checked)
                          .map((i) => i.id);
                        setSelectedItems(current);
                      }}
                    >
                      Order Form
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* DOCUMENTS POPUP */}
      {viewOrder && (
        <div className="pd-popup-overlay">
          <div className="pd-popup-container">
            <h3>Documents</h3>

            <div className="pd-section-block">
              <h4>Manufacturing Documents</h4>
              {manufacturerDocs.length ? (
                <ul className="pd-file-list">
                  {manufacturerDocs.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.file}
                        target="_blank"
                        rel="noreferrer"
                        className="pd-doc-link"
                      >
                        {doc.file.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No manufacturing docs uploaded</p>
              )}
            </div>

            <div className="pd-section-block">
              <h4>Testing Documents</h4>
              {testingDocs.length ? (
                <ul className="pd-file-list">
                  {testingDocs.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.file}
                        target="_blank"
                        rel="noreferrer"
                        className="pd-doc-link"
                      >
                        {doc.file.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No testing docs uploaded</p>
              )}
            </div>

            <div className="pd-section-block">
              <h4>UIN Number</h4>
              <p className="pd-uin-link">{uin || "Not registered"}</p>
            </div>

            <div className="pd-popup-actions">
              <button
                className="pd-close-btn"
                onClick={() => setViewOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER FORM POPUP */}
      {orderForm && (
        <div className="popup-bg">
          <div className="popup-box big-box">
            <h3 className="popup-title-centered">Order Delivery Details</h3>

            <div className="popup-input-row">
              <div className="input-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  className="top-input"
                  value={orderForm.customer_name}
                  readOnly
                />
              </div>
              <div className="input-group">
                <label>Drone Model</label>
                <input
                  type="text"
                  className="top-input"
                  value={orderForm.drone_model || orderForm.drone_name || ""}
                  readOnly
                />
              </div>
            </div>

            {orderForm.items.map((it, idx) => (
              <div className="form-row" key={idx}>
                <div className="item-name">{it.description}</div>
                <div className="item-qty">Qty: {it.quantity_ordered}</div>

                <input
                  type="text"
                  className="readOnly-input"
                  value={it.remarks || "Nil"}
                  readOnly
                />

                <div className="item-check">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(it.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      const updatedOrder = { ...orderForm };
                      updatedOrder.items[idx].is_checked = checked;
                      setOrderForm(updatedOrder);

                      if (checked) {
                        setSelectedItems((prev) => [...new Set([...prev, it.id])]);
                      } else {
                        setSelectedItems((prev) =>
                          prev.filter((id) => id !== it.id)
                        );
                      }
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="popup-actions">
              <button className="save-btn" onClick={handleSaveCheckedItems}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setOrderForm(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
