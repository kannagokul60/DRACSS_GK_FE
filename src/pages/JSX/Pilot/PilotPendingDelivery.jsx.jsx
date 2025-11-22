import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../../config";
import "../../CSS/Pilot/PendingDelivery.css";
import { format } from "date-fns";
import BreadCrumbs from "../BreadCrumbs";

export default function PilotPendingDelivery() {
  const [pendingList, setPendingList] = useState([]);
  const navigate = useNavigate();
  const [viewOrder, setViewOrder] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [manufacturerDocs, setManufacturerDocs] = useState([]);
  const [testingDocs, setTestingDocs] = useState([]);
  const [uin, setUIN] = useState("");

  useEffect(() => {
    loadPendingDeliveries();
  }, []);

  const loadDeliveryInfo = async (orderId) => {
    try {
      const res = await fetch(`${config.baseURL}/order-delivery-info/`);
      const allInfo = await res.json();
      const info = allInfo.find((i) => {
        if (typeof i.order === "number") return i.order === orderId;
        if (typeof i.order === "string")
          return i.order.includes(`/${orderId}/`);
        return false;
      });

      setDeliveryInfo(info);
      setManufacturerDocs(info?.manufacturer_attachments ?? []);
      setTestingDocs(info?.testing_attachments ?? []);
      setUIN(info?.uin_registration_number ?? "");
    } catch (err) {
      console.error("Failed to load delivery info", err);
      setDeliveryInfo(null);
      setManufacturerDocs([]);
      setTestingDocs([]);
      setUIN("");
    }
  };

  const loadPendingDeliveries = async () => {
    try {
      // Fetch all orders
      const orderRes = await fetch(`${config.baseURL}/orders/`);
      const orders = await orderRes.json();

      // Fetch all delivery info
      const deliveryRes = await fetch(`${config.baseURL}/order-delivery-info/`);
      const delivery = await deliveryRes.json();

      // Match orders with ready_for_delivery = true
      const pending = orders.filter((o) => {
        const info = delivery.find((d) => {
          if (typeof d.order === "number") return d.order === o.id;
          if (typeof d.order === "string") return d.order.includes(`/${o.id}/`);
          return false;
        });

        return info?.ready_for_delivery === true;
      });

      setPendingList(pending);
    } catch (err) {
      console.error("Failed to load pending deliveries", err);
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
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {pendingList.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No Pending Deliveries
              </td>
            </tr>
          ) : (
            pendingList.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.order_number}</td>
                <td>{order.customer_name}</td>
                <td>{format(new Date(order.created_at), "dd-MM-yyyy")}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={async () => {
                      setViewOrder(order); // set order info
                      await loadDeliveryInfo(order.id); // load delivery info
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {viewOrder && (
        <div className="pd-popup-overlay">
          <div className="pd-popup-container">
            <h3>Documents</h3>

            <div className="pd-section-block">
              <h4>Manufacturing Documents</h4>
              {manufacturerDocs.length > 0 ? (
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
              {testingDocs.length > 0 ? (
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
    </div>
  );
}
