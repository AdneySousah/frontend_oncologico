// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("oncologico:UserData");

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
