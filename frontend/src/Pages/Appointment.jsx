import "./Appointment.css";

function Appointment() {
  return (
    <div className="appointment-page">

      <header className="appointment-header">
        <div>
          <span className="appointment-badge">📅 Appointment Management</span>
          <h1>My Appointments</h1>
          <p>View and manage your upcoming healthcare appointments.</p>
        </div>

        <button className="book-appointment-btn">
          + Book Appointment
        </button>
      </header>

      {/* Appointment Summary */}
      <section className="appointment-summary">

        <div className="appointment-summary-card">
          <span className="appointment-icon">📅</span>
          <div>
            <h3>2</h3>
            <p>Upcoming</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <span className="appointment-icon">✓</span>
          <div>
            <h3>5</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <span className="appointment-icon">⏳</span>
          <div>
            <h3>1</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <span className="appointment-icon">🏥</span>
          <div>
            <h3>3</h3>
            <p>Healthcare Centres</p>
          </div>
        </div>

      </section>

      {/* Upcoming Appointments */}
      <section className="appointment-list-card">

        <div className="appointment-section-heading">
          <div>
            <h2>Upcoming Appointments</h2>
            <p>Your scheduled healthcare appointments</p>
          </div>

          <select>
            <option>All Appointments</option>
            <option>Upcoming</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        {/* Appointment 1 */}
        <div className="appointment-item">

          <div className="appointment-date">
            <span>SEP</span>
            <strong>25</strong>
            <small>2026</small>
          </div>

          <div className="appointment-details">
            <h3>General Medicine Consultation</h3>
            <p>🏥 RuralCare General Hospital</p>
            <p>👨‍⚕️ Dr. General Physician</p>
            <p>🕐 10:30 AM</p>
          </div>

          <span className="appointment-status upcoming">
            Upcoming
          </span>

          <button className="appointment-view-btn">
            View Details
          </button>

        </div>

        {/* Appointment 2 */}
        <div className="appointment-item">

          <div className="appointment-date">
            <span>SEP</span>
            <strong>28</strong>
            <small>2026</small>
          </div>

          <div className="appointment-details">
            <h3>Diagnostic Consultation</h3>
            <p>🏥 Community Health Centre</p>
            <p>👨‍⚕️ Diagnostic Specialist</p>
            <p>🕐 02:00 PM</p>
          </div>

          <span className="appointment-status pending">
            Pending
          </span>

          <button className="appointment-view-btn">
            View Details
          </button>

        </div>

      </section>

      {/* Appointment Information */}
      <section className="appointment-info">

        <h2>Appointment Guidelines</h2>

        <div className="guideline-grid">

          <div className="guideline-card">
            <span>⏰</span>
            <div>
              <h3>Arrive Early</h3>
              <p>Please arrive at least 15 minutes before your appointment.</p>
            </div>
          </div>

          <div className="guideline-card">
            <span>📋</span>
            <div>
              <h3>Carry Documents</h3>
              <p>Keep your previous medical reports and identification documents.</p>
            </div>
          </div>

          <div className="guideline-card">
            <span>📞</span>
            <div>
              <h3>Need Help?</h3>
              <p>Contact the healthcare centre if you need to reschedule.</p>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Appointment;