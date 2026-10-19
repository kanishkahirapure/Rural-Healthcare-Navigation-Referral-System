import { useEffect, useMemo, useRef, useState } from "react";
import "./Appointment.css";
import {
  MdCalendarMonth, MdCheckCircle, MdCancel, MdLocalHospital,
  MdAdd, MdAccessTime, MdPerson, MdVisibility,
  MdDescription, MdPhone
} from "react-icons/md";
import { useAuth } from "../context/useAuth";
import { cancelAppointment, createAppointment, getAppointmentsByPatient } from "../api/appointments";
import { getFacilities } from "../api/facilities";
import { getDoctorsByFacility } from "../api/doctors";
import { getErrorMessage } from "../api/client";
import FormMessage from "../components/FormMessage";

// Backend status -> text, existing CSS class and (when needed) an inline colour.
const STATUS_UI = {
  SCHEDULED: { label: "Upcoming", className: "upcoming" },
  COMPLETED: { label: "Completed", className: "upcoming", style: { background: "#e0f4f8", color: "#087ea4" } },
  CANCELLED: { label: "Cancelled", className: "pending", style: { background: "#fee2e2", color: "#991b1b" } },
};

const EMPTY_FORM = { facilityId: "", doctorId: "", appointmentDate: "" };

// Inline styles for the booking form, so no CSS file has to change.
const labelStyle = { display: "block", margin: "14px 0 6px", fontSize: "13px", fontWeight: 600, color: "#102b4e" };
const fieldStyle = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #dbe7ee", borderRadius: "9px",
  background: "white", color: "#536472", fontSize: "13px", outline: "none", fontFamily: "inherit",
};

