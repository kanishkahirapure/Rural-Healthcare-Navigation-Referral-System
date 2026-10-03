import { Link, useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";
import {
  MdEmail, MdPhone, MdLocationOn, MdLocalHospital,
  MdAutoAwesome, MdCalendarMonth, MdMedicalServices,
  MdLink, MdSchool, MdBadge, MdSecurity
} from "react-icons/md";
import "../App.css";

export default function Footer() {
  const navigate = useNavigate();

  return (
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
          <h4><MdLocalHospital size={15} color="#79b8c9" /> Platform</h4>
          <Link to="/facilities">Healthcare Facilities</Link>
          <Link to="/ai-recommendation">AI Recommendation</Link>
          <Link to="/referrals">Digital Referral</Link>
          <Link to="/appointments">Appointments</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4><MdLink size={15} color="#79b8c9" /> Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/#services">Services</Link>
          <Link to="/#how-it-works">How It Works</Link>
          <Link to="/#about">About</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* Project Info */}
        <div className="footer-col">
          <h4><MdSchool size={15} color="#79b8c9" /> Project Info</h4>
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
  );
}
