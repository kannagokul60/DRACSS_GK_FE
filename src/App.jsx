import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/JSX/Login";
import Register from "./pages/JSX/Register";

import Layout from "./pages/JSX/Layout";

// CLIENT IMPORTS
import Dashboard from "./pages/JSX/Client/Dashboard";
import DroneDetails from "./pages/JSX/Client/DroneDetails";
import ViewDrone from "./pages/JSX/Client/ViewDrone";
import DroneRegistration from "./pages/JSX/Client/DroneRegistration";
import KnowledgeBase from "./pages/JSX/Client/KnowledgeBase";
import ViewKnowledge from "./pages/JSX/Client/ViewKnowledge";
import ProfileDetails from "./pages/JSX/Client/ProfileDetails";
import SupportPage from "./pages/JSX/Client/SupportPage";
import OnlineSupport from "./pages/JSX/Client/OnlineSupport";
import OnsiteSupport from "./pages/JSX/Client/OnSiteSupport";
import ReturnToBase from "./pages/JSX/Client/Return_base";

// BD TEAM IMPORTS
import BDDashboard from "./pages/JSX/BDTeam/Dashboard";
import ClientList from "./pages/JSX/BDTeam/ClientList";
import ClientDetails from "./pages/JSX/BDTeam/ClientDroneList";
import BDDroneDetails from "./pages/JSX/BDTeam/BDDroneDetails";
import SoldDroneList from "./pages/JSX/BDTeam/soldDroneList.jsx";
import BDKnowledgeBase from "./pages/JSX/BDTeam/KnowledgeBase";
import BDViewKnowledge from "./pages/JSX/BDTeam/ViewKnowledge";
import PendingTasks from "./pages/JSX/BDTeam/PendingTasks";
import Profile from "./pages/JSX/BDTeam/Profile";
import DroneApprove from "./pages/JSX/BDTeam/DroneApprove";
import UnsoldDroneList from "./pages/JSX/BDTeam/UnsoldDroneList.jsx";
import OrderFormPage from "./pages/JSX/BDTeam/OrderFormPage";

import BDSupportPage from "./pages/JSX/BDTeam/SupportPage.jsx";
import BDOnlineSupportList from "./pages/JSX/BDTeam/OnlineSupportList.jsx";
import BDOnlineSupportPage from "./pages/JSX/BDTeam/OnlineSupportPage.jsx";
import BDOnSiteSupportPage from "./pages/JSX/BDTeam/OnsiteSupportPage.jsx";

// TECHNICAL TEAM
import TechiDashboard from "./pages/JSX/Technical/Dashboard";
import AssignedDroneList from "./pages/JSX/Technical/AssignedDroneList";
import OrderStatusPage from "./pages/JSX/Technical/OrderStatusPage";
import TechnicalProfile from "./pages/JSX/Technical/TechnicalProfile.jsx";
import CompletedDroneList from "./pages/JSX/Technical/CompletedDroneList.jsx";
import RCAReportPage from "./pages/JSX/Technical/RCAReportPage.jsx";
import SupportPageTech from "./pages/JSX/Technical/SupportPage.jsx";
import OnSiteSupportTickets from "./pages/JSX/Technical/OnsiteSupportTickets.jsx";

// PILOT TEAM
import PilotDashboard from "./pages/JSX/Pilot/PilotDashboard";
import PilotPendingDelivery from "./pages/JSX/Pilot/PilotPendingDelivery.jsx";
import PilotProfile from "./pages/JSX/Pilot/PilotProfile.jsx";
import PilotDelivered from "./pages/JSX/Pilot/PilotDelivered.jsx";

import "./App.css";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("user");

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
            <Route path="view-drone/:droneId" element={<ViewDrone />} />
            <Route path="drone-registration" element={<DroneRegistration />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="knowledge/:droneName" element={<ViewKnowledge />} />
            <Route path="profile-details" element={<ProfileDetails />} />
            <Route path="support" element={<SupportPage />} />
            <Route
              path="online-support/:ticketId?"
              element={<OnlineSupport />}
            />
            <Route path="onsite-support" element={<OnsiteSupport />} />
            <Route path="return-to-base" element={<ReturnToBase />} />
          </Route>

          {/* BD TEAM ROUTES */}
          <Route path="/bd" element={<Layout />}>
            <Route path="dashboard" element={<BDDashboard />} />
            <Route path="client-list" element={<ClientList />} />
            <Route path="client-drone-list/:id" element={<ClientDetails />} />
            <Route path="drone-details" element={<BDDroneDetails />} />
            <Route path="sold-drones" element={<SoldDroneList />} />
            <Route path="knowledge-base" element={<BDKnowledgeBase />} />
            <Route path="knowledge/:drone" element={<BDViewKnowledge />} />
            <Route path="pending-tasks" element={<PendingTasks />} />
            <Route path="profile-details" element={<Profile />} />
            <Route path="unsold-drones" element={<UnsoldDroneList />} />
            <Route path="drone-approve" element={<DroneApprove />} />
            <Route path="orderform" element={<OrderFormPage />} />

            {/* SUPPORT FLOW */}
            <Route path="support" element={<BDSupportPage />} />
            <Route path="online-support" element={<BDOnlineSupportList />} />
            <Route
              path="online-support/:ticketId"
              element={<BDOnlineSupportPage />}
            />
            <Route
              path="onsite-support/:ticketId"
              element={<BDOnSiteSupportPage />}
            />
              <Route path="onsite-support" element={<BDOnSiteSupportPage />} />
            {/* <Route path="assign-onsite-ticket/:id" element={<AssignOnsiteTicket />}/> */}
          </Route>

          {/* TECHNICAL */}
          <Route path="/technical" element={<Layout />}>
            <Route path="dashboard" element={<TechiDashboard />} />
            <Route path="assigned-drones" element={<AssignedDroneList />} />
            <Route path="order-status/:orderId" element={<OrderStatusPage />} />
            <Route path="completed-work" element={<CompletedDroneList />} />
            <Route path="support-tech" element={<SupportPageTech />} />
            <Route
              path="on-site-support-tickets"
              element={<OnSiteSupportTickets />}
            />
            <Route path="completed-work" element={<CompletedDroneList />} />
            <Route path="rca-report" element={<RCAReportPage />} />
            <Route path="profile" element={<TechnicalProfile />} />
          </Route>

          {/* PILOT */}
          <Route path="/pilot" element={<Layout />}>
            <Route path="dashboard" element={<PilotDashboard />} />
            <Route path="pending-delivery" element={<PilotPendingDelivery />} />
            <Route path="pilot-delivered" element={<PilotDelivered />} />
            <Route path="profile-details" element={<PilotProfile />} />
          </Route>
        </>
      ) : (
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}
