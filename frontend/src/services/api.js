/**
 * api.js  –  All real HTTP calls to the Spring Boot backend via the API Gateway.
 *
 * Base URL comes from the environment variable VITE_API_BASE_URL
 * (set in frontend/.env  →  VITE_API_BASE_URL=http://localhost:8080).
 *
 * Every function returns the `data` field from the standard ApiResponse wrapper:
 *   { success, message, data, timestamp }
 *
 * On HTTP error the function throws an Error with the backend `message` string
 * so callers can display it directly in the UI.
 *
 * JWT is read from localStorage key "rc_jwt" and attached as Bearer token.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// ─── JWT helpers ─────────────────────────────────────────────────────────────

export function saveToken(token) {
  localStorage.setItem("rc_jwt", token);
}

export function getToken() {
  return localStorage.getItem("rc_jwt") || null;
}

export function removeToken() {
  localStorage.removeItem("rc_jwt");
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request(method, path, body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body !== null) options.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${BASE}${path}`, options);
  } catch (networkErr) {
    // Backend not reachable
    throw new Error("Cannot connect to server. Is the backend running?");
  }

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Server returned non-JSON response (status ${res.status}).`);
  }

  if (!res.ok) {
    // Use backend message when available, otherwise fall back to HTTP status text
    throw new Error(json?.message || res.statusText || `HTTP ${res.status}`);
  }

  return json.data; // unwrap ApiResponse<T>
}

// ─── Auth  (user-service  →  /api/users/**) ──────────────────────────────────

/**
 * POST /api/users/login
 * Body: { email, password }
 * Returns: { token, role, name, userId }
 */
export async function apiLogin(email, password) {
  const data = await request("POST", "/api/users/login", { email, password }, false);
  // data = AuthResponse { token, role, name, userId }
  saveToken(data.token);
  return data; // { token, role, name, userId }
}

/**
 * POST /api/users/register
 * Body: { name, email, password, phone, location, role }
 * Returns: string message ("User registered successfully")
 */
export async function apiRegister({ name, email, password, phone, location = "", role }) {
  return request("POST", "/api/users/register", { name, email, password, phone, location, role }, false);
}

/**
 * GET /api/users/profile/me
 * Returns: ProfileResponse { id, name, email, phone, location, age, gender, role }
 */
export async function apiGetProfile() {
  return request("GET", "/api/users/profile/me");
}

/**
 * PUT /api/users/profile/me
 * Body: { name, phone, location, age, gender }
 */
export async function apiUpdateProfile(updates) {
  return request("PUT", "/api/users/profile/me", updates);
}

/**
 * PATCH /api/users/profile/password
 * Body: { oldPassword, newPassword }
 */
export async function apiChangePassword(oldPassword, newPassword) {
  return request("PATCH", "/api/users/profile/password", { oldPassword, newPassword });
}

/**
 * GET /api/users/admin/users   (ADMIN only)
 */
export async function apiGetAllUsers() {
  return request("GET", "/api/users/admin/users");
}

// ─── Facilities  (core-service  →  /api/facilities/**) ───────────────────────

/** GET /api/facilities */
export async function apiGetFacilities() {
  return request("GET", "/api/facilities", null, false);
}

/** GET /api/facilities/:id */
export async function apiGetFacilityById(id) {
  return request("GET", `/api/facilities/${id}`, null, false);
}

/** GET /api/facilities/type/:type */
export async function apiGetFacilitiesByType(type) {
  return request("GET", `/api/facilities/type/${type}`, null, false);
}

/**
 * GET /api/facilities/nearby?lat=&lng=&radiusKm=&type=&govtScheme=
 * Returns: NearbyFacilityResponse[] with distanceKm field
 */
export async function apiGetNearbyFacilities({ lat, lng, radiusKm = 50, type, govtScheme } = {}) {
  const params = new URLSearchParams();
  if (lat != null) params.append("lat", lat);
  if (lng != null) params.append("lng", lng);
  if (radiusKm != null) params.append("radiusKm", radiusKm);
  if (type) params.append("type", type);
  if (govtScheme != null) params.append("govtScheme", govtScheme);
  return request("GET", `/api/facilities/nearby?${params}`, null, false);
}

/** POST /api/facilities  (ADMIN) */
export async function apiCreateFacility(data) {
  return request("POST", "/api/facilities", data);
}

/** PUT /api/facilities/:id  (ADMIN) */
export async function apiUpdateFacility(id, data) {
  return request("PUT", `/api/facilities/${id}`, data);
}

/** DELETE /api/facilities/:id  (ADMIN) */
export async function apiDeleteFacility(id) {
  return request("DELETE", `/api/facilities/${id}`);
}

// ─── Doctors  (core-service  →  /api/doctors/**) ─────────────────────────────

/** GET /api/doctors */
export async function apiGetDoctors() {
  return request("GET", "/api/doctors", null, false);
}

