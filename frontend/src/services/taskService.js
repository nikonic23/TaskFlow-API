import API from "../api/axios";

export const getTasks = async () => {
  return API.get("/tasks/");
};

export const createTask = async (data) => {
  return API.post("/tasks/", data);
};

export const updateTask = async (id, data) => {
  return API.put(`/tasks/${id}`, data);
};

export const deleteTask = async (id) => {
  return API.delete(`/tasks/${id}`);
};