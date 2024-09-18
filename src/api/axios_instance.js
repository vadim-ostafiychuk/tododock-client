import axios from "axios";
import { useAuthStore } from "../store/authStore";

// const token = useAuthStore.getState().token;

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    // ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(async (config) => {
  const token = await useAuthStore.getState().token;

  config.headers = {
    ...config.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return config;
});

export default instance;
