import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { leaveService } from "../services/leaveService";
import * as XLSX from "xlsx";

export default function Leave() {
  const nav = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const getRoles = () => JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = getRoles().includes("ROLE_ADMIN");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = isAdmin ? await leaveService.getAllLeaveRequests() : await leaveService.getMyLeaveRequests();
      setLeaves(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!reason || !startDate || !endDate) return setError("Please fill all fields");
    setLoading(true);
    setError("");

    try {
      await leaveService.createLeaveRequest({ reason, startDate, endDate });
      setReason("");
      setStartDate("");
      setEndDate("");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setError("Failed to apply for leave: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await leaveService.updateLeaveStatus(id, status);
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusColor = (status) => {
    if (status === "PENDING") return "var(--warning)";
    if (status === "APPROVED") return "var(--success)";
    if (status === "REJECTED") return "var(--danger)";
    return "var(--text-muted)";
  };

  const handleExportExcel = () => {
    if (!leaves || leaves.length === 0) {
      alert("No data to export");
      return;
    }

    let filtered = leaves;
    if (exportStartDate && exportEndDate) {
      const start = new Date(exportStartDate);
      const end = new Date(exportEndDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = leaves.filter((l) => {
        const itemDate = new Date(l.startDate);
        return itemDate >= start && itemDate <= end;
      });
    } else if (exportStartDate || exportEndDate) {
      alert("Please select both start and end dates for the export range.");
      return;
    }

    if (filtered.length === 0) {
      alert("No records found in the selected date range.");
      return;
    }

    const exportData = filtered.map((l) => ({
      "Student Email": l.studentEmail || "N/A",
      "Start Date": l.startDate,
      "End Date": l.endDate,
      Reason: l.reason,
      Status: l.status,
      "Handled By": l.approvedByEmail || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");
    XLSX.writeFile(workbook, "Leave_Gate_Passes.xlsx");
  };

  return (
    <div className="container">
      <div className="card animate-slide-up" style={{ maxWidth: "800px" }}>
        <button style={styles.backBtn} onClick={() => nav("/dashboard")}>
          ⬅ Back
        </button>

        <h2>🛫 Leave & Gate Pass</h2>

        {/* APPLY LEAVE FORM */}
        {!isAdmin && (
          <form style={styles.form} onSubmit={handleCreate}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="date"
                className="inputBox"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span style={{ color: "var(--text-main)", alignSelf: "center", fontWeight: "bold" }}>to</span>
              <input
                type="date"
                className="inputBox"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <textarea
              placeholder="Reason for leave..."
              className="inputBox"
              style={{ minHeight: "80px", resize: "vertical" }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {error && <p style={{ color: "var(--danger)", fontSize: "14px" }}>{error}</p>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Submitting..." : "Apply Leave"}
            </button>
          </form>
        )}

        {/* LEAVES LIST */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", marginTop: "20px", flexWrap: "wrap", gap: "10px" }}>
          <h3 style={{ color: "var(--text-main)", margin: 0 }}>
            {isAdmin ? "All Leave Requests" : "My Leave Requests"}
          </h3>
          {isAdmin && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--glass-border)" }}>
              <span style={{ color: "var(--text-main)", fontSize: "13px" }}>Export Range:</span>
              <input type="date" style={styles.dateInput} value={exportStartDate} onChange={(e) => setExportStartDate(e.target.value)} />
              <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>to</span>
              <input type="date" style={styles.dateInput} value={exportEndDate} onChange={(e) => setExportEndDate(e.target.value)} />
              <button onClick={handleExportExcel} style={styles.exportBtn}>
                📥 Export
              </button>
            </div>
          )}
        </div>
        
        <div style={styles.list}>
          {leaves.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No leave requests found.</p>
          ) : (
            leaves.map((l) => (
              <div key={l.id} style={styles.leaveItem}>
                <div>
                  <h4 style={{ color: "var(--accent-blue)", margin: 0, fontSize: "16px" }}>
                    {l.startDate} ➡️ {l.endDate}
                  </h4>
                  <p style={{ color: "var(--text-main)", margin: "8px 0", fontSize: "14px" }}>
                    {l.reason}
                  </p>
                  {isAdmin && (
                    <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: 0 }}>
                      By: {l.studentEmail}
                    </p>
                  )}
                  {l.approvedByEmail && (
                    <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "5px 0 0 0" }}>
                      Handled By: {l.approvedByEmail}
                    </p>
                  )}
                </div>
                
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    ...styles.statusBadge,
                    background: getStatusColor(l.status)
                  }}>
                    {l.status}
                  </span>
                  
                  {isAdmin && l.status === "PENDING" && (
                    <div style={{ marginTop: "15px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button style={styles.actionBtnApprove} onClick={() => handleStatusUpdate(l.id, "APPROVED")}>
                        Approve
                      </button>
                      <button style={styles.actionBtnReject} onClick={() => handleStatusUpdate(l.id, "REJECTED")}>
                        Reject
                      </button>
                    </div>
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
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    marginTop: "20px",
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid var(--glass-border)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  leaveItem: {
    display: "flex",
    justifyContent: "space-between",
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "12px",
    alignItems: "center",
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
  actionBtnApprove: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "var(--success)",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  actionBtnReject: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "var(--danger)",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  exportBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "var(--success)",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    transition: "0.2s",
    fontSize: "13px"
  },
  dateInput: {
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid var(--glass-border)",
    background: "var(--glass-bg)",
    color: "var(--text-main)",
    outline: "none",
    fontSize: "13px",
  }
};
