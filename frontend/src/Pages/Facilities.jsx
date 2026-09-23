import "./Facilities.css";

function Facilities() {
  return (
    <div className="facilities-page">

      {/* Header */}
      <header className="facilities-header">
        <div>
          <h1>Healthcare Facilities</h1>
          <p>Find suitable hospitals, clinics and healthcare centres near you.</p>
        </div>

        <div className="facility-location">
          📍 <span>Rural / Local Area</span>
        </div>
      </header>

      {/* Search */}
      <div className="facility-search">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search hospital, clinic or healthcare service..."
        />
        <button>Search</button>
      </div>

      {/* Filters */}
      <div className="facility-filters">
        <button className="active-filter">All</button>
        <button>Hospital</button>
        <button>Clinic</button>
        <button>Diagnostic Centre</button>
        <button>Emergency</button>
      </div>

      {/* Facilities */}
      <section className="facility-grid">

        <div className="facility-card">
          <div className="facility-icon">🏥</div>

          <div className="facility-info">
            <span className="available">Available</span>
            <h2>RuralCare General Hospital</h2>
            <p>🏥 General Hospital</p>
            <p>📍 Rural / Local Area</p>

            <div className="facility-services">
              <span>Emergency</span>
              <span>General Medicine</span>
              <span>Diagnostics</span>
            </div>

            <button>View Details →</button>
          </div>
        </div>

        <div className="facility-card">
          <div className="facility-icon">🏨</div>

          <div className="facility-info">
            <span className="available">Available</span>
            <h2>Community Health Centre</h2>
            <p>🏥 Community Healthcare</p>
            <p>📍 Nearby Rural Area</p>

            <div className="facility-services">
              <span>OPD</span>
              <span>Primary Care</span>
              <span>Pharmacy</span>
            </div>

            <button>View Details →</button>
          </div>
        </div>

        <div className="facility-card">
          <div className="facility-icon">🩺</div>

          <div className="facility-info">
            <span className="available">Available</span>
            <h2>Primary Health Clinic</h2>
            <p>🩺 Primary Healthcare</p>
            <p>📍 Local Area</p>

            <div className="facility-services">
              <span>Consultation</span>
              <span>Vaccination</span>
              <span>Health Checkup</span>
            </div>

            <button>View Details →</button>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Facilities;