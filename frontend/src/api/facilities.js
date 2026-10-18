import client from "./client";

// All facilities.
export async function getFacilities() {
  const response = await client.get("/api/facilities");
  return response.data.data;
}

// One facility by id.
export async function getFacilityById(id) {
  const response = await client.get(`/api/facilities/${id}`);
  return response.data.data;
}

// type = PHC | DISTRICT_HOSPITAL | SPECIALIST_HOSPITAL | CLINIC
export async function getFacilitiesByType(type) {
  const response = await client.get(`/api/facilities/type/${type}`);
  return response.data.data;
}

// Facilities that accept the government scheme.
export async function getGovtSchemeFacilities() {
  const response = await client.get("/api/facilities/govt-scheme");
  return response.data.data;
}

// Facilities near a point. All params are optional: { lat, lng, radiusKm, type, govtScheme }.
// Each result also has distanceKm.
export async function getNearbyFacilities(params = {}) {
  const response = await client.get("/api/facilities/nearby", { params });
  return response.data.data;
}
