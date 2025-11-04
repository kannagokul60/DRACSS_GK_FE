import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/JSX/login";
import Register from "./pages/JSX/Register";
import Dashboard from "./pages/JSX/Dashboard";
import DroneDetails from "./pages/JSX/DroneDetails";
import ViewDrone from "./pages/JSX/ViewDrone";
import Layout from "./pages/JSX/Layout";
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

        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}
