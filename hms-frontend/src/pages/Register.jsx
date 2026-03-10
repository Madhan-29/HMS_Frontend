import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser({ email, password });
      alert("✅ Registered Successfully! Now Login");
      nav("/");
    } catch (err) {
      alert("❌ Register Failed: " + (err.response?.data || "Error"));
    }
  };

  return (
  <div className="container">
    <div className="card">
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          className="inputBox"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="inputBox"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn" type="submit">
          Register
        </button>
      </form>

      <p className="linkText">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  </div>
);

}
