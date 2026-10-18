import client from "./client";

// Book an appointment.
// body: { patientId, facilityId, doctorId (optional), appointmentDate }
// appointmentDate must be in the future, like "2026-11-05T10:30:00".
export async function createAppointment(body) {
  const response = await client.post("/api/appointments", body);
  return response.data.data;
}

// Appointments of one patient (use the logged-in userId).
export async function getAppointmentsByPatient(patientId) {
  const response = await client.get(`/api/appointments/patient/${patientId}`);
  return response.data.data;
}

// Cancel an appointment.
export async function cancelAppointment(id) {
  const response = await client.patch(`/api/appointments/${id}/cancel`);
  return response.data.data;
}
