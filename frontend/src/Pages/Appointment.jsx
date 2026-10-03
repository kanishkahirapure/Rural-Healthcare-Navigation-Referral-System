import "./Appointment.css";
import {
  MdCalendarMonth, MdCheckCircle, MdHourglassTop, MdLocalHospital,
  MdAdd, MdAccessTime, MdPerson, MdVisibility, MdEventAvailable,
  MdDescription, MdPhone
} from "react-icons/md";

function Appointment() {
  return (
    <div className="appointment-page">

      <header className="appointment-header">
        <div>
          <div className="appt-badge">
            <MdCalendarMonth size={14} />
            <span>Appointment Management</span>
          </div>
          <h1>My Appointments</h1>
          <p>View and manage your upcoming healthcare appointments.</p>
        </div>
        <button className="book-appointment-btn">
          <MdAdd size={18} /> Book Appointment
        </button>
      </header>

      {/* Summary */}
      <section className="appointment-summary">

        <div className="appointment-summary-card">
          <div className="appt-icon-wrap blue-bg">
            <MdCalendarMonth size={24} color="#087ea4" />
          </div>
          <div>
            <h3>2</h3>
            <p>Upcoming</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appt-icon-wrap green-bg">
            <MdCheckCircle size={24} color="#059669" />
          </div>
          <div>
            <h3>5</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appt-icon-wrap orange-bg">
            <MdHourglassTop size={24} color="#d97706" />
          </div>
          <div>
            <h3>1</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appt-icon-wrap purple-bg">
            <MdLocalHospital size={24} color="#7c3aed" />
          </div>
          <div>
            <h3>3</h3>
            <p>Healthcare Centres</p>
          </div>
        </div>

      </section>

      {/* Appointment List */}
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
            <p><MdLocalHospital size={13} /> RuralCare General Hospital</p>
            <p><MdPerson size={13} /> Dr. General Physician</p>
            <p><MdAccessTime size={13} /> 10:30 AM</p>
          </div>
          <span className="appointment-status upcoming">Upcoming</span>
          <button className="appointment-view-btn">
            <MdVisibility size={14} /> View Details
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
            <p><MdLocalHospital size={13} /> Community Health Centre</p>
            <p><MdPerson size={13} /> Diagnostic Specialist</p>
            <p><MdAccessTime size={13} /> 02:00 PM</p>
          </div>
          <span className="appointment-status pending">Pending</span>
          <button className="appointment-view-btn">
            <MdVisibility size={14} /> View Details
          </button>
        </div>

      </section>

      {/* Guidelines */}
      <section className="appointment-info">
        <h2>Appointment Guidelines</h2>
        <div className="guideline-grid">

          <div className="guideline-card">
            <div className="guide-icon orange-bg">
              <MdAccessTime size={22} color="#d97706" />
            </div>
            <div>
              <h3>Arrive Early</h3>
              <p>Please arrive at least 15 minutes before your appointment.</p>
            </div>
          </div>

          <div className="guideline-card">
            <div className="guide-icon blue-bg">
              <MdDescription size={22} color="#087ea4" />
            </div>
            <div>
              <h3>Carry Documents</h3>
              <p>Keep your previous medical reports and identification documents.</p>
            </div>
          </div>

          <div className="guideline-card">
            <div className="guide-icon green-bg">
              <MdPhone size={22} color="#059669" />
            </div>
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
