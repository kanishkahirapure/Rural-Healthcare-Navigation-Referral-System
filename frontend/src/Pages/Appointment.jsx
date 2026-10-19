import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { appointmentService, facilityService, doctorService } from "../services/store";
import Navbar from "../components/Navbar";
import "./Appointment.css";
import {
  MdCalendarMonth, MdCheckCircle, MdHourglassTop, MdLocalHospital,
  MdAdd, MdAccessTime, MdPerson, MdClose, MdDirections,
  MdWarningAmber, MdStar, MdDescription, MdPhone, MdLocationOn,
  MdArrowBack,
} from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";

/* ── helpers ─────────────────────────────────────────────────────────────── */
const STATUS_STYLE = {
  CONFIRMED: { bg: "#d1fae5", color: "#065f46", label: "Confirmed" },
  REQUESTED: { bg: "#fef3c7", color: "#92400e", label: "Requested" },
  SCHEDULED: { bg: "#d1fae5", color: "#065f46", label: "Scheduled" },
  COMPLETED: { bg: "#dbeafe", color: "#1e40af", label: "Completed" },
  CANCELLED: { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: "#f3f4f6", color: "#6b7280", label: status };
  return (
    <span className="apt-status-pill" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function fmtDate(str) {
  if (!str) return { mon: "—", day: "—", year: "—", full: "—" };
  const d = new Date(str);
  return {
    mon:  d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    day:  d.getDate(),
    year: d.getFullYear(),
    full: d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
  };
}

/* ══════════════════════════════════════════════════════════════
   MY APPOINTMENTS
══════════════════════════════════════════════════════════════ */
function MyAppointments({ onBook }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [confirmCancel, setConfirmCancel] = useState(null);

  useEffect(() => {
    if (user) setAppointments(appointmentService.getByPatient(String(user.id)));
  }, [user]);

  const reload = () => {
    if (user) setAppointments(appointmentService.getByPatient(String(user.id)));
  };

  const handleCancel = (id) => {
    appointmentService.updateStatus(id, "CANCELLED");
    setConfirmCancel(null);
    reload();
  };

  const canCancel = (status) => ["REQUESTED", "CONFIRMED", "SCHEDULED"].includes(status);

  const FILTER_OPTS = ["ALL", "REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED"];

  const displayed = filter === "ALL"
    ? appointments
    : appointments.filter((a) => a.status === filter);

  const counts = {
    upcoming:  appointments.filter((a) => ["REQUESTED", "CONFIRMED", "SCHEDULED"].includes(a.status)).length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    pending:   appointments.filter((a) => a.status === "REQUESTED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  const openDirections = (a) => {
    const fac = facilityService.getById(a.facilityId);
    if (fac?.lat && fac?.lng)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`, "_blank");
    else if (fac?.address)
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fac.address)}`, "_blank");
  };

  return (
    <div className="apt-root">
      <Navbar />
      <main className="apt-main">
        <div className="apt-container">

          {/* Header */}
          <div className="apt-page-header">
            <div>
              <div className="apt-badge"><MdCalendarMonth size={13} /> Appointments</div>
              <h1>My Appointments</h1>
              <p>View and manage your healthcare appointments.</p>
            </div>
            <button className="apt-book-btn" onClick={onBook}>
              <MdAdd size={18} /> Book Appointment
            </button>
          </div>

          {/* Stats */}
          <div className="apt-stats-row">
            <div className="apt-stat blue-bg" onClick={() => setFilter("ALL")} style={{ cursor: "pointer" }}>
              <MdCalendarMonth size={22} color="#087ea4" />
              <div><span>{counts.upcoming}</span><small>Upcoming</small></div>
            </div>
            <div className="apt-stat green-bg" onClick={() => setFilter("COMPLETED")} style={{ cursor: "pointer" }}>
              <MdCheckCircle size={22} color="#059669" />
              <div><span>{counts.completed}</span><small>Completed</small></div>
            </div>
            <div className="apt-stat orange-bg" onClick={() => setFilter("REQUESTED")} style={{ cursor: "pointer" }}>
              <MdHourglassTop size={22} color="#d97706" />
              <div><span>{counts.pending}</span><small>Pending</small></div>
            </div>
            <div className="apt-stat red-bg" onClick={() => setFilter("CANCELLED")} style={{ cursor: "pointer" }}>
              <MdClose size={22} color="#dc2626" />
              <div><span>{counts.cancelled}</span><small>Cancelled</small></div>
            </div>
          </div>

          {/* List card */}
          <div className="apt-card">
            <div className="apt-card-head">
              <div>
                <h2>Appointment History</h2>
                <p>{displayed.length} appointment{displayed.length !== 1 ? "s" : ""}</p>
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="apt-filter-select">
                {FILTER_OPTS.map((f) => (
                  <option key={f} value={f}>{f === "ALL" ? "All Statuses" : f}</option>
                ))}
              </select>
            </div>

            {displayed.length === 0 ? (
              <div className="apt-empty">
                <MdCalendarMonth size={48} color="#d1d5db" />
                <h3>{filter === "ALL" ? "No appointments yet" : `No ${filter.toLowerCase()} appointments`}</h3>
                <p>Book your first appointment to get started.</p>
                <button onClick={onBook}>Book Appointment</button>
              </div>
            ) : (
              displayed.map((a) => {
                const d = fmtDate(a.date || a.appointmentDate);
                return (
                  <div key={a.id} className="apt-item">
                    <div className="apt-date-box">
                      <span>{d.mon}</span>
                      <strong>{d.day}</strong>
                      <small>{d.year}</small>
                    </div>
                    <div className="apt-item-info">
                      <h3>{a.reason || "Healthcare Appointment"}</h3>
                      <p><MdLocalHospital size={13} /> {a.facilityName || "Healthcare Facility"}</p>
                      <p><MdPerson size={13} /> {a.doctorName || "Doctor to be assigned"}</p>
                      <p><MdAccessTime size={13} /> {a.time || "—"}</p>
                    </div>
                    <StatusBadge status={a.status} />
                    <div className="apt-item-actions">
                      <button className="apt-icon-btn" onClick={() => openDirections(a)} title="Get Directions">
                        <MdDirections size={16} />
                      </button>
                      {canCancel(a.status) && (
                        <button className="apt-cancel-btn" onClick={() => setConfirmCancel(a.id)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Guidelines */}
          <div className="apt-guidelines">
            <div className="apt-guide-item">
              <div className="apt-guide-icon orange-bg"><MdAccessTime size={20} color="#d97706" /></div>
              <div><strong>Arrive 15 mins early</strong><p>Reach the facility before your scheduled time.</p></div>
            </div>
            <div className="apt-guide-item">
              <div className="apt-guide-icon blue-bg"><MdDescription size={20} color="#087ea4" /></div>
              <div><strong>Carry Documents</strong><p>Bring medical reports and ID proof.</p></div>
            </div>
            <div className="apt-guide-item">
              <div className="apt-guide-icon green-bg"><MdPhone size={20} color="#059669" /></div>
              <div><strong>Need Help?</strong><p>Contact the facility to reschedule.</p></div>
            </div>
          </div>

        </div>
      </main>

      {/* Confirm Cancel Modal */}
      {confirmCancel && (
        <div className="apt-modal-overlay">
          <div className="apt-modal">
            <MdWarningAmber size={36} color="#d97706" />
            <h3>Cancel Appointment?</h3>
            <p>This action cannot be undone. Are you sure you want to cancel this appointment?</p>
            <div className="apt-modal-actions">
              <button className="apt-confirm-cancel-btn" onClick={() => handleCancel(confirmCancel)}>
                Yes, Cancel
              </button>
              <button className="apt-keep-btn" onClick={() => setConfirmCancel(null)}>
                Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BOOK APPOINTMENT
══════════════════════════════════════════════════════════════ */
function BookAppointment({ onBack }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params    = new URLSearchParams(location.search);
  const initFacId = params.get("facilityId") || "";
  const initDocId = params.get("doctorId")   || "";

  const allFacilities = facilityService.getAll().filter((f) => f.status !== "CLOSED");

  const [form, setForm] = useState({
    facilityId: initFacId,
    doctorId:   initDocId,
    date:       "",
    timeSlot:   "",
    reason:     "",
    notes:      "",
  });
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const facility = allFacilities.find((f) => f.id === form.facilityId);
  const doctors  = form.facilityId ? doctorService.getByFacility(form.facilityId) : [];
  const doctor   = doctors.find((d) => d.id === form.doctorId);

  const setF = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const validate = () => {
    const e = {};
    if (!form.facilityId)       e.facilityId = "Please select a hospital.";
    if (!form.date)              e.date       = "Please select a date.";
    else if (form.date < minDateStr) e.date   = "Date must be in the future.";
    if (!form.reason.trim())     e.reason     = "Please enter the reason for visit.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    setTimeout(() => {
      const apt = appointmentService.create({
        patientId:    String(user.id),
        patientName:  user.name,
        facilityId:   form.facilityId,
        facilityName: facility?.name || "",
        doctorId:     form.doctorId  || null,
        doctorName:   doctor?.name   || "",
        date:         form.date,
        time:         form.timeSlot  || "Time to be confirmed",
        reason:       form.reason,
        notes:        form.notes,
        appointmentDate: `${form.date}T10:00:00`,
      });
      setLoading(false);
      setConfirmed(apt);
    }, 900);
  };

  /* ── Success Screen ── */
  if (confirmed) {
    const d = fmtDate(confirmed.date);
    return (
      <div className="apt-root">
        <Navbar />
        <main className="apt-main">
          <div className="apt-container">
            <div className="apt-success-card">
              <div className="apt-success-icon"><MdCheckCircle size={56} color="#059669" /></div>
              <h2>Appointment Requested!</h2>
              <p>Your appointment has been submitted. You will receive confirmation from the facility.</p>

              <div className="apt-confirm-details">
                <div className="apt-confirm-row"><span>Appointment ID</span><strong>{confirmed.id}</strong></div>
                <div className="apt-confirm-row"><span>Hospital</span><strong>{confirmed.facilityName}</strong></div>
                <div className="apt-confirm-row"><span>Doctor</span><strong>{confirmed.doctorName || "To be assigned"}</strong></div>
                <div className="apt-confirm-row"><span>Date</span><strong>{d.full}</strong></div>
                <div className="apt-confirm-row"><span>Time</span><strong>{confirmed.time}</strong></div>
                <div className="apt-confirm-row"><span>Status</span><StatusBadge status={confirmed.status} /></div>
              </div>

              <div className="apt-success-note">
                <MdWarningAmber size={15} color="#92400e" />
                <span>Status shows "Requested" — confirmation will be sent by the facility.</span>
              </div>

              <div className="apt-success-actions">
                <button className="apt-book-btn" onClick={() => navigate("/appointments")}>
                  <MdCalendarMonth size={16} /> View My Appointments
                </button>
                <button className="apt-outline-btn" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ── Form Screen ── */
  return (
    <div className="apt-root">
      <Navbar />
      <main className="apt-main">
        <div className="apt-container">

          <div className="apt-page-header">
            <div>
              <div className="apt-badge"><MdCalendarMonth size={13} /> Book Appointment</div>
              <h1>Book Appointment</h1>
              <p>Schedule a visit at a healthcare facility.</p>
            </div>
            <button className="apt-back-btn" onClick={onBack}>
              <MdArrowBack size={16} /> My Appointments
            </button>
          </div>

          <div className="apt-book-layout">

            {/* Form */}
            <form className="apt-form-card" onSubmit={handleSubmit} noValidate>
              <h2>Appointment Details</h2>

              {/* Hospital */}
              <div className="apt-field">
                <label>Select Hospital *</label>
                <div className={`apt-input-wrap ${errors.facilityId ? "apt-err-border" : ""}`}>
                  <MdLocalHospital size={16} color="#9ab0c0" />
                  <select
                    value={form.facilityId}
                    onChange={(e) => { setF("facilityId", e.target.value); setF("doctorId", ""); setF("timeSlot", ""); }}
                  >
                    <option value="">Choose a hospital...</option>
                    {allFacilities.map((f) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.area})</option>
                    ))}
                  </select>
                </div>
                {errors.facilityId && <span className="apt-field-err">{errors.facilityId}</span>}
              </div>

              {/* Doctor */}
              <div className="apt-field">
                <label>Select Doctor <span className="apt-optional">(optional)</span></label>
                <div className="apt-input-wrap">
                  <FaStethoscope size={13} color="#9ab0c0" />
                  <select
                    value={form.doctorId}
                    onChange={(e) => { setF("doctorId", e.target.value); setF("timeSlot", ""); }}
                    disabled={!form.facilityId}
                  >
                    <option value="">Any available doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="apt-field">
                <label>Appointment Date *</label>
                <div className={`apt-input-wrap ${errors.date ? "apt-err-border" : ""}`}>
                  <MdCalendarMonth size={16} color="#9ab0c0" />
                  <input
                    type="date"
                    value={form.date}
                    min={minDateStr}
                    onChange={(e) => setF("date", e.target.value)}
                  />
                </div>
                {errors.date && <span className="apt-field-err">{errors.date}</span>}
              </div>

              {/* Time Slots */}
              {doctor?.slots?.length > 0 && (
                <div className="apt-field">
                  <label>Preferred Time Slot</label>
                  <div className="apt-slots-grid">
                    {doctor.slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`apt-slot-btn ${form.timeSlot === slot ? "apt-slot-active" : ""}`}
                        onClick={() => setF("timeSlot", slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reason */}
              <div className="apt-field">
                <label>Reason for Visit *</label>
                <div className={`apt-input-wrap apt-textarea-wrap ${errors.reason ? "apt-err-border" : ""}`}>
                  <MdDescription size={16} color="#9ab0c0" style={{ marginTop: 3, flexShrink: 0 }} />
                  <textarea
                    rows={3}
                    placeholder="Describe your health concern or reason..."
                    value={form.reason}
                    onChange={(e) => setF("reason", e.target.value)}
                  />
                </div>
                {errors.reason && <span className="apt-field-err">{errors.reason}</span>}
              </div>

              {/* Notes */}
              <div className="apt-field">
                <label>Additional Notes <span className="apt-optional">(optional)</span></label>
                <div className="apt-input-wrap apt-textarea-wrap">
                  <MdDescription size={16} color="#9ab0c0" style={{ marginTop: 3, flexShrink: 0 }} />
                  <textarea
                    rows={2}
                    placeholder="Any specific requirements or notes..."
                    value={form.notes}
                    onChange={(e) => setF("notes", e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="apt-submit-btn" disabled={loading}>
                {loading
                  ? <><span className="apt-spinner" /> Submitting…</>
                  : <><MdCalendarMonth size={16} /> Confirm Appointment</>}
              </button>

              <div className="apt-disclaimer">
                <MdWarningAmber size={13} color="#92400e" />
                <span>Your appointment will be confirmed by the facility. Status shows "Requested" until confirmed.</span>
              </div>
            </form>

            {/* Summary Panel */}
            <div className="apt-summary-panel">
              <h3>Booking Summary</h3>

              {facility ? (
                <>
                  <div className="apt-summary-item">
                    <div className="apt-sum-icon blue-bg"><MdLocalHospital size={18} color="#087ea4" /></div>
                    <div>
                      <small>Hospital</small>
                      <strong>{facility.name}</strong>
                      <span><MdLocationOn size={11} /> {facility.address?.split(",").slice(-2).join(",").trim() || "—"}</span>
                    </div>
                  </div>
                  {facility.phone && (
                    <a href={`tel:${facility.phone}`} className="apt-sum-call">
                      <MdPhone size={14} /> {facility.phone}
                    </a>
                  )}
                  {facility.hours && (
                    <div className="apt-sum-hours">
                      <MdAccessTime size={13} color="#718096" /> {facility.hours}
                    </div>
                  )}
                  {facility.emergency && (
                    <div className="apt-sum-emergency">✓ Emergency services available</div>
                  )}
                </>
              ) : (
                <div className="apt-sum-placeholder">
                  <MdLocalHospital size={36} color="#d1d5db" />
                  <p>Select a hospital to see details</p>
                </div>
              )}

              {doctor && (
                <div className="apt-summary-item" style={{ marginTop: 14 }}>
                  <div className="apt-sum-icon green-bg"><FaStethoscope size={16} color="#059669" /></div>
                  <div>
                    <small>Doctor</small>
                    <strong>{doctor.name}</strong>
                    <span>{doctor.specialization}</span>
                    {doctor.fee && <span>₹{doctor.fee} consultation fee</span>}
                  </div>
                </div>
              )}

              {form.date && (
                <div className="apt-summary-item" style={{ marginTop: 14 }}>
                  <div className="apt-sum-icon orange-bg"><MdCalendarMonth size={18} color="#d97706" /></div>
                  <div>
                    <small>Date</small>
                    <strong>{new Date(form.date).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</strong>
                    {form.timeSlot && <span>{form.timeSlot}</span>}
                  </div>
                </div>
              )}

              {facility?.rating && (
                <div className="apt-sum-rating">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <MdStar key={s} size={14} color={s <= Math.round(facility.rating) ? "#f59e0b" : "#e2e8f0"} />
                  ))}
                  <span>{facility.rating} ({facility.totalRatings} reviews)</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT — switches between list and booking based on URL
══════════════════════════════════════════════════════════════ */
export default function Appointment() {
  const location = useLocation();
  const navigate = useNavigate();

  const isBook =
    location.pathname === "/book-appointment" ||
    location.search.includes("facilityId") ||
    location.search.includes("doctorId");

  const [view, setView] = useState(isBook ? "book" : "list");

  // sync view when URL changes
  useEffect(() => {
    setView(
      location.pathname === "/book-appointment" ||
      location.search.includes("facilityId") ||
      location.search.includes("doctorId")
        ? "book"
        : "list"
    );
  }, [location]);

  return view === "book" ? (
    <BookAppointment
      onBack={() => { navigate("/appointments"); setView("list"); }}
    />
  ) : (
    <MyAppointments
      onBook={() => { navigate("/book-appointment"); setView("book"); }}
    />
  );
}
