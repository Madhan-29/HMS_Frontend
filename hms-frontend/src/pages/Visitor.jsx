import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { visitorService } from "../services/visitorService";
import * as XLSX from "xlsx";

export default function Visitor() {
  const nav = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [visitorName, setVisitorName] = useState("");
  const [relation, setRelation] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const getRoles = () => JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = getRoles().includes("ROLE_ADMIN");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const data = isAdmin ? await visitorService.getAllVisitors() : await visitorService.getMyVisitors();
      setVisitors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!visitorName || !relation || !visitDate) return setError("Please fill all fields");
    setLoading(true);
    setError("");

    try {
      await visitorService.createVisitorRequest({ visitorName, relation, visitDate });
      setVisitorName("");
      setRelation("");
      setVisitDate("");
      fetchVisitors();
    } catch (err) {
      console.error(err);
      setError("Failed to register visitor: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await visitorService.updateVisitorStatus(id, status);
      fetchVisitors();
    } catch (err) {
      console.error(err);
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    if (status === "PENDING") return "var(--warning)";
    if (status === "APPROVED") return "var(--accent-blue)";
    if (status === "CHECKED_IN") return "var(--success)";
    if (status === "REJECTED") return "var(--danger)";
    if (status === "CHECKED_OUT") return "var(--text-muted)";
    return "var(--text-muted)";
  };

  const handleExportExcel = () => {
    if (!visitors || visitors.length === 0) {
      alert("No data to export");
      return;
    }

    let filtered = visitors;
    if (exportStartDate && exportEndDate) {
      const start = new Date(exportStartDate);
      const end = new Date(exportEndDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = visitors.filter((v) => {
        const itemDate = new Date(v.visitDate);
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

    const exportData = filtered.map((v) => ({
      "Visitor Name": v.visitorName,
      "Relation": v.relation,
      "Expected Date": v.visitDate,
      "Host (Student Email)": v.studentEmail || "N/A",
      "Status": v.status,
      "In Time": formatDateTime(v.inTime),
      "Out Time": formatDateTime(v.outTime)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");
    XLSX.writeFile(workbook, "Visitor_Passes.xlsx");
  };

  return (
    <div className="container">
      <div className="card animate-slide-up" style={{ maxWidth: "800px" }}>
        <button style={styles.backBtn} onClick={() => nav("/dashboard")}>
          ⬅ Back
        </button>

        <h2>👥 Visitor Management</h2>

        {/* REGISTER VISITOR FORM */}
        {!isAdmin && (
          <form style={styles.form} onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Visitor Name"
              className="inputBox"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Relation (e.g., Father, Friend)"
                className="inputBox"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              />
              <input
                type="date"
                className="inputBox"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
            </div>
            {error && <p style={{ color: "var(--danger)", fontSize: "14px" }}>{error}</p>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Registering..." : "Register Visitor"}
            </button>
          </form>
        )}

        {/* VISITORS LIST */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", marginTop: "20px", flexWrap: "wrap", gap: "10px" }}>
          <h3 style={{ color: "var(--text-main)", margin: 0 }}>
            {isAdmin ? "All Visitor Requests" : "My Visitors"}
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
          {visitors.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No visitor records found.</p>
          ) : (
            visitors.map((v) => (
              <div key={v.id} style={styles.visitorItem}>
                <div>
                  <h4 style={{ color: "var(--accent-blue)", margin: 0, fontSize: "16px" }}>
                    {v.visitorName} <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>({v.relation})</span>
                  </h4>
                  <p style={{ color: "var(--text-main)", margin: "8px 0", fontSize: "14px" }}>
                    Expected Date: {v.visitDate}
                  </p>
                  
                  {isAdmin && (
                    <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: 0 }}>
                      Host: {v.studentEmail}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: 0 }}>
                      <strong>In:</strong> {formatDateTime(v.inTime)}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: 0 }}>
                      <strong>Out:</strong> {formatDateTime(v.outTime)}
                    </p>
                  </div>
                </div>
                
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    ...styles.statusBadge,
                    background: getStatusColor(v.status)
                  }}>
                    {v.status}
                  </span>
                  
                  {isAdmin && (
                    <div style={{ marginTop: "15px", display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                      {v.status === "PENDING" && (
                        <>
                          <button style={styles.actionBtnApprove} onClick={() => handleStatusUpdate(v.id, "APPROVED")}>
                            Approve
                          </button>
                          <button style={styles.actionBtnReject} onClick={() => handleStatusUpdate(v.id, "REJECTED")}>
                            Reject
                          </button>
                        </>
                      )}
                      
                      {v.status === "APPROVED" && (
                        <button style={styles.actionBtnApprove} onClick={() => handleStatusUpdate(v.id, "CHECKED_IN")}>
                          Check-In
                        </button>
                      )}
                      
                      {v.status === "CHECKED_IN" && (
                        <button style={styles.actionBtnReject} onClick={() => handleStatusUpdate(v.id, "CHECKED_OUT")}>
                          Check-Out
                        </button>
                      )}
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
  visitorItem: {
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
