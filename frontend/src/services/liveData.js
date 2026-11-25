/**
 * liveData.js - connects the Appointment, Notifications and Referral pages to the real backend.
 *
 * Each function tries the backend first (through api.js) and converts the reply into the
 * shape the pages already use. If the backend cannot be reached (or the user is a demo
 * user without a real numeric id), it falls back to the local demo store, exactly like
 * the other pages do.
 */
import {
  apiGetFacilities,
  apiGetFacilityById,
  apiGetDoctorsByFacility,
  apiCreateAppointment,
  apiGetAppointmentsByPatient,
  apiCancelAppointment,
  apiGetNotifications,
  apiGetUnreadNotifications,
  apiMarkNotificationRead,
  apiMarkAllNotificationsRead,
  apiGetAllReferrals,
  getToken,
} from "./api";
import {
  appointmentService,
  facilityService,
  doctorService,
  notificationService,
  referralService,
} from "./store";

// ─── helpers ─────────────────────────────────────────────────────────────────

const isNetworkErr = (msg = "") =>
  ["cannot connect", "failed to fetch", "networkerror", "load failed"].some((k) =>
    msg.toLowerCase().includes(k)
  );

// Real backend ids are numbers. Demo (offline) users and records have ids like "u1" or "APT-001".
const isNumericId = (id) => /^\d+$/.test(String(id));

// Use the backend only when the user logged in through it (a token exists and the id is numeric).
const canUseBackend = (userId) => Boolean(getToken()) && isNumericId(userId);

async function tryLive(live, fallback) {
  try {
    return await live();
  } catch (err) {
    if (isNetworkErr(err.message)) return fallback();
    throw err;
  }
}

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// "10:30 AM" -> "10:30:00". Returns "10:00:00" when the text cannot be read.
function slotToTime(slot) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec((slot || "").trim());
  if (!m) return "10:00:00";
  let h = parseInt(m[1], 10);
  const mer = (m[3] || "").toUpperCase();
  if (mer === "PM" && h < 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}:00`;
}

// ─── facilities and doctors (used by the booking form) ───────────────────────

export async function getFacilities() {
  return tryLive(
    async () => (await apiGetFacilities()) || [],
    () => facilityService.getAll()
  );
}

export async function getFacility(id) {
  if (!isNumericId(id)) return facilityService.getById(id);
  return tryLive(
    () => apiGetFacilityById(id),
    () => facilityService.getById(id)
  );
}

export async function getDoctorsByFacility(facilityId) {
  if (!isNumericId(facilityId)) return doctorService.getByFacility(facilityId);
  return tryLive(
    async () => (await apiGetDoctorsByFacility(facilityId)) || [],
    () => doctorService.getByFacility(facilityId)
  );
}

// ─── appointments ────────────────────────────────────────────────────────────

function toUiAppointment(a) {
  return {
    ...a,
    patientId: String(a.patientId),
    date: a.appointmentDate ? a.appointmentDate.slice(0, 10) : "",
    time: formatTime(a.appointmentDate),
  };
}

export async function getAppointments(userId) {
  if (!canUseBackend(userId)) return appointmentService.getByPatient(String(userId));
  return tryLive(
    async () => ((await apiGetAppointmentsByPatient(userId)) || []).map(toUiAppointment),
    () => appointmentService.getByPatient(String(userId))
  );
}

export async function createAppointment(form) {
  // form: { patientId, patientName, facilityId, facilityName, doctorId, doctorName, date, time, reason, notes }
  const demoCreate = () =>
    appointmentService.create({
      ...form,
      patientId: String(form.patientId),
      doctorId: form.doctorId || null,
      time: form.time || "Time to be confirmed",
      appointmentDate: `${form.date}T10:00:00`,
    });

  if (!canUseBackend(form.patientId) || !isNumericId(form.facilityId)) return demoCreate();

  return tryLive(
    async () => {
      const saved = await apiCreateAppointment({
        patientId: Number(form.patientId),
        facilityId: Number(form.facilityId),
        doctorId: form.doctorId && isNumericId(form.doctorId) ? Number(form.doctorId) : undefined,
        appointmentDate: `${form.date}T${slotToTime(form.time)}`,
      });
      // The backend does not store the reason or notes, so keep them for the confirmation screen.
      return { ...toUiAppointment(saved), reason: form.reason, notes: form.notes };
    },
    demoCreate
  );
}

export async function cancelAppointment(id) {
  if (!isNumericId(id)) return appointmentService.updateStatus(id, "CANCELLED");
  return tryLive(
    () => apiCancelAppointment(id),
    () => appointmentService.updateStatus(id, "CANCELLED")
  );
}

// ─── notifications ───────────────────────────────────────────────────────────

const NOTIFICATION_TITLES = {
  REFERRAL: "Referral update",
  APPOINTMENT: "Appointment update",
  EMERGENCY: "Emergency alert",
  GENERAL: "Notification",
};

function toUiNotification(n) {
  return { ...n, read: Boolean(n.isRead), title: NOTIFICATION_TITLES[n.type] || "Notification" };
}

export async function getNotifications(userId) {
  if (!canUseBackend(userId)) return notificationService.getAll(String(userId));
  return tryLive(
    async () => ((await apiGetNotifications(userId)) || []).map(toUiNotification),
    () => notificationService.getAll(String(userId))
  );
}

export async function getUnreadCount(userId) {
  if (!canUseBackend(userId)) return notificationService.getUnread(String(userId)).length;
  return tryLive(
    async () => ((await apiGetUnreadNotifications(userId)) || []).length,
    () => notificationService.getUnread(String(userId)).length
  );
}

export async function markNotificationRead(id) {
  if (!isNumericId(id)) return notificationService.markRead(id);
  return tryLive(
    () => apiMarkNotificationRead(id),
    () => notificationService.markRead(id)
  );
}

export async function markAllNotificationsRead(userId) {
  if (!canUseBackend(userId)) return notificationService.markAllRead(String(userId));
  return tryLive(
    () => apiMarkAllNotificationsRead(userId),
    () => notificationService.markAllRead(String(userId))
  );
}

// ─── referrals (admin / health worker monitoring list) ───────────────────────

function toUiReferral(r) {
  return {
    ...r,
    patientName: `Patient #${r.patientId}`,
    fromFacilityName: r.fromFacilityId ? `Facility #${r.fromFacilityId}` : "—",
    priority: r.isEmergency ? "HIGH" : "MEDIUM",
  };
}

export async function getAllReferrals() {
  if (!getToken()) return referralService.getAll();
  return tryLive(
    async () => ((await apiGetAllReferrals()) || []).map(toUiReferral),
    () => referralService.getAll()
  );
}
