import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function AdminAttendance() {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [history, setHistory] = useState([]);

  const [filterDate, setFilterDate] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to load users");
    }
  };

  const fetchAttendance = async (email) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/attendance/user/${encodeURIComponent(email)}`
      );
      setHistory(res.data);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to load user attendance");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceByDate = async (email, date) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/attendance/user/${encodeURIComponent(email)}/date?date=${date}`
      );
      setHistory(res.data);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to load user attendance by date");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (e) => {
    const email = e.target.value;
    setSelectedEmail(email);

    if (!email) {
      setHistory([]);
      return;
    }

    if (filterDate) {
      fetchAttendanceByDate(email, filterDate);
    } else {
      fetchAttendance(email);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFilterDate(date);

    if (!selectedEmail) {
      alert("⚠️ Select a user first");
      return;
    }

    if (date) {
      fetchAttendanceByDate(selectedEmail, date);
    } else {
      fetchAttendance(selectedEmail); 
    }
  };

  const clearFilters = () => {
    setFilterDate("");
    if (selectedEmail) fetchAttendance(selectedEmail);
  };

  const handleExportExcel = () => {
    if (!history || history.length === 0) {
      alert("No data to export");
      return;
    }

    let filtered = history;
    if (exportStartDate && exportEndDate) {
      const start = new Date(exportStartDate);
      const end = new Date(exportEndDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = history.filter((a) => {
        const itemDate = new Date(a.date);
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

    const exportData = filtered.map((a) => ({
      "User Email": selectedEmail,
      "Date": a.date,
      "Status": a.present ? "Present" : "Absent",
      "Marked At": a.markedAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${selectedEmail || 'All'}.xlsx`);
  };

  return (
    <div className="container">
      <div className="card animate-slide-up" style={{ maxWidth: "1000px" }}>
        <button style={styles.backBtn} onClick={() => window.history.back()}>
          ⬅ Back
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📋 User Attendance History (Admin)</h2>

        <div style={styles.filterContainer}>
          <select
            className="inputBox"
            value={selectedEmail}
            onChange={handleSelectUser}
            style={{ flex: "1", minWidth: "250px" }}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.email}>
                {u.email}
              </option>
            ))}
          </select>

          <input
            className="inputBox"
            type="date"
            value={filterDate}
            onChange={handleDateChange}
            style={{ flex: "1", minWidth: "200px" }}
          />

          <button className="btn" onClick={clearFilters} style={{ background: "var(--glass-border)", color: "var(--text-main)" }}>
            Clear Filter
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "25px", flexWrap: "wrap", gap: "10px" }}>
          <h3 style={{ color: "var(--text-main)", margin: 0 }}>
            Attendance Records
          </h3>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--glass-border)" }}>
            <span style={{ color: "var(--text-main)", fontSize: "13px" }}>Export Range:</span>
            <input type="date" style={styles.dateInput} value={exportStartDate} onChange={(e) => setExportStartDate(e.target.value)} />
            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>to</span>
            <input type="date" style={styles.dateInput} value={exportEndDate} onChange={(e) => setExportEndDate(e.target.value)} />
            <button onClick={handleExportExcel} style={styles.exportBtn}>
              📥 Export
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</p>
        ) : history.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No attendance found</p>
        ) : (
          <div style={{ maxWidth: "900px", margin: "0 auto", overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Marked At</th>
                </tr>
              </thead>

              <tbody>
                {history.map((a) => (
                  <tr key={a.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <td style={styles.td}>{a.date}</td>
                    <td style={styles.td}>
                      {a.present ? (
                        <span style={{ color: "var(--success)", fontWeight: "bold" }}>✅ Present</span>
                      ) : (
                        <span style={{ color: "var(--danger)", fontWeight: "bold" }}>❌ Absent</span>
                      )}
                    </td>
                    <td style={styles.td}>{a.markedAt}</td>
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
    cursor: "pointer",
    background: "var(--glass-bg)",
    border: "1px solid var(--glass-border)",
    color: "var(--text-main)",
    transition: "all 0.3s ease",
  },
  filterContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    justifyContent: "center",
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid var(--glass-border)",
    marginBottom: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(0,0,0,0.2)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid var(--glass-border)",
  },
  th: {
    padding: "15px",
    textAlign: "center",
    color: "var(--text-main)",
    fontWeight: "bold",
    borderBottom: "1px solid var(--glass-border)",
  },
  td: {
    padding: "15px",
    textAlign: "center",
    color: "var(--text-muted)",
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
