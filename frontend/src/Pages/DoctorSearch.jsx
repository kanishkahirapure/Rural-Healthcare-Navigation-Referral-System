import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorService, facilityService } from "../services/store";
import { apiGetDoctors } from "../services/api";
import Navbar from "../components/Navbar";
import "./DoctorSearch.css";
import {
  MdSearch, MdClose, MdRefresh, MdLocalHospital,
  MdCalendarMonth, MdAccessTime, MdPerson, MdArrowForward,
} from "react-icons/md";
import { FaStethoscope, FaUserMd } from "react-icons/fa";

const isNet = (m="") => ["cannot connect","failed to fetch","networkerror","load failed"].some(k=>m.toLowerCase().includes(k));

const SPECS = ["General Medicine","Cardiology","Orthopaedics","Gynaecology","Paediatrics",
  "Neurology","Oncology","Ophthalmology","ENT","Surgery","Nephrology","Psychiatry",
  "Emergency Medicine","Dermatology"];

const AVATAR_COLORS = ["#087ea4","#059669","#7c3aed","#d97706","#0891b2","#dc2626"];

export default function DoctorSearch() {
  const navigate = useNavigate();
  const [allDoctors, setAllDoctors] = useState([]);
  const [results,    setResults]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [filters,    setFilters]    = useState({ name: "", specialization: "", facilityId: "", availableOnly: false });

  const facilities = facilityService.getAll();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let docs;
        try { docs = await apiGetDoctors(); }
        catch(e) { if (isNet(e.message)) docs = doctorService.getAll(); else throw e; }
        setAllDoctors(docs || []);
        setResults(docs || []);
      } catch(e) {
        setError(e.message);
        const d = doctorService.getAll();
        setAllDoctors(d); setResults(d);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  const applyFilters = (f, data) => {
    let r = [...data];
    if (f.name.trim()) r = r.filter(d => d.name?.toLowerCase().includes(f.name.toLowerCase()));
    if (f.specialization) r = r.filter(d => (d.specialization||"").toLowerCase().includes(f.specialization.toLowerCase()));
    if (f.facilityId) r = r.filter(d => String(d.facilityId) === String(f.facilityId));
    if (f.availableOnly) r = r.filter(d => d.isAvailable !== false && d.status !== "INACTIVE");
    setResults(r);
  };

  const setF = (k, v) => {
    const updated = { ...filters, [k]: v };
    setFilters(updated);
    applyFilters(updated, allDoctors);
  };

  const reset = () => {
    const cleared = { name: "", specialization: "", facilityId: "", availableOnly: false };
    setFilters(cleared);
    setResults(allDoctors);
  };

  return (
    <div className="ds-root">
      <Navbar />
      <main className="ds-main">
        <div className="ds-container">

          {/* Header */}
          <div className="ds-page-header">
            <div>
              <div className="ds-badge"><FaStethoscope size={12}/> Find Doctors</div>
              <h1>Find Doctors</h1>
              <p>Search doctors by name, specialization or hospital.</p>
            </div>
            <span className="ds-count">{!loading && <><strong>{results.length}</strong> doctors found</>}</span>
          </div>

          {/* Search & Filters */}
          <div className="ds-filters-card">
            <div className="ds-filter-row">
              <div className="ds-input-wrap ds-grow">
                <MdSearch size={18} color="#9ab0c0"/>
                <input placeholder="Search by doctor name..." value={filters.name}
                  onChange={e => setF("name", e.target.value)}/>
                {filters.name && <button className="ds-clear" onClick={() => setF("name","")}>
                  <MdClose size={15}/>
                </button>}
              </div>

              <div className="ds-input-wrap">
                <FaStethoscope size={13} color="#9ab0c0"/>
                <select value={filters.specialization} onChange={e => setF("specialization", e.target.value)}>
                  <option value="">All Specializations</option>
                  {SPECS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="ds-input-wrap">
                <MdLocalHospital size={16} color="#9ab0c0"/>
                <select value={filters.facilityId} onChange={e => setF("facilityId", e.target.value)}>
                  <option value="">All Hospitals</option>
                  {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <label className="ds-check-label">
                <input type="checkbox" checked={filters.availableOnly}
                  onChange={e => setF("availableOnly", e.target.checked)}/>
                Available Only
              </label>

              <button className="ds-reset-btn" onClick={reset} title="Reset filters">
                <MdRefresh size={16}/>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div className="ds-error">{error}</div>}

          {/* Results */}
          {loading ? (
            <div className="ds-grid">
              {[1,2,3,4,5,6].map(i => <div key={i} className="ds-skeleton"/>)}
            </div>
          ) : results.length === 0 ? (
            <div className="ds-empty">
              <FaUserMd size={52} color="#d1d5db"/>
              <h3>No doctors found</h3>
              <p>Try adjusting your filters.</p>
              <button onClick={reset}>Reset Filters</button>
            </div>
          ) : (
            <div className="ds-grid">
              {results.map((d, idx) => {
                const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const initials = (d.name||"Dr").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
                const fac = facilities.find(f => String(f.id) === String(d.facilityId));
                const available = d.isAvailable !== false && d.status !== "INACTIVE";

                return (
                  <div key={d.id} className="ds-card">
                    <div className="ds-card-top">
                      <div className="ds-avatar" style={{background: color + "20", color}}>
                        {initials}
                      </div>
                      <span className={`ds-avail-badge ${available ? "avail" : "unavail"}`}>
                        {available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <h3 className="ds-name">{d.name}</h3>
                    <span className="ds-spec">{d.specialization}</span>

                    {(d.qualification||d.qualifications) && (
                      <p className="ds-qual">{d.qualification||d.qualifications}</p>
                    )}

                    <div className="ds-meta">
                      <span><MdPerson size={13}/> {d.experienceYears||d.experience||"—"} yrs exp</span>
                      {(d.fee||d.consultationFee) && <span>₹{d.fee||d.consultationFee}</span>}
                    </div>

                    <div className="ds-hospital">
                      <MdLocalHospital size={13} color="#087ea4"/>
                      <span>{d.facilityName || fac?.name || "—"}</span>
                    </div>

                    {(d.availableDays||d.availability) && (
                      <div className="ds-availability">
                        <MdAccessTime size={12} color="#718096"/>
                        <span>{Array.isArray(d.availability) ? d.availability.join(", ") : (d.availableDays||d.availableTime||"")}</span>
                      </div>
                    )}

                    {(d.languages) && (
                      <div className="ds-langs">
                        {(d.languages||[]).map(l => <span key={l} className="ds-lang-tag">{l}</span>)}
                      </div>
                    )}

                    <div className="ds-card-actions">
                      <button className="ds-book-btn"
                        onClick={() => navigate(`/book-appointment?doctorId=${d.id}&facilityId=${d.facilityId}`)}>
                        <MdCalendarMonth size={14}/> Book
                      </button>
                      <button className="ds-hosp-btn"
                        onClick={() => navigate(`/hospital/${d.facilityId}`)}>
                        <MdArrowForward size={14}/>
                      </button>
                    </div>
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
