import API from "../api/axios";

export const registerUser = async (data) => {
  return API.post("/auth/register", data);
};

export const loginUser = async (data) => {
  return API.post("/auth/login", data);
};

export const getProfile = async () => {
  return API.get("/auth/profile");
};