import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Facilities from "./Pages/Facilities";
import AIRecommendation from "./Pages/AIRecommendation";
import Referral from "./Pages/Referral";
import Appointment from "./Pages/Appointment";
import Profile from "./Pages/Profile";
import Contact from "./Pages/Contact";
import heroImg from "./assets/hero.jpg";
import { FaHeartbeat, FaRobot, FaHospital, FaCheckCircle } from "react-icons/fa";
import {
  MdEmail, MdPhone, MdLocationOn, MdLocalHospital,
  MdAutoAwesome, MdCalendarMonth, MdMedicalServices,
  MdLink, MdSchool, MdBadge, MdSecurity,
  MdSearch, MdAssignment, MdVerified, MdAccessTime,
  MdArrowForward
} from "react-icons/md";

function Home() {
  const navigate = useNavigate();
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
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="nav-buttons">
          <Link to="/login" className="login-btn"> 
          Login
          </Link>
          <button className="register-btn" onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">

          <div className="badge">
            <FaHeartbeat size={13} color="#087e87" />
            AI-Assisted Healthcare Navigation
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
            <button className="primary-btn" onClick={() => navigate("/facilities")}>
              Find Healthcare Facility <MdArrowForward size={17} />
            </button>
            <button className="secondary-btn" onClick={() => navigate("/ai-recommendation")}>
              <MdAutoAwesome size={16} color="#087ea4" /> AI Recommendation
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

        {/* Hero Image */}
        <div className="hero-visual">
          <div className="hero-img-wrap">
            <img src={heroImg} alt="Healthcare" className="hero-img" />

            {/* Floating cards over image */}
            <div className="floating-ai">
              <div className="float-icon-wrap teal-bg">
                <FaRobot size={18} color="#087ea4" />
              </div>
              <div>
                <strong>AI Assistance</strong>
                <p>Smart facility recommendation</p>
              </div>
            </div>

            <div className="floating-referral">
              <div className="float-icon-wrap green-bg">
                <FaCheckCircle size={18} color="#059669" />
              </div>
              <div>
                <strong>Referral Tracked</strong>
                <p>Status updated successfully</p>
              </div>
            </div>

            <div className="floating-stats">
              <div className="float-icon-wrap blue-bg">
                <FaHospital size={18} color="#7c3aed" />
              </div>
              <div>
                <strong>50+ Facilities</strong>
                <p>Available near you</p>
              </div>
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
            <div className="service-icon blue"><MdLocalHospital size={24} color="#087ea4" /></div>
            <h3>Find Healthcare Facilities</h3>
            <p>Search facilities based on location, healthcare services and availability.</p>
            <Link to="/facilities">Explore Facilities →</Link>
          </div>

          <div className="service-card featured">
            <div className="service-icon teal"><MdAutoAwesome size={24} color="#079b91" /></div>
            <h3>AI Recommendation</h3>
            <p>Get AI-assisted facility recommendations based on healthcare requirements and configured facility information.</p>
            <Link to="/ai-recommendation">Get Recommendation →</Link>
          </div>

          <div className="service-card">
            <div className="service-icon purple"><MdAssignment size={24} color="#7c3aed" /></div>
            <h3>Digital Referral</h3>
            <p>Create digital referrals and track the referral status between healthcare facilities.</p>
            <Link to="/referrals">Manage Referral →</Link>
          </div>

          <div className="service-card">
            <div className="service-icon orange"><MdCalendarMonth size={24} color="#d97706" /></div>
            <h3>Appointment Management</h3>
            <p>Manage healthcare appointments and keep important information organized.</p>
            <Link to="/appointments">Book Appointment →</Link>
          </div>

        </div>
      </section>

      {/* AI Section */}
      <section className="ai-section">
        <div className="ai-content">
          <div className="ai-badge"><MdAutoAwesome size={13} /> AI-ASSISTED HEALTHCARE</div>

          <h2>
            Smarter navigation for
            <span> better healthcare access.</span>
          </h2>

          <p>
            Enter your healthcare requirement and receive assistance in
            identifying potentially suitable healthcare facilities based on
            available services and configured referral criteria.
          </p>

          <button className="white-btn" onClick={() => navigate("/ai-recommendation")}>
            Try AI Recommendation →
          </button>
        </div>

        <div className="ai-panel">
          <div className="ai-panel-header">
            <div className="ai-panel-icon-wrap">
              <MdAutoAwesome size={18} color="#087ea4" />
            </div>
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
          <div className="about-icon">
            <FaHeartbeat size={28} color="#087ea4" />
          </div>

          <div className="about-body">
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

            <div className="about-stats">
              <div className="about-stat">
                <strong>24/7</strong>
                <span>Platform Access</span>
              </div>
              <div className="about-stat-divider"></div>
              <div className="about-stat">
                <strong>AI</strong>
                <span>Powered Recommendations</span>
              </div>
              <div className="about-stat-divider"></div>
              <div className="about-stat">
                <strong>Digital</strong>
                <span>Referral System</span>
              </div>
              <div className="about-stat-divider"></div>
              <div className="about-stat">
                <strong>Rural</strong>
                <span>Healthcare Focus</span>
              </div>
            </div>

            <div className="about-actions">
              <button className="about-primary-btn" onClick={() => navigate("/register")}>
                Get Started →
              </button>
              <button className="about-secondary-btn" onClick={() => navigate("/facilities")}>
                Explore Facilities
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="disclaimer">
        <MdMedicalServices size={16} color="#765f2e" />
        <p>
          AI recommendations are intended as assistance based on available
          system information and do not replace professional medical diagnosis
          or clinical judgment.
        </p>
      </section>

      {/* Footer */}
      <footer id="contact" className="site-footer">

        {/* Main Footer */}
        <div className="footer-inner">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <FaHeartbeat size={20} color="white" />
              </div>
              <div>
                <h2>RuralCare</h2>
                <span>Healthcare Navigation</span>
              </div>
            </div>
            <p>
              AI-assisted rural healthcare navigation and digital referral
              management platform built to serve rural communities.
            </p>
            <div className="footer-contact-items">
              <div className="footer-contact-item">
                <MdEmail size={15} color="#79b8c9" />
                <span>support@ruralcare.in</span>
              </div>
              <div className="footer-contact-item">
                <MdPhone size={15} color="#79b8c9" />
                <span>+91 98765 43210</span>
              </div>
              <div className="footer-contact-item">
                <MdLocationOn size={15} color="#79b8c9" />
                <span>India — Rural Healthcare Initiative</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="footer-col">
            <h4>
              <MdLocalHospital size={15} color="#79b8c9" /> Platform
            </h4>
            <Link to="/facilities">Healthcare Facilities</Link>
            <Link to="/ai-recommendation">AI Recommendation</Link>
            <Link to="/referrals">Digital Referral</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>
              <MdLink size={15} color="#79b8c9" /> Quick Links
            </h4>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
            <Link to="/contact">Contact Us</Link>
          </div>

          {/* Project Info */}
          <div className="footer-col">
            <h4>
              <MdSchool size={15} color="#79b8c9" /> Project Info
            </h4>
            <div className="footer-info-item">
              <MdBadge size={14} color="#79b8c9" />
              <span>MCA Final Year Project</span>
            </div>
            <div className="footer-info-item">
              <MdCalendarMonth size={14} color="#79b8c9" />
              <span>Session 2026–27</span>
            </div>
            <div className="footer-info-item">
              <MdMedicalServices size={14} color="#79b8c9" />
              <span>Healthcare Technology</span>
            </div>
            <div className="footer-info-item">
              <MdAutoAwesome size={14} color="#79b8c9" />
              <span>AI-Based Navigation System</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© 2026 RuralCare. All rights reserved.</span>
            <span className="footer-dot">•</span>
            <span>AI-Based Rural Healthcare Navigation &amp; Referral System</span>
          </div>
          <div className="footer-bottom-right">
            <MdSecurity size={14} color="#79b8c9" />
            <span>Secure &amp; Privacy Protected</span>
          </div>
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
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;