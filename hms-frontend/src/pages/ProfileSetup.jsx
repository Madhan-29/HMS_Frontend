import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setupProfile } from "../services/profileService";

export default function ProfileSetup() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    registerNumber: "",
    department: "",
    year: "",
    collegeName: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await setupProfile(form);
      alert("✅ Profile completed successfully");
      nav("/dashboard");
    } catch (err) {
      alert("❌ Failed to setup profile");
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>📝 Complete Your Profile</h2>
        <p style={{ color: "gray" }}>
          Please complete your profile to continue
        </p>

        <form onSubmit={handleSubmit}>
          <input name="fullName" placeholder="Full Name" className="inputBox" onChange={handleChange} required />
          <input name="registerNumber" placeholder="Register Number" className="inputBox" onChange={handleChange} required />
          <input name="department" placeholder="Department" className="inputBox" onChange={handleChange} required />
          <input name="year" placeholder="Year" className="inputBox" onChange={handleChange} required />
          <input name="collegeName" placeholder="College Name" className="inputBox" onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" className="inputBox" onChange={handleChange} required />

          <button className="btn">Save Profile</button>
        </form>
      </div>
    </div>
  );
}
