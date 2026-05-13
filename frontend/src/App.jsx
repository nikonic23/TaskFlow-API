import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

function App() {
  return (

    <Routes>

      <Route
        path="/"
        element={
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Internshala Backend</h1>
            <div style={{ marginTop: "2rem" }}>
              <a href="/register" style={{ marginRight: "1rem", padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", textDecoration: "none", borderRadius: "4px" }}>Register</a>
              <a href="/login" style={{ padding: "0.5rem 1rem", backgroundColor: "#28a745", color: "white", textDecoration: "none", borderRadius: "4px" }}>Login</a>
            </div>
          </div>
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
