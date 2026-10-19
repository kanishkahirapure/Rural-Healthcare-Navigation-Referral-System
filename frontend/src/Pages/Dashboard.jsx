import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  facilityService,
  appointmentService,
  referralService,
  notificationService,
} from "../services/store";
import {
  apiGetAppointmentsByPatient,
  apiGetReferralsByPatient,
  apiGetUnreadNotifications,
  apiGetNearbyFacilities,
} from "../services/api";
import Navbar from "../components/Navbar";
import "./Dashboard.css";
import {
  MdLocalHospital, MdSearch, MdLocationOn, MdEmergency,
  MdCalendarMonth, MdAssignment, MdNotifications, MdStar,
  MdArrowForward, MdAccessTime, MdPerson, MdMyLocation,
  MdCheckCircle, MdRefresh, MdWarningAmber,
  MdFavorite, MdAutoAwesome,
} from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";

/* ── helpers ──────────────────────────────────────────────────────────────── */
const isNetworkErr = (msg = "") =>
  ["cannot connect", "failed to fetch", "networkerror", "load failed"].some((k) =>
    msg.toLowerCase().includes(k)
  );

const STATUS_STYLE = {
  CONFIRMED:  { bg: "#d1fae5", color: "#065f46" },
  REQUESTED:  { bg: "#fef3c7", color: "#92400e" },
  COMPLETED:  { bg: "#dbeafe", color: "#1e40af" },
  CANCELLED:  { bg: "#fee2e2", color: "#991b1b" },
  SCHEDULED:  { bg: "#d1fae5", color: "#065f46" },
  PENDING:    { bg: "#fef3c7", color: "#92400e" },
  ACCEPTED:   { bg: "#ede9fe", color: "#5b21b6" },
  REJECTED:   { bg: "#fee2e2", color: "#991b1b" },
  IN_PROGRESS:{ bg: "#dbeafe", color: "#1e40af" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span className="db-status-pill" style={{ background: s.bg, color: s.color }}>
      {status?.replace("_", " ") || "—"}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return { month: "—", day: "—" };
  const d = new Date(dateStr);
  return {
    month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    day: d.getDate(),
    full: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  };
}

/* ── component ────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    requirement: "", location: "", specialization: "", priority: "MEDIUM",
  });

  const [data, setData] = useState({
    facilities: [], appointments: [], referrals: [], notifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ── fetch dashboard data ── */
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      /* Try backend first, fall back to mock store on network error */
      let appointments = [], referrals = [], notifications = [], facilities = [];

      try {
        [appointments, referrals, notifications] = await Promise.all([
          apiGetAppointmentsByPatient(user.id),
          apiGetReferralsByPatient(user.id),
          apiGetUnreadNotifications(user.id),
        ]);
        /* nearby — use geolocation if available */
        try {
          facilities = await apiGetNearbyFacilities({ radiusKm: 100 });
          if (!facilities?.length) throw new Error("empty");
        } catch {
          facilities = facilityService.getAll().slice(0, 4);
        }
      } catch (err) {
        if (isNetworkErr(err.message)) {
          /* backend offline → mock store */
          appointments  = appointmentService.getByPatient(String(user.id));
          referrals     = referralService.getByPatient(String(user.id));
          notifications = notificationService.getUnread(String(user.id));
          facilities    = facilityService.getAll().slice(0, 4);
        } else {
          throw err;
        }
      }

      setData({ facilities, appointments, referrals, notifications });
    } catch (e) {
      setError(e.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── search submit ── */
  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/recommendations", { state: { ...form } });
  };

  /* ── geolocation ── */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((f) => ({
        ...f,
        location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
      })),
      () => alert("Could not get location. Please enter manually.")
    );
  };

  /* ── derived ── */
  const firstName = user?.name?.split(" ")[0] || "User";
  const initials  = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";
  const unreadCount = data.notifications.length;

  const stats = {
    upcoming  : data.appointments.filter((a) => ["REQUESTED", "CONFIRMED", "SCHEDULED"].includes(a.status)).length,
    completed : data.appointments.filter((a) => a.status === "COMPLETED").length,
    referrals : data.referrals.length,
    pending   : data.referrals.filter((r) => r.status === "PENDING").length,
  };

  /* ── render ── */
  return (
    <div className="db-root">
      <Navbar />

      <main className="db-main">
        <div className="db-container">

          {/* ── Page header ───────────────────────────────────────────── */}
          <div className="db-page-header">
            <div className="db-welcome">
              <h1>Welcome back, <span>{firstName}</span> 👋</h1>
              <p>Here's your healthcare overview for today.</p>
            </div>
            <div className="db-header-right">
              {unreadCount > 0 && (
                <button className="db-notif-btn" onClick={() => navigate("/notifications")}>
                  <MdNotifications size={20} />
                  <span className="db-notif-badge">{unreadCount}</span>
                </button>
              )}
              <div className="db-avatar-card" onClick={() => navigate("/profile")}>
                <div className="db-avatar">{initials}</div>
                <div className="db-avatar-info">
                  <strong>{user?.name || "User"}</strong>
                  <small>Patient</small>
                </div>
              </div>
            </div>
          </div>

          {/* ── Error / Refresh ───────────────────────────────────────── */}
          {error && (
            <div className="db-error-bar">
              <MdWarningAmber size={18} />
              <span>{error}</span>
              <button onClick={fetchData}><MdRefresh size={16} /> Retry</button>
            </div>
          )}

          {/* ── Stats row ─────────────────────────────────────────────── */}
          {loading ? (
            <div className="db-stats-row">
              {[1,2,3,4].map((i) => <div key={i} className="db-stat-card db-skeleton" />)}
            </div>
          ) : (
            <div className="db-stats-row">
              <div className="db-stat-card" onClick={() => navigate("/appointments")}>
                <div className="db-stat-icon blue-bg"><MdCalendarMonth size={22} color="#087ea4" /></div>
                <div>
                  <span className="db-stat-num">{stats.upcoming}</span>
                  <span className="db-stat-label">Upcoming Appointments</span>
                </div>
              </div>
              <div className="db-stat-card" onClick={() => navigate("/appointments")}>
                <div className="db-stat-icon green-bg"><MdCheckCircle size={22} color="#059669" /></div>
                <div>
                  <span className="db-stat-num">{stats.completed}</span>
                  <span className="db-stat-label">Completed</span>
                </div>
              </div>
              <div className="db-stat-card" onClick={() => navigate("/referrals")}>
                <div className="db-stat-icon purple-bg"><MdAssignment size={22} color="#7c3aed" /></div>
                <div>
                  <span className="db-stat-num">{stats.referrals}</span>
                  <span className="db-stat-label">Total Referrals</span>
                </div>
              </div>
              <div className="db-stat-card" onClick={() => navigate("/referrals")}>
                <div className="db-stat-icon orange-bg"><MdRefresh size={22} color="#d97706" /></div>
                <div>
                  <span className="db-stat-num">{stats.pending}</span>
                  <span className="db-stat-label">Pending Referrals</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Quick Actions ─────────────────────────────────────────── */}
          <section className="db-section">
            <h2 className="db-section-title">Quick Actions</h2>
            <div className="db-quick-grid">

              <button className="db-qcard" onClick={() => navigate("/hospital-search")}>
                <div className="db-qicon blue-bg"><MdLocalHospital size={24} color="#087ea4" /></div>
                <span className="db-qcard-title">Find Hospitals</span>
                <span className="db-qcard-desc">Search nearby facilities</span>
              </button>

              <button className="db-qcard" onClick={() => navigate("/doctor-search")}>
                <div className="db-qicon green-bg"><FaStethoscope size={22} color="#059669" /></div>
                <span className="db-qcard-title">Find Doctors</span>
                <span className="db-qcard-desc">Browse by specialization</span>
              </button>

              <button className="db-qcard" onClick={() => navigate("/book-appointment")}>
                <div className="db-qicon orange-bg"><MdCalendarMonth size={24} color="#d97706" /></div>
                <span className="db-qcard-title">Book Appointment</span>
                <span className="db-qcard-desc">Schedule a visit</span>
              </button>

              <button className="db-qcard" onClick={() => navigate("/referrals")}>
                <div className="db-qicon purple-bg"><MdAssignment size={24} color="#7c3aed" /></div>
                <span className="db-qcard-title">My Referrals</span>
                <span className="db-qcard-desc">Track referral status</span>
              </button>

              <button className="db-qcard" onClick={() => navigate("/ai-recommendation")}>
                <div className="db-qicon teal-bg"><MdAutoAwesome size={24} color="#0891b2" /></div>
                <span className="db-qcard-title">AI Recommendation</span>
                <span className="db-qcard-desc">Get smart guidance</span>
              </button>

              <button className="db-qcard db-emergency-card" onClick={() => navigate("/emergency")}>
                <div className="db-qicon red-bg"><MdEmergency size={24} color="#dc2626" /></div>
                <span className="db-qcard-title">Emergency</span>
                <span className="db-qcard-desc">Find emergency care</span>
              </button>

              <button className="db-qcard" onClick={() => navigate("/map")}>
                <div className="db-qicon" style={{background:"#f0fdf4"}}><MdLocationOn size={24} color="#059669" /></div>
                <span className="db-qcard-title">Map & Navigate</span>
                <span className="db-qcard-desc">View facilities on map</span>
              </button>

            </div>
          </section>

          {/* ── Search ───────────────────────────────────────────────── */}
          <section className="db-search-card">
            <div className="db-search-head">
              <MdSearch size={20} color="#087ea4" />
              <div>
                <h2>Find Healthcare Near You</h2>
                <p>Search hospitals, doctors or services by requirement.</p>
              </div>
            </div>
            <form className="db-search-form" onSubmit={handleSearch}>
              <div className="db-search-fields">
                <div className="db-field">
                  <label>Healthcare Requirement</label>
                  <div className="db-input-wrap">
                    <MdFavorite size={15} color="#9ab0c0" />
                    <input
                      type="text"
                      placeholder="e.g. Cardiology, Maternity, Surgery..."
                      value={form.requirement}
                      onChange={(e) => setForm((f) => ({ ...f, requirement: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="db-field">
                  <label>Location</label>
                  <div className="db-input-wrap">
                    <MdLocationOn size={15} color="#9ab0c0" />
                    <input
                      type="text"
                      placeholder="Village, city or area..."
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    />
                    <button type="button" className="db-loc-btn" onClick={useCurrentLocation} title="Use GPS">
                      <MdMyLocation size={14} />
                    </button>
                  </div>
                </div>
                <div className="db-field">
                  <label>Specialization</label>
                  <div className="db-input-wrap">
                    <FaStethoscope size={13} color="#9ab0c0" />
                    <select value={form.specialization} onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}>
                      <option value="">Any Specialization</option>
                      {["General Medicine","Cardiology","Orthopaedics","Gynaecology",
                        "Paediatrics","Neurology","Oncology","Ophthalmology","ENT",
                        "Surgery","Nephrology","Psychiatry"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="db-field">
                  <label>Priority</label>
                  <div className="db-input-wrap">
                    <MdWarningAmber size={15} color="#9ab0c0" />
                    <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High / Emergency</option>
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" className="db-search-btn">
                <MdSearch size={17} /> Find Healthcare Facilities
              </button>
            </form>
          </section>

          {/* ── Bottom two-column ─────────────────────────────────────── */}
          <div className="db-two-col">

            {/* Recent Appointments */}
            <section className="db-card">
              <div className="db-card-header">
                <h2><MdCalendarMonth size={18} color="#087ea4" /> Upcoming Appointments</h2>
                <button className="db-view-all" onClick={() => navigate("/appointments")}>
                  View All <MdArrowForward size={13} />
                </button>
              </div>

              {loading ? (
                <div className="db-loading-rows">
                  {[1,2].map((i) => <div key={i} className="db-skeleton-row" />)}
                </div>
              ) : data.appointments.filter(a => ["REQUESTED","CONFIRMED","SCHEDULED"].includes(a.status)).length === 0 ? (
                <div className="db-empty">
                  <MdCalendarMonth size={36} color="#d1d5db" />
                  <p>No upcoming appointments</p>
                  <button onClick={() => navigate("/book-appointment")}>Book Appointment</button>
                </div>
              ) : (
                data.appointments
                  .filter(a => ["REQUESTED","CONFIRMED","SCHEDULED"].includes(a.status))
                  .slice(0, 3)
                  .map((a) => {
                    const d = formatDate(a.date || a.appointmentDate);
                    return (
                      <div key={a.id} className="db-apt-row" onClick={() => navigate(`/appointment/${a.id}`)}>
                        <div className="db-date-box">
                          <span>{d.month}</span>
                          <strong>{d.day}</strong>
                        </div>
                        <div className="db-apt-info">
                          <strong>{a.facilityName || "Healthcare Facility"}</strong>
                          <p><MdPerson size={12} /> {a.doctorName || "Doctor"}</p>
                          <p><MdAccessTime size={12} /> {a.time || (a.appointmentDate ? new Date(a.appointmentDate).toLocaleTimeString("en-IN", {hour:"2-digit",minute:"2-digit"}) : "—")}</p>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                    );
                  })
              )}
            </section>

            {/* Recent Referrals */}
            <section className="db-card">
              <div className="db-card-header">
                <h2><MdAssignment size={18} color="#7c3aed" /> My Referrals</h2>
                <button className="db-view-all" onClick={() => navigate("/referrals")}>
                  View All <MdArrowForward size={13} />
                </button>
              </div>

              {loading ? (
                <div className="db-loading-rows">
                  {[1,2].map((i) => <div key={i} className="db-skeleton-row" />)}
                </div>
              ) : data.referrals.length === 0 ? (
                <div className="db-empty">
                  <MdAssignment size={36} color="#d1d5db" />
                  <p>No referrals found</p>
                </div>
              ) : (
                data.referrals.slice(0, 3).map((r) => (
                  <div key={r.id} className="db-ref-row" onClick={() => navigate(`/referral/${r.id}`)}>
                    <div className="db-ref-id">{typeof r.id === "string" ? r.id : `REF-${String(r.id).padStart(3,"0")}`}</div>
                    <div className="db-ref-info">
                      <strong>{r.specialization || r.reason?.slice(0, 30) || "Referral"}</strong>
                      <p><MdLocalHospital size={12} /> {r.toFacilityName || "Receiving Facility"}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))
              )}
            </section>

          </div>

          {/* ── Nearby Facilities ─────────────────────────────────────── */}
          <section className="db-section">
            <div className="db-section-header">
              <h2 className="db-section-title">
                <MdLocalHospital size={20} color="#087ea4" /> Nearby Facilities
              </h2>
              <button className="db-view-all" onClick={() => navigate("/hospital-search")}>
                View All <MdArrowForward size={13} />
              </button>
            </div>

            {loading ? (
              <div className="db-fac-grid">
                {[1,2,3,4].map((i) => <div key={i} className="db-fac-card db-skeleton" style={{height:140}} />)}
              </div>
            ) : (
              <div className="db-fac-grid">
                {data.facilities.slice(0, 4).map((f) => (
                  <div key={f.id} className="db-fac-card" onClick={() => navigate(`/hospital/${f.id}`)}>
                    <div className="db-fac-top">
                      <div className="db-fac-icon-wrap">
                        <MdLocalHospital size={20} color="#087ea4" />
                      </div>
                      <div className="db-fac-badges">
                        {(f.area || f.operatingStatus) && (
                          <span className={`db-area-badge ${(f.area || "").toLowerCase() === "rural" ? "rural" : "urban"}`}>
                            {f.area || f.operatingStatus}
                          </span>
                        )}
                        {(f.emergency || f.operatingStatus === "OPEN") && (
                          <span className="db-open-badge">
                            {f.emergency ? "Emergency" : "Open"}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3>{f.name}</h3>
                    <p className="db-fac-addr">
                      <MdLocationOn size={12} />
                      {f.address
                        ? f.address.split(",").slice(-2).join(",").trim()
                        : "Address not available"}
                    </p>
                    {f.rating && (
                      <div className="db-fac-rating">
                        <MdStar size={13} color="#f59e0b" />
                        <span>{f.rating}</span>
                        {f.totalRatings && <span className="db-rating-count">({f.totalRatings})</span>}
                      </div>
                    )}
                    {f.distanceKm && (
                      <span className="db-distance">{f.distanceKm} km away</span>
                    )}
                    <button className="db-fac-btn">
                      View Details <MdArrowForward size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Notifications ─────────────────────────────────────────── */}
          {data.notifications.length > 0 && (
            <section className="db-card db-notif-section">
              <div className="db-card-header">
                <h2><MdNotifications size={18} color="#0891b2" /> Notifications
                  <span className="db-notif-count-badge">{unreadCount} new</span>
                </h2>
                <button className="db-view-all" onClick={() => navigate("/notifications")}>
                  View All <MdArrowForward size={13} />
                </button>
              </div>
              {data.notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="db-notif-row"
                  onClick={() => {
                    if (n.referralId) navigate(`/referral/${n.referralId}`);
                    else if (n.appointmentId) navigate(`/appointment/${n.appointmentId}`);
                    else navigate("/notifications");
                  }}>
                  <div className={`db-notif-dot type-${(n.type || "GENERAL").toLowerCase()}`} />
                  <div className="db-notif-body">
                    <strong>{n.title || "Notification"}</strong>
                    <p>{n.message}</p>
                  </div>
                  <small>{new Date(n.createdAt).toLocaleDateString("en-IN", {day:"2-digit",month:"short"})}</small>
                </div>
              ))}
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
