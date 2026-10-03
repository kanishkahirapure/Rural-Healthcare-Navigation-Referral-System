import "./Facilities.css";
import {
  MdLocalHospital, MdSearch, MdLocationOn, MdFilterList,
  MdVerified, MdArrowForward, MdMedicalServices, MdEmergency
} from "react-icons/md";
import { FaClinicMedical, FaHospital, FaStethoscope } from "react-icons/fa";

function Facilities() {
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
          <span>Rural / Local Area</span>
        </div>
      </header>

      {/* Search */}
      <div className="facility-search">
        <MdSearch size={22} color="#9aa5af" />
        <input type="text" placeholder="Search hospital, clinic or healthcare service..." />
        <button className="search-go-btn">Search</button>
      </div>

      {/* Filters */}
      <div className="facility-filters">
        <button className="active-filter">
          <MdFilterList size={14} /> All
        </button>
        <button><FaHospital size={13} /> Hospital</button>
        <button><FaClinicMedical size={13} /> Clinic</button>
        <button><MdMedicalServices size={14} /> Diagnostic Centre</button>
        <button><MdEmergency size={14} /> Emergency</button>
      </div>

      {/* Grid */}
      <section className="facility-grid">

        <div className="facility-card">
          <div className="facility-icon-wrap blue-bg">
            <FaHospital size={26} color="#087ea4" />
          </div>
          <div className="facility-info">
            <span className="available">
              <MdVerified size={12} /> Available
            </span>
            <h2>RuralCare General Hospital</h2>
            <p className="fac-type"><FaHospital size={12} /> General Hospital</p>
            <p className="fac-loc"><MdLocationOn size={13} /> Rural / Local Area</p>
            <div className="facility-services">
              <span>Emergency</span>
              <span>General Medicine</span>
              <span>Diagnostics</span>
            </div>
            <button className="fac-btn">
              View Details <MdArrowForward size={15} />
            </button>
          </div>
        </div>

        <div className="facility-card">
          <div className="facility-icon-wrap green-bg">
            <FaClinicMedical size={26} color="#059669" />
          </div>
          <div className="facility-info">
            <span className="available">
              <MdVerified size={12} /> Available
            </span>
            <h2>Community Health Centre</h2>
            <p className="fac-type"><FaClinicMedical size={12} /> Community Healthcare</p>
            <p className="fac-loc"><MdLocationOn size={13} /> Nearby Rural Area</p>
            <div className="facility-services">
              <span>OPD</span>
              <span>Primary Care</span>
              <span>Pharmacy</span>
            </div>
            <button className="fac-btn">
              View Details <MdArrowForward size={15} />
            </button>
          </div>
        </div>

        <div className="facility-card">
          <div className="facility-icon-wrap purple-bg">
            <FaStethoscope size={26} color="#7c3aed" />
          </div>
          <div className="facility-info">
            <span className="available">
              <MdVerified size={12} /> Available
            </span>
            <h2>Primary Health Clinic</h2>
            <p className="fac-type"><FaStethoscope size={12} /> Primary Healthcare</p>
            <p className="fac-loc"><MdLocationOn size={13} /> Local Area</p>
            <div className="facility-services">
              <span>Consultation</span>
              <span>Vaccination</span>
              <span>Health Checkup</span>
            </div>
            <button className="fac-btn">
              View Details <MdArrowForward size={15} />
            </button>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Facilities;
