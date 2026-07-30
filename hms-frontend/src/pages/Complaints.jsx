import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { complaintService } from "../services/complaintService";

export default function Complaints() {
  const nav = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const getRoles = () => JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = getRoles().includes("ROLE_ADMIN");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = isAdmin ? await complaintService.getAllComplaints() : await complaintService.getMyComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !description) return setError("Please fill all fields");
    setLoading(true);
    setError("");

    try {
      await complaintService.createComplaint({ title, description });
      setTitle("");
      setDescription("");
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setError("Failed to create complaint: " + (err.response?.data?.message || err.message || err.toString()));
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await complaintService.updateComplaintStatus(id, status);
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();
  const getStatusColor = (status) => {
    if (status === "PENDING") return "var(--color-danger)";
    if (status === "IN_PROGRESS") return "var(--color-warning)";
    if (status === "RESOLVED") return "var(--color-success)";
    return "var(--text-muted)";
  };

  return (
    <div className="container">
      <div className="card animate-slide-up" style={{ maxWidth: "1000px" }}>
        <button style={styles.backBtn} onClick={() => nav("/dashboard")}>
          ⬅ Back
        </button>

        <h2>📝 Maintenance & Complaints</h2>
        
        {!isAdmin && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button 
              className="btn"
              style={{ width: "auto", padding: "10px 20px" }}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "➕ Raise New Complaint"}
            </button>
          </div>
        )}

        {showForm && !isAdmin && (
          <form style={styles.form} onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Title (e.g. Broken Fan)"
              className="inputBox"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Describe the issue..."
              className="inputBox"
              style={{ minHeight: "80px", resize: "vertical" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error && <p style={{ color: "var(--color-danger)", fontSize: "14px" }}>{error}</p>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        )}

        <div style={styles.list}>
          {complaints.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No complaints found.</p>
          ) : (
            complaints.map((c) => (
              <div key={c.id} style={styles.complaintItem}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: "var(--text-main)", margin: "0 0 5px 0", fontSize: "18px" }}>
                    {c.title}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 10px 0" }}>
                    By: {c.studentEmail} | Date: {formatDate(c.createdAt)}
                  </p>
                  <p style={{ color: "var(--text-main)", fontSize: "14px", lineHeight: "1.4", margin: 0 }}>
                    {c.description}
                  </p>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", minWidth: "120px" }}>
                  <span style={{
                    ...styles.statusBadge,
                    background: getStatusColor(c.status)
                  }}>
                    {c.status}
                  </span>

                  {isAdmin && c.status !== "RESOLVED" && (
                    <select 
                      style={styles.select}
                      onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Update Status</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
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
  form: {
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px",
    border: "1px solid var(--glass-border)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  complaintItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid var(--glass-border)",
    transition: "transform 0.2s",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  select: {
    padding: "6px",
    borderRadius: "6px",
    background: "var(--bg-secondary)",
    color: "var(--text-main)",
    border: "1px solid var(--glass-border)",
    cursor: "pointer",
    fontSize: "12px",
    outline: "none",
  },
};
