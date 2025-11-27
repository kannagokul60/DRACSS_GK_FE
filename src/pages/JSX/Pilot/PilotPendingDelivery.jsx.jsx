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

  // PATCH logic
  const [selectedItems, setSelectedItems] = useState([]);
  const [alreadySavedItems, setAlreadySavedItems] = useState([]);

  // ATTACHMENTS PER ORDER
  const [orderAttachments, setOrderAttachments] = useState({});
  const [pendingAttachments, setPendingAttachments] = useState(false);
  const [attachmentsSaved, setAttachmentsSaved] = useState({});

  const navigate = useNavigate();

  // ================== HELPER ==================
  const hasAttachments = (orderId) => {
    const attachments = orderAttachments[orderId] || [];
    return attachments.length > 0;
  };

  // ================== LOAD PENDING DELIVERIES ==================
  useEffect(() => {
    loadPendingDeliveries();
  }, []);

  const loadPendingDeliveries = async () => {
    try {
      const [ordersRes, deliveryRes] = await Promise.all([
        fetch(`${config.baseURL}/orders/`),
        fetch(`${config.baseURL}/order-delivery-info/`),
      ]);

      const orders = await ordersRes.json();
      const delivery = await deliveryRes.json();

      // Filter only orders where ready_for_delivery = true AND status != DELIVERED
      const pending = orders.filter((order) => {
        const info = delivery.find(
          (d) => d.order === order.id || d.order?.includes?.(`/${order.id}/`)
        );

        return (
          info?.ready_for_delivery === true && order.status !== "DELIVERED"
        );
      });

      setPendingList(pending);

      // Map attachments correctly
      const attachmentsMap = {};
      delivery.forEach((d) => {
        const id =
          typeof d.order === "number"
            ? d.order
            : parseInt(d.order.split("/").filter(Boolean).pop());

        attachmentsMap[id] = d.attachments || [];
      });

      setOrderAttachments(attachmentsMap);
    } catch (err) {
      console.error("Failed to load pending deliveries:", err);
    }
  };

  // ================== LOAD DELIVERY INFO ==================
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

      // Ensure attachments for this order are up-to-date
      setOrderAttachments((prev) => ({
        ...prev,
        [orderId]: info?.attachments || [],
      }));
    } catch (err) {
      console.error("Failed to load delivery info:", err);
      setDeliveryInfo(null);
      setManufacturerDocs([]);
      setTestingDocs([]);
      setUIN("");
    }
  };

  // ================== ORDER FORM CHECKLIST ==================
  const handleSaveCheckedItems = async () => {
    if (!orderForm) return;

    try {
      const csrftoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      const updates = [];

      orderForm.items.forEach((item) => {
        const wasSavedBefore = alreadySavedItems.includes(item.id);
        const isSelectedNow = selectedItems.includes(item.id);

        if (wasSavedBefore !== isSelectedNow) {
          updates.push({
            id: item.id,
            value: isSelectedNow,
          });
        }
      });

      if (updates.length === 0) {
        alert("No changes to update.");
        setOrderForm(null);
        return;
      }

      for (let upd of updates) {
        await fetch(`${config.baseURL}/order-items/${upd.id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ is_checked: upd.value }),
          credentials: "include",
        });
      }

      alert("Checklist updated successfully!");
      setOrderForm(null);
    } catch (err) {
      console.error("Failed to save checklist:", err);
      alert("Error saving checklist!");
    }
  };

  // ================== ATTACHMENT HANDLERS ==================
  const handleAttachmentSelect = (e, orderId) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setOrderAttachments((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), ...files],
    }));

    setPendingAttachments(true);
  };

  const uploadAttachmentFile = async (orderId, file) => {
    const fd = new FormData();
    fd.append("order", orderId);
    fd.append("attachment_type", "ATTACHMENT");
    fd.append("file", file);

    const res = await fetch(`${config.baseURL}/order-delivery-attachments/`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) throw new Error("Upload failed");
  };

  const saveAttachmentFiles = async () => {
    if (!viewOrder) return;

    const files = (orderAttachments[viewOrder.id] || []).filter(
      (f) => f instanceof File
    );

    if (files.length === 0) return;

    try {
      for (const f of files) {
        await uploadAttachmentFile(viewOrder.id, f);
      }

      alert("Attachments uploaded successfully!");

      setPendingAttachments(false);

      await loadDeliveryInfo(viewOrder.id); // Refresh final attachments

      setViewOrder({ ...viewOrder }); // Force re-render

      // ✅ Mark attachments saved → Deliver button enabled
      setAttachmentsSaved((prev) => ({
        ...prev,
        [viewOrder.id]: true,
      }));
    } catch (err) {
      console.error("Attachment upload error:", err);
      alert("Failed to upload attachments");
    }
  };

  const cancelAttachmentFiles = () => {
    if (!viewOrder) return;

    // ❌ Mark unsaved → Deliver button disabled
    setAttachmentsSaved((prev) => ({
      ...prev,
      [viewOrder.id]: false,
    }));

    // Remove only unsaved (new) files
    setOrderAttachments((prev) => ({
      ...prev,
      [viewOrder.id]: (prev[viewOrder.id] || []).filter(
        (f) => !(f instanceof File)
      ),
    }));

    setPendingAttachments(false);
  };

  // ================== MARK ORDER DELIVERED ==================
  const handleDeliverOrder = async (orderId) => {
    try {
      const csrftoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      const res = await fetch(`${config.baseURL}/orders/${orderId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ status: "DELIVERED" }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to mark as delivered");

      // ---- IMPORTANT FIX ----
      // Remove the delivered order immediately from the UI
      setPendingList((prev) => prev.filter((o) => o.id !== orderId));

      // Clear popup
      setViewOrder(null);

      alert("Order status updated to DELIVERED!");

      // Navigate after UI update
      navigate("/pilot-delivered");
    } catch (err) {
      console.error(err);
      alert("Failed to update delivery status");
    }
  };

  // ================== RENDER ==================
  return (
    <div className="pending-delivery-page">
      <div className="pilot-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>
      <h2 className="page-title">Pending Deliveries</h2>
      <div className="pending-table-wrapper">
        <table>
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
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
                >
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

                          const saved = order.items
                            .filter((i) => i.is_checked === true)
                            .map((i) => i.id);
                          setAlreadySavedItems(saved);

                          const current = order.items
                            .filter((i) => i.is_checked)
                            .map((i) => i.id);
                          setSelectedItems(current);
                        }}
                      >
                        Order Form
                      </button>

                      {hasAttachments(order.id) &&
                        attachmentsSaved[order.id] && (
                          <button
                            className="deliver-btn"
                            onClick={() => handleDeliverOrder(order.id)}
                          >
                            Deliver
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================== VIEW ORDER POPUP ================== */}
      {viewOrder && (
        <div className="pd-popup-overlay">
          <div className="pd-popup-container split-layout">
            <div className="pd-left">
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
            </div>

            <div className="pd-right">
              <h3>Upload Documents</h3>
              <h4>Attachments</h4>

              <div className="section-block">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleAttachmentSelect(e, viewOrder.id)}
                />
                <ul className="file-list">
                  {(orderAttachments[viewOrder.id] || []).map((f, i) => (
                    <li key={i}>
                      {!(f instanceof File) ? (
                        <a
                          href={f.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="manufacture-link"
                        >
                          {f.file.split("/").pop()}
                        </a>
                      ) : (
                        <>
                          {f.name}
                          <span
                            className="remove-file"
                            onClick={() => {
                              const updated = [
                                ...orderAttachments[viewOrder.id],
                              ];
                              updated.splice(i, 1);
                              setOrderAttachments((prev) => ({
                                ...prev,
                                [viewOrder.id]: updated,
                              }));
                            }}
                          >
                            ✖
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                {pendingAttachments && (
                  <div className="btn-row">
                    <button className="save-btn" onClick={saveAttachmentFiles}>
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={cancelAttachmentFiles}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="pd-popup-actions-bottom">
                <button
                  className="pd-close-btn"
                  onClick={() => setViewOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================== ORDER FORM POPUP ================== */}
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
                        setSelectedItems((prev) => [
                          ...new Set([...prev, it.id]),
                        ]);
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
