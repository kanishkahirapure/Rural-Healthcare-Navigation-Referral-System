import {
  FACILITIES,
  DOCTORS,
  DEMO_USERS,
  INITIAL_REFERRALS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
} from "./mockData";

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
const STORAGE_KEYS = {
  CURRENT_USER: "rc_current_user",
  USERS: "rc_users",
  REFERRALS: "rc_referrals",
  APPOINTMENTS: "rc_appointments",
  NOTIFICATIONS: "rc_notifications",
};

function seed(key, initial) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initial));
  }
}

function get(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function set(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// Seed initial data on first load
seed(STORAGE_KEYS.USERS, DEMO_USERS);
seed(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
seed(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
seed(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);

// ─────────────────────────────────────────
// authService
// ─────────────────────────────────────────
export const authService = {
  login(email, password) {
    const users = get(STORAGE_KEYS.USERS) || [];
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        u.status !== "INACTIVE"
    );
    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }
    const { password: _pw, ...safeUser } = user;
    set(STORAGE_KEYS.CURRENT_USER, safeUser);
    return { success: true, user: safeUser };
  },

  register({ name, email, phone, password, role, language }) {
    const users = get(STORAGE_KEYS.USERS) || [];
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "An account with this email already exists." };
    }
    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      phone,
      password,
      role: role || "PATIENT",
      language: language || "Hindi",
      location: "",
      age: null,
      gender: "",
      status: "ACTIVE",
    };
    users.push(newUser);
    set(STORAGE_KEYS.USERS, users);
    const { password: _pw, ...safeUser } = newUser;
    set(STORAGE_KEYS.CURRENT_USER, safeUser);
    return { success: true, user: safeUser };
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser() {
    return get(STORAGE_KEYS.CURRENT_USER);
  },

  isLoggedIn() {
    return !!get(STORAGE_KEYS.CURRENT_USER);
  },

  updateProfile(updates) {
    const current = get(STORAGE_KEYS.CURRENT_USER);
    if (!current) return { success: false, message: "Not logged in." };
    const updated = { ...current, ...updates };
    set(STORAGE_KEYS.CURRENT_USER, updated);
    // Also update in users list
    const users = get(STORAGE_KEYS.USERS) || [];
    const idx = users.findIndex((u) => u.id === current.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      set(STORAGE_KEYS.USERS, users);
    }
    return { success: true, user: updated };
  },

  changePassword(currentPw, newPw) {
    const current = get(STORAGE_KEYS.CURRENT_USER);
    if (!current) return { success: false, message: "Not logged in." };
    const users = get(STORAGE_KEYS.USERS) || [];
    const user = users.find((u) => u.id === current.id);
    if (!user || user.password !== currentPw) {
      return { success: false, message: "Current password is incorrect." };
    }
    user.password = newPw;
    set(STORAGE_KEYS.USERS, users);
    return { success: true };
  },

  // Used by AuthContext when backend JWT login sets user directly
  _setCurrentUser(userObj) {
    set(STORAGE_KEYS.CURRENT_USER, userObj);
  },
};

// ─────────────────────────────────────────
// facilityService
// ─────────────────────────────────────────
export const facilityService = {
  getAll() {
    return FACILITIES;
  },

  getById(id) {
    return FACILITIES.find((f) => f.id === id) || null;
  },

  search({ name = "", area = "", type = "", specialization = "", service = "", emergency = false } = {}) {
    return FACILITIES.filter((f) => {
      if (name && !f.name.toLowerCase().includes(name.toLowerCase())) return false;
      if (area && area !== "All" && f.area !== area) return false;
      if (type && type !== "All" && f.type !== type) return false;
      if (specialization && !f.departments.some((d) => d.toLowerCase().includes(specialization.toLowerCase()))) return false;
      if (service && !f.services.some((s) => s.toLowerCase().includes(service.toLowerCase()))) return false;
      if (emergency && !f.emergency) return false;
      return true;
    });
  },

  getEmergency() {
    return FACILITIES.filter((f) => f.emergency);
  },

  getRecommendations({ requirement = "", specialization = "", service = "", priority = "" } = {}) {
    const scored = FACILITIES.map((f) => {
      let score = 0;
      const req = requirement.toLowerCase();
      const spec = specialization.toLowerCase();
      const svc = service.toLowerCase();

      if (req) {
        if (f.departments.some((d) => d.toLowerCase().includes(req))) score += 3;
        if (f.services.some((s) => s.toLowerCase().includes(req))) score += 2;
        if (f.name.toLowerCase().includes(req)) score += 1;
      }
      if (spec && f.departments.some((d) => d.toLowerCase().includes(spec))) score += 4;
      if (svc && f.services.some((s) => s.toLowerCase().includes(svc))) score += 3;
      if (priority === "HIGH" && f.emergency) score += 2;
      if (f.status === "OPEN") score += 1;
      score += f.rating * 0.5;

      let reason = "General healthcare facility";
      if (spec && f.departments.some((d) => d.toLowerCase().includes(spec))) {
        reason = `Has ${specialization} department`;
      } else if (f.emergency) {
        reason = "Emergency services available";
      } else if (f.govtScheme) {
        reason = "Government scheme coverage";
      }

      return { ...f, score, reason };
    });

    return scored.sort((a, b) => b.score - a.score).filter((f) => f.score > 0).slice(0, 6);
  },
};

