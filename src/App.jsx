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
import BDDroneDetails from "./pages/JSX/BDTeam/BDDroneDetails";
import BDDroneProfile from "./pages/JSX/BDTeam/BDDroneProfile";
import BDKnowledgeBase from "./pages/JSX/BDTeam/KnowledgeBase";
import BDViewKnowledge from "./pages/JSX/BDTeam/ViewKnowledge";
import PendingTasks from "./pages/JSX/BDTeam/PendingTasks";
import Profile from "./pages/JSX/BDTeam/Profile";
import DroneApprove from "./pages/JSX/BDTeam/DroneApprove";

//Technical Team Imports
import TechnicalLayout from "./pages/JSX/Layout";
import TechiDashboard from "./pages/JSX/Technical/Dashboard";
import TechnicalTasks from "./pages/JSX/Technical/TechnicalTasks";
import OrderFormPage from "./pages/JSX/BDTeam/OrderFormPage";
import AssignedDroneList from "./pages/JSX/Technical/AssignedDroneList";

//Pilot Team Imports
import PilotLayout from "./pages/JSX/Layout";
import PilotDashboard from "./pages/JSX/Pilot/PilotDashboard";

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
  <Route path="drone-details" element={<BDDroneDetails />} />
  <Route path="drone-details/:id" element={<BDDroneProfile />} />
  <Route path="knowledge-base" element={<BDKnowledgeBase />} />
  <Route path="knowledge/bhumi" element={<BDViewKnowledge />} />
  <Route path="pending-tasks" element={<PendingTasks />} />
  <Route path="profile-details" element={<Profile />} />

  {/* FIXED: REMOVE leading slash */}
  <Route path="drone-approve" element={<DroneApprove />} />
  <Route path="orderform" element={<OrderFormPage />} />
</Route>


          {/* TECHNICAL TEAM ROUTES */}
          <Route path="/technical" element={<TechnicalLayout />}>
            <Route path="dashboard" element={<TechiDashboard />} />
            <Route path="tasks" element={<TechnicalTasks role="technical" />} />
                    <Route path="assigned-drones" element={<AssignedDroneList />} />
          </Route>

          {/* PILOT TEAM ROUTES */}

           <Route path="/pilot" element={<PilotLayout />}>
            <Route path="dashboard" element={<PilotDashboard />} />

          </Route>
        </>
      ) : (
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}
