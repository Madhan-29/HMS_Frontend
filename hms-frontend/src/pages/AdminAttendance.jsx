import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function AdminAttendance() {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [history, setHistory] = useState([]);

  const [filterDate, setFilterDate] = useState(""); 
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>📋 User Attendance History (Admin)</h2>

      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <Link to="/dashboard" style={{ color: "#4cafef" }}>
          ⬅ Back to Dashboard
        </Link>
      </div>

      {}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {}
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

        {}
        <input
          className="inputBox"
          type="date"
          value={filterDate}
          onChange={handleDateChange}
          style={{ flex: "1", minWidth: "200px" }}
        />

        {}
        <button className="btn" onClick={clearFilters}>
          Clear Filter
        </button>
      </div>

      <h3 style={{ textAlign: "center", marginTop: "25px" }}>
        Attendance Records
      </h3>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : history.length === 0 ? (
        <p style={{ textAlign: "center" }}>No attendance found</p>
      ) : (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <table
            style={{
              width: "100%",
              marginTop: "15px",
              borderCollapse: "collapse",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.12)" }}>
                <th style={{ padding: "12px" }}>Date</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Marked At</th>
              </tr>
            </thead>

            <tbody>
              {history.map((a) => (
                <tr key={a.id} style={{ textAlign: "center" }}>
                  <td style={{ padding: "12px" }}>{a.date}</td>
                  <td style={{ padding: "12px" }}>
                    {a.present ? "✅ Present" : "❌ Absent"}
                  </td>
                  <td style={{ padding: "12px" }}>{a.markedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
