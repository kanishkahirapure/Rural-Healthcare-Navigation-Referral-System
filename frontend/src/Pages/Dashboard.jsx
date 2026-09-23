import "./Dashboard.css";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <span>✚</span> RuralCare
        </div>

        <nav>
          <a href="#">🏠 Dashboard</a>
          <a href="#">🏥 Healthcare Facilities</a>
          <a href="#">🤖 AI Recommendation</a>
          <a href="#">📋 My Referrals</a>
          <a href="#">📅 Appointments</a>
          <a href="#">👤 Profile</a>
        </nav>

        <button className="logout-btn">↪ Logout</button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1>Welcome to RuralCare 👋</h1>
            <p>Access healthcare services and manage your health easily.</p>
          </div>

          <div className="user-profile">
            <div className="user-avatar">U</div>
            <div>
              <strong>User</strong>
              <small>Patient</small>
            </div>
          </div>
        </div>

        {/* Cards */}
        <section className="dashboard-cards">

          <div className="dashboard-card">
            <div className="card-icon">🏥</div>
            <h3>Healthcare Facilities</h3>
            <p>Find nearby hospitals, clinics and healthcare centres.</p>
            <Link to="/facilities" className="dashboard-card-button">
              Find Facilities →
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🤖</div>
            <h3>AI Recommendation</h3>
            <p>Get AI-based healthcare guidance and recommendations.</p>
            <Link to="/ai-recommendation" className="dashboard-card-button">
              Get Recommendation →
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>My Referrals</h3>
            <p>Track your healthcare referrals and referral status.</p>
            <Link to="/referrals" className="dashboard-card-button">
              View Referrals →
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Appointments</h3>
            <p>View and manage your upcoming healthcare appointments.</p>
            <Link to="/appointments" className="dashboard-card-button">
            View Appointments →
            </Link>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="quick-section">
          <h2>Quick Actions</h2>

          <div className="quick-actions">
            <button>🔍 Find Hospital</button>
            <button>🤖 Ask AI Assistant</button>
            <button>📅 Book Appointment</button>
            <button>📋 Track Referral</button>
          </div>
        </section>

        {/* Health Notice */}
        <section className="health-notice">
          <div>
            <h2>Need Healthcare Assistance?</h2>
            <p>
              RuralCare helps you find suitable healthcare facilities,
              recommendations and referral services.
            </p>
          </div>

          <button>Get Started →</button>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;