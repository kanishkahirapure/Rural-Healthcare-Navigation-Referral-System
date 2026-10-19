import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { facilityService } from "../services/store";
import { apiGetFacilities, apiGetNearbyFacilities } from "../services/api";
import Navbar from "../components/Navbar";
import "./Facilities.css";
import {
  MdSearch, MdLocationOn, MdPhone, MdFilterAlt, MdClose,
  MdLocalHospital, MdEmergency, MdVerified, MdStar,
  MdArrowForward, MdDirections, MdRefresh, MdTune,
} from "react-icons/md";
import { FaHospital, FaClinicMedical, FaStethoscope, FaHeartbeat } from "react-icons/fa";

/* ── helpers ──────────────────────────────────────────────────────────────── */
const isNetworkErr = (msg = "") =>
  ["cannot connect", "failed to fetch", "networkerror", "load failed"].some((k) =>
    msg.toLowerCase().includes(k)
  );

const TYPE_META = {
  PHC:                  { label: "PHC",              icon: <FaClinicMedical size={14} />, color: "#059669", bg: "#d1fae5" },
  DISTRICT_HOSPITAL:    { label: "District Hospital", icon: <FaHospital size={14} />,     color: "#087ea4", bg: "#dbeafe" },
  SPECIALIST_HOSPITAL:  { label: "Specialist",        icon: <FaStethoscope size={13} />,   color: "#7c3aed", bg: "#ede9fe" },
  CLINIC:               { label: "Clinic",            icon: <FaClinicMedical size={13} />, color: "#d97706", bg: "#fef3c7" },
};

const STATUS_META = {
  OPEN:           { label: "Open",           color: "#065f46", bg: "#d1fae5" },
  CLOSED:         { label: "Closed",         color: "#991b1b", bg: "#fee2e2" },
  EMERGENCY_ONLY: { label: "Emergency Only", color: "#92400e", bg: "#fef3c7" },
};

const ICON_COLORS = ["#087ea4", "#059669", "#7c3aed", "#d97706", "#0891b2", "#dc2626"];

