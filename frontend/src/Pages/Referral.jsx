import "./Referral.css";

function Referral() {
  return (
    <div className="referral-page">

      {/* Header */}
      <header className="referral-header">
        <div>
          <span className="referral-badge">📋 Referral Tracking</span>
          <h1>My Referrals</h1>
          <p>Track your healthcare referrals and their current status.</p>
        </div>

        <button className="new-referral-btn">
          + New Referral
        </button>
      </header>

      {/* Summary Cards */}
      <section className="referral-summary">

        <div className="summary-card">
          <span className="summary-icon">📋</span>
          <div>
            <h3>3</h3>
            <p>Total Referrals</p>
          </div>
        </div>

        <div className="summary-card">
          <span className="summary-icon">⏳</span>
          <div>
            <h3>1</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="summary-card">
          <span className="summary-icon">🔄</span>
          <div>
            <h3>1</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="summary-card">
          <span className="summary-icon">✓</span>
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
          <div className="referral-number">01</div>

          <div className="referral-details">
            <h3>General Medicine Consultation</h3>
            <p>🏥 RuralCare General Hospital</p>
            <p>📅 23 September 2026</p>
          </div>

          <span className="status pending">Pending</span>

          <button>View Details</button>
        </div>

        {/* Referral 2 */}
        <div className="referral-item">
          <div className="referral-number">02</div>

          <div className="referral-details">
            <h3>Diagnostic Consultation</h3>
            <p>🏥 Community Health Centre</p>
            <p>📅 20 September 2026</p>
          </div>

          <span className="status progress">In Progress</span>

          <button>View Details</button>
        </div>

        {/* Referral 3 */}
        <div className="referral-item">
          <div className="referral-number">03</div>

          <div className="referral-details">
            <h3>Primary Health Checkup</h3>
            <p>🏥 Primary Health Clinic</p>
            <p>📅 15 September 2026</p>
          </div>

          <span className="status completed">Completed</span>

          <button>View Details</button>
        </div>

      </section>

      {/* Referral Process */}
      <section className="referral-process">

        <h2>Referral Process</h2>

        <div className="process-steps">

          <div className="process-step active">
            <span>1</span>
            <h3>Referral Created</h3>
            <p>Healthcare referral is submitted.</p>
          </div>

          <div className="process-line"></div>

          <div className="process-step active">
            <span>2</span>
            <h3>Under Review</h3>
            <p>Healthcare worker reviews the referral.</p>
          </div>

          <div className="process-line"></div>

          <div className="process-step">
            <span>3</span>
            <h3>Appointment</h3>
            <p>Patient receives appointment details.</p>
          </div>

          <div className="process-line"></div>

          <div className="process-step">
            <span>4</span>
            <h3>Completed</h3>
            <p>Referral process is completed.</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Referral;