import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { facilityService, doctorService } from "../services/store";
import { apiGetFacilityById, apiGetDoctorsByFacility } from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  MdArrowBack, MdLocationOn, MdPhone, MdDirections,
  MdLocalHospital, MdEmergency, MdVerified, MdCalendarMonth,
  MdStar, MdAccessTime, MdPerson,
} from "react-icons/md";
import { FaHospital, FaStethoscope, FaClinicMedical } from "react-icons/fa";
import "./HospitalDetails.css";

const isNet = (msg="") => ["cannot connect","failed to fetch","networkerror","load failed"].some(k=>msg.toLowerCase().includes(k));

export default function HospitalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [facility, setFacility] = useState(null);
  const [doctors,  setDoctors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let f, docs;
        try {
          f    = await apiGetFacilityById(id);
          docs = await apiGetDoctorsByFacility(id);
        } catch(e) {
          if (isNet(e.message)) {
            f    = facilityService.getById(id);
            docs = doctorService.getByFacility(id);
          } else throw e;
        }
        setFacility(f);
        setDoctors(docs || []);
      } catch(e) {
        setError(e.message || "Failed to load facility.");
      } finally { setLoading(false); }
    }
    load();
  }, [id]);

  const openDirections = () => {
    if (!facility) return;
    if (facility.latitude && facility.longitude)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`, "_blank");
    else if (facility.address)
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address)}`, "_blank");
  };

  if (loading) return <div className="hd-root"><Navbar /><div className="hd-loading">Loading facility…</div></div>;
  if (error || !facility) return (
    <div className="hd-root"><Navbar />
      <div className="hd-not-found">
        <MdLocalHospital size={52} color="#d1d5db" />
        <h3>Facility not found</h3>
        <p>{error || "The requested facility could not be found."}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );

  const f = facility;
  const TYPE_META = {
    PHC:                 {label:"PHC",              color:"#059669",bg:"#d1fae5"},
    DISTRICT_HOSPITAL:   {label:"District Hospital", color:"#087ea4",bg:"#dbeafe"},
    SPECIALIST_HOSPITAL: {label:"Specialist",        color:"#7c3aed",bg:"#ede9fe"},
    CLINIC:              {label:"Clinic",            color:"#d97706",bg:"#fef3c7"},
  };
  const tm = TYPE_META[f.type] || {label:f.type||"Facility",color:"#6b7280",bg:"#f3f4f6"};

  return (
    <div className="hd-root">
      <Navbar />
      <main className="hd-main">
        <div className="hd-container">

          {/* Back */}
          <button className="hd-back" onClick={() => navigate(-1)}>
            <MdArrowBack size={16} /> Back to Results
          </button>

          {/* Hero card */}
          <div className="hd-hero">
            <div className="hd-hero-icon" style={{background:tm.bg}}>
              {f.type==="SPECIALIST_HOSPITAL"?<FaStethoscope size={32} color={tm.color}/>
               :f.type==="CLINIC"?<FaClinicMedical size={32} color={tm.color}/>
               :<FaHospital size={32} color={tm.color}/>}
            </div>
            <div className="hd-hero-info">
              <div className="hd-hero-badges">
                <span className="hd-badge" style={{background:tm.bg,color:tm.color}}>{tm.label}</span>
                {f.area && <span className={`hd-badge ${f.area?.toLowerCase()==="rural"?"rural":"urban"}`}>{f.area}</span>}
                {(f.emergency||f.operatingStatus==="EMERGENCY_ONLY") && <span className="hd-badge hd-emergency"><MdEmergency size={11}/> 24/7 Emergency</span>}
                {(f.govtScheme||f.acceptsGovtScheme) && <span className="hd-badge hd-govt"><MdVerified size={11}/> Govt Scheme</span>}
              </div>
              <h1>{f.name}</h1>
              <p className="hd-address"><MdLocationOn size={14}/>{f.address||"Address not available"}</p>
              {f.rating && (
                <div className="hd-rating">
                  {[1,2,3,4,5].map(s=><MdStar key={s} size={15} color={s<=Math.round(f.rating)?"#f59e0b":"#e2e8f0"}/>)}
                  <span>{f.rating}</span>{f.totalRatings&&<span className="hd-rating-count">({f.totalRatings} reviews)</span>}
                </div>
              )}
            </div>
            <div className="hd-hero-actions">
              {(f.phone||f.contactNumber)&&<a href={`tel:${f.phone||f.contactNumber}`} className="hd-action-btn hd-call"><MdPhone size={16}/>{f.phone||f.contactNumber}</a>}
              <button className="hd-action-btn hd-dir" onClick={openDirections}><MdDirections size={16}/>Get Directions</button>
              <button className="hd-action-btn hd-book" onClick={()=>navigate(`/book-appointment?facilityId=${f.id}`)}><MdCalendarMonth size={16}/>Book Appointment</button>
              {user?.role==="HEALTH_WORKER"&&<button className="hd-action-btn hd-ref" onClick={()=>navigate(`/create-referral?toFacilityId=${f.id}`)}>Request Referral</button>}
            </div>
          </div>

          <div className="hd-two-col">
            {/* Info */}
            <div className="hd-card">
              <h2>Facility Information</h2>
              <div className="hd-info-row"><span>Operating Hours</span><strong>{f.hours||f.operatingStatus||"Not specified"}</strong></div>
              <div className="hd-info-row"><span>Status</span><strong>{f.operatingStatus||"OPEN"}</strong></div>
              <div className="hd-info-row"><span>Facility Type</span><strong>{tm.label}</strong></div>
              <div className="hd-info-row"><span>Area</span><strong>{f.area||"Not specified"}</strong></div>
              <div className="hd-info-row"><span>Emergency</span><strong>{f.emergency?"Available":"Not available"}</strong></div>
              <div className="hd-info-row"><span>Govt Scheme</span><strong>{(f.govtScheme||f.acceptsGovtScheme)?"Accepted":"Not applicable"}</strong></div>
              {f.distanceKm!=null&&<div className="hd-info-row"><span>Distance</span><strong>{f.distanceKm} km</strong></div>}
            </div>

            {/* Departments + Services */}
            <div>
              {(f.departments||[]).length>0&&(
                <div className="hd-card" style={{marginBottom:16}}>
                  <h2>Departments</h2>
                  <div className="hd-tags">{(f.departments||[]).map(d=><span key={d} className="hd-dept-tag">{d}</span>)}</div>
                </div>
              )}
              {(f.services||[]).length>0&&(
                <div className="hd-card">
                  <h2>Services</h2>
                  <div className="hd-tags">{(f.services||[]).map(s=><span key={s} className="hd-svc-tag">{s}</span>)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Doctors */}
          {doctors.length>0&&(
            <div className="hd-card">
              <div className="hd-section-head">
                <h2>Doctors at this Facility</h2>
                <button className="hd-view-all" onClick={()=>navigate("/doctor-search")}>View All Doctors</button>
              </div>
              <div className="hd-doctors-grid">
                {doctors.map((d,i)=>(
                  <div key={d.id||i} className="hd-doctor-card">
                    <div className="hd-doc-avatar">{(d.name||"D").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
                    <div className="hd-doc-info">
                      <strong>{d.name}</strong>
                      <span className="hd-doc-spec">{d.specialization}</span>
                      <span className="hd-doc-qual">{d.qualification||d.qualifications}</span>
                      <span className="hd-doc-exp"><MdAccessTime size={12}/> {d.experienceYears||d.experience} yrs exp</span>
                      {(d.isAvailable||d.status==="ACTIVE")&&<span className="hd-doc-avail">Available</span>}
                    </div>
                    <button className="hd-book-doc" onClick={()=>navigate(`/book-appointment?facilityId=${f.id}&doctorId=${d.id}`)}>
                      <MdCalendarMonth size={13}/> Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
