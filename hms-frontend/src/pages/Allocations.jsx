import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Allocations() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const [userEmail, setUserEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [vacatingId, setVacatingId] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [roomsRes, usersRes, allocationsRes] = await Promise.all([
          api.get("/api/rooms"),
          api.get("/api/users"),
          api.get("/api/allocations"),
        ]);

        setRooms(roomsRes.data);
        setUsers(usersRes.data);
        setAllocations(allocationsRes.data);
      } catch (err) {
        console.log(err);
        alert("❌ Failed to load allocation data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const refreshRoomsAndAllocations = async () => {
    try {
      const [roomsRes, allocationsRes] = await Promise.all([
        api.get("/api/rooms"),
        api.get("/api/allocations"),
      ]);

      setRooms(roomsRes.data);
      setAllocations(allocationsRes.data);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to refresh data");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!userEmail || !roomId) {
      alert("⚠️ Select user & room");
      return;
    }

    try {
      setAssigning(true);

      await api.post("/api/allocations/assign", {
        userEmail,
        roomId: Number(roomId),
      });

      alert("✅ Room allocated successfully");
      setUserEmail("");
      setRoomId("");

      await refreshRoomsAndAllocations();
    } catch (err) {
      console.log(err);
      alert("❌ Allocation failed: " + (err.response?.data || "Error"));
    } finally {
      setAssigning(false);
    }
  };

  const handleAutoAssign = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert("⚠️ Select a user first");
      return;
    }

    try {
      setAssigning(true);

      const res = await api.post("/api/allocations/auto-assign", {
        userEmail,
      });

      alert("✅ " + res.data);
      setUserEmail("");
      setRoomId("");

      await refreshRoomsAndAllocations();
    } catch (err) {
      console.log(err);
      alert("❌ Auto-allocation failed: " + (err.response?.data || "Error"));
    } finally {
      setAssigning(false);
    }
  };

  const handleVacate = async (allocationId) => {
    try {
      setVacatingId(allocationId);

      await api.put(`/api/allocations/vacate/${allocationId}`);
      alert("✅ Room vacated");

      await refreshRoomsAndAllocations();
    } catch (err) {
      console.log(err);
      alert("❌ Vacate failed: " + (err.response?.data || "Error"));
    } finally {
      setVacatingId(null);
    }
  };

  return (
    <div className="container">
      <div className="card animate-slide-up" style={{ maxWidth: "1000px" }}>
        <button style={styles.backBtn} onClick={() => window.history.back()}>
          ⬅ Back
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🏠 Room Allocations (Admin)</h2>

        {loading && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "20px" }}>
            Loading allocation data...
          </p>
        )}

        <div style={styles.formContainer}>
          <h3 style={{ textAlign: "center", marginBottom: "20px", color: "var(--text-main)" }}>Assign Room</h3>

          <form onSubmit={handleAssign} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <select
              className="inputBox"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              disabled={assigning}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.email}>
                  {u.email}
                </option>
              ))}
            </select>

            <select
              className="inputBox"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={assigning}
            >
              <option value="">Select Room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.roomNumber} (Occupied {r.occupied}/{r.capacity})
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "15px", marginTop: "10px", flexWrap: "wrap" }}>
              <button className="btn" type="submit" disabled={assigning} style={{ flex: 1 }}>
                {assigning ? "Allocating..." : "Manual Allocate"}
              </button>
              <button 
                className="btn" 
                type="button" 
                onClick={handleAutoAssign} 
                disabled={assigning}
                style={{ flex: 1, background: "linear-gradient(135deg, #667eea, #764ba2)" }}
              >
                {assigning ? "Allocating..." : "Auto Allocate"}
              </button>
            </div>
          </form>
        </div>

        <h3 style={{ textAlign: "center", marginTop: "40px", marginBottom: "20px", color: "var(--text-main)" }}>
          Active Allocations
        </h3>

        {allocations.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No allocations found</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {allocations.map((a) => (
              <div key={a.allocationId} style={styles.allocationCard}>
                <h4 style={{ color: "var(--accent-blue)", marginBottom: "10px" }}>Room: {a.roomNumber}</h4>
                <p style={{ color: "var(--text-main)", marginBottom: "5px", fontSize: "14px" }}>User: {a.userEmail}</p>
                <p style={{ color: "var(--text-muted)", marginBottom: "10px", fontSize: "13px" }}>
                  Occupied: {a.occupied}/{a.capacity}
                </p>
                
                <div style={{ marginBottom: "15px" }}>
                  {a.active ? (
                     <span style={{ ...styles.statusBadge, background: "var(--success)" }}>Active</span>
                  ) : (
                     <span style={{ ...styles.statusBadge, background: "var(--danger)" }}>Inactive</span>
                  )}
                </div>

                <button
                  className="btn"
                  style={{ background: "var(--danger)", padding: "8px", fontSize: "13px" }}
                  onClick={() => handleVacate(a.allocationId)}
                  disabled={vacatingId === a.allocationId}
                >
                  {vacatingId === a.allocationId ? "Vacating..." : "Vacate Room"}
                </button>
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
    maxWidth: "550px",
    margin: "0 auto",
    background: "rgba(0,0,0,0.2)",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid var(--glass-border)",
  },
  allocationCard: {
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid var(--glass-border)",
    transition: "transform 0.2s",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
};
