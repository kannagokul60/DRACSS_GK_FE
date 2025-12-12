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

  useEffect(() => {
    const fetchApprovedDrones = async () => {
      try {
        const res = await fetch(`${config.baseURL}/drone_registration/`);
        const data = await res.json();

        const approvedDrones = data.filter((d) => d.is_active === true);

        // Fetch drone images from drone-images API
        const dronesWithImages = await Promise.all(
          approvedDrones.map(async (d) => {
            const latestClient =
              d.client && d.client.length > 0
                ? d.client[d.client.length - 1]
                : null;

            // Fetch image from drone-images API
            let imageUrl = "";
            try {
              const resImage = await fetch(
                `${config.baseURL}/drone_images/${d.id}/`
              );
              const imageData = await resImage.json();
              imageUrl = imageData.image;
            } catch (err) {
              console.error(`Error fetching image for drone ${d.id}:`, err);
            }

            return {
              id: d.id,
              name: latestClient?.model_name || d.model_name,
              purchaseDate: (
                latestClient?.created_at ||
                d.created_at ||
                ""
              ).split("T")[0],
              count: d.client?.length || 1,
              image: imageUrl,
            };
          })
        );

        setDrones(dronesWithImages);
      } catch (err) {
        console.error("Error fetching approved drones:", err);
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
        {drones.length > 0 ? (
          drones.map((drone, i) => (
            <div
              className="approved-card"
              key={i}
              onClick={() => handleDroneClick(drone.id)}
            >
              <FaShare className="approved-icon" title="View Drone" />
              <div className="approved-card-content">
                <img
                  src={drone.image}
                  alt={drone.name}
                  className="approved-img"
                />
                <div className="approved-info">
                  <h3>{drone.name}</h3>
                  <p>
                    Purchase Date:{" "}
                    <strong>
                      {drone.purchaseDate
                        ? format(new Date(drone.purchaseDate), "dd-MM-yyyy")
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
