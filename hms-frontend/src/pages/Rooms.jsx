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
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>🏠 Hostel Rooms</h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link to="/dashboard" style={{ color: "#4cafef" }}>
          ⬅ Back to Dashboard
        </Link>
      </div>

      {}
      <div style={{ maxWidth: "500px", margin: "0 auto", marginBottom: "20px" }}>
        <input
          className="inputBox"
          type="text"
          placeholder="🔍 Search by Room Number (ex: A101)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {}
      {isAdmin() && (
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            background: "rgba(255,255,255,0.06)",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>➕ Add New Room (Admin)</h3>

          <form onSubmit={handleAddRoom}>
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

      {}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading rooms...</p>
      ) : filteredRooms.length === 0 ? (
        <p style={{ textAlign: "center" }}>No rooms found</p>
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
            <div
              key={room.id}
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "18px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>Room: {room.roomNumber}</h3>

              <p>👥 Capacity: {room.capacity}</p>
              <p>✅ Occupied: {room.occupied}</p>

              <p>
                {room.available ? (
                  <span style={{ color: "lightgreen", fontWeight: "bold" }}>
                    Available ✅
                  </span>
                ) : (
                  <span style={{ color: "tomato", fontWeight: "bold" }}>
                    Full ❌
                  </span>
                )}
              </p>

              {}
              {isAdmin() && (
                <div style={{ marginTop: "12px" }}>
                  <button
                    className="btn"
                    style={{ marginBottom: "10px" }}
                    onClick={() => handleUpdateCapacity(room.id)}
                    disabled={updatingId === room.id}
                  >
                    {updatingId === room.id ? "Updating..." : "Update Capacity"}
                  </button>

                  <button
                    className="btn"
                    style={{ background: "tomato" }}
                    onClick={() => handleDeleteRoom(room.id)}
                    disabled={deletingId === room.id}
                  >
                    {deletingId === room.id ? "Deleting..." : "Delete Room"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
