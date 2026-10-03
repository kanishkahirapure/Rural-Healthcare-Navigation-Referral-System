import "./Dashboard.css";
import { Link } from "react-router-dom";
import {
  MdHome, MdLocalHospital, MdAutoAwesome, MdAssignment,
  MdCalendarMonth, MdPerson, MdLogout, MdSearch, MdSmartToy,
  MdEventAvailable, MdTrackChanges, MdFavorite
} from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <FaHeartbeat size={22} />
          <span>RuralCare</span>
        </div>

        <nav>
          <Link to="/dashboard" className="nav-link active-link">
            <MdHome size={20} /> Dashboard
          </Link>
          <Link to="/facilities" className="nav-link">
            <MdLocalHospital size={20} /> Healthcare Facilities
          </Link>
          <Link to="/ai-recommendation" className="nav-link">
            <MdAutoAwesome size={20} /> AI Recommendation
          </Link>
          <Link to="/referrals" className="nav-link">
            <MdAssignment size={20} /> My Referrals
          </Link>
          <Link to="/appointments" className="nav-link">
            <MdCalendarMonth size={20} /> Appointments
          </Link>
          <Link to="/profile" className="nav-link">
            <MdPerson size={20} /> Profile
          </Link>
        </nav>

        <button className="logout-btn">
          <MdLogout size={18} /> Logout
        </button>
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
            <div className="card-icon blue-bg">
              <MdLocalHospital size={28} color="#087ea4" />
            </div>
            <h3>Healthcare Facilities</h3>
            <p>Find nearby hospitals, clinics and healthcare centres.</p>
            <Link to="/facilities" className="dashboard-card-button">
              Find Facilities →
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon purple-bg">
              <MdAutoAwesome size={28} color="#7c3aed" />
            </div>
            <h3>AI Recommendation</h3>
            <p>Get AI-based healthcare guidance and recommendations.</p>
            <Link to="/ai-recommendation" className="dashboard-card-button">
              Get Recommendation →
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon orange-bg">
              <MdAssignment size={28} color="#d97706" />
            </div>
            <h3>My Referrals</h3>
            <p>Track your healthcare referrals and referral status.</p>
            <Link to="/referrals" className="dashboard-card-button">
              View Referrals →
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon green-bg">
              <MdCalendarMonth size={28} color="#059669" />
            </div>
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
            <button className="quick-btn">
              <div className="quick-icon blue-bg"><MdSearch size={20} color="#087ea4" /></div>
              Find Hospital
            </button>
            <button className="quick-btn">
              <div className="quick-icon purple-bg"><MdSmartToy size={20} color="#7c3aed" /></div>
              Ask AI Assistant
            </button>
            <button className="quick-btn">
              <div className="quick-icon green-bg"><MdEventAvailable size={20} color="#059669" /></div>
              Book Appointment
            </button>
            <button className="quick-btn">
              <div className="quick-icon orange-bg"><MdTrackChanges size={20} color="#d97706" /></div>
              Track Referral
            </button>
          </div>
        </section>

        {/* Health Notice */}
        <section className="health-notice">
          <div className="notice-icon-wrap">
            <MdFavorite size={28} color="#087ea4" />
          </div>
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
