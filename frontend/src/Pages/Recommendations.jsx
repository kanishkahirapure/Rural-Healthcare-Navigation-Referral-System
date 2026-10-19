import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { facilityService } from "../services/store";
import { apiGetFacilities } from "../services/api";
import Navbar from "../components/Navbar";
import "./Recommendations.css";
import {
  MdLocalHospital, MdLocationOn, MdPhone, MdStar,
  MdArrowForward, MdDirections, MdSearch, MdEmergency,
  MdVerified, MdAutoAwesome, MdEdit, MdWarningAmber,
  MdSort, MdRefresh,
} from "react-icons/md";
import { FaHospital, FaClinicMedical, FaStethoscope } from "react-icons/fa";

/* ── helpers ──────────────────────────────────────────────────────────────── */
const isNetworkErr = (msg = "") =>
  ["cannot connect", "failed to fetch", "networkerror", "load failed"].some((k) =>
    msg.toLowerCase().includes(k)
  );

const TYPE_META = {
  PHC:                 { label: "PHC",              color: "#059669", bg: "#d1fae5" },
  DISTRICT_HOSPITAL:   { label: "District Hospital", color: "#087ea4", bg: "#dbeafe" },
  SPECIALIST_HOSPITAL: { label: "Specialist",        color: "#7c3aed", bg: "#ede9fe" },
  CLINIC:              { label: "Clinic",            color: "#d97706", bg: "#fef3c7" },
};

const URGENCY_META = {
  HIGH:   { label: "High Priority",   bg: "#fee2e2", color: "#991b1b" },
  MEDIUM: { label: "Medium Priority", bg: "#fef3c7", color: "#92400e" },
  LOW:    { label: "Routine",         bg: "#d1fae5", color: "#065f46" },
};

