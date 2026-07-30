import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { noticeService } from "../services/noticeService";

export default function NoticeBoard() {
  const nav = useNavigate();
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getRoles = () => JSON.parse(localStorage.getItem("roles") || "[]");
  const isAdmin = getRoles().includes("ROLE_ADMIN");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await noticeService.getAllNotices();
      setNotices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !content) return setError("Please fill all fields");
    setLoading(true);
    setError("");

    try {
      await noticeService.createNotice({ title, content });
      setTitle("");
      setContent("");
      fetchNotices();
    } catch (err) {
      console.error(err);
      setError("Failed to create notice: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await noticeService.deleteNotice(id);
      fetchNotices();
    } catch (err) {
      console.error(err);
      alert("Failed to delete notice");
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container">
      <div className="card animate-slide-up" style={{ maxWidth: "800px" }}>
        <button style={styles.backBtn} onClick={() => nav("/dashboard")}>
          ⬅ Back
        </button>

        <h2>📌 Notice Board</h2>

        {/* CREATE NOTICE FORM (ADMIN ONLY) */}
        {isAdmin && (
          <form style={styles.form} onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Notice Title"
              className="inputBox"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Notice Content..."
              className="inputBox"
              style={{ minHeight: "100px", resize: "vertical" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" className="btn" style={{ background: "linear-gradient(135deg, var(--warning), #f97316)" }} disabled={loading}>
              {loading ? "Posting..." : "Post Notice"}
            </button>
          </form>
        )}

        {isAdmin && <hr style={styles.hr} />}

        {/* NOTICES LIST */}
        <h3 style={{ color: "var(--text-main)", marginBottom: "15px", marginTop: "10px" }}>Latest Announcements</h3>
        
        <div style={styles.list}>
          {notices.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No notices posted yet.</p>
          ) : (
            notices.map((n) => (
              <div key={n.id} style={styles.noticeItem}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: "var(--accent-blue)", margin: 0, fontSize: "18px" }}>
                    {n.title}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "5px 0" }}>
                    Posted By: {n.authorEmail} | {formatDateTime(n.createdAt)}
                  </p>
                  <p style={{ color: "var(--text-main)", margin: "10px 0 0 0", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                    {n.content}
                  </p>
                </div>
                
                {isAdmin && (
                  <button style={styles.deleteBtn} onClick={() => handleDelete(n.id)}>
                    🗑
                  </button>
                )}
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
  },
  error: { color: "var(--danger)", fontSize: "14px", margin: 0 },
  hr: {
    border: "0",
    height: "1px",
    background: "var(--glass-border)",
    marginBottom: "20px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  noticeItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "12px",
    borderLeft: "4px solid var(--warning)",
    border: "1px solid var(--glass-border)",
    transition: "transform 0.2s",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "var(--danger)",
    fontSize: "20px",
    cursor: "pointer",
    padding: "5px",
    transition: "transform 0.2s",
  },
};
