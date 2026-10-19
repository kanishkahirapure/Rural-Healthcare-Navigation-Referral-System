import { useEffect, useMemo, useState } from "react";
import "./Facilities.css";
import {
  MdLocalHospital, MdSearch, MdLocationOn, MdFilterList,
  MdArrowForward, MdMedicalServices, MdEmergency,
  MdMyLocation, MdStar, MdPhone, MdNearMe
} from "react-icons/md";
import { FaClinicMedical, FaHospital, FaStethoscope } from "react-icons/fa";
import { getFacilities, getNearbyFacilities } from "../api/facilities";
import { getDoctorsByFacility } from "../api/doctors";
import { getFacilityRatings } from "../api/ratings";
import { getErrorMessage } from "../api/client";
import FormMessage from "../components/FormMessage";
import { getTypeInfo, getStatusInfo } from "../utils/facility";

// Filter buttons. "key" is either "ALL", a real backend type, or "EMERGENCY" (status EMERGENCY_ONLY).
const FILTERS = [
  { key: "ALL", label: "All", Icon: MdFilterList },
  { key: "DISTRICT_HOSPITAL", label: "District Hospital", Icon: FaHospital },
  { key: "SPECIALIST_HOSPITAL", label: "Specialist Hospital", Icon: MdMedicalServices },
  { key: "PHC", label: "PHC", Icon: FaStethoscope },
  { key: "CLINIC", label: "Clinic", Icon: FaClinicMedical },
  { key: "EMERGENCY", label: "Emergency", Icon: MdEmergency },
];

const NEARBY_RADIUS_KM = 50;

