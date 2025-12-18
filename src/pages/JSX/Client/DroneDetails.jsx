import React, { useEffect, useState } from "react";
import { FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../CSS/Client/dronedetails.css";
import BreadCrumbs from "../BreadCrumbs";
import config from "../../../config";
import { format } from "date-fns";

export default function DroneDetails() {
  const navigate = useNavigate();
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedDrones = async () => {
      try {
        // 1️⃣ Fetch drone registrations
        const droneRes = await fetch(`${config.baseURL}/drone_registration/`);
        const droneData = await droneRes.json();

        // 2️⃣ Fetch drone images (LIST API)
        const imageRes = await fetch(`${config.baseURL}/drone_images/`);
        const imageData = await imageRes.json();

        // 3️⃣ Filter only active drones
        const approvedDrones = droneData.filter(
          (d) => d.is_active === true
        );

        // 4️⃣ Map drones with correct image matching (BY NAME)
        const dronesWithImages = approvedDrones.map((d) => {
          const latestClient =
            d.client && d.client.length > 0
              ? d.client[d.client.length - 1]
              : null;

          const droneName =
            latestClient?.model_name || d.model_name || "";

          const matchedImage = imageData.find(
            (img) => img.name === droneName
          );

          return {
            id: d.id,
            name: droneName,
            purchaseDate: (
              latestClient?.created_at ||
              d.created_at ||
              ""
            ).split("T")[0],
            count: d.client?.length || 1,
            image: matchedImage?.image || "",
          };
        });

        setDrones(dronesWithImages);
      } catch (error) {
        console.error("Error fetching drone details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedDrones();
  }, []);

  const handleDroneClick = (id) => {
    navigate(`/client/view-drone/${id}`);
  };

  return (
    <div className="approved-page">
      <div className="approved-breadcrumb-wrapper">
        <BreadCrumbs title="Drone Details" />
      </div>

      <div className="approved-header">
        <h2 className="approved-title">Approved Drones</h2>
      </div>

      <div className="approved-container">
        {loading ? (
          <p>Loading drones...</p>
        ) : drones.length > 0 ? (
          drones.map((drone, index) => (
            <div
              className="approved-card"
              key={index}
              onClick={() => handleDroneClick(drone.id)}
            >
              <FaShare className="approved-icon" title="View Drone" />

              <div className="approved-card-content">
                <img
                  src={drone.image || "/no-image.png"}
                  alt={drone.name}
                  className="approved-img"
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />

                <div className="approved-info">
                  <h3>{drone.name}</h3>

                  <p>
                    Purchase Date:{" "}
                    <strong>
                      {drone.purchaseDate
                        ? format(
                            new Date(drone.purchaseDate),
                            "dd-MM-yyyy"
                          )
                        : "N/A"}
                    </strong>
                  </p>

                  <p>
                    Count: <strong>{drone.count} pcs</strong>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No approved drones available.</p>
        )}
      </div>
    </div>
  );
}
