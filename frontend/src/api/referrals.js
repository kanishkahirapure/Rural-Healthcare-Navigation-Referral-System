import client from "./client";

// Create a referral (roles: PATIENT, HEALTH_WORKER).
// body: { patientId, fromFacilityId (optional), toFacilityId, reason, isEmergency }
export async function createReferral(body) {
  const response = await client.post("/api/referrals", body);
  return response.data.data;
}

// Referrals of one patient (use the logged-in userId).
export async function getReferralsByPatient(patientId) {
  const response = await client.get(`/api/referrals/patient/${patientId}`);
  return response.data.data;
}

// All referrals (for HEALTH_WORKER and ADMIN).
export async function getAllReferrals() {
  const response = await client.get("/api/referrals");
  return response.data.data;
}

// Change the status (roles: HEALTH_WORKER, ADMIN).
// Allowed flow: PENDING -> ACCEPTED or REJECTED, ACCEPTED -> COMPLETED.
export async function updateReferralStatus(id, status) {
  const response = await client.patch(`/api/referrals/${id}/status`, null, { params: { status } });
  return response.data.data;
}
