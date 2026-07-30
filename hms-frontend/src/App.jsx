import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Attendance from "./pages/Attendance";
import Allocations from "./pages/Allocations";
import AdminAttendance from "./pages/AdminAttendance";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileEdit from "./pages/ProfileEdit";
import Complaints from "./pages/Complaints";
import Leave from "./pages/Leave";
import Visitor from "./pages/Visitor";
import NoticeBoard from "./pages/NoticeBoard";
import UserManagement from "./pages/UserManagement";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />

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

        <Route
          path="/complaints"
          element={
            <PrivateRoute>
              <ProfileGuard>
                <Complaints />
              </ProfileGuard>
            </PrivateRoute>
          }
        />

        <Route
          path="/leave"
          element={
            <PrivateRoute>
              <ProfileGuard>
                <Leave />
              </ProfileGuard>
            </PrivateRoute>
          }
        />

        <Route
          path="/visitors"
          element={
            <PrivateRoute>
              <ProfileGuard>
                <Visitor />
              </ProfileGuard>
            </PrivateRoute>
          }
        />

        <Route
          path="/notices"
          element={
            <PrivateRoute>
              <ProfileGuard>
                <NoticeBoard />
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

        <Route
          path="/user-management"
          element={
            <PrivateRoute>
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
