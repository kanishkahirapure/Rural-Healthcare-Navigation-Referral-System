import "./Referral.css";
import {
  MdAssignment, MdHourglassTop, MdSync, MdCheckCircle,
  MdAdd, MdLocalHospital, MdCalendarMonth, MdVisibility,
  MdPlayCircle, MdRadioButtonUnchecked
} from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";

function Referral() {
  return (
    <div className="referral-page">

      {/* Header */}
      <header className="referral-header">
        <div>
          <div className="referral-badge">
            <MdAssignment size={14} />
            <span>Referral Tracking</span>
          </div>
          <h1>My Referrals</h1>
          <p>Track your healthcare referrals and their current status.</p>
        </div>
        <button className="new-referral-btn">
          <MdAdd size={18} /> New Referral
        </button>
      </header>

      {/* Summary Cards */}
      <section className="referral-summary">

        <div className="summary-card">
          <div className="sum-icon blue-bg">
            <MdAssignment size={24} color="#087ea4" />
          </div>
          <div>
            <h3>3</h3>
            <p>Total Referrals</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="sum-icon orange-bg">
            <MdHourglassTop size={24} color="#d97706" />
          </div>
          <div>
            <h3>1</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="sum-icon purple-bg">
            <MdSync size={24} color="#7c3aed" />
          </div>
          <div>
            <h3>1</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="sum-icon green-bg">
            <MdCheckCircle size={24} color="#059669" />
          </div>
          <div>
            <h3>1</h3>
            <p>Completed</p>
          </div>
        </div>

      </section>

      {/* Referral List */}
      <section className="referral-list-card">

        <div className="section-heading">
          <div>
            <h2>Referral History</h2>
            <p>Your recent healthcare referrals</p>
          </div>
          <select>
            <option>All Referrals</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Referral 1 */}
        <div className="referral-item">
          <div className="ref-num-badge">01</div>
          <div className="referral-details">
            <h3>General Medicine Consultation</h3>
            <p><MdLocalHospital size={13} /> RuralCare General Hospital</p>
            <p><MdCalendarMonth size={13} /> 23 September 2026</p>
          </div>
          <span className="ref-status pending">Pending</span>
          <button className="ref-view-btn">
            <MdVisibility size={14} /> View Details
          </button>
        </div>

        {/* Referral 2 */}
        <div className="referral-item">
          <div className="ref-num-badge">02</div>
          <div className="referral-details">
            <h3>Diagnostic Consultation</h3>
            <p><MdLocalHospital size={13} /> Community Health Centre</p>
            <p><MdCalendarMonth size={13} /> 20 September 2026</p>
          </div>
          <span className="ref-status progress">In Progress</span>
          <button className="ref-view-btn">
            <MdVisibility size={14} /> View Details
          </button>
        </div>

        {/* Referral 3 */}
        <div className="referral-item">
          <div className="ref-num-badge">03</div>
          <div className="referral-details">
            <h3>Primary Health Checkup</h3>
            <p><MdLocalHospital size={13} /> Primary Health Clinic</p>
            <p><MdCalendarMonth size={13} /> 15 September 2026</p>
          </div>
          <span className="ref-status completed">Completed</span>
          <button className="ref-view-btn">
            <MdVisibility size={14} /> View Details
          </button>
        </div>

      </section>

      {/* Process */}
      <section className="referral-process">
        <h2>Referral Process</h2>
        <div className="process-steps">

          <div className="process-step active">
            <div className="step-circle active-circle">
              <MdAssignment size={18} />
            </div>
            <h3>Referral Created</h3>
            <p>Healthcare referral is submitted.</p>
          </div>

          <div className="process-line active-line"></div>

          <div className="process-step active">
            <div className="step-circle active-circle">
              <MdSync size={18} />
            </div>
            <h3>Under Review</h3>
            <p>Healthcare worker reviews the referral.</p>
          </div>

          <div className="process-line"></div>

          <div className="process-step">
            <div className="step-circle">
              <MdPlayCircle size={18} />
            </div>
            <h3>Appointment</h3>
            <p>Patient receives appointment details.</p>
          </div>

          <div className="process-line"></div>

          <div className="process-step">
            <div className="step-circle">
              <MdRadioButtonUnchecked size={18} />
            </div>
            <h3>Completed</h3>
            <p>Referral process is completed.</p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Referral;
