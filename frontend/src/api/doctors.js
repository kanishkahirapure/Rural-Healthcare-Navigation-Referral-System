import client from "./client";

// All doctors.
export async function getDoctors() {
  const response = await client.get("/api/doctors");
  return response.data.data;
}

// One doctor by id.
export async function getDoctorById(id) {
  const response = await client.get(`/api/doctors/${id}`);
  return response.data.data;
}

// Doctors working in one facility.
export async function getDoctorsByFacility(facilityId) {
  const response = await client.get(`/api/doctors/facility/${facilityId}`);
  return response.data.data;
}

// Search doctors by specialization, for example "Cardiology".
export async function searchDoctors(specialization) {
  const response = await client.get("/api/doctors/search", { params: { specialization } });
  return response.data.data;
}
