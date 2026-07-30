import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

export default function UserManagement() {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleStatusToggle = async (id, currentStatus, email) => {
    if (email === "admin@hms.com") {
      alert("Cannot disable the master admin account!");
      return;
    }
    try {
      await userService.updateUserStatus(id, !currentStatus);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleRoleChange = async (id, currentRoles, email) => {
    if (email === "admin@hms.com") {
      alert("Cannot demote the master admin account!");
      return;
    }
    const isCurrentlyAdmin = currentRoles.includes("ROLE_ADMIN");
    const newRole = isCurrentlyAdmin ? "ROLE_USER" : "ROLE_ADMIN";
    const confirmMessage = isCurrentlyAdmin 
      ? `Are you sure you want to demote ${email} to Student?`
      : `Are you sure you want to promote ${email} to Admin?`;
      
    if (!window.confirm(confirmMessage)) return;

    try {
      await userService.updateUserRole(id, newRole);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  const handleDelete = async (id, email) => {
    if (email === "admin@hms.com") {
      alert("Cannot delete the master admin account!");
      return;
    }
    if (!window.confirm(`Are you sure you want to completely delete ${email}'s account? This cannot be undone.`)) return;
    
    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="container">
      <div className="card animate-slide-up" style={{ maxWidth: "1000px" }}>
        <button style={styles.backBtn} onClick={() => nav("/dashboard")}>
          ⬅ Back
        </button>

        <h2>👥 User Management</h2>
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: "20px" }}>
          Manage system access, promote users, and disable accounts.
        </p>

        {loading ? (
          <p style={{ color: "white", textAlign: "center" }}>Loading users...</p>
        ) : (
          <div style={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    
                    <td>
                      <button 
                        style={{
                          ...styles.statusBtn,
                          background: u.enabled ? "var(--success)" : "#555",
                        }}
                        onClick={() => handleStatusToggle(u.id, u.enabled, u.email)}
                        disabled={u.email === "admin@hms.com"}
                      >
                        {u.enabled ? "Active" : "Disabled"}
                      </button>
                    </td>

                    <td>
                      <span style={{
                        ...styles.roleBadge,
                        background: u.roles.includes("ROLE_ADMIN") ? "var(--warning)" : "var(--accent-blue)"
                      }}>
                        {u.roles.includes("ROLE_ADMIN") ? "Admin" : "Student"}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button 
                          style={styles.actionBtnPrimary}
                          onClick={() => handleRoleChange(u.id, u.roles, u.email)}
                          disabled={u.email === "admin@hms.com"}
                        >
                          Change Role
                        </button>
                        <button 
                          style={styles.actionBtnDanger}
                          onClick={() => handleDelete(u.id, u.email)}
                          disabled={u.email === "admin@hms.com"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  backBtn: {
    position: "absolute",
    top: "25px",
    left: "25px",
    padding: "8px 15px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    color: "var(--text-main)",
    transition: "all 0.3s ease",
  },
  tableContainer: {
    overflowX: "auto",
    marginTop: "20px",
  },
  statusBtn: {
    padding: "6px 12px",
    borderRadius: "15px",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  roleBadge: {
    padding: "6px 12px",
    borderRadius: "15px",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
  },
  actionBtnPrimary: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent-blue)",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "transform 0.2s",
  },
  actionBtnDanger: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "var(--danger)",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "transform 0.2s",
  },
};
