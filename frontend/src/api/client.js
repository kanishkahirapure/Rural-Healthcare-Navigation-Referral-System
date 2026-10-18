import axios from "axios";
import { clearSession, getToken } from "./authStorage";

// Base URL of the API gateway.
// Local dev: set VITE_API_BASE_URL=http://localhost:8080 in frontend/.env
// Docker: the value is empty, so requests go to "/api/..." on the same host and nginx forwards them.
const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const client = axios.create({
  baseURL: BASE,
  timeout: 30000, // the AI call can take several seconds
  headers: { "Content-Type": "application/json" },
});

// Public auth calls. A 401 here only means "wrong email or password", not "token expired".
const AUTH_PATHS = ["/api/users/login", "/api/users/register"];

// Add "Authorization: Bearer <token>" to every request when the user is logged in.
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 = not logged in or token expired: clear the session and go to the login page.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const isAuthCall = AUTH_PATHS.some((path) => url.includes(path));

    if (status === 401 && !isAuthCall) {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

// Turn any error into a short message that is safe to show on screen.
export function getErrorMessage(error) {
  const status = error.response?.status;
  if (status === 403) return "You do not have permission to do this.";
  // Backend error shape: { success: false, message: "..." }
  const backendMessage = error.response?.data?.message;
  if (backendMessage) return backendMessage;
  if (error.code === "ECONNABORTED") return "The server took too long to answer. Please try again.";
  if (!error.response) return "Cannot reach the server. Please check your connection.";
  return "Something went wrong. Please try again.";
}

export default client;
