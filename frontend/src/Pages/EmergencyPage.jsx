import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { facilityService } from "../services/store";
import { apiGetFacilities } from "../services/api";
import Navbar from "../components/Navbar";
import "./EmergencyPage.css";
import {
  MdEmergency, MdLocationOn, MdPhone, MdDirections,
  MdMyLocation, MdSearch, MdWarningAmber, MdArrowBack,
  MdLocalHospital,
} from "react-icons/md";
import { FaHospital, FaHeartbeat } from "react-icons/fa";

const isNetworkErr = (msg = "") =>
  ["cannot connect", "failed to fetch", "networkerror", "load failed"].some((k) => msg.toLowerCase().includes(k));

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);

  const findFacilities = async () => {
    setLoading(true); setSearched(true);
    try {
      let all;
      try { all = await apiGetFacilities(); }
      catch (e) {
        if (isNetworkErr(e.message)) all = facilityService.getAll();
        else throw e;
      }
      const emergency = (all || []).filter(f =>
        f.emergency || f.operatingStatus === "EMERGENCY_ONLY" || f.operatingStatus === "OPEN"
      );
      setResults(emergency);
    } catch { setResults(facilityService.getEmergency()); }
    finally { setLoading(false); }
  };

  const useGPS = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      () => alert("Could not get location. Please enter manually.")
    );
  };

  const openDirections = (f) => {
    if (f.latitude && f.longitude)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${f.latitude},${f.longitude}`, "_blank");
    else if (f.address)
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.address)}`, "_blank");
  };

  return (
    <div className="em-root">
      <Navbar />
      <main className="em-main">
        <div className="em-container">

          {/* Emergency Banner */}
          <div className="em-alert-banner">
            <MdEmergency size={28} color="white" />
            <div>
              <strong>For life-threatening emergencies, call 108 immediately!</strong>
              <p>Do not delay urgent care. Contact local emergency services first.</p>
            </div>
            <a href="tel:108" className="em-call-108">
              <MdPhone size={18} /> Call 108
            </a>
          </div>

          {/* Page Header */}
          <div className="em-header">
            <button className="em-back-btn" onClick={() => navigate("/dashboard")}>
              <MdArrowBack size={16} /> Back to Dashboard
            </button>
            <div>
              <h1><MdEmergency size={24} color="#dc2626" /> Emergency Healthcare</h1>
              <p>Find facilities with emergency services near you.</p>
            </div>
          </div>

          {/* Search */}
          <div className="em-search-card">
            <div className="em-input-wrap">
              <MdLocationOn size={18} color="#9ab0c0" />
              <input
                type="text"
                placeholder="Enter your location or area..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && findFacilities()}
              />
              <button className="em-gps-btn" onClick={useGPS} title="Use GPS">
                <MdMyLocation size={16} />
              </button>
            </div>
            <button className="em-find-btn" onClick={findFacilities} disabled={loading}>
              {loading ? "Searching…" : <><MdSearch size={16} /> Find Emergency Facilities</>}
            </button>
          </div>

          {/* Results */}
          {!searched && (
            <div className="em-prompt">
              <FaHeartbeat size={48} color="#fca5a5" />
              <p>Click "Find Emergency Facilities" to locate nearby emergency services.</p>
            </div>
          )}

          {searched && !loading && results.length === 0 && (
            <div className="em-empty">
              <MdLocalHospital size={48} color="#d1d5db" />
              <p>No emergency facilities found. Please call 108.</p>
            </div>
          )}

          {searched && !loading && results.length > 0 && (
            <div className="em-grid">
              {results.map((f) => (
                <div key={f.id} className="em-card">
                  <div className="em-card-top">
                    <div className="em-fac-icon">
                      <FaHospital size={22} color="#dc2626" />
                    </div>
                    <div className="em-card-badges">
                      {(f.emergency || f.operatingStatus === "EMERGENCY_ONLY") && (
                        <span className="em-badge em-badge-emergency">
                          <MdEmergency size={11} /> 24/7
                        </span>
                      )}
                      {(f.operatingStatus === "OPEN" || !f.operatingStatus) && (
                        <span className="em-badge em-badge-open">Open</span>
                      )}
                    </div>
                  </div>

                  <h3>{f.name}</h3>

                  <p className="em-address">
                    <MdLocationOn size={13} /> {f.address || "Address not available"}
                  </p>

                  {f.distanceKm != null && (
                    <span className="em-distance">{f.distanceKm} km away</span>
                  )}

                  <div className="em-actions">
                    {(f.phone || f.contactNumber) && (
                      <a href={`tel:${f.phone || f.contactNumber}`} className="em-call-btn">
                        <MdPhone size={16} /> {f.phone || f.contactNumber}
                      </a>
                    )}
                    <button className="em-dir-btn" onClick={() => openDirections(f)}>
                      <MdDirections size={16} /> Directions
                    </button>
                  </div>

                  <button className="em-details-btn" onClick={() => navigate(`/hospital/${f.id}`)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="em-disclaimer">
            <MdWarningAmber size={15} color="#92400e" />
            <span>Facility listings may not reflect real-time capacity. Always call ahead in emergencies.</span>
          </div>

        </div>
      </main>
    </div>
  );
}