/* ── scoring logic (local) ────────────────────────────────────────────────── */
function scoreAndRank(facilities, { requirement, specialization, service, priority }) {
  const req  = (requirement    || "").toLowerCase();
  const spec = (specialization || "").toLowerCase();
  const svc  = (service        || "").toLowerCase();

  return facilities
    .map((f) => {
      let score = 0;
      const depts = (f.departments || []).map((d) => d.toLowerCase());
      const svcs  = (f.services    || []).map((s) => s.toLowerCase());

      if (req) {
        if (depts.some((d) => d.includes(req))) score += 4;
        if (svcs.some((s)  => s.includes(req)))  score += 3;
        if ((f.name || "").toLowerCase().includes(req)) score += 1;
      }
      if (spec && depts.some((d) => d.includes(spec))) score += 5;
      if (svc  && svcs.some((s)  => s.includes(svc)))  score += 4;
      if (priority === "HIGH" && f.emergency) score += 3;
      if ((f.operatingStatus || f.status || "").toUpperCase() === "OPEN") score += 1;
      score += (f.rating || 0) * 0.5;

      /* reason text */
      let reason = "General healthcare facility available in your area.";
      if (spec && depts.some((d) => d.includes(spec))) {
        reason = `Has ${specialization} department matching your requirement.`;
      } else if (req && depts.some((d) => d.includes(req))) {
        reason = `Provides ${requirement} services.`;
      } else if (f.emergency) {
        reason = "Emergency services available 24/7.";
      } else if (f.govtScheme || f.acceptsGovtScheme) {
        reason = "Accepts government healthcare schemes.";
      }

      return { ...f, score, reason };
    })
    .filter((f) => f.score > 0)
    .sort((a, b) => b.score - a.score);
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Recommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  /* search params passed from Dashboard */
  const state = location.state || {};
  const { requirement = "", location: loc = "", specialization = "", priority = "MEDIUM" } = state;

  const [results,   setResults]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [sortByDist, setSortByDist] = useState(false);

  /* ── load & score ── */
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true); setError("");
      try {
        let facilities;
        try {
          facilities = await apiGetFacilities();
        } catch (err) {
          if (isNetworkErr(err.message)) {
            facilities = facilityService.getAll();
          } else throw err;
        }
        if (!active) return;
        const scored = scoreAndRank(facilities || [], { requirement, specialization, service: "", priority });
        setResults(scored);
      } catch (e) {
        if (!active) return;
        setError(e.message || "Failed to load recommendations.");
        /* fallback to mock */
        const scored = scoreAndRank(facilityService.getAll(), { requirement, specialization, service: "", priority });
        setResults(scored);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [requirement, specialization, priority]);

  /* ── sort ── */
  const sorted = sortByDist
    ? [...results].sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
    : results;

  const openDirections = (f) => {
    if (f.latitude && f.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${f.latitude},${f.longitude}`, "_blank");
    } else if (f.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.address)}`, "_blank");
    }
  };

  const urgencyMeta = URGENCY_META[priority] || URGENCY_META.MEDIUM;

  /* ── render ── */
  return (
    <div className="rec-root">
      <Navbar />

      <main className="rec-main">
        <div className="rec-container">

          {/* ── Header ── */}
          <div className="rec-page-header">
            <div>
              <div className="rec-badge">
                <MdAutoAwesome size={13} /> Smart Recommendations
              </div>
              <h1>Healthcare Recommendations</h1>
              <p>Facilities matched to your healthcare requirement.</p>
            </div>
            <button className="rec-edit-btn" onClick={() => navigate("/dashboard")}>
              <MdEdit size={15} /> Edit Search
            </button>
          </div>

          {/* ── Search criteria chips ── */}
          <div className="rec-criteria-row">
            {requirement && (
              <span className="rec-chip blue-chip">
                <MdSearch size={13} /> {requirement}
              </span>
            )}
            {loc && (
              <span className="rec-chip teal-chip">
                <MdLocationOn size={13} /> {loc}
              </span>
            )}
            {specialization && (
              <span className="rec-chip purple-chip">
                <FaStethoscope size={11} /> {specialization}
              </span>
            )}
            <span className="rec-chip" style={{ background: urgencyMeta.bg, color: urgencyMeta.color }}>
              {urgencyMeta.label}
            </span>
            {!requirement && !loc && !specialization && (
              <span className="rec-chip gray-chip">Showing all available facilities</span>
            )}
          </div>

          {/* ── Controls row ── */}
          <div className="rec-controls">
            <span className="rec-count">
              {loading ? "Loading…" : <><strong>{sorted.length}</strong> facilities found</>}
            </span>
            <button
              className={`rec-sort-btn ${sortByDist ? "active" : ""}`}
              onClick={() => setSortByDist((v) => !v)}
              disabled={loading}
            >
              <MdSort size={16} />
              {sortByDist ? "Sorted by Distance" : "Sort by Distance"}
            </button>
            <button className="rec-back-btn" onClick={() => navigate("/facilities")}>
              <MdLocalHospital size={14} /> Browse All Facilities
            </button>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="rec-error">
              <MdWarningAmber size={16} />
              <span>{error}</span>
              <button onClick={() => window.location.reload()}><MdRefresh size={14} /> Retry</button>
            </div>
          )}

          {/* ── Results ── */}
          {loading ? (
            <div className="rec-grid">
              {[1,2,3,4,5,6].map((i) => <div key={i} className="rec-skeleton" />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="rec-empty">
              <MdLocalHospital size={52} color="#d1d5db" />
              <h3>No matching facilities found</h3>
              <p>Try a different search term or browse all facilities.</p>
              <div className="rec-empty-actions">
                <button onClick={() => navigate("/dashboard")}>Edit Search</button>
                <button className="rec-outline-btn" onClick={() => navigate("/facilities")}>
                  Browse All
                </button>
              </div>
            </div>
          ) : (
            <div className="rec-grid">
              {sorted.map((f, idx) => {
                const typeMeta = TYPE_META[f.type] || { label: f.type || "Facility", color: "#6b7280", bg: "#f3f4f6" };
                const depts = f.departments || [];
                const svcs  = f.services    || [];

                return (
                  <div key={f.id} className={`rec-card ${idx === 0 ? "rec-card-top" : ""}`}>

                    {/* rank badge */}
                    <div className="rec-rank">#{idx + 1}</div>

                    {/* header */}
                    <div className="rec-card-header">
                      <div className="rec-icon-wrap" style={{ background: typeMeta.bg }}>
                        {f.type === "SPECIALIST_HOSPITAL" ? <FaStethoscope size={22} color={typeMeta.color} />
                        : f.type === "CLINIC"             ? <FaClinicMedical size={22} color={typeMeta.color} />
                        :                                   <FaHospital size={22} color={typeMeta.color} />}
                      </div>
                      <div className="rec-card-badges">
                        <span className="rec-type-badge" style={{ background: typeMeta.bg, color: typeMeta.color }}>
                          {typeMeta.label}
                        </span>
                        {(f.area) && (
                          <span className={`rec-area-badge ${f.area?.toLowerCase() === "rural" ? "rural" : "urban"}`}>
                            {f.area}
                          </span>
                        )}
                        {(f.emergency || f.operatingStatus === "EMERGENCY_ONLY") && (
                          <span className="rec-emergency-badge">
                            <MdEmergency size={11} /> 24/7 Emergency
                          </span>
                        )}
                        {(f.govtScheme || f.acceptsGovtScheme) && (
                          <span className="rec-govt-badge">
                            <MdVerified size={11} /> Govt Scheme
                          </span>
                        )}
                      </div>
                    </div>

                    {/* name */}
                    <h3 className="rec-card-name">{f.name}</h3>

                    {/* reason */}
                    <div className="rec-reason">
                      <MdAutoAwesome size={13} color="#087ea4" />
                      <span>{f.reason}</span>
                    </div>

                    {/* address */}
                    <p className="rec-address">
                      <MdLocationOn size={13} color="#718096" />
                      {f.address || "Address not available"}
                    </p>

                    {/* distance */}
                    {f.distanceKm != null && (
                      <span className="rec-distance">
                        <MdLocationOn size={12} /> {f.distanceKm} km away
                      </span>
                    )}

                    {/* rating */}
                    {f.rating && (
                      <div className="rec-rating">
                        {[1,2,3,4,5].map((s) => (
                          <MdStar key={s} size={14} color={s <= Math.round(f.rating) ? "#f59e0b" : "#e2e8f0"} />
                        ))}
                        <span>{f.rating}</span>
                        {f.totalRatings && <span className="rec-rating-count">({f.totalRatings})</span>}
                      </div>
                    )}

                    {/* departments */}
                    {depts.length > 0 && (
                      <div className="rec-tags">
                        {depts.slice(0, 3).map((d) => (
                          <span key={d} className="rec-dept-tag">{d}</span>
                        ))}
                        {depts.length > 3 && <span className="rec-more-tag">+{depts.length - 3}</span>}
                      </div>
                    )}

                    {/* services */}
                    {svcs.length > 0 && (
                      <div className="rec-tags">
                        {svcs.slice(0, 3).map((s) => (
                          <span key={s} className="rec-svc-tag">{s}</span>
                        ))}
                        {svcs.length > 3 && <span className="rec-more-tag">+{svcs.length - 3}</span>}
                      </div>
                    )}

                    {/* action buttons */}
                    <div className="rec-card-actions">
                      <button className="rec-btn-primary" onClick={() => navigate(`/hospital/${f.id}`)}>
                        View Details <MdArrowForward size={14} />
                      </button>
                      <button className="rec-btn-icon" onClick={() => openDirections(f)} title="Get Directions">
                        <MdDirections size={18} />
                      </button>
                      {(f.phone || f.contactNumber) && (
                        <a
                          href={`tel:${f.phone || f.contactNumber}`}
                          className="rec-btn-icon"
                          title="Call Hospital"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MdPhone size={18} />
                        </a>
                      )}
                    </div>

                    <button
                      className="rec-book-btn"
                      onClick={() => navigate(`/book-appointment?facilityId=${f.id}`)}
                    >
                      Book Appointment
                    </button>

                    {user?.role === "HEALTH_WORKER" && (
                      <button
                        className="rec-referral-btn"
                        onClick={() => navigate(`/create-referral?toFacilityId=${f.id}`)}
                      >
                        Request Referral
                      </button>
                    )}

                  </div>
                );
              })}
            </div>
          )}

          {/* ── Disclaimer ── */}
          {!loading && sorted.length > 0 && (
            <div className="rec-disclaimer">
              <MdWarningAmber size={15} color="#92400e" />
              <span>
                These are navigation recommendations based on available facility data,
                not medical advice. Please consult a qualified doctor for diagnosis.
              </span>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
