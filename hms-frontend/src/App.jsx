import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Attendance from "./pages/Attendance";
import Allocations from "./pages/Allocations";
import AdminAttendance from "./pages/AdminAttendance";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileEdit from "./pages/ProfileEdit";

/* Route Guards */
import AdminRoute from "./routes/AdminRoute";
import ProfileGuard from "./routes/ProfileGuard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROFILE SETUP ================= */}
        {/* First login → mandatory */}
        <Route path="/profile-setup" element={<ProfileSetup />} />

        {/* ================= USER PROTECTED ROUTES ================= */}
        <Route
          path="/dashboard"
          element={
            <ProfileGuard>
              <Dashboard />
            </ProfileGuard>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProfileGuard>
              <Rooms />
            </ProfileGuard>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProfileGuard>
              <Attendance />
            </ProfileGuard>
          }
        />

        <Route
          path="/profile-edit"
          element={
            <ProfileGuard>
              <ProfileEdit />
            </ProfileGuard>
          }
        />

        {/* ================= ADMIN PROTECTED ROUTES ================= */}
        <Route
          path="/allocations"
          element={
            <AdminRoute>
              <Allocations />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-attendance"
          element={
            <AdminRoute>
              <AdminAttendance />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
