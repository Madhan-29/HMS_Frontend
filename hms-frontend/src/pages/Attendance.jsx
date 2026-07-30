import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Attendance() {
  const [date, setDate] = useState("");
  const [present, setPresent] = useState(true);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchMyAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/attendance"); 
        setHistory(res.data);
      } catch (err) {
        console.log(err);
        alert("❌ Failed to load attendance history");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAttendance();
  }, []);

  const handleMark = async (e) => {
    e.preventDefault();

    if (!date) {
      alert("⚠️ Please select a date");
      return;
    }

    try {
      setMarking(true);

      await api.post("/api/attendance/mark", {
        date, 
        present,
      });

      alert("✅ Attendance marked successfully");

    
      const res = await api.get("/api/attendance");
      setHistory(res.data);

      setDate("");
      setPresent(true);
    } catch (err) {
      console.log(err);
      alert("❌ " + (err.response?.data || "Failed to mark attendance"));
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="container">
      <div className="card animate-slide-up" style={{ maxWidth: "800px" }}>
        <button style={styles.backBtn} onClick={() => window.history.back()}>
          ⬅ Back
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📌 Attendance</h2>

        <div style={styles.formContainer}>
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Mark Attendance</h3>

          <form onSubmit={handleMark} style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
            <input
              className="inputBox"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={marking}
            />

            <select
              className="inputBox"
              value={present ? "present" : "absent"}
              onChange={(e) => setPresent(e.target.value === "present")}
              disabled={marking}
            >
              <option value="present">Present ✅</option>
              <option value="absent">Absent ❌</option>
            </select>

            <button className="btn" type="submit" disabled={marking}>
              {marking ? "Marking..." : "Mark Attendance"}
            </button>
          </form>
        </div>

        <h3 style={{ textAlign: "center", marginTop: "30px", marginBottom: "15px", color: "var(--text-main)" }}>
          My Attendance History
        </h3>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading...</p>
        ) : history.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No attendance found</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {history.map((a) => (
              <div key={a.id} style={styles.historyCard}>
                <h4 style={{ color: "var(--accent-blue)", marginBottom: "8px" }}>Date: {a.date}</h4>
                <p style={{ color: "var(--text-main)", marginBottom: "5px" }}>Status: {a.present ? "Present ✅" : "Absent ❌"}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>Marked At: {a.markedAt}</p>
              </div>
            ))}
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
  formContainer: {
    maxWidth: "400px",
    margin: "0 auto",
    background: "rgba(0,0,0,0.2)",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid var(--glass-border)",
  },
  historyCard: {
    background: "rgba(0,0,0,0.2)",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid var(--glass-border)",
    transition: "transform 0.2s",
  },
};
