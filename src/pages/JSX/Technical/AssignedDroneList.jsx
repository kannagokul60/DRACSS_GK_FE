import React, { useEffect, useState } from "react";
import "../../CSS/Technical/assignedDroneList.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import config from "../../../config"; // adjust path if needed

export default function AssignedDroneList() {
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const [backendItems, setBackendItems] = useState([]);
  const navigate = useNavigate();

  // Fetch BD Orders
  useEffect(() => {
    fetch(`${config.baseURL}/orders/`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Failed to load orders:", err));
  }, []);

  // Fetch Template Items (same as OrderFormPage)
  useEffect(() => {
    fetch(`${config.baseURL}/checklist-items/`)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => a.sort_order - b.sort_order);
        setBackendItems(data);
      })
      .catch((err) => console.error("Failed to load template items:", err));
  }, []);

  const checkDeliveryStatus = async (orderId) => {
    try {
      const res = await fetch(
        `${config.baseURL}/order-delivery-info/${orderId}/`
      );
      if (res.ok) {
        // delivery info exists
        navigate(`/technical/order-status/${orderId}`, {
          state: { readOnly: true },
        });
      } else {
        // delivery not submitted
        navigate(`/technical/order-status/${orderId}`, {
          state: { readOnly: false },
        });
      }
    } catch (err) {
      console.error("Delivery check failed:", err);
      navigate(`/technical/order-status/${orderId}`, {
        state: { readOnly: false },
      });
    }
  };

  // Only orders NOT delivered
  const pendingOrders = orders.filter((o) => o.status !== "DELIVERED");

  return (
    <div className="assigned-page">
      <h2 className="assigned-header">Drone Dispatch</h2>

      {/* TABLE LIST */}
      <div className="assigned-table-wrapper">
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
            {pendingOrders.map((o, i) => (
              <tr key={o.id}>
                <td>{i + 1}</td>
                <td
                  className="clickable-td"
                  onClick={() => checkDeliveryStatus(o.id)}
                >
                  {o.order_number}
                </td>
                <td>{o.customer_name}</td>
                <td>{format(new Date(o.created_at), "dd-MM-yyyy")}</td>
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
            <h3 className="popup-title-centered">Order Delivery Details</h3>

            {/* ===== QTY INFERENCE LOGIC ===== */}
            {(() => {
              const backendDroneQty = viewOrder.number_of_drone; // <-- updated here
              let inferredDroneQty = backendDroneQty;

              if (inferredDroneQty == null) {
                try {
                  const templateMap = {};
                  backendItems.forEach((t) => {
                    templateMap[t.description] =
                      Number(t.default_quantity) || 1;
                  });

                  const ratios = viewOrder.items
                    .map((it) => {
                      const def = templateMap[it.description];
                      if (!def) return null;
                      const ratio = (Number(it.quantity_ordered) || 0) / def;
                      return Number.isFinite(ratio) ? ratio : null;
                    })
                    .filter((r) => r != null && r > 0);

                  if (ratios.length) {
                    const allEqual = ratios.every(
                      (r) => Math.abs(r - ratios[0]) < 1e-6
                    );
                    if (allEqual) inferredDroneQty = Math.round(ratios[0]);
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
                      value={inferredDroneQty ?? "-"} // <-- uses number_of_drone now
                      readOnly
                    />
                  </div>

                  <div className="input-group">
                    <label>End Date</label>
                    <input
                      type="text"
                      className="top-input"
                      readOnly
                      value={
                        viewOrder.required_by_date
                          ? format(
                              new Date(viewOrder.required_by_date),
                              "dd-MM-yyyy"
                            )
                          : "-"
                      }
                    />
                  </div>
                </div>
              );
            })()}

            {/* ===== GROUPED ITEMS ===== */}
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
    </div>
  );
}