// Date -> "2026-11-05T10:30" (the format a datetime-local input understands, in local time).
function toInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function Appointment() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0); // change it to load the list again
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Booking form
  const [showForm, setShowForm] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [doctors, setDoctors] = useState([]);       // doctors of the chosen facility
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [minDate, setMinDate] = useState("");       // earliest time the date picker allows
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const chosenFacility = useRef(""); // lets us ignore a doctor list that arrives too late

  // Load my appointments.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getAppointmentsByPatient(userId);
        if (cancelled) return;
        setAppointments(data);
        setError("");
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  // Numbers for the four summary cards.
  const counts = useMemo(() => ({
    upcoming: appointments.filter((a) => a.status === "SCHEDULED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    centres: new Set(appointments.map((a) => a.facilityId)).size,
  }), [appointments]);

  // Upcoming first (soonest on top), then the rest (newest on top).
  const visible = useMemo(() => {
    return appointments
      .filter((a) => statusFilter === "ALL" || a.status === statusFilter)
      .sort((a, b) => {
        const aUpcoming = a.status === "SCHEDULED";
        const bUpcoming = b.status === "SCHEDULED";
        if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
        const diff = new Date(a.appointmentDate) - new Date(b.appointmentDate);
        return aUpcoming ? diff : -diff;
      });
  }, [appointments, statusFilter]);

  async function openForm() {
    setShowForm(true);
    setFormError("");
    setNotice("");
    setMinDate(toInputValue(new Date()));
    if (facilities.length === 0) {
      try {
        setFacilities(await getFacilities());
      } catch (err) {
        setFormError(getErrorMessage(err));
      }
    }
  }

  function closeForm() {
    setShowForm(false);
    setForm(EMPTY_FORM);
    setDoctors([]);
    chosenFacility.current = "";
    setFormError("");
  }

  // When the facility changes, load only that facility's doctors.
  async function handleFacilityChange(value) {
    setForm((prev) => ({ ...prev, facilityId: value, doctorId: "" }));
    setDoctors([]);
    chosenFacility.current = value;
    if (!value) return;

    setLoadingDoctors(true);
    try {
      const list = await getDoctorsByFacility(value);
      if (chosenFacility.current === value) setDoctors(list);
    } catch (err) {
      if (chosenFacility.current === value) setFormError(getErrorMessage(err));
    } finally {
      if (chosenFacility.current === value) setLoadingDoctors(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.facilityId) {
      setFormError("Please choose a healthcare facility.");
      return;
    }
    if (!form.appointmentDate) {
      setFormError("Please choose the date and time.");
      return;
    }
    if (new Date(form.appointmentDate) <= new Date()) {
      setFormError("The appointment must be in the future.");
      return;
    }

    // The backend wants "2026-11-05T10:30:00" (with seconds).
    const date = form.appointmentDate.length === 16 ? `${form.appointmentDate}:00` : form.appointmentDate;
    const body = { patientId: userId, facilityId: Number(form.facilityId), appointmentDate: date };
    if (form.doctorId) body.doctorId = Number(form.doctorId);

    setSubmitting(true);
    try {
      await createAppointment(body);
      closeForm();
      setNotice("Appointment booked successfully.");
      setReloadKey((k) => k + 1);
    } catch (err) {
      setFormError(getErrorMessage(err)); // for example "Doctor is already booked at the selected time"
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Do you really want to cancel this appointment?")) return;
    setCancellingId(id);
    setError("");
    setNotice("");
    try {
      await cancelAppointment(id);
      setNotice("Appointment cancelled.");
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="appointment-page">

      <header className="appointment-header">
        <div>
          <div className="appt-badge">
            <MdCalendarMonth size={14} />
            <span>Appointment Management</span>
          </div>
          <h1>My Appointments</h1>
          <p>View and manage your upcoming healthcare appointments.</p>
        </div>
        <button className="book-appointment-btn" onClick={showForm ? closeForm : openForm}>
          <MdAdd size={18} /> {showForm ? "Close Form" : "Book Appointment"}
        </button>
      </header>

      <FormMessage type="success">{notice}</FormMessage>
      <FormMessage type="error">{error}</FormMessage>

      {/* Booking form */}
      {showForm && (
        <section className="appointment-list-card" style={{ marginTop: "20px" }}>
          <div className="appointment-section-heading">
            <div>
              <h2>Book Appointment</h2>
              <p>Choose a facility, an optional doctor and a future date and time.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle} htmlFor="appt-facility">Healthcare facility</label>
            <select
              id="appt-facility" style={fieldStyle} value={form.facilityId}
              onChange={(e) => handleFacilityChange(e.target.value)}
            >
              <option value="">Select a facility</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id} disabled={f.operatingStatus === "CLOSED"}>
                  {f.name}
                  {f.operatingStatus === "CLOSED" ? " (Closed)" : ""}
                </option>
              ))}
            </select>

            <label style={labelStyle} htmlFor="appt-doctor">Doctor (optional)</label>
            <select
              id="appt-doctor" style={fieldStyle} value={form.doctorId}
              disabled={!form.facilityId || loadingDoctors}
              onChange={(e) => setForm((prev) => ({ ...prev, doctorId: e.target.value }))}
            >
              <option value="">
                {!form.facilityId
                  ? "Choose a facility first"
                  : loadingDoctors
                    ? "Loading doctors..."
                    : "No specific doctor"}
              </option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id} disabled={d.isAvailable === false}>
                  {d.name} - {d.specialization}
                  {d.isAvailable === false ? " (not available)" : ""}
                </option>
              ))}
            </select>

            <label style={labelStyle} htmlFor="appt-date">Date and time</label>
            <input
              id="appt-date" type="datetime-local" style={fieldStyle}
              min={minDate} value={form.appointmentDate}
              onChange={(e) => setForm((prev) => ({ ...prev, appointmentDate: e.target.value }))}
            />

            <FormMessage type="error">{formError}</FormMessage>

            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <button type="submit" className="book-appointment-btn" disabled={submitting}>
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
              <button type="button" className="appointment-view-btn" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      {/* Summary */}
      <section className="appointment-summary" style={{ marginTop: "28px" }}>

        <div className="appointment-summary-card">
          <div className="appt-icon-wrap blue-bg">
            <MdCalendarMonth size={24} color="#087ea4" />
          </div>
          <div>
            <h3>{counts.upcoming}</h3>
            <p>Upcoming</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appt-icon-wrap green-bg">
            <MdCheckCircle size={24} color="#059669" />
          </div>
          <div>
            <h3>{counts.completed}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appt-icon-wrap orange-bg">
            <MdCancel size={24} color="#d97706" />
          </div>
          <div>
            <h3>{counts.cancelled}</h3>
            <p>Cancelled</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appt-icon-wrap purple-bg">
            <MdLocalHospital size={24} color="#7c3aed" />
          </div>
          <div>
            <h3>{counts.centres}</h3>
            <p>Healthcare Centres</p>
          </div>
        </div>

      </section>

      {/* Appointment List */}
      <section className="appointment-list-card">

        <div className="appointment-section-heading">
          <div>
            <h2>Your Appointments</h2>
            <p>Your scheduled and past healthcare appointments</p>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Appointments</option>
            <option value="SCHEDULED">Upcoming</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {loading && <p style={{ color: "#6c7885" }}>Loading appointments...</p>}

        {!loading && !error && visible.length === 0 && (
          <p style={{ color: "#6c7885" }}>
            {appointments.length === 0
              ? "No appointments yet. Click \"Book Appointment\" to schedule one."
              : "No appointments with this status."}
          </p>
        )}

        {visible.map((a) => {
          const status = STATUS_UI[a.status] ?? STATUS_UI.SCHEDULED;
          const date = new Date(a.appointmentDate);
          const isOpen = expandedId === a.id;

          return (
            <div className="appointment-item" key={a.id}>
              <div className="appointment-date">
                <span>{date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</span>
                <strong>{date.getDate()}</strong>
                <small>{date.getFullYear()}</small>
              </div>

              <div className="appointment-details">
                <h3>{a.doctorName ? "Doctor Consultation" : "Facility Visit"}</h3>
                <p><MdLocalHospital size={13} /> {a.facilityName}</p>
                <p><MdPerson size={13} /> {a.doctorName ?? "No specific doctor"}</p>
                <p><MdAccessTime size={13} /> {formatTime(a.appointmentDate)}</p>

                {isOpen && (
                  <>
                    <p>Appointment ID: {a.id}</p>
                    <p>Date: {formatDate(a.appointmentDate)}</p>
                    <p>Booked on: {formatDate(a.createdAt)}</p>
                  </>
                )}

                {a.status === "SCHEDULED" && (
                  <div style={{ marginTop: "8px" }}>
                    <button
                      className="appointment-view-btn"
                      disabled={cancellingId === a.id}
                      onClick={() => handleCancel(a.id)}
                    >
                      {cancellingId === a.id ? "Cancelling..." : "Cancel Appointment"}
                    </button>
                  </div>
                )}
              </div>

              <span className={`appointment-status ${status.className}`} style={status.style}>
                {status.label}
              </span>
              <button className="appointment-view-btn" onClick={() => setExpandedId(isOpen ? null : a.id)}>
                <MdVisibility size={14} /> {isOpen ? "Hide Details" : "View Details"}
              </button>
            </div>
          );
        })}

      </section>

      {/* Guidelines */}
      <section className="appointment-info">
        <h2>Appointment Guidelines</h2>
        <div className="guideline-grid">

          <div className="guideline-card">
            <div className="guide-icon orange-bg">
              <MdAccessTime size={22} color="#d97706" />
            </div>
            <div>
              <h3>Arrive Early</h3>
              <p>Please arrive at least 15 minutes before your appointment.</p>
            </div>
          </div>

          <div className="guideline-card">
            <div className="guide-icon blue-bg">
              <MdDescription size={22} color="#087ea4" />
            </div>
            <div>
              <h3>Carry Documents</h3>
              <p>Keep your previous medical reports and identification documents.</p>
            </div>
          </div>

          <div className="guideline-card">
            <div className="guide-icon green-bg">
              <MdPhone size={22} color="#059669" />
            </div>
            <div>
              <h3>Need Help?</h3>
              <p>Contact the healthcare centre if you need to reschedule.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Appointment;