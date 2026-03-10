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
    <div style={styles.page}>
      <div style={styles.card}>
        {/* 🔝 TOP RIGHT ACTIONS */}
        <div style={styles.topActions}>
          <button
            style={styles.profileBtn}
            onClick={() => nav("/profile-edit")}
          >
            👤 Profile
          </button>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        <h1 style={styles.title}>🏠 Hostel Management System</h1>
        <p style={styles.subTitle}>Dashboard</p>

        {/* ROLE BADGE */}
        <div style={styles.roleBox}>
          <span
            style={{
              ...styles.badge,
              background: isAdmin() ? "#ff6b6b" : "#4caf50",
            }}
          >
            {isAdmin() ? "ADMIN" : "USER"}
          </span>
          <span style={{ color: "lightgray", fontSize: "14px" }}>
            ✅ You are logged in
          </span>
        </div>

        {/* ACTION GRID */}
        <div style={styles.grid}>
          <button style={styles.actionBtn} onClick={() => nav("/rooms")}>
            🏠 View Rooms
            <p style={styles.desc}>Check hostel room availability</p>
          </button>

          <button style={styles.actionBtn} onClick={() => nav("/attendance")}>
            📌 Attendance
            <p style={styles.desc}>Mark & view your attendance</p>
          </button>

          {/* ADMIN ONLY */}
          {isAdmin() && (
            <>
              <button
                style={styles.adminBtn}
                onClick={() => nav("/allocations")}
              >
                🛏 Room Allocation
                <p style={styles.desc}>Allocate & vacate rooms</p>
              </button>

              <button
                style={styles.adminBtn}
                onClick={() => nav("/admin-attendance")}
              >
                📋 Admin Attendance
                <p style={styles.desc}>View users attendance history</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f0f0f, #1b1b1b)",
    padding: "20px",
  },

  card: {
    position: "relative",
    width: "100%",
    maxWidth: "900px",
    padding: "35px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)",
    boxShadow: "0px 8px 30px rgba(0,0,0,0.5)",
    textAlign: "center",
  },

  topActions: {
    position: "absolute",
    top: "20px",
    right: "20px",
    display: "flex",
    gap: "10px",
  },

  profileBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "#4cafef",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
  },

  logoutBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "tomato",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
  },

  title: {
    color: "white",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "5px",
  },

  subTitle: {
    color: "lightgray",
    marginBottom: "20px",
  },

  roleBox: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    alignItems: "center",
    marginBottom: "30px",
  },

  badge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: "bold",
    color: "white",
    fontSize: "13px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginTop: "20px",
  },

  actionBtn: {
    padding: "18px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background: "rgba(255,255,255,0.10)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "left",
  },

  adminBtn: {
    padding: "18px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background: "rgba(255, 99, 71, 0.20)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "left",
  },

  desc: {
    fontSize: "13px",
    marginTop: "5px",
    fontWeight: "400",
    color: "lightgray",
  },
};
