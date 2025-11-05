import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../CSS/breadcrumb.css";

export default function BreadCrumbs({ title }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Map pathname to readable labels (optional, for nicer names)
  const pathLabels = {
    "drone-registration": "Back",
    "view-drone": "View Drone",
    "drone-details": "Back",
    "knowledge-base":"Back"
  };

  // Generate breadcrumb items from pathname
  const path = location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment, i, arr) => (
      <span key={i} className="breadcrumb-segment">
        {pathLabels[segment] || segment.replace(/-/g, " ")}
        {i < arr.length - 1 && " / "}
      </span>
    ));

  return (
    <div className="back-header">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="back-btn">
        <FaArrowLeft />
      </button>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        {path.length > 0 ? path : title || "Back"}
      </div>
    </div>
  );
}
