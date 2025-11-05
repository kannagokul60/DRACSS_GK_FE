import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/JSX/Login";
import Register from "./pages/JSX/Register";
import Dashboard from "./pages/JSX/Client/Dashboard";
import DroneDetails from "./pages/JSX/Client/DroneDetails";
import ViewDrone from "./pages/JSX/Client/ViewDrone";
import Layout from "./pages/JSX/Layout";
import DroneRegistration from "./pages/JSX/Client/DroneRegistration";
import KnowledgeBase from "./pages/JSX/Client/KnowledgeBase";

import "./App.css";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("access");

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {isLoggedIn ? (
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/drone-details" element={<DroneDetails />} />
          <Route path="/view-drone/:droneName" element={<ViewDrone />} />
          <Route path="/drone-registration" element={<DroneRegistration />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}
