/* --------------- FULLY FIXED ORDER DELIVERY PAGE --------------- */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../CSS/Technical/orderStatusPage.css";
import config from "../../../config";

export default function OrderDeliveryPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isReadOnly = location.state?.readOnly || false;

  const [order, setOrder] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  // New file selections
  const [manufactureFiles, setManufactureFiles] = useState([]);
  const [testingFiles, setTestingFiles] = useState([]);

  // Existing backend attachments
  const [existingManufacturerDocs, setExistingManufacturerDocs] = useState([]);
  const [existingTestingDocs, setExistingTestingDocs] = useState([]);

  // UIN
  const [uin, setUIN] = useState("");
  const [tempUIN, setTempUIN] = useState("");

  // Pending edit states
  const [manufacturePending, setManufacturePending] = useState(false);
  const [testingPending, setTestingPending] = useState(false);
  const [uinPending, setUinPending] = useState(false);

  /* =========================================================
     FETCH ORDER DETAILS
  ========================================================== */
  useEffect(() => {
    fetch(`${config.baseURL}/orders/${orderId}/`)
      .then((res) => res.json())
      .then((data) => setOrder(data));
  }, [orderId]);

  /* =========================================================
     FETCH DELIVERY INFO + ATTACHMENTS
  ========================================================== */
  useEffect(() => {
    reloadDeliveryInfo();
  }, [orderId]);

  const reloadDeliveryInfo = async () => {
    try {
      const res = await fetch(`${config.baseURL}/order-delivery-info/`);
      const allInfo = await res.json();

      const info = allInfo.find((i) => {
        if (typeof i.order === "number") return i.order === parseInt(orderId);
        if (typeof i.order === "string")
          return i.order.includes(`/${orderId}/`);
        return false;
      });

      if (!info) {
        setDeliveryInfo(null);
        setExistingManufacturerDocs([]);
        setExistingTestingDocs([]);
        setUIN("");
        setTempUIN("");
        return;
      }

      setDeliveryInfo(info);

      // Attachments
      setExistingManufacturerDocs(
        info.manufacturer_attachments ?? info.manufacturer_docs ?? []
      );

      setExistingTestingDocs(
        info.testing_attachments ?? info.testing_docs ?? []
      );

      setUIN(info.uin_registration_number || "");
      setTempUIN(info.uin_registration_number || "");
    } catch (err) {
      console.error("reloadDeliveryInfo error:", err);
    }
  };

  /* =========================================================
     FILE UPLOAD HELPERS
  ========================================================== */

  const uploadSingleAttachment = async (file, type) => {
    const fd = new FormData();
    fd.append("order", orderId);
    fd.append("attachment_type", type);
    fd.append("file", file);

    const res = await fetch(`${config.baseURL}/order-delivery-attachments/`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  };

  const uploadAllFiles = async (files, type) => {
    for (const f of files) await uploadSingleAttachment(f, type);
  };

  const updateOrderStatus = async (newStatus) => {
    await fetch(`${config.baseURL}/orders/${orderId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  /* =========================================================
     SELECT HANDLERS
  ========================================================== */

const handleManufactureUpload = (e) => {
  const selected = Array.from(e.target.files || []);
  if (selected.length === 0) return;

  setManufactureFiles((prev) => [...prev, ...selected]);  
  setManufacturePending(true);
};

const handleTestingUpload = (e) => {
  const selected = Array.from(e.target.files || []);
  if (selected.length === 0) return;

  setTestingFiles((prev) => [...prev, ...selected]);
  setTestingPending(true);
};

  /* =========================================================
     MANUFACTURING SAVE / CANCEL
  ========================================================== */

  const saveManufactureFiles = async () => {
    try {
      if (manufactureFiles.length === 0) return;

      await uploadAllFiles(manufactureFiles, "MANUFACTURER");
      await updateOrderStatus("MANUFACTURING");

      await reloadDeliveryInfo();
      setManufactureFiles([]);
      setManufacturePending(false);
    } catch {
      alert("Failed to save manufacturing docs");
    }
  };

  const cancelManufactureFiles = () => {
    setManufactureFiles([]);
    setManufacturePending(false);
  };

  /* =========================================================
     TESTING SAVE / CANCEL
  ========================================================== */

  const saveTestingFiles = async () => {
    try {
      if (testingFiles.length === 0) return;

      await uploadAllFiles(testingFiles, "TESTING");
      await updateOrderStatus("TESTING");

      await reloadDeliveryInfo();
      setTestingFiles([]);
      setTestingPending(false);
    } catch {
      alert("Failed to save testing docs");
    }
  };

  const cancelTestingFiles = () => {
    setTestingFiles([]);
    setTestingPending(false);
  };

  /* =========================================================
     SAVE UIN ONLY
  ========================================================== */

  const saveUINOnly = async () => {
    try {
      if (deliveryInfo?.id) {
        const fd = new FormData();
        fd.append("uin_registration_number", tempUIN);

        await fetch(
          `${config.baseURL}/order-delivery-info/${deliveryInfo.id}/`,
          {
            method: "PATCH",
            body: fd,
          }
        );
      } else {
        const fd = new FormData();
        fd.append("order", orderId);
        fd.append("uin_registration_number", tempUIN);
        fd.append("ready_for_delivery", false);

        await fetch(`${config.baseURL}/order-delivery-info/`, {
          method: "POST",
          body: fd,
        });
      }

      await reloadDeliveryInfo();
      setUinPending(false);
    } catch {
      alert("Failed to save UIN");
    }
  };

  const cancelUINEdit = () => {
    setTempUIN(uin);
    setUinPending(false);
  };

  /* =========================================================
     READY FOR DELIVERY
  ========================================================== */

  const markReadyForDelivery = async () => {
    try {
      const fd = new FormData();
      fd.append("ready_for_delivery", true);
      fd.append("uin_registration_number", tempUIN || uin || "");

      if (deliveryInfo?.id) {
        await fetch(
          `${config.baseURL}/order-delivery-info/${deliveryInfo.id}/`,
          { method: "PATCH", body: fd }
        );
      } else {
        fd.append("order", orderId);
        await fetch(`${config.baseURL}/order-delivery-info/`, {
          method: "POST",
          body: fd,
        });
      }

      await updateOrderStatus("READY FOR DELIVERY");
      await reloadDeliveryInfo();

      alert("Marked Ready for Delivery ✔");
      navigate(-1);
    } catch {
      alert("Failed to mark ready for delivery");
    }
  };

  /* =========================================================
     UI
  ========================================================== */

  if (!order) return <p>Loading...</p>;

  return (
    <div className="delivery-page">
      <div className="page-actions">
        <button className="order-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <h2 className="delivery-header">
        Order Delivery Workflow - {order.order_number}
      </h2>

      {/* ----------------- STEP 1 ----------------- */}
      <div className="section-block">
        <h4>1. Manufacturing Documents</h4>

        {/* Show existing docs if available */}
        {existingManufacturerDocs.length > 0 && (
          <ul className="file-list">
            {existingManufacturerDocs.map((doc) => (
              <li key={doc.id}>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noreferrer"
                  className="manufacture-link"
                >
                  {doc.file.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Show upload ONLY if no manufacturing docs exist */}
        {existingManufacturerDocs.length === 0 && (
          <>     
            <input type="file" multiple onChange={handleManufactureUpload} />
            <ul className="file-list">
              {manufactureFiles.map((f, i) => (
                <li key={i}>
                  {f.name}
                  <span
                    className="remove-file"
                    onClick={() => {
                      const t = [...manufactureFiles];
                      t.splice(i, 1);
                      setManufactureFiles(t);
                    }}
                  >
                    ✖
                  </span>
                </li>
              ))}
            </ul>

            {manufacturePending && (
              <div className="btn-row">
                <button className="save-btn" onClick={saveManufactureFiles}>
                  Save
                </button>
                <button className="cancel-btn" onClick={cancelManufactureFiles}>
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ----------------- STEP 2 ----------------- */}
      <div className="section-block">
        <h4>2. Testing Documents</h4>

        {/* Show existing docs */}
        {existingTestingDocs.length > 0 && (
          <ul className="file-list">
            {existingTestingDocs.map((doc) => (
              <li key={doc.id}>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noreferrer"
                  className="testing-link"
                >
                  {doc.file.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Show upload ONLY if NO testing docs exist */}
        {existingTestingDocs.length === 0 && (
          <>
            <input
              type="file"
              multiple
              disabled={existingManufacturerDocs.length === 0}
              onChange={handleTestingUpload}
            />

            <ul className="file-list">
              {testingFiles.map((f, i) => (
                <li key={i}>
                  {f.name}
                  <span
                    className="remove-file"
                    onClick={() => {
                      const t = [...testingFiles];
                      t.splice(i, 1);
                      setTestingFiles(t);
                    }}
                  >
                    ✖
                  </span>
                </li>
              ))}
            </ul>

            {testingPending && (
              <div className="btn-row">
                <button className="save-btn" onClick={saveTestingFiles}>
                  Save
                </button>
                <button className="cancel-btn" onClick={cancelTestingFiles}>
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ----------------- STEP 3 ----------------- */}
      <div className="section-block">
        <h4>3. UIN Number</h4>

        <>
          <input
            type="text"
            disabled={existingTestingDocs.length === 0}
            value={tempUIN}
            onChange={(e) => {
              setTempUIN(e.target.value);
              setUinPending(true);
            }}
          />

          {uinPending && (
            <div className="btn-row">
              <button className="save-btn" onClick={saveUINOnly}>
                Save
              </button>
              <button className="cancel-btn" onClick={cancelUINEdit}>
                Cancel
              </button>
            </div>
          )}
        </>
      </div>

      {/* ----------------- STEP 4 ----------------- */}
      <div className="section-block">
        <h4>4. Ready for Delivery</h4>

        <button
          className="deliver-btn"
          disabled={existingTestingDocs.length === 0}
          onClick={markReadyForDelivery}
        >
          Mark as Ready for Delivery
        </button>

        {deliveryInfo?.ready_for_delivery && (
          <p className="success">Marked Ready ✔</p>
        )}
      </div>
    </div>
  );
}
