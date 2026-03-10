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
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>📌 Attendance</h2>

      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <Link to="/dashboard" style={{ color: "#4cafef" }}>
          ⬅ Back to Dashboard
        </Link>
      </div>

      {}
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.06)",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Mark Attendance</h3>

        <form onSubmit={handleMark}>
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

      {}
      <h3 style={{ textAlign: "center", marginTop: "30px" }}>
        My Attendance History
      </h3>

      {loading ? (
        <p style={{ textAlign: "center", color: "lightgray" }}>Loading...</p>
      ) : history.length === 0 ? (
        <p style={{ textAlign: "center" }}>No attendance found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          {history.map((a) => (
            <div
              key={a.id}
              style={{
                background: "rgba(255,255,255,0.06)",
                padding: "18px",
                borderRadius: "12px",
              }}
            >
              <h4>Date: {a.date}</h4>
              <p>Status: {a.present ? "Present ✅" : "Absent ❌"}</p>
              <p>Marked At: {a.markedAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
