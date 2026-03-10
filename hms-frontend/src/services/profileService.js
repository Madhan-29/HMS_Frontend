import api from "./api";

export const getMyProfile = () => {
  return api.get("/api/profile/me");
};

export const setupProfile = (data) => {
  return api.post("/api/profile/setup", data);
};

export const updateProfile = (data) => {
  return api.put("/api/profile/update", data);
};
