import api from "../utils/api";

export const getProfile = async () => {
  const res = await api.get("/auth/me"); // BE cần có route này
  return res.data;
};
