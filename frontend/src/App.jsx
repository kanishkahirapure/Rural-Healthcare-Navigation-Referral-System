import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Facilities from "./Pages/Facilities";
import AIRecommendation from "./Pages/AIRecommendation";
import Referral from "./Pages/Referral";
import Appointment from "./Pages/Appointment";

function Home() {
  return (
    <div className="app">

      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <div className="logo-icon">✚</div>
          <div>
            <h2>RuralCare</h2>
            <span>Healthcare Navigation</span>
          </div>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-buttons">
          <Link to="/login" className="login-btn"> 
          Login
          </Link>
          <button className="register-btn">Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">

          <div className="badge">
            <span>●</span> AI-Assisted Healthcare Navigation
          </div>

          <h1>
            Right Healthcare.
            <br />
            <span>Closer to You.</span>
          </h1>

          <p>
            Find suitable healthcare facilities, discover available services,
            and manage referrals through one simple digital platform.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Find Healthcare Facility →
            </button>

            <button className="secondary-btn">
              ✨ AI Recommendation
            </button>
          </div>

          <div className="trust-info">
            <div className="trust-item">
              <strong>24/7</strong>
              <span>Information Access</span>
            </div>

            <div className="divider"></div>

            <div className="trust-item">
              <strong>AI</strong>
              <span>Assisted Recommendations</span>
            </div>

            <div className="divider"></div>

            <div className="trust-item">
              <strong>Digital</strong>
              <span>Referral Tracking</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual">

          <div className="main-card">
            <div className="card-top">
              <div className="medical-icon">🏥</div>

              <div>
                <h3>Healthcare Finder</h3>
                <p>Find suitable facilities near you</p>
              </div>

              <span className="online-dot"></span>
            </div>

            <div className="search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search healthcare service..."
              />
            </div>

            <div className="location-box">
              <span>📍</span>
              <div>
                <small>Your Location</small>
                <strong>Rural / Local Area</strong>
              </div>
            </div>

            <div className="facility-card">
              <div className="facility-icon">🏥</div>

              <div className="facility-info">
                <h4>Healthcare Facility</h4>
                <p>Specialist • Diagnostics • Emergency</p>
              </div>

              <span className="available">Available</span>
            </div>

            <button className="view-btn">
              View Suitable Facilities
            </button>
          </div>

          <div className="floating-ai">
            <div className="ai-icon">✨</div>
            <div>
              <strong>AI Assistance</strong>
              <p>Smart facility recommendation</p>
            </div>
          </div>

          <div className="floating-referral">
            <span>✓</span>
            <div>
              <strong>Referral Tracked</strong>
              <p>Status updated successfully</p>
            </div>
          </div>

        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div>
          <span className="section-label">QUICK SEARCH</span>
          <h2>What healthcare service do you need?</h2>
          <p>
            Search for healthcare facilities and services based on your
            requirements.
          </p>
        </div>

        <div className="quick-search">
          <div className="input-group">
            <span>🔍</span>
            <input placeholder="Service, specialist or facility..." />
          </div>

          <div className="input-group location-input">
            <span>📍</span>
            <input placeholder="Enter location" />
          </div>

          <button className="search-btn">Search</button>
        </div>
      </section>

      {/* Services */}
      <section className="services-section" id="services">
        <div className="section-heading">
          <span className="section-label">OUR SERVICES</span>
          <h2>Healthcare made easier</h2>
          <p>
            One platform for healthcare navigation, recommendations and
            referral coordination.
          </p>
        </div>

        <div className="service-grid">

          <div className="service-card">
            <div className="service-icon blue">🏥</div>
            <h3>Find Healthcare Facilities</h3>
            <p>
              Search facilities based on location, healthcare services and
              availability.
            </p>
            <a href="#home">Explore Facilities →</a>
          </div>

          <div className="service-card featured">
            <div className="service-icon teal">✨</div>
            <h3>AI Recommendation</h3>
            <p>
              Get AI-assisted facility recommendations based on healthcare
              requirements and configured facility information.
            </p>
            <a href="#home">Get Recommendation →</a>
          </div>

          <div className="service-card">
            <div className="service-icon purple">📋</div>
            <h3>Digital Referral</h3>
            <p>
              Create digital referrals and track the referral status between
              healthcare facilities.
            </p>
            <a href="#home">Manage Referral →</a>
          </div>

          <div className="service-card">
            <div className="service-icon orange">📅</div>
            <h3>Appointment Management</h3>
            <p>
              Manage healthcare appointments and keep important information
              organized.
            </p>
            <a href="#home">Book Appointment →</a>
          </div>

        </div>
      </section>

      {/* AI Section */}
      <section className="ai-section">
        <div className="ai-content">
          <div className="ai-badge">✨ AI-ASSISTED HEALTHCARE</div>

          <h2>
            Smarter navigation for
            <span> better healthcare access.</span>
          </h2>

          <p>
            Enter your healthcare requirement and receive assistance in
            identifying potentially suitable healthcare facilities based on
            available services and configured referral criteria.
          </p>

          <button className="white-btn">
            Try AI Recommendation →
          </button>
        </div>

        <div className="ai-panel">
          <div className="ai-panel-header">
            <span>✨</span>
            <div>
              <strong>AI Healthcare Assistant</strong>
              <small>Recommendation assistance</small>
            </div>
            <span className="status">●</span>
          </div>

          <div className="chat-message user-message">
            I need a cardiology service.
          </div>

          <div className="chat-message ai-message">
            <span>✨</span>
            Based on the available healthcare information, suitable facilities
            can be identified for further consideration.
          </div>

          <div className="recommendation">
            <small>RECOMMENDED FACILITY TYPE</small>
            <strong>Cardiology Healthcare Facility</strong>
            <span>Based on service availability</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="workflow-section" id="how-it-works">
        <div className="section-heading">
          <span className="section-label">HOW IT WORKS</span>
          <h2>Simple healthcare navigation</h2>
          <p>
            A structured digital workflow connecting users and healthcare
            facilities.
          </p>
        </div>

        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>
            <h3>Enter Requirement</h3>
            <p>
              Provide your healthcare service or facility requirement.
            </p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Find Suitable Facility</h3>
            <p>
              Search available facilities and receive AI-assisted
              recommendations.
            </p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Create Referral</h3>
            <p>
              Authorized healthcare workers can create and manage digital
              referrals.
            </p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div className="step-number">04</div>
            <h3>Track Status</h3>
            <p>
              Monitor referral progress from creation to completion.
            </p>
          </div>

        </div>
      </section>

      {/* About */}
      <section className="about-section" id="about">
        <div className="about-card">
          <div className="about-icon">❤️</div>

          <div>
            <span className="section-label">ABOUT RURALCARE</span>

            <h2>
              Connecting people with
              <span> appropriate healthcare information.</span>
            </h2>

            <p>
              RuralCare is designed to support rural patients, healthcare
              workers, healthcare facilities and administrators through a
              centralized digital platform for healthcare navigation and
              referral management.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="disclaimer">
        <span>ⓘ</span>
        <p>
          AI recommendations are intended as assistance based on available
          system information and do not replace professional medical diagnosis
          or clinical judgment.
        </p>
      </section>

      {/* Footer */}
      <footer id="contact">
        <div className="footer-main">

          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">✚</div>
              <div>
                <h2>RuralCare</h2>
                <span>Healthcare Navigation</span>
              </div>
            </div>

            <p>
              AI-assisted rural healthcare navigation and digital referral
              management platform.
            </p>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>
            <a href="#services">Healthcare Facilities</a>
            <a href="#services">AI Recommendation</a>
            <a href="#services">Digital Referral</a>
            <a href="#services">Appointments</a>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-column">
            <h4>Project</h4>
            <p>MCA Final Year Project</p>
            <p>Session 2026–27</p>
            <p>Healthcare Technology</p>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 RuralCare. All rights reserved.</span>
          <span>AI-Based Rural Healthcare Navigation & Referral System</span>
        </div>
      </footer>

    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/facilities" element={<Facilities />} />
      <Route path="/ai-recommendation" element={<AIRecommendation />} />
      <Route path="/referrals" element={<Referral />} />
      <Route path="/appointments" element={<Appointment />} />
    </Routes>
  );
}

export default App;