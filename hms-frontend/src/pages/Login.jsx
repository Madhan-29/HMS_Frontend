import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await loginUser({ email, password }); 
      alert("✅ Login Successful!");
      nav("/dashboard");
    } catch (err) {
      alert("❌ Login Failed: " + (err.response?.data || "Invalid credentials"));
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            className="inputBox"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div style={{ position: "relative", marginBottom: "15px", width: "100%" }}>
            <input
              className="inputBox"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", paddingRight: "50px", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "0",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="btn" type="submit">
            Login
          </button>
        </form>

        <p className="linkText">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
        <p className="linkText" style={{ marginTop: "10px" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}
