import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMyProfile } from "../services/profileService";

export default function ProfileGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setCompleted(res.data?.profileCompleted);
      })
      .catch(() => setCompleted(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!completed) return <Navigate to="/profile-setup" replace />;

  return children;
}
