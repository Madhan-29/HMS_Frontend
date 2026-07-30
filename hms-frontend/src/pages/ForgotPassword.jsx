import { useState } from "react";
import { resetPassword } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email, newPassword);
      alert("✅ Password reset successfully! You can now log in.");
      nav("/");
    } catch (err) {
      alert("❌ Reset Failed: " + (err.response?.data?.message || err.message || "Email not found"));
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Reset Password</h2>
        <p style={{ color: "lightgray", marginBottom: "20px", fontSize: "14px" }}>
          Enter your email address and choose a new password.
        </p>

        <form onSubmit={handleReset}>
          <input
            className="inputBox"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="inputBox"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="linkText" style={{ marginTop: "15px" }}>
          Remembered your password? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