/** GET /api/doctors/:id */
export async function apiGetDoctorById(id) {
  return request("GET", `/api/doctors/${id}`, null, false);
}

/** GET /api/doctors/facility/:facilityId */
export async function apiGetDoctorsByFacility(facilityId) {
  return request("GET", `/api/doctors/facility/${facilityId}`, null, false);
}

/** GET /api/doctors/search?specialization= */
export async function apiSearchDoctors(specialization) {
  return request("GET", `/api/doctors/search?specialization=${encodeURIComponent(specialization)}`, null, false);
}

/** POST /api/doctors  (ADMIN) */
export async function apiCreateDoctor(data) {
  return request("POST", "/api/doctors", data);
}

/** PUT /api/doctors/:id  (ADMIN) */
export async function apiUpdateDoctor(id, data) {
  return request("PUT", `/api/doctors/${id}`, data);
}

/** DELETE /api/doctors/:id  (ADMIN) */
export async function apiDeleteDoctor(id) {
  return request("DELETE", `/api/doctors/${id}`);
}

// ─── Referrals  (core-service  →  /api/referrals/**) ─────────────────────────

/**
 * POST /api/referrals
 * Body: { patientId, fromFacilityId?, toFacilityId, reason, isEmergency? }
 */
export async function apiCreateReferral({ patientId, fromFacilityId, toFacilityId, reason, isEmergency = false }) {
  return request("POST", "/api/referrals", { patientId, fromFacilityId, toFacilityId, reason, isEmergency });
}

/** GET /api/referrals */
export async function apiGetAllReferrals() {
  return request("GET", "/api/referrals");
}

/** GET /api/referrals/:id */
export async function apiGetReferralById(id) {
  return request("GET", `/api/referrals/${id}`);
}

/** GET /api/referrals/patient/:patientId */
export async function apiGetReferralsByPatient(patientId) {
  return request("GET", `/api/referrals/patient/${patientId}`);
}

/** PATCH /api/referrals/:id/status?status= */
export async function apiUpdateReferralStatus(id, status) {
  return request("PATCH", `/api/referrals/${id}/status?status=${status}`);
}

// ─── Appointments  (core-service  →  /api/appointments/**) ──────────────────

/**
 * POST /api/appointments
 * Body: { patientId, facilityId, doctorId?, appointmentDate (ISO LocalDateTime string) }
 * Note: appointmentDate must be in the future  e.g. "2026-11-01T10:00:00"
 */
export async function apiCreateAppointment({ patientId, facilityId, doctorId, appointmentDate }) {
  const body = { patientId, facilityId, appointmentDate };
  if (doctorId != null) body.doctorId = doctorId;
  return request("POST", "/api/appointments", body);
}

/** GET /api/appointments/patient/:patientId */
export async function apiGetAppointmentsByPatient(patientId) {
  return request("GET", `/api/appointments/patient/${patientId}`);
}

/** GET /api/appointments/facility/:facilityId */
export async function apiGetAppointmentsByFacility(facilityId) {
  return request("GET", `/api/appointments/facility/${facilityId}`);
}

/** PATCH /api/appointments/:id/cancel */
export async function apiCancelAppointment(id) {
  return request("PATCH", `/api/appointments/${id}/cancel`);
}

/** PATCH /api/appointments/:id/status?status= */
export async function apiUpdateAppointmentStatus(id, status) {
  return request("PATCH", `/api/appointments/${id}/status?status=${status}`);
}

// ─── Notifications  (core-service  →  /api/notifications/**) ────────────────

/** GET /api/notifications/user/:userId */
export async function apiGetNotifications(userId) {
  return request("GET", `/api/notifications/user/${userId}`);
}

/** GET /api/notifications/user/:userId/unread */
export async function apiGetUnreadNotifications(userId) {
  return request("GET", `/api/notifications/user/${userId}/unread`);
}

/** PATCH /api/notifications/:id/read */
export async function apiMarkNotificationRead(id) {
  return request("PATCH", `/api/notifications/${id}/read`);
}

/** PATCH /api/notifications/user/:userId/read-all */
export async function apiMarkAllNotificationsRead(userId) {
  return request("PATCH", `/api/notifications/user/${userId}/read-all`);
}

// ─── Admin Stats  (core-service  →  /api/admin/**) ───────────────────────────

/** GET /api/admin/stats  (ADMIN only) */
export async function apiGetAdminStats() {
  return request("GET", "/api/admin/stats");
}

// ─── AI  (ai-service  →  /api/ai/**) ─────────────────────────────────────────

/**
 * POST /api/ai/recommend
 * Body: { symptoms, latitude?, longitude?, isEmergency? }
 * Returns backend AI recommendation (Gemini + keyword fallback)
 */
export async function apiAiRecommend({ symptoms, latitude, longitude, isEmergency = false }) {
  const body = { symptoms, isEmergency };
  if (latitude != null) body.latitude = latitude;
  if (longitude != null) body.longitude = longitude;
  return request("POST", "/api/ai/recommend", body, false);
}