function FacilityIcon({ index, type }) {
  const color = ICON_COLORS[index % ICON_COLORS.length];
  const bgs   = ["#dbeafe","#d1fae5","#ede9fe","#fef3c7","#cffafe","#fee2e2"];
  const bg    = bgs[index % bgs.length];
  const Icon  = type === "SPECIALIST_HOSPITAL" ? FaStethoscope
              : type === "CLINIC"              ? FaClinicMedical
              : FaHospital;
  return (
    <div className="fhs-fac-icon" style={{ background: bg }}>
      <Icon size={24} color={color} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Facilities() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user }  = useAuth();

  /* read state passed from Dashboard search form */
  const passedState = location.state || {};

  const [filters, setFilters] = useState({
    name:           passedState.requirement || "",
    area:           "All",        // All | Rural | Urban
    type:           "All",        // All | PHC | DISTRICT_HOSPITAL | SPECIALIST_HOSPITAL | CLINIC
    specialization: passedState.specialization || "",
    emergency:      false,
    govtScheme:     false,
  });

  const [allFacilities, setAllFacilities]   = useState([]);
  const [results, setResults]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [showFilters, setShowFilters]       = useState(false);
  const [activeType, setActiveType]         = useState("All");

  /* ── load all facilities ── */
  const loadFacilities = useCallback(async () => {
    setLoading(true); setError("");
    try {
      let data;
      try {
        data = await apiGetFacilities();
      } catch (err) {
        if (isNetworkErr(err.message)) {
          data = facilityService.getAll();
        } else throw err;
      }
      setAllFacilities(data || []);
      applyFilters(data || [], filters);
    } catch (e) {
      setError(e.message || "Failed to load facilities.");
      setAllFacilities(facilityService.getAll());
      applyFilters(facilityService.getAll(), filters);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { loadFacilities(); }, [loadFacilities]);

  /* ── apply filters ── */
  const applyFilters = (data, f) => {
    let r = [...data];
    if (f.name.trim())
      r = r.filter((x) =>
        x.name?.toLowerCase().includes(f.name.toLowerCase()) ||
        x.address?.toLowerCase().includes(f.name.toLowerCase())
      );
    if (f.area !== "All")
      r = r.filter((x) => (x.area || "").toLowerCase() === f.area.toLowerCase());
    if (f.type !== "All")
      r = r.filter((x) => x.type === f.type);
    if (f.specialization)
      r = r.filter((x) =>
        (x.departments || []).some((d) => d.toLowerCase().includes(f.specialization.toLowerCase())) ||
        (x.services    || []).some((s) => s.toLowerCase().includes(f.specialization.toLowerCase()))
      );
    if (f.emergency)
      r = r.filter((x) => x.emergency || x.operatingStatus === "EMERGENCY_ONLY");
    if (f.govtScheme)
      r = r.filter((x) => x.govtScheme || x.acceptsGovtScheme);
    setResults(r);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters(allFacilities, filters);
  };

  const handleReset = () => {
    const cleared = { name: "", area: "All", type: "All", specialization: "", emergency: false, govtScheme: false };
    setFilters(cleared);
    setActiveType("All");
    applyFilters(allFacilities, cleared);
  };

  const setF = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const handleTypeTab = (type) => {
    setActiveType(type);
    const updated = { ...filters, type };
    setFilters(updated);
    applyFilters(allFacilities, updated);
  };

  const openDirections = (f) => {
    if (f.latitude && f.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${f.latitude},${f.longitude}`, "_blank");
    } else if (f.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.address)}`, "_blank");
    }
  };

  /* ── skeleton count ── */
  const skeletonCount = 6;

  /* ── render ── */
  return (
    <div className="fhs-root">
      <Navbar />

      <main className="fhs-main">
        <div className="fhs-container">

          {/* ── Page Header ───────────────────────────────────────────── */}
          <div className="fhs-page-header">
            <div>
              <div className="fhs-badge">
                <MdLocalHospital size={13} /> Find Healthcare Facilities
              </div>
              <h1>Healthcare Facilities</h1>
              <p>Search hospitals, clinics and health centres near you.</p>
            </div>
            <div className="fhs-result-count">
              {!loading && (
                <span>
                  <strong>{results.length}</strong> {results.length === 1 ? "facility" : "facilities"} found
                </span>
              )}
            </div>
          </div>

          {/* ── Search Bar ────────────────────────────────────────────── */}
          <form className="fhs-search-bar" onSubmit={handleSearch}>
            <div className="fhs-search-input-wrap">
              <MdSearch size={20} color="#9ab0c0" />
              <input
                type="text"
                placeholder="Search by hospital name, location or service..."
                value={filters.name}
                onChange={(e) => setF("name", e.target.value)}
              />
              {filters.name && (
                <button type="button" className="fhs-clear-btn" onClick={() => setF("name", "")}>
                  <MdClose size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="fhs-search-btn">
              <MdSearch size={16} /> Search
            </button>
            <button
              type="button"
              className={`fhs-filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <MdTune size={16} /> Filters
              {(filters.area !== "All" || filters.specialization || filters.emergency || filters.govtScheme) && (
                <span className="fhs-filter-dot" />
              )}
            </button>
            <button type="button" className="fhs-reset-btn" onClick={handleReset}>
              <MdRefresh size={16} />
            </button>
          </form>

          {/* ── Advanced Filters Panel ────────────────────────────────── */}
          {showFilters && (
            <div className="fhs-filters-panel">
              <div className="fhs-filter-group">
                <label>Area Type</label>
                <div className="fhs-radio-row">
                  {["All", "Rural", "Urban"].map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`fhs-radio-btn ${filters.area === a ? "active" : ""}`}
                      onClick={() => { setF("area", a); applyFilters(allFacilities, { ...filters, area: a }); }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="fhs-filter-group">
                <label>Specialization / Service</label>
                <div className="fhs-select-wrap">
                  <FaStethoscope size={13} color="#9ab0c0" />
                  <select
                    value={filters.specialization}
                    onChange={(e) => { setF("specialization", e.target.value); applyFilters(allFacilities, { ...filters, specialization: e.target.value }); }}
                  >
                    <option value="">Any Specialization</option>
                    {["General Medicine","Cardiology","Orthopaedics","Gynaecology","Paediatrics",
                      "Neurology","Oncology","Ophthalmology","ENT","Surgery","Nephrology",
                      "Psychiatry","Emergency Care","Maternity Care","Vaccination","Diagnostics"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="fhs-filter-group">
                <label>Special Filters</label>
                <div className="fhs-check-row">
                  <label className="fhs-check-label">
                    <input type="checkbox" checked={filters.emergency}
                      onChange={(e) => { setF("emergency", e.target.checked); applyFilters(allFacilities, { ...filters, emergency: e.target.checked }); }} />
                    <MdEmergency size={14} color="#dc2626" /> Emergency Only
                  </label>
                  <label className="fhs-check-label">
                    <input type="checkbox" checked={filters.govtScheme}
                      onChange={(e) => { setF("govtScheme", e.target.checked); applyFilters(allFacilities, { ...filters, govtScheme: e.target.checked }); }} />
                    <MdVerified size={14} color="#059669" /> Govt Scheme
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ── Type Tabs ─────────────────────────────────────────────── */}
          <div className="fhs-type-tabs">
            {["All","PHC","DISTRICT_HOSPITAL","SPECIALIST_HOSPITAL","CLINIC"].map((t) => {
              const meta = TYPE_META[t];
              return (
                <button
                  key={t}
                  className={`fhs-tab ${activeType === t ? "active" : ""}`}
                  onClick={() => handleTypeTab(t)}
                >
                  {meta ? meta.icon : <MdLocalHospital size={14} />}
                  {meta ? meta.label : "All"}
                </button>
              );
            })}
            {(filters.emergency) && (
              <button className="fhs-tab active emergency-tab">
                <MdEmergency size={14} /> Emergency
              </button>
            )}
          </div>

          {/* ── Error ─────────────────────────────────────────────────── */}
          {error && (
            <div className="fhs-error-bar">
              <span>{error}</span>
              <button onClick={loadFacilities}><MdRefresh size={15} /> Retry</button>
            </div>
          )}

          {/* ── Results Grid ──────────────────────────────────────────── */}
          {loading ? (
            <div className="fhs-grid">
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={i} className="fhs-skeleton-card" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="fhs-empty">
              <MdLocalHospital size={52} color="#d1d5db" />
              <h3>No facilities found</h3>
              <p>Try adjusting your search or filters.</p>
              <button onClick={handleReset}>Reset Filters</button>
            </div>
          ) : (
            <div className="fhs-grid">
              {results.map((f, idx) => {
                const typeMeta   = TYPE_META[f.type]   || { label: f.type,   color: "#6b7280", bg: "#f3f4f6" };
                const statusMeta = STATUS_META[f.operatingStatus || (f.status === "OPEN" ? "OPEN" : "OPEN")]
                                 || STATUS_META.OPEN;
                const depts  = f.departments || [];
                const svcs   = f.services    || [];

                return (
                  <div key={f.id} className="fhs-card">

                    {/* Card top */}
                    <div className="fhs-card-top">
                      <FacilityIcon index={idx} type={f.type} />

                      <div className="fhs-card-badges">
                        {/* Status */}
                        <span className="fhs-badge" style={{ background: statusMeta.bg, color: statusMeta.color }}>
                          {statusMeta.label}
                        </span>
                        {/* Emergency */}
                        {(f.emergency || f.operatingStatus === "EMERGENCY_ONLY") && (
                          <span className="fhs-badge emergency-badge">
                            <MdEmergency size={11} /> 24/7
                          </span>
                        )}
                        {/* Govt Scheme */}
                        {(f.govtScheme || f.acceptsGovtScheme) && (
                          <span className="fhs-badge govt-badge">
                            <MdVerified size={11} /> Govt
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name & type */}
                    <h3 className="fhs-card-name">{f.name}</h3>
                    <div className="fhs-card-meta">
                      <span className="fhs-type-tag" style={{ background: typeMeta.bg, color: typeMeta.color }}>
                        {typeMeta.icon} {typeMeta.label}
                      </span>
                      {f.area && (
                        <span className={`fhs-area-tag ${f.area?.toLowerCase() === "rural" ? "rural" : "urban"}`}>
                          {f.area}
                        </span>
                      )}
                    </div>

                    {/* Address */}
                    <p className="fhs-address">
                      <MdLocationOn size={13} color="#718096" />
                      {f.address || "Address not available"}
                    </p>

                    {/* Phone */}
                    {(f.phone || f.contactNumber) && (
                      <a
                        href={`tel:${f.phone || f.contactNumber}`}
                        className="fhs-phone"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MdPhone size={13} /> {f.phone || f.contactNumber}
                      </a>
                    )}

                    {/* Rating */}
                    {f.rating && (
                      <div className="fhs-rating">
                        {[1,2,3,4,5].map((s) => (
                          <MdStar key={s} size={14} color={s <= Math.round(f.rating) ? "#f59e0b" : "#d1d5db"} />
                        ))}
                        <span>{f.rating}</span>
                        {f.totalRatings && <span className="fhs-rating-count">({f.totalRatings} reviews)</span>}
                      </div>
                    )}

                    {/* Distance */}
                    {f.distanceKm != null && (
                      <div className="fhs-distance">
                        <MdLocationOn size={12} /> {f.distanceKm} km away
                      </div>
                    )}

                    {/* Departments */}
                    {depts.length > 0 && (
                      <div className="fhs-tags-row">
                        {depts.slice(0, 3).map((d) => (
                          <span key={d} className="fhs-dept-tag">{d}</span>
                        ))}
                        {depts.length > 3 && (
                          <span className="fhs-more-tag">+{depts.length - 3} more</span>
                        )}
                      </div>
                    )}

                    {/* Services */}
                    {svcs.length > 0 && (
                      <div className="fhs-tags-row">
                        {svcs.slice(0, 3).map((s) => (
                          <span key={s} className="fhs-svc-tag">{s}</span>
                        ))}
                        {svcs.length > 3 && (
                          <span className="fhs-more-tag">+{svcs.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="fhs-card-actions">
                      <button
                        className="fhs-btn-primary"
                        onClick={() => navigate(`/hospital/${f.id}`)}
                      >
                        View Details <MdArrowForward size={14} />
                      </button>
                      <button
                        className="fhs-btn-secondary"
                        onClick={() => openDirections(f)}
                        title="Get Directions"
                      >
                        <MdDirections size={16} />
                      </button>
                      {(f.phone || f.contactNumber) && (
                        <a
                          href={`tel:${f.phone || f.contactNumber}`}
                          className="fhs-btn-secondary"
                          title="Call Hospital"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MdPhone size={16} />
                        </a>
                      )}
                    </div>

                    {/* Book Appointment */}
                    <button
                      className="fhs-book-btn"
                      onClick={() => navigate(`/book-appointment?facilityId=${f.id}`)}
                    >
                      Book Appointment
                    </button>

                    {/* Referral – health worker only */}
                    {user?.role === "HEALTH_WORKER" && (
                      <button
                        className="fhs-referral-btn"
                        onClick={() => navigate(`/create-referral?toFacilityId=${f.id}`)}
                      >
                        <MdLocalHospital size={14} /> Request Referral
                      </button>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
