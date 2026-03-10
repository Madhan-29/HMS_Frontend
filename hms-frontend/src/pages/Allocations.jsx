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
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>🏠 Room Allocations (Admin)</h2>

      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <Link to="/dashboard" style={{ color: "#4cafef" }}>
          ⬅ Back to Dashboard
        </Link>
      </div>

      {loading && (
        <p style={{ textAlign: "center", color: "lightgray" }}>
          Loading allocation data...
        </p>
      )}

      {}
      <div
        style={{
          maxWidth: "550px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.06)",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Assign Room</h3>

        <form onSubmit={handleAssign}>
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

          <button className="btn" type="submit" disabled={assigning}>
            {assigning ? "Allocating..." : "Allocate"}
          </button>
        </form>
      </div>

      {}
      <h3 style={{ textAlign: "center", marginTop: "30px" }}>
        Active Allocations
      </h3>

      {allocations.length === 0 ? (
        <p style={{ textAlign: "center" }}>No allocations found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          {allocations.map((a) => (
            <div
              key={a.allocationId}
              style={{
                background: "rgba(255,255,255,0.06)",
                padding: "18px",
                borderRadius: "12px",
              }}
            >
              <h4>Room: {a.roomNumber}</h4>
              <p>User: {a.userEmail}</p>
              <p>
                Occupied: {a.occupied}/{a.capacity}
              </p>
              <p>Status: {a.active ? "Active ✅" : "Inactive ❌"}</p>

              <button
                className="btn"
                style={{ background: "tomato" }}
                onClick={() => handleVacate(a.allocationId)}
                disabled={vacatingId === a.allocationId}
              >
                {vacatingId === a.allocationId ? "Vacating..." : "Vacate"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
