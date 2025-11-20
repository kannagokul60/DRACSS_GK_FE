import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../CSS/Technical/orderStatusPage.css";
import config from "../../../config"; // adjust path if needed
import { useLocation } from "react-router-dom";

export default function OrderDeliveryPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  // Track uploaded files for each step
  const [manufactureFiles, setManufactureFiles] = useState([]);
  const [testingFiles, setTestingFiles] = useState([]);
  const [uin, setUIN] = useState("");
  const [uploadStatus, setUploadStatus] = useState({
    manufacture: false,
    testing: false,
    uin: false,
    delivery: false,
  });
  const location = useLocation();
  const isReadOnly = location.state?.readOnly || false;

  const [deliveryInfo, setDeliveryInfo] = useState(null);

  useEffect(() => {
    fetch(`${config.baseURL}/orders/${orderId}/`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((err) => console.error("Failed to fetch order:", err));
  }, [orderId]);

  useEffect(() => {
    fetch(`${config.baseURL}/order-delivery-info/${orderId}/`)
      .then((res) => res.json())
      .then((data) => {
        setDeliveryInfo(data);
      })
      .catch(() => {});
  }, [orderId]);

  // Handle file uploads
  const handleManufactureUpload = (e) => {
    const files = Array.from(e.target.files);
    setManufactureFiles((prev) => [...prev, ...files]);
    if (files.length > 0)
      setUploadStatus((prev) => ({ ...prev, manufacture: true }));
  };

  const handleTestingUpload = (e) => {
    if (!uploadStatus.manufacture) return;
    const files = Array.from(e.target.files);
    setTestingFiles((prev) => [...prev, ...files]);
    if (files.length > 0)
      setUploadStatus((prev) => ({ ...prev, testing: true }));
  };

  const removeManufactureFile = (index) => {
    setManufactureFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        manufacture: newFiles.length > 0,
        testing: newFiles.length > 0 ? prevStatus.testing : false,
        uin: newFiles.length > 0 ? prevStatus.uin : false,
      }));
      return newFiles;
    });
  };

  const removeTestingFile = (index) => {
    setTestingFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        testing: newFiles.length > 0,
        uin: newFiles.length > 0 ? prevStatus.uin : false,
      }));
      return newFiles;
    });
  };

  const markReadyForDelivery = () => {
    if (uploadStatus.uin)
      setUploadStatus((prev) => ({ ...prev, delivery: true }));
  };

  const saveDeliveryInfo = async () => {
    if (!order?.id) {
      alert("Order not loaded");
      return;
    }

    const formData = new FormData();
    formData.append("order", order.id);

    // Backend expects single file, so use first one
    if (manufactureFiles[0]) {
      formData.append("manufacturer_attachment", manufactureFiles[0]);
    }

    if (testingFiles[0]) {
      formData.append("testing_attachment", testingFiles[0]);
    }

    formData.append("uin_registration_number", uin);
    formData.append("ready_for_delivery", true);

    try {
      const res = await fetch(`${config.baseURL}/order-delivery-info/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        console.log("Backend Error:", error);
        throw new Error("Failed to save delivery info");
      }

      alert("Delivery info saved successfully ✔");
      setUploadStatus((prev) => ({ ...prev, delivery: true }));
    } catch (err) {
      console.error("Save failed:", err);
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

      {/* STEP 1 — Manufacturing Documents */}
      <div className="section-block">
        <h4>1. Manufacturing Documents</h4>

        {isReadOnly ? (
          <p>
            <a
              href={deliveryInfo?.manufacturer_attachment}
              target="_blank"
              rel="noopener noreferrer"
            >
              {deliveryInfo?.manufacturer_attachment?.split("/").pop()}
            </a>
          </p>
        ) : (
          <>
            <input type="file" multiple onChange={handleManufactureUpload} />

            <ul className="file-list">
              {manufactureFiles.map((file, i) => (
                <li key={i}>
                  {file.name}{" "}
                  <span
                    className="remove-file"
                    onClick={() => removeManufactureFile(i)}
                  >
                    ✖
                  </span>
                </li>
              ))}
            </ul>

            {uploadStatus.manufacture && <p className="success">Uploaded ✔</p>}
          </>
        )}
      </div>

      {/* STEP 2 — Testing Documents */}
      <div className="section-block">
        <h4>2. Testing Documents</h4>

        {isReadOnly ? (
          <p>
            <a href={deliveryInfo?.testing_attachment} target="_blank">
              {deliveryInfo?.testing_attachment?.split("/").pop()}
            </a>
          </p>
        ) : (
          <>
            <input
              type="file"
              multiple
              disabled={!uploadStatus.manufacture}
              onChange={handleTestingUpload}
            />

            <ul className="file-list">
              {testingFiles.map((file, i) => (
                <li key={i}>
                  {file.name}{" "}
                  <span
                    className="remove-file"
                    onClick={() => removeTestingFile(i)}
                  >
                    ✖
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* STEP 3 — UIN Number */}
      <div className="section-block">
        <h4>3. UIN Number</h4>

        {isReadOnly ? (
          <p>{deliveryInfo?.uin_registration_number}</p>
        ) : (
          <input
            type="text"
            placeholder="Enter UIN Number"
            disabled={!uploadStatus.testing}
            value={uin}
            onChange={(e) => {
              setUIN(e.target.value);
              setUploadStatus((prev) => ({ ...prev, uin: !!e.target.value }));
            }}
          />
        )}
      </div>

      {/* STEP 4 — Ready for Delivery */}
      <div className="section-block">
        <h4>4. Ready for Delivery</h4>

        {/* Show button only when NOT read-only */}
        {!isReadOnly && (
          <button
            className="deliver-btn"
            disabled={!uploadStatus.uin}
            onClick={saveDeliveryInfo}
          >
            Mark as Ready for Delivery
          </button>
        )}

        {deliveryInfo?.ready_for_delivery === true && (
          <p className="success">Marked Ready ✔</p>
        )}
      </div>
    </div>
  );
}
