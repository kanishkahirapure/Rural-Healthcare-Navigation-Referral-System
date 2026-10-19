import { useEffect, useMemo, useState } from "react";
import "./Referral.css";
import {
  MdAssignment, MdHourglassTop, MdSync, MdCheckCircle,
  MdAdd, MdLocalHospital, MdCalendarMonth, MdVisibility,
  MdPlayCircle, MdRadioButtonUnchecked
} from "react-icons/md";
import { useAuth } from "../context/useAuth";
import {
  createReferral, getAllReferrals, getReferralsByPatient, updateReferralStatus
} from "../api/referrals";
import { getFacilities } from "../api/facilities";
import { getErrorMessage } from "../api/client";
import FormMessage from "../components/FormMessage";

// Backend status -> text and the CSS class that already exists in Referral.css.
const STATUS_UI = {
  PENDING: { label: "Pending", className: "pending" },
  ACCEPTED: { label: "In Progress", className: "progress" },
  COMPLETED: { label: "Completed", className: "completed" },
  REJECTED: { label: "Rejected", className: "pending", style: { background: "#fee2e2", color: "#991b1b" } },
};

// Allowed status flow (same as the backend): PENDING -> ACCEPTED or REJECTED, ACCEPTED -> COMPLETED.
const NEXT_ACTIONS = {
  PENDING: [
    { status: "ACCEPTED", label: "Accept" },
    { status: "REJECTED", label: "Reject" },
  ],
  ACCEPTED: [{ status: "COMPLETED", label: "Mark Completed" }],
};

const EMPTY_FORM = { patientId: "", fromFacilityId: "", toFacilityId: "", reason: "", isEmergency: false };

// Inline styles for the new form, so no CSS file has to change.
const labelStyle = { display: "block", margin: "14px 0 6px", fontSize: "13px", fontWeight: 600, color: "#102b4e" };
const fieldStyle = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #dbe7ee", borderRadius: "9px",
  background: "white", color: "#536472", fontSize: "13px", outline: "none", fontFamily: "inherit",
};