function Facilities() {
  const [facilities, setFacilities] = useState([]);   // all facilities from the backend
  const [nearby, setNearby] = useState(null);         // result of /nearby, or null when not used
  const [ratings, setRatings] = useState({});         // { facilityId: { averageStars, totalRatings } }
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");           // text inside the search box
  const [query, setQuery] = useState("");             // text actually used for filtering
  const [filter, setFilter] = useState("ALL");

  const [expandedId, setExpandedId] = useState(null); // facility whose details are open
  const [doctorsById, setDoctorsById] = useState({}); // { facilityId: { list | loading | error } }

  // Load all facilities once, then load their ratings.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getFacilities();
        if (cancelled) return;
        setFacilities(data);

        // One ratings call per facility. A failed rating must not break the page.
        const results = await Promise.allSettled(data.map((f) => getFacilityRatings(f.id)));
        if (cancelled) return;
        const map = {};
        results.forEach((result, index) => {
          if (result.status === "fulfilled") map[data[index].id] = result.value;
        });
        setRatings(map);
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
  }, []);

  // Apply the search text and the filter button to the current list.
  const visible = useMemo(() => {
    const source = nearby ?? facilities;
    const text = query.trim().toLowerCase();

    return source.filter((f) => {
      if (filter === "EMERGENCY" && f.operatingStatus !== "EMERGENCY_ONLY") return false;
      if (filter !== "ALL" && filter !== "EMERGENCY" && f.type !== filter) return false;
      if (!text) return true;
      const haystack = `${f.name} ${f.address ?? ""} ${getTypeInfo(f.type).label}`.toLowerCase();
      return haystack.includes(text);
    });
  }, [nearby, facilities, query, filter]);

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearch(value);
    if (value === "") setQuery(""); // clearing the box shows everything again
  }

  function applySearch() {
    setQuery(search);
  }

  // "Use my location": ask the browser for coordinates, then call /nearby.
  // Clicking it again goes back to the full list.
  function handleUseLocation() {
    if (nearby) {
      setNearby(null);
      setError("");
      return;
    }
    if (!navigator.geolocation) {
      setError("Your browser does not support location.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getNearbyFacilities({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radiusKm: NEARBY_RADIUS_KM,
          });
          setNearby(data);
        } catch (err) {
          setError(getErrorMessage(err));
        } finally {
          setLocating(false);
        }
      },
      (geoError) => {
        setError(
          geoError.code === 1
            ? "Location permission was denied. Allow it in your browser to see nearby facilities."
            : "Could not get your location. Please try again."
        );
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }

  // Open or close the details of a card. Doctors are loaded the first time only.
  async function toggleDetails(id) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (doctorsById[id]?.list) return;

    setDoctorsById((prev) => ({ ...prev, [id]: { loading: true } }));
    try {
      const list = await getDoctorsByFacility(id);
      setDoctorsById((prev) => ({ ...prev, [id]: { list } }));
    } catch (err) {
      setDoctorsById((prev) => ({ ...prev, [id]: { error: getErrorMessage(err) } }));
    }
  }

  return (
    <div className="facilities-page">

      {/* Header */}
      <header className="facilities-header">
        <div>
          <div className="facilities-badge">
            <MdLocalHospital size={14} />
            <span>Healthcare Facilities</span>
          </div>
          <h1>Healthcare Facilities</h1>
          <p>Find suitable hospitals, clinics and healthcare centres near you.</p>
        </div>
        <div className="facility-location">
          <MdLocationOn size={18} color="#087ea4" />
          <span>{nearby ? `Within ${NEARBY_RADIUS_KM} km of you` : "Rural / Local Area"}</span>
        </div>
      </header>

      {/* Search */}
      <div className="facility-search">
        <MdSearch size={22} color="#9aa5af" />
        <input
          type="text"
          placeholder="Search hospital, clinic or healthcare service..."
          value={search}
          onChange={handleSearchChange}
          onKeyDown={(event) => event.key === "Enter" && applySearch()}
        />
        <button className="search-go-btn" onClick={applySearch}>Search</button>
      </div>

      {/* Filters */}
      <div className="facility-filters">
        {FILTERS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={filter === key ? "active-filter" : ""}
            onClick={() => setFilter(key)}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
        <button
          className={nearby ? "active-filter" : ""}
          onClick={handleUseLocation}
          disabled={locating}
        >
          <MdMyLocation size={14} />
          {locating ? " Finding you..." : nearby ? " Show all" : " Use my location"}
        </button>
      </div>

      <FormMessage type="error">{error}</FormMessage>

      {loading && <p style={{ color: "#6c7885" }}>Loading facilities...</p>}

      {!loading && !error && visible.length === 0 && (
        <p style={{ color: "#6c7885" }}>
          {nearby
            ? `No facilities found within ${NEARBY_RADIUS_KM} km. Click "Show all" to see every facility.`
            : "No facilities found."}
        </p>
      )}

      {/* Grid */}
      <section className="facility-grid">
        {visible.map((f) => {
          const type = getTypeInfo(f.type);
          const status = getStatusInfo(f.operatingStatus);
          const rating = ratings[f.id];
          const isOpen = expandedId === f.id;
          const docs = doctorsById[f.id];
          const hasRating = rating && rating.totalRatings > 0;

          return (
            <div className="facility-card" key={f.id}>
              <div className={`facility-icon-wrap ${type.bg}`}>
                <type.Icon size={26} color={type.color} />
              </div>
              <div className="facility-info">
                <span className="available" style={status.style}>
                  <status.Icon size={12} /> {status.label}
                </span>
                <h2>{f.name}</h2>
                <p className="fac-type"><type.Icon size={12} /> {type.label}</p>
                <p className="fac-loc"><MdLocationOn size={13} /> {f.address}</p>
                {f.distanceKm != null && (
                  <p className="fac-loc"><MdNearMe size={13} /> {f.distanceKm} km away</p>
                )}
                <p className="fac-loc">
                  <MdStar size={14} color="#f59e0b" />
                  {hasRating
                    ? `${rating.averageStars.toFixed(1)} (${rating.totalRatings} ratings)`
                    : "No ratings yet"}
                </p>

                {f.acceptsGovtScheme && (
                  <div className="facility-services">
                    <span>Govt Scheme</span>
                  </div>
                )}

                {/* Details: phone number and doctors */}
                {isOpen && (
                  <div style={{ margin: "12px 0", fontSize: "13px", color: "#536b79" }}>
                    {f.contactNumber && (
                      <p className="fac-loc"><MdPhone size={13} /> {f.contactNumber}</p>
                    )}
                    <strong style={{ color: "#102b4e" }}>Doctors</strong>
                    {docs?.loading && <p>Loading doctors...</p>}
                    {docs?.error && <p style={{ color: "#b91c1c" }}>{docs.error}</p>}
                    {docs?.list && docs.list.length === 0 && <p>No doctors listed.</p>}
                    {docs?.list?.map((d) => (
                      <p key={d.id} style={{ margin: "8px 0" }}>
                        <strong>{d.name}</strong> - {d.specialization}
                        <br />
                        {d.availableDays} {d.availableTime}
                        {d.isAvailable === false && " (not available)"}
                      </p>
                    ))}
                  </div>
                )}

                <button className="fac-btn" onClick={() => toggleDetails(f.id)}>
                  {isOpen ? "Hide Details" : "View Details"} <MdArrowForward size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}

export default Facilities;