import client from "./client";

// Ratings of a facility (public). Returns { averageStars, totalRatings, ratings[] }.
export async function getFacilityRatings(facilityId) {
  const response = await client.get(`/api/ratings/facility/${facilityId}`);
  return response.data.data;
}

// Rate a facility (login required). body: { facilityId, patientId, stars (1-5), comment (max 500) }
export async function submitRating(body) {
  const response = await client.post("/api/ratings", body);
  return response.data.data;
}
