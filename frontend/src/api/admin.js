import client from "./client";

// Dashboard numbers (ADMIN only).
export async function getAdminStats() {
  const response = await client.get("/api/admin/stats");
  return response.data.data;
}
