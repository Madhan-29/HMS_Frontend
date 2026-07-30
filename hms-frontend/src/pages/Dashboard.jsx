import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

export default function Dashboard() {
  const nav = useNavigate();

  const getRoles = () => {
    return JSON.parse(localStorage.getItem("roles") || "[]");
  };

  const isAdmin = () => {
    const roles = getRoles();
    return roles.includes("ROLE_ADMIN");
  };

  const handleLogout = () => {
    logoutUser();
    alert("✅ Logged out");
    nav("/");
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "1000px" }}>
        {/* 🔝 TOP RIGHT ACTIONS */}
        <div style={{ position: "absolute", top: "25px", right: "25px", display: "flex", gap: "12px" }}>
          <button
            style={{ padding: "8px 16px", borderRadius: "10px", border: "none", background: "var(--glass-bg)", color: "white", cursor: "pointer", fontWeight: "600", border: "1px solid var(--glass-border)" }}
            onClick={() => nav("/profile-edit")}
          >
            👤 Profile
          </button>

          <button 
            style={{ padding: "8px 16px", borderRadius: "10px", border: "none", background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", cursor: "pointer", fontWeight: "600", border: "1px solid rgba(239,68,68,0.3)" }}
            onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        <h2 style={{ fontSize: "32px", marginBottom: "5px" }}>🏠 Hostel Management System</h2>

        {/* ROLE BADGE */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", alignItems: "center", marginBottom: "35px" }}>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontWeight: "700",
              fontSize: "12px",
              letterSpacing: "1px",
              background: isAdmin() ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)",
              color: isAdmin() ? "#fbbf24" : "#34d399",
              border: `1px solid ${isAdmin() ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)"}`
            }}
          >
            {isAdmin() ? "ADMIN" : "USER"}
          </span>
        </div>

        {/* ACTION GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          <button className="actionCard" onClick={() => nav("/rooms")}>
            <span className="cardTitle">🏠 View Rooms</span>
            <span className="cardDesc">Check hostel room availability and details</span>
          </button>

          <button className="actionCard" onClick={() => nav("/attendance")}>
            <span className="cardTitle">📌 Attendance</span>
            <span className="cardDesc">Mark & view your daily attendance records</span>
          </button>

          <button className="actionCard" onClick={() => nav("/complaints")}>
            <span className="cardTitle">📝 Complaints</span>
            <span className="cardDesc">Raise or track maintenance and room issues</span>
          </button>

          <button className="actionCard" onClick={() => nav("/leave")}>
            <span className="cardTitle">🛫 Leave / Pass</span>
            <span className="cardDesc">Apply for leave or a temporary gate pass</span>
          </button>

          <button className="actionCard" onClick={() => nav("/visitors")}>
            <span className="cardTitle">👥 Visitors</span>
            <span className="cardDesc">Register and keep track of your visitors</span>
          </button>

          <button className="actionCard" onClick={() => nav("/notices")}>
            <span className="cardTitle">📢 Notice Board</span>
            <span className="cardDesc">Read the latest announcements and alerts</span>
          </button>

          {/* ADMIN ONLY */}
          {isAdmin() && (
            <>
              <button
                className="adminCard"
                onClick={() => nav("/allocations")}
              >
                <span className="cardTitle">🛏 Room Allocation</span>
                <span className="cardDesc">Admin: Allocate & vacate student rooms</span>
              </button>

              <button
                className="adminCard"
                onClick={() => nav("/admin-attendance")}
              >
                <span className="cardTitle">📋 Admin Attendance</span>
                <span className="cardDesc">Admin: View overall users attendance history</span>
              </button>

              <button
                className="adminCard"
                onClick={() => nav("/user-management")}
              >
                <span className="cardTitle">👥 User Management</span>
                <span className="cardDesc">Admin: Manage system access and roles</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
