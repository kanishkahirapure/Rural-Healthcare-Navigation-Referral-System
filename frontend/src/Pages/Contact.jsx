import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdEmail, MdPhone, MdLocationOn, MdSend, MdCheckCircle,
  MdPerson, MdSubject, MdMessage, MdAccessTime
} from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";
import Footer from "../components/Footer";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">

      {/* Navbar */}
      <header className="navbar">
        <Link to="/" className="logo">
          <div className="logo-icon">✚</div>
          <div>
            <h2>RuralCare</h2>
            <span>Healthcare Navigation</span>
          </div>
        </Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/#services">Services</Link>
          <Link to="/#how-it-works">How It Works</Link>
          <Link to="/#about">About</Link>
          <Link to="/contact" className="nav-active">Contact</Link>
        </nav>
        <div className="nav-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="register-btn">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="contact-hero">
        <div className="hero-badge">
          <FaHeartbeat size={14} />
          <span>RURALCARE SUPPORT</span>
        </div>
        <h1>We're Here to <span>Help You</span></h1>
        <p>Have questions about our platform? Reach out and our team will get back to you shortly.</p>
      </div>

      <div className="contact-body">

        {/* Left — Info */}
        <div className="contact-left">
          <div className="info-header">
            <h3>Contact Information</h3>
            <p>Reach us through any of the channels below.</p>
          </div>

          <div className="info-card">
            <div className="info-icon-wrap email-bg">
              <MdEmail size={22} />
            </div>
            <div>
              <h4>Email Us</h4>
              <p>support@ruralcare.in</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon-wrap phone-bg">
              <MdPhone size={22} />
            </div>
            <div>
              <h4>Call Us</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon-wrap loc-bg">
              <MdLocationOn size={22} />
            </div>
            <div>
              <h4>Location</h4>
              <p>India — Rural Healthcare Initiative</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon-wrap time-bg">
              <MdAccessTime size={22} />
            </div>
            <div>
              <h4>Support Hours</h4>
              <p>Mon – Sat, 9:00 AM – 6:00 PM</p>
            </div>
          </div>

          <div className="info-decoration">
            <div className="deco-circle c1"></div>
            <div className="deco-circle c2"></div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="contact-right">
          {submitted ? (
            <div className="success-msg">
              <div className="success-icon">
                <MdCheckCircle size={56} color="#087ea4" />
              </div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send a Message</h3>
              <p className="form-subtitle">Fill out the form and we'll respond promptly.</p>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <MdPerson size={18} className="input-icon" />
                    <input required placeholder="Your full name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrap">
                    <MdEmail size={18} className="input-icon" />
                    <input required type="email" placeholder="your@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <div className="input-wrap">
                  <MdSubject size={18} className="input-icon" />
                  <input required placeholder="How can we help?" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <div className="input-wrap textarea-wrap">
                  <MdMessage size={18} className="input-icon textarea-icon" />
                  <textarea required rows={5} placeholder="Write your message here..." value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                <MdSend size={16} />
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}
