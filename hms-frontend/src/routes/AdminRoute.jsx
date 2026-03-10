import { Navigate } from "react-router-dom";
import { isAdmin } from "../services/authService";

export default function AdminRoute({ children }) {
  if (!isAdmin()) {
    alert("⛔ Access Denied! Admins only.");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
