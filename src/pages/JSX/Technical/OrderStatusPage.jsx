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

  const [manufactureFiles, setManufactureFiles] = useState([]);
  const [testingFiles, setTestingFiles] = useState([]);
  const [uin, setUIN] = useState("");

  const [existingManufacturerDocs, setExistingManufacturerDocs] = useState([]);
  const [existingTestingDocs, setExistingTestingDocs] = useState([]);

  const [uploadStatus, setUploadStatus] = useState({
    manufacture: false,
    testing: false,
    uin: false,
    delivery: false,
  });

  // ------------------------------
  // FETCH ORDER DETAILS
  // ------------------------------
  useEffect(() => {
    fetch(`${config.baseURL}/orders/${orderId}/`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => {});
  }, [orderId]);

  // ------------------------------
  // FETCH DELIVERY INFO + ATTACHMENTS
  // ------------------------------
  useEffect(() => {
    fetch(`${config.baseURL}/order-delivery-info/`)
      .then((res) => res.json())
      .then((allInfo) => {
        const info = allInfo.find((i) => i.order === parseInt(orderId));
        if (info) {
          setDeliveryInfo(info);
          setExistingManufacturerDocs(info.manufacturer_attachments || []);
          setExistingTestingDocs(info.testing_attachments || []);
          setUIN(info.uin_registration_number || "");
        }
      })
      .catch(() => {});
  }, [orderId]);

  // ------------------------------
  // HANDLE FILE UPLOAD FUNCTIONS
  // ------------------------------

  const uploadSingleAttachment = async (file, type) => {
    const formData = new FormData();
    formData.append("order", orderId);
    formData.append("attachment_type", type);
    formData.append("file", file);

    const res = await fetch(`${config.baseURL}/order-delivery-attachments/`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    return res.json();
  };

  const uploadAllFiles = async (files, type) => {
    for (let file of files) {
      await uploadSingleAttachment(file, type);
    }
  };

  

  const handleManufactureUpload = (e) => {
    const files = Array.from(e.target.files);
    setManufactureFiles((prev) => [...prev, ...files]);
    setUploadStatus((prev) => ({ ...prev, manufacture: true }));
  };

  const handleTestingUpload = (e) => {
    if (!uploadStatus.manufacture) return;
    const files = Array.from(e.target.files);
    setTestingFiles((prev) => [...prev, ...files]);
    setUploadStatus((prev) => ({ ...prev, testing: true }));
  };

  // ------------------------------
  // SAVE DELIVERY INFO
  // ------------------------------
  const saveDeliveryInfo = async () => {
    try {
      // Upload Manufacturing docs
      if (manufactureFiles.length > 0) {
        await uploadAllFiles(manufactureFiles, "MANUFACTURER");
      }

      // Upload Testing docs
      if (testingFiles.length > 0) {
        await uploadAllFiles(testingFiles, "TESTING");
      }

      // Save UIN + ready status
      const res = await fetch(`${config.baseURL}/order-delivery-info/`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: (() => {
          const f = new FormData();
          f.append("order", orderId);
          f.append("uin_registration_number", uin);
          f.append("ready_for_delivery", true);
          return f;
        })(),
      });

      if (!res.ok) throw new Error("Save failed");

      alert("Delivery info saved ✔");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error saving delivery info");
    }
  };

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

{/* ------------------------------------------------------ */}
{/* STEP 1 — Manufacturing Documents */}
{/* ------------------------------------------------------ */}
<div className="section-block">
  <h4>1. Manufacturing Documents</h4>

  {/* Existing Docs */}
  {existingManufacturerDocs.length > 0 && (
    <ul className="file-list">
      {existingManufacturerDocs.map((doc) => (
        <li key={doc.id}>
          <a href={doc.file} target="_blank" className="manufacture-link">
            {doc.file.split("/").pop()}
          </a>
        </li>
      ))}
    </ul>
  )}

  {/* Upload New Docs */}
  {!isReadOnly && (
    <>
      <input type="file" multiple onChange={handleManufactureUpload} />

      {/* Selected Files Before Upload */}
      <ul className="file-list">
        {manufactureFiles.map((file, index) => (
          <li key={index}>
            {file.name}
            <span
              className="remove-file"
              onClick={() => {
                const updated = [...manufactureFiles];
                updated.splice(index, 1);
                setManufactureFiles(updated);
              }}
            >
              ✖
            </span>
          </li>
        ))}
      </ul>
    </>
  )}
</div>


{/* ------------------------------------------------------ */}
{/* STEP 2 — Testing Documents */}
{/* ------------------------------------------------------ */}
<div className="section-block">
  <h4>2. Testing Documents</h4>

  {/* Existing Docs */}
  {existingTestingDocs.length > 0 && (
    <ul className="file-list">
      {existingTestingDocs.map((doc) => (
        <li key={doc.id}>
          <a href={doc.file} target="_blank" className="testing-link">
            {doc.file.split("/").pop()}
          </a>
        </li>
      ))}
    </ul>
  )}

  {/* Upload New Docs */}
  {!isReadOnly && (
    <>
      <input
        type="file"
        multiple
        disabled={!uploadStatus.manufacture}
        onChange={handleTestingUpload}
      />

      {/* Selected Files Before Upload */}
      <ul className="file-list">
        {testingFiles.map((file, index) => (
          <li key={index}>
            {file.name}
            <span
              className="remove-file"
              onClick={() => {
                const updated = [...testingFiles];
                updated.splice(index, 1);
                setTestingFiles(updated);
              }}
            >
              ✖
            </span>
          </li>
        ))}
      </ul>
    </>
  )}
</div>


      {/* ------------------------------------------------------ */}
      {/* STEP 3 — UIN Number */}
      {/* ------------------------------------------------------ */}
      <div className="section-block">
        <h4>3. UIN Number</h4>

        {isReadOnly ? (
          <p>{deliveryInfo?.uin_registration_number}</p>
        ) : (
          <input
            type="text"
            disabled={!uploadStatus.testing}
            value={uin}
            onChange={(e) => setUIN(e.target.value)}
          />
        )}
      </div>

      {/* ------------------------------------------------------ */}
      {/* STEP 4 — Ready for Delivery */}
      {/* ------------------------------------------------------ */}
      <div className="section-block">
        <h4>4. Ready for Delivery</h4>

        {!isReadOnly && (
          <button
            className="deliver-btn"
            disabled={!uin}
            onClick={saveDeliveryInfo}
          >
            Mark as Ready for Delivery
          </button>
        )}

        {deliveryInfo?.ready_for_delivery && (
          <p className="success">Marked Ready ✔</p>
        )}
      </div>
    </div>
  );
}
