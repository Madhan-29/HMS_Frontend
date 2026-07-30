import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [adding, setAdding] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = () => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles.includes("ROLE_ADMIN");
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/rooms");
      setRooms(res.data);
    } catch (error) {
      console.log(error);
      alert("❌ Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) =>
      r.roomNumber.toLowerCase().includes(search.toLowerCase())
    );
  }, [rooms, search]);

  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!roomNumber || !capacity) {
      alert("⚠️ Enter room number and capacity");
      return;
    }

    try {
      setAdding(true);

      await api.post("/api/rooms", {
        roomNumber,
        capacity: Number(capacity),
      });

      alert("✅ Room added successfully");
      setRoomNumber("");
      setCapacity("");

      fetchRooms();
    } catch (error) {
      console.log(error);
      alert("❌ Failed to add room: " + (error.response?.data || "Error"));
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateCapacity = async (roomId) => {
    const newCap = prompt("Enter new capacity:");
    if (!newCap) return;

    if (Number(newCap) <= 0) {
      alert("⚠️ Capacity must be greater than 0");
      return;
    }

    try {
      setUpdatingId(roomId);

      await api.put(`/api/rooms/${roomId}?capacity=${Number(newCap)}`);
      alert("✅ Capacity updated");

      fetchRooms();
    } catch (error) {
      console.log(error);
      alert("❌ Update failed: " + (error.response?.data || "Error"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const ok = window.confirm("Are you sure you want to delete this room?");
    if (!ok) return;

    try {
      setDeletingId(roomId);

      await api.delete(`/api/rooms/${roomId}`);
      alert("✅ Room deleted");

      fetchRooms();
    } catch (error) {
      console.log(error);
      alert("❌ Delete failed: " + (error.response?.data || "Error"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container">
      <div className="card animate-slide-up" style={{ maxWidth: "1000px" }}>
        <button style={styles.backBtn} onClick={() => window.history.back()}>
          ⬅ Back
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🏠 Hostel Rooms</h2>

        <div style={{ maxWidth: "500px", margin: "0 auto", marginBottom: "30px" }}>
          <input
            className="inputBox"
            type="text"
            placeholder="🔍 Search by Room Number (ex: A101)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isAdmin() && (
          <div style={styles.adminFormContainer}>
            <h3 style={{ textAlign: "center", marginBottom: "15px" }}>➕ Add New Room (Admin)</h3>

            <form onSubmit={handleAddRoom} style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <input
                className="inputBox"
                type="text"
                placeholder="Room Number (ex: A101)"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                disabled={adding}
              />

              <input
                className="inputBox"
                type="number"
                placeholder="Capacity (ex: 4)"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                disabled={adding}
              />

              <button className="btn" type="submit" disabled={adding}>
                {adding ? "Adding..." : "Add Room"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Loading rooms...</p>
        ) : filteredRooms.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No rooms found</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {filteredRooms.map((room) => (
              <div key={room.id} style={styles.roomCard}>
                <h3 style={{ marginBottom: "15px", color: "var(--accent-blue)" }}>Room: {room.roomNumber}</h3>

                <p style={{ color: "var(--text-main)", margin: "5px 0" }}>👥 Capacity: {room.capacity}</p>
                <p style={{ color: "var(--text-main)", margin: "5px 0" }}>👤 Occupied: {room.occupied}</p>

                <div style={{ marginTop: "10px", marginBottom: "15px" }}>
                  {room.available ? (
                    <span style={{ ...styles.statusBadge, background: "var(--success)" }}>
                      Available
                    </span>
                  ) : (
                    <span style={{ ...styles.statusBadge, background: "var(--danger)" }}>
                      Full
                    </span>
                  )}
                </div>

                {isAdmin() && (
                  <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                    <button
                      className="btn"
                      style={{ padding: "8px", fontSize: "13px" }}
                      onClick={() => handleUpdateCapacity(room.id)}
                      disabled={updatingId === room.id}
                    >
                      {updatingId === room.id ? "Updating..." : "Update Cap"}
                    </button>

                    <button
                      className="btn"
                      style={{ background: "var(--danger)", padding: "8px", fontSize: "13px", marginTop: "20px" }}
                      onClick={() => handleDeleteRoom(room.id)}
                      disabled={deletingId === room.id}
                    >
                      {deletingId === room.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
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
  adminFormContainer: {
    maxWidth: "500px",
    margin: "0 auto",
    background: "rgba(0,0,0,0.2)",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "30px",
    border: "1px solid var(--glass-border)",
  },
  roomCard: {
    background: "rgba(0,0,0,0.2)",
    borderRadius: "16px",
    padding: "20px",
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
};