// ─────────────────────────────────────────
// doctorService
// ─────────────────────────────────────────
export const doctorService = {
  getAll() {
    return DOCTORS;
  },

  getById(id) {
    return DOCTORS.find((d) => d.id === id) || null;
  },

  search({ name = "", specialization = "", facilityId = "", location = "" } = {}) {
    return DOCTORS.filter((d) => {
      if (name && !d.name.toLowerCase().includes(name.toLowerCase())) return false;
      if (specialization && !d.specialization.toLowerCase().includes(specialization.toLowerCase())) return false;
      if (facilityId && d.facilityId !== facilityId) return false;
      if (location && !d.facilityName.toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    });
  },

  getByFacility(facilityId) {
    return DOCTORS.filter((d) => d.facilityId === facilityId);
  },
};

// ─────────────────────────────────────────
// referralService
// ─────────────────────────────────────────
export const referralService = {
  getAll() {
    return get(STORAGE_KEYS.REFERRALS) || [];
  },

  getByPatient(patientId) {
    return this.getAll().filter((r) => r.patientId === patientId);
  },

  getById(id) {
    return this.getAll().find((r) => r.id === id) || null;
  },

  create(data) {
    const all = this.getAll();
    const num = String(all.length + 1).padStart(3, "0");
    const newRef = {
      id: `REF-${num}`,
      ...data,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: "PENDING",
          date: new Date().toISOString(),
          note: "Referral created",
        },
      ],
    };
    all.push(newRef);
    set(STORAGE_KEYS.REFERRALS, all);
    return newRef;
  },

  updateStatus(id, status, note = "") {
    const all = this.getAll();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    all[idx].status = status;
    all[idx].statusHistory.push({
      status,
      date: new Date().toISOString(),
      note: note || `Status updated to ${status}`,
    });
    set(STORAGE_KEYS.REFERRALS, all);
    return all[idx];
  },
};

// ─────────────────────────────────────────
// appointmentService
// ─────────────────────────────────────────
export const appointmentService = {
  getAll() {
    return get(STORAGE_KEYS.APPOINTMENTS) || [];
  },

  getByPatient(patientId) {
    return this.getAll().filter((a) => a.patientId === patientId);
  },

  getById(id) {
    return this.getAll().find((a) => a.id === id) || null;
  },

  create(data) {
    const all = this.getAll();
    const num = String(all.length + 1).padStart(3, "0");
    const newApt = {
      id: `APT-${num}`,
      ...data,
      status: "REQUESTED",
      createdAt: new Date().toISOString(),
    };
    all.push(newApt);
    set(STORAGE_KEYS.APPOINTMENTS, all);
    return newApt;
  },

  updateStatus(id, status) {
    const all = this.getAll();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    all[idx].status = status;
    set(STORAGE_KEYS.APPOINTMENTS, all);
    return all[idx];
  },
};

// ─────────────────────────────────────────
// notificationService
// ─────────────────────────────────────────
export const notificationService = {
  getAll(userId) {
    const all = get(STORAGE_KEYS.NOTIFICATIONS) || [];
    return all.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getUnread(userId) {
    return this.getAll(userId).filter((n) => !n.read);
  },

  markRead(id) {
    const all = get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const idx = all.findIndex((n) => n.id === id);
    if (idx !== -1) {
      all[idx].read = true;
      set(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  },

  markAllRead(userId) {
    const all = get(STORAGE_KEYS.NOTIFICATIONS) || [];
    all.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    set(STORAGE_KEYS.NOTIFICATIONS, all);
  },

  add(data) {
    const all = get(STORAGE_KEYS.NOTIFICATIONS) || [];
    const newNotif = {
      id: `n${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...data,
    };
    all.push(newNotif);
    set(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  },
};

// ─────────────────────────────────────────
// adminService
// ─────────────────────────────────────────
export const adminService = {
  getStats() {
    const users = get(STORAGE_KEYS.USERS) || [];
    const referrals = referralService.getAll();
    const appointments = appointmentService.getAll();

    return {
      totalUsers: users.length,
      totalPatients: users.filter((u) => u.role === "PATIENT").length,
      totalWorkers: users.filter((u) => u.role === "HEALTH_WORKER").length,
      totalAdmins: users.filter((u) => u.role === "ADMIN").length,
      totalDoctors: DOCTORS.length,
      totalFacilities: FACILITIES.length,
      ruralFacilities: FACILITIES.filter((f) => f.area === "Rural").length,
      urbanFacilities: FACILITIES.filter((f) => f.area === "Urban").length,
      totalReferrals: referrals.length,
      pendingReferrals: referrals.filter((r) => r.status === "PENDING").length,
      acceptedReferrals: referrals.filter((r) => r.status === "ACCEPTED").length,
      completedReferrals: referrals.filter((r) => r.status === "COMPLETED").length,
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter((a) => a.status === "CONFIRMED").length,
      requestedAppointments: appointments.filter((a) => a.status === "REQUESTED").length,
    };
  },

  getUsers() {
    const users = get(STORAGE_KEYS.USERS) || [];
    return users.map(({ password: _pw, ...u }) => u);
  },

  updateUserStatus(id, status) {
    const users = get(STORAGE_KEYS.USERS) || [];
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      users[idx].status = status;
      set(STORAGE_KEYS.USERS, users);
    }
  },

  addFacility(data) {
    // Facilities are mock-only — store additions in localStorage
    const extra = get("rc_extra_facilities") || [];
    const newF = { id: `fe${Date.now()}`, ...data };
    extra.push(newF);
    set("rc_extra_facilities", extra);
    return newF;
  },

  addDoctor(data) {
    const extra = get("rc_extra_doctors") || [];
    const newD = { id: `de${Date.now()}`, status: "ACTIVE", ...data };
    extra.push(newD);
    set("rc_extra_doctors", extra);
    return newD;
  },
};
