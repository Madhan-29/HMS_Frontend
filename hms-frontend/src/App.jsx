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
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROFILE SETUP ================= */}
        {/* First login → mandatory */}
        <Route path="/profile-setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />

        {/* ================= USER PROTECTED ROUTES ================= */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProfileGuard>
                <Dashboard />
              </ProfileGuard>
            </PrivateRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <PrivateRoute>
              <ProfileGuard>
                <Rooms />
              </ProfileGuard>
            </PrivateRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <ProfileGuard>
                <Attendance />
              </ProfileGuard>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile-edit"
          element={
            <PrivateRoute>
              <ProfileGuard>
                <ProfileEdit />
              </ProfileGuard>
            </PrivateRoute>
          }
        />

        {/* ================= ADMIN PROTECTED ROUTES ================= */}
        <Route
          path="/allocations"
          element={
            <PrivateRoute>
              <AdminRoute>
                <Allocations />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-attendance"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminAttendance />
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
