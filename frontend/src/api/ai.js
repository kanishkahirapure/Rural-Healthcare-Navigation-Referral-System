import client from "./client";

// Ask the AI service for facility suggestions (public).
// body: { symptoms (required, max 1000), latitude, longitude, isEmergency }
// Returns { suggestedSpecialization, urgency, recommendations[], disclaimer }.
// This can take several seconds, so the page should show a loading state.
export async function recommend(body) {
  const response = await client.post("/api/ai/recommend", body);
  return response.data.data;
}
