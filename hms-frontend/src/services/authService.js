import api from "./api";
import { jwtDecode } from "jwt-decode";

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  const token = res.data; 
  localStorage.setItem("token", token);

  const decoded = jwtDecode(token);
  const roles = decoded.roles || decoded.authorities || [];
  localStorage.setItem("roles", JSON.stringify(roles));

  return token; 
};

export const registerUser = async (data) => {
  return api.post("/auth/register", data);
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
};

export const isAdmin = () => {
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  return roles.includes("ROLE_ADMIN");
};
