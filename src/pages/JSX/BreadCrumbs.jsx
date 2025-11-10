import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../CSS/breadCrumb.css";

export default function BreadCrumbs() {
  const navigate = useNavigate();

  return (
    <div className="back-header">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FaArrowLeft />
      </button>
      <div className="breadcrumb">Back</div>
    </div>
  );
}
