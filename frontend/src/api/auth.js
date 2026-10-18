import client from "./client";

// Create a new account. role must be PATIENT or HEALTH_WORKER.
export async function register({ name, email, password, phone, location, role }) {
  const response = await client.post("/api/users/register", { name, email, password, phone, location, role });
  return response.data; // { success, message, data }
}

// Log in. Returns { token, role, name, userId }.
export async function login({ email, password }) {
  const response = await client.post("/api/users/login", { email, password });
  return response.data.data;
}
