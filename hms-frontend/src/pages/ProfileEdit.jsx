import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyProfile, updateProfile } from "../services/profileService";

export default function ProfileEdit() {
  const nav = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    getMyProfile().then((res) => setForm(res.data));
  }, []);

  if (!form) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(form);
      alert("✅ Profile updated");
      nav("/dashboard");
    } catch (err) {
      alert("❌ Update failed");
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>✏️ Edit Profile</h2>

        <form onSubmit={handleUpdate}>
          <input name="fullName" value={form.fullName} className="inputBox" onChange={handleChange} />
          <input name="registerNumber" value={form.registerNumber} className="inputBox" onChange={handleChange} />
          <input name="department" value={form.department} className="inputBox" onChange={handleChange} />
          <input name="year" value={form.year} className="inputBox" onChange={handleChange} />
          <input name="collegeName" value={form.collegeName} className="inputBox" onChange={handleChange} />
          <input name="phone" value={form.phone} className="inputBox" onChange={handleChange} />

          <button className="btn">Update</button>
        </form>

        <Link to="/dashboard" style={{ color: "#4cafef" }}>
          ⬅ Back
        </Link>
      </div>
    </div>
  );
}
