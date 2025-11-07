import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/JSX/Login";
import Register from "./pages/JSX/Register";
import Dashboard from "./pages/JSX/Client/Dashboard";
import DroneDetails from "./pages/JSX/Client/DroneDetails";
import ViewDrone from "./pages/JSX/Client/ViewDrone";
import Layout from "./pages/JSX/Layout";
import DroneRegistration from "./pages/JSX/Client/DroneRegistration";
import KnowledgeBase from "./pages/JSX/Client/KnowledgeBase";
import ViewKnowledge from "./pages/JSX/Client/ViewKnowledge";
import ProfileDetails from "./pages/JSX/Client/ProfileDetails";
import SupportPage from "./pages/JSX/Client/SupportPage";
import OnlineSupport from "./pages/JSX/Client/OnlineSupport";
import OnsiteSupport from "./pages/JSX/Client/OnSiteSupport";
import ReturnToBase from "./pages/JSX/Client/Return_base";

//BD Team Imports
import BDLayout from "./pages/JSX/Layout";
import BDDashboard from "./pages/JSX/BDTeam/Dashboard";
import ClientList from "./pages/JSX/BDTeam/ClientList";
import ClientDetails from "./pages/JSX/BDTeam/ClientDroneList";

import "./App.css";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("access");

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {isLoggedIn ? (
  <>
    {/* CLIENT ROUTES */}
    <Route path="/client" element={<Layout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="drone-details" element={<DroneDetails />} />
      <Route path="view-drone/:droneName" element={<ViewDrone />} />
      <Route path="drone-registration" element={<DroneRegistration />} />
      <Route path="knowledge-base" element={<KnowledgeBase />} />
      <Route path="knowledge/bhumi" element={<ViewKnowledge />} />
      <Route path="profile-details" element={<ProfileDetails />} />
      <Route path="support" element={<SupportPage />} />
      <Route path="online-support" element={<OnlineSupport />} />
      <Route path="onsite-support" element={<OnsiteSupport />} />
      <Route path="return-to-base" element={<ReturnToBase />} />
    </Route>

    {/* BD TEAM ROUTES */}
    <Route path="/bd" element={<BDLayout />}>
      <Route path="dashboard" element={<BDDashboard />} />
            <Route path="client-list" element={<ClientList />} />
            <Route path="client-drone-list/:id" element={<ClientDetails />} />

    </Route>
  </>
) : (
  <Route path="*" element={<Navigate to="/" />} />
)}


    </Routes>
  );
}
