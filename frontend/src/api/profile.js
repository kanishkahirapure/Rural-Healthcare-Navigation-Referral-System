import client from "./client";

// Own profile (the backend reads the email from the token).
// Returns { id, name, email, role, phone, location, age, gender }.
export async function getMyProfile() {
  const response = await client.get("/api/users/profile/me");
  return response.data.data;
}

// Update own profile. body: { name, phone, location, age, gender }. Email and role cannot be changed.
export async function updateMyProfile(body) {
  const response = await client.put("/api/users/profile/me", body);
  return response.data.data;
}

// Change own password. body: { oldPassword, newPassword (min 6) }.
export async function changePassword(body) {
  const response = await client.patch("/api/users/profile/password", body);
  return response.data;
}