// "2026-10-18T19:00:00" -> "18 October 2026"
function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function Referral() {
  const { user } = useAuth();
  const role = user?.role;
  const userId = user?.userId;
  const isStaff = role === "HEALTH_WORKER" || role === "ADMIN"; // can see all referrals and change status
  const canCreate = role === "PATIENT" || role === "HEALTH_WORKER"; // backend does not allow ADMIN to create

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0); // change it to load the list again
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // New referral form
  const [showForm, setShowForm] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load the referrals: staff see all, a patient sees only their own.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = isStaff ? await getAllReferrals() : await getReferralsByPatient(userId);
        if (cancelled) return;
        setReferrals(data);
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
  }, [isStaff, userId, reloadKey]);

  // Numbers for the four summary cards.
  const counts = useMemo(() => ({
    total: referrals.length,
    pending: referrals.filter((r) => r.status === "PENDING").length,
    progress: referrals.filter((r) => r.status === "ACCEPTED").length,
    completed: referrals.filter((r) => r.status === "COMPLETED").length,
  }), [referrals]);

  const visible = referrals.filter((r) => statusFilter === "ALL" || r.status === statusFilter);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Open the form and load the facility list the first time.
  async function openForm() {
    setShowForm(true);
    setFormError("");
    setNotice("");
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
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const toFacilityId = Number(form.toFacilityId);
    if (!toFacilityId) {
      setFormError("Please choose the facility to refer to.");
      return;
    }
    if (!form.reason.trim()) {
      setFormError("Please write the reason for the referral.");
      return;
    }

    // Same rule as the backend, checked early to save a request.
    const target = facilities.find((f) => f.id === toFacilityId);
    if (target?.operatingStatus === "EMERGENCY_ONLY" && !form.isEmergency) {
      setFormError("This facility accepts emergency referrals only. Please tick the emergency box.");
      return;
    }

    // A patient refers themselves. A health worker enters the patient's ID.
    let patientId = userId;
    if (role === "HEALTH_WORKER") {
      patientId = Number(form.patientId);
      if (!Number.isInteger(patientId) || patientId <= 0) {
        setFormError("Please enter a valid patient ID.");
        return;
      }
    }

    const body = { patientId, toFacilityId, reason: form.reason.trim(), isEmergency: form.isEmergency };
    if (role === "HEALTH_WORKER" && form.fromFacilityId) {
      body.fromFacilityId = Number(form.fromFacilityId);
    }

    setSubmitting(true);
    try {
      await createReferral(body);
      closeForm();
      setNotice("Referral created successfully.");
      setReloadKey((k) => k + 1);
    } catch (err) {
      setFormError(getErrorMessage(err)); // for example "Facility is closed"
    } finally {
      setSubmitting(false);
    }
  }

  // Accept / Reject / Complete (staff only).
  async function changeStatus(id, status) {
    setUpdatingId(id);
    setError("");
    setNotice("");
    try {
      await updateReferralStatus(id, status);
      setNotice(`Referral #${id} is now "${STATUS_UI[status].label}".`);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="referral-page">

      {/* Header */}
      <header className="referral-header">
        <div>
          <div className="referral-badge">
            <MdAssignment size={14} />
            <span>Referral Tracking</span>
          </div>
          <h1>{isStaff ? "All Referrals" : "My Referrals"}</h1>
          <p>Track your healthcare referrals and their current status.</p>
        </div>
        {canCreate && (
          <button className="new-referral-btn" onClick={showForm ? closeForm : openForm}>
            <MdAdd size={18} /> {showForm ? "Close Form" : "New Referral"}
          </button>
        )}
      </header>

      <FormMessage type="success">{notice}</FormMessage>
      <FormMessage type="error">{error}</FormMessage>

      {/* New referral form */}
      {showForm && (
        <section className="referral-list-card" style={{ marginTop: "20px" }}>
          <div className="section-heading">
            <div>
              <h2>New Referral</h2>
              <p>Choose the facility and describe the reason.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {role === "HEALTH_WORKER" && (
              <>
                <label style={labelStyle} htmlFor="ref-patient">Patient ID</label>
                <input
                  id="ref-patient" type="number" min="1" style={fieldStyle}
                  value={form.patientId}
                  onChange={(e) => updateField("patientId", e.target.value)}
                  placeholder="ID of the patient"
                />

                <label style={labelStyle} htmlFor="ref-from">Referred from (optional)</label>
                <select
                  id="ref-from" style={fieldStyle} value={form.fromFacilityId}
                  onChange={(e) => updateField("fromFacilityId", e.target.value)}
                >
                  <option value="">Not specified</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </>
            )}

            <label style={labelStyle} htmlFor="ref-to">Refer to facility</label>
            <select
              id="ref-to" style={fieldStyle} value={form.toFacilityId}
              onChange={(e) => updateField("toFacilityId", e.target.value)}
            >
              <option value="">Select a facility</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id} disabled={f.operatingStatus === "CLOSED"}>
                  {f.name}
                  {f.operatingStatus === "CLOSED" ? " (Closed)" : ""}
                  {f.operatingStatus === "EMERGENCY_ONLY" ? " (Emergency only)" : ""}
                </option>
              ))}
            </select>

            <label style={labelStyle} htmlFor="ref-reason">Reason</label>
            <textarea
              id="ref-reason" rows={4} maxLength={500} style={fieldStyle}
              value={form.reason}
              onChange={(e) => updateField("reason", e.target.value)}
              placeholder="Why is this referral needed?"
            />

            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox" checked={form.isEmergency}
                onChange={(e) => updateField("isEmergency", e.target.checked)}
              />
              This is an emergency
            </label>

            <FormMessage type="error">{formError}</FormMessage>

            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <button type="submit" className="new-referral-btn" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Referral"}
              </button>
              <button type="button" className="ref-view-btn" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      {/* Summary Cards */}
      <section className="referral-summary" style={{ marginTop: "28px" }}>

        <div className="summary-card">
          <div className="sum-icon blue-bg">
            <MdAssignment size={24} color="#087ea4" />
          </div>
          <div>
            <h3>{counts.total}</h3>
            <p>Total Referrals</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="sum-icon orange-bg">
            <MdHourglassTop size={24} color="#d97706" />
          </div>
          <div>
            <h3>{counts.pending}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="sum-icon purple-bg">
            <MdSync size={24} color="#7c3aed" />
          </div>
          <div>
            <h3>{counts.progress}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="sum-icon green-bg">
            <MdCheckCircle size={24} color="#059669" />
          </div>
          <div>
            <h3>{counts.completed}</h3>
            <p>Completed</p>
          </div>
        </div>

      </section>

      {/* Referral List */}
      <section className="referral-list-card">

        <div className="section-heading">
          <div>
            <h2>Referral History</h2>
            <p>{isStaff ? "All healthcare referrals" : "Your recent healthcare referrals"}</p>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Referrals</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {loading && <p style={{ color: "#6c7885" }}>Loading referrals...</p>}

        {!loading && !error && visible.length === 0 && (
          <p style={{ color: "#6c7885" }}>
            {referrals.length === 0
              ? "No referrals yet."
              : "No referrals with this status."}
          </p>
        )}

        {visible.map((r, index) => {
          const status = STATUS_UI[r.status] ?? STATUS_UI.PENDING;
          const actions = isStaff ? NEXT_ACTIONS[r.status] ?? [] : [];
          const isOpen = expandedId === r.id;

          return (
            <div className="referral-item" key={r.id}>
              <div className="ref-num-badge">{String(index + 1).padStart(2, "0")}</div>

              <div className="referral-details">
                <h3 style={{ wordBreak: "break-word" }}>
                  {r.reason}
                  {r.isEmergency && (
                    <span
                      style={{
                        marginLeft: "8px", padding: "3px 8px", borderRadius: "10px",
                        background: "#fee2e2", color: "#991b1b", fontSize: "10px",
                        fontWeight: 700, verticalAlign: "middle",
                      }}
                    >
                      EMERGENCY
                    </span>
                  )}
                </h3>
                <p><MdLocalHospital size={13} /> {r.toFacilityName}</p>
                <p><MdCalendarMonth size={13} /> {formatDate(r.createdAt)}</p>

                {isOpen && (
                  <>
                    <p>Referral ID: {r.id}</p>
                    <p>Patient ID: {r.patientId}</p>
                    <p>Referred from facility ID: {r.fromFacilityId ?? "Not specified"}</p>
                    <p>Last updated: {formatDate(r.updatedAt)}</p>
                  </>
                )}

                {actions.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                    {actions.map((action) => (
                      <button
                        key={action.status}
                        className="ref-view-btn"
                        disabled={updatingId === r.id}
                        onClick={() => changeStatus(r.id, action.status)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className={`ref-status ${status.className}`} style={status.style}>
                {status.label}
              </span>
              <button className="ref-view-btn" onClick={() => setExpandedId(isOpen ? null : r.id)}>
                <MdVisibility size={14} /> {isOpen ? "Hide Details" : "View Details"}
              </button>
            </div>
          );
        })}

      </section>

      {/* Process */}
      <section className="referral-process">
        <h2>Referral Process</h2>
        <div className="process-steps">

          <div className="process-step active">
            <div className="step-circle active-circle">
              <MdAssignment size={18} />
            </div>
            <h3>Referral Created</h3>
            <p>Healthcare referral is submitted.</p>
          </div>

          <div className="process-line active-line"></div>

          <div className="process-step active">
            <div className="step-circle active-circle">
              <MdSync size={18} />
            </div>
            <h3>Under Review</h3>
            <p>Healthcare worker reviews the referral.</p>
          </div>

          <div className="process-line"></div>

          <div className="process-step">
            <div className="step-circle">
              <MdPlayCircle size={18} />
            </div>
            <h3>Appointment</h3>
            <p>Patient receives appointment details.</p>
          </div>

          <div className="process-line"></div>

          <div className="process-step">
            <div className="step-circle">
              <MdRadioButtonUnchecked size={18} />
            </div>
            <h3>Completed</h3>
            <p>Referral process is completed.</p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Referral;