import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { facilityService } from "../services/store";
import Navbar from "../components/Navbar";
import "./MapNavigation.css";
import {
  MdLocationOn, MdDirections, MdLocalHospital, MdPhone,
  MdArrowBack, MdSearch, MdMyLocation, MdAccessTime,
  MdEmergency, MdStar, MdOpenInNew, MdMap,
} from "react-icons/md";
import { FaHospital, FaStethoscope, FaClinicMedical } from "react-icons/fa";

export default function MapNavigation() {
  const navigate      = useNavigate();
  const [params]      = useSearchParams();
  const initId        = params.get("facilityId") || "";

  const allFacilities = facilityService.getAll();
  const [selected,  setSelected]  = useState(initId ? facilityService.getById(initId) : null);
  const [search,    setSearch]    = useState("");
  const [userLoc,   setUserLoc]   = useState(null);
  const [locLoading,setLocLoading]= useState(false);

  /* filter sidebar list */
  const filtered = allFacilities.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.address.toLowerCase().includes(search.toLowerCase())
  );

  /* open Google Maps directions */
  const openDirections = (f) => {
    if (!f) return;
    const dest = f.lat && f.lng
      ? `${f.lat},${f.lng}`
      : encodeURIComponent(f.address);
    const origin = userLoc
      ? `&origin=${userLoc.lat},${userLoc.lng}`
      : "";
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${dest}${origin}`,
      "_blank"
    );
  };

  /* open in Google Maps (view only) */
  const openMap = (f) => {
    if (!f) return;
    const q = f.lat && f.lng
      ? `${f.lat},${f.lng}`
      : encodeURIComponent(f.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
  };

  /* geolocation */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation is not supported by your browser."); return; }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => {
        alert("Could not get your location. Please allow location access.");
        setLocLoading(false);
      }
    );
  };

  /* haversine distance (km) */
  const calcDist = (f) => {
    if (!userLoc || !f.lat || !f.lng) return f.distanceKm ?? null;
    const R = 6371;
    const dLat = ((f.lat - userLoc.lat) * Math.PI) / 180;
    const dLng = ((f.lng - userLoc.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLoc.lat * Math.PI) / 180) *
        Math.cos((f.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  const TYPE_ICON = {
    SPECIALIST_HOSPITAL: <FaStethoscope size={18} color="#7c3aed" />,
    CLINIC:              <FaClinicMedical size={18} color="#d97706" />,
    PHC:                 <FaHospital size={18} color="#059669" />,
    DISTRICT_HOSPITAL:   <FaHospital size={18} color="#087ea4" />,
  };

  const TYPE_COLOR = {
    SPECIALIST_HOSPITAL: { bg: "#ede9fe", color: "#7c3aed" },
    CLINIC:              { bg: "#fef3c7", color: "#d97706" },
    PHC:                 { bg: "#d1fae5", color: "#059669" },
    DISTRICT_HOSPITAL:   { bg: "#dbeafe", color: "#1e40af" },
  };

  return (
    <div className="map-root">
      <Navbar />
      <main className="map-main">

        {/* ── Page Header ── */}
        <div className="map-page-header">
          <button className="map-back-btn" onClick={() => navigate(-1)}>
            <MdArrowBack size={16} /> Back
          </button>
          <div>
            <div className="map-badge"><MdMap size={13} /> Map & Navigation</div>
            <h1>Healthcare Facility Map</h1>
            <p>Find and navigate to healthcare facilities near you.</p>
          </div>
          <button
            className={`map-loc-btn ${locLoading ? "loading" : ""}`}
            onClick={useCurrentLocation}
            disabled={locLoading}
          >
            <MdMyLocation size={16} />
            {locLoading ? "Getting location…" : userLoc ? "Location set ✓" : "Use My Location"}
          </button>
        </div>

        <div className="map-layout">

          {/* ── Sidebar ── */}
          <aside className="map-sidebar">
            <div className="map-search-wrap">
              <MdSearch size={16} color="#9ab0c0" />
              <input
                type="text"
                placeholder="Search facility or area…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <p className="map-sidebar-count">{filtered.length} facilities</p>

            <div className="map-facility-list">
              {filtered.map((f) => {
                const dist = calcDist(f);
                const tc   = TYPE_COLOR[f.type] || { bg: "#f3f4f6", color: "#6b7280" };
                return (
                  <div
                    key={f.id}
                    className={`map-fac-item ${selected?.id === f.id ? "map-fac-active" : ""}`}
                    onClick={() => setSelected(f)}
                  >
                    <div className="map-fac-icon" style={{ background: tc.bg }}>
                      {TYPE_ICON[f.type] || <FaHospital size={18} color={tc.color} />}
                    </div>
                    <div className="map-fac-text">
                      <strong>{f.name}</strong>
                      <span><MdLocationOn size={11} /> {f.address.split(",").slice(-2).join(",").trim()}</span>
                      <div className="map-fac-meta">
                        {f.emergency && <span className="map-tag emergency">Emergency</span>}
                        {f.area && <span className={`map-tag ${f.area.toLowerCase()}`}>{f.area}</span>}
                        {dist && <span className="map-dist">{dist} km</span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="map-empty">
                  <MdLocalHospital size={36} color="#d1d5db" />
                  <p>No facilities match your search.</p>
                  <button onClick={() => setSearch("")}>Clear Search</button>
                </div>
              )}
            </div>
          </aside>

          {/* ── Map Area ── */}
          <div className="map-area">

            {selected ? (
              <>
                {/* Map placeholder with embedded Google Maps iframe */}
                <div className="map-frame-wrap">
                  <iframe
                    title={selected.name}
                    className="map-iframe"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(selected.address)}&output=embed&z=14`}
                  />
                  <div className="map-overlay-badge">
                    <MdLocationOn size={14} color="#dc2626" />
                    <span>{selected.name}</span>
                  </div>
                </div>

                {/* Facility Info Card */}
                <div className="map-info-card">
                  <div className="map-info-left">
                    <div
                      className="map-info-icon"
                      style={{ background: (TYPE_COLOR[selected.type] || {}).bg || "#f3f4f6" }}
                    >
                      {TYPE_ICON[selected.type] || <FaHospital size={22} color="#087ea4" />}
                    </div>
                    <div>
                      <h2>{selected.name}</h2>
                      <p className="map-info-addr">
                        <MdLocationOn size={13} /> {selected.address}
                      </p>
                      <div className="map-info-meta">
                        {selected.hours && (
                          <span><MdAccessTime size={12} /> {selected.hours}</span>
                        )}
                        {selected.emergency && (
                          <span className="map-tag emergency"><MdEmergency size={11} /> Emergency</span>
                        )}
                        {selected.rating && (
                          <span className="map-rating">
                            <MdStar size={13} color="#f59e0b" /> {selected.rating}
                          </span>
                        )}
                        {calcDist(selected) && (
                          <span className="map-dist-badge">
                            {calcDist(selected)} km away
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="map-info-actions">
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="map-action-btn call">
                        <MdPhone size={15} /> Call
                      </a>
                    )}
                    <button className="map-action-btn view" onClick={() => openMap(selected)}>
                      <MdOpenInNew size={15} /> View on Maps
                    </button>
                    <button className="map-action-btn directions" onClick={() => openDirections(selected)}>
                      <MdDirections size={15} /> Get Directions
                    </button>
                    <button
                      className="map-action-btn book"
                      onClick={() => navigate(`/book-appointment?facilityId=${selected.id}`)}
                    >
                      Book Appointment
                    </button>
                    <button
                      className="map-action-btn details"
                      onClick={() => navigate(`/hospital/${selected.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No facility selected */
              <div className="map-placeholder">
                <div className="map-placeholder-icon">
                  <MdMap size={56} color="#d1d5db" />
                </div>
                <h3>Select a facility to view on map</h3>
                <p>Choose a healthcare facility from the list on the left to see its location and get directions.</p>
                <div className="map-placeholder-tips">
                  <div className="map-tip">
                    <MdMyLocation size={16} color="#087ea4" />
                    <span>Use "My Location" to see distances from your current position.</span>
                  </div>
                  <div className="map-tip">
                    <MdDirections size={16} color="#059669" />
                    <span>Click "Get Directions" to open Google Maps with turn-by-turn navigation.</span>
                  </div>
                  <div className="map-tip">
                    <MdEmergency size={16} color="#dc2626" />
                    <span>Facilities marked "Emergency" provide 24/7 emergency care.</span>
                  </div>
                </div>
                <button
                  className="map-emergency-btn"
                  onClick={() => navigate("/emergency")}
                >
                  <MdEmergency size={16} /> Find Emergency Facilities
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
