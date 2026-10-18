import "./Register.css";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { register } from "../api/auth";
import { getErrorMessage } from "../api/client";
import FormMessage from "../components/FormMessage";
import {
  MdPerson, MdPhone, MdEmail, MdLock, MdCheckCircle,
  MdBadge, MdArrowForward, MdSecurity
} from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // A logged-in user does not need the sign-up page.
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // Returns a small handler that updates one field of the form.
  const update = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  // Returns an error text, or "" when everything is fine.
  function validate() {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!/^[0-9]{10}$/.test(form.phone.trim())) return "Mobile number must be exactly 10 digits.";
    if (!EMAIL_PATTERN.test(form.email.trim())) return "Please enter a valid email address.";
    if (!form.role) return "Please select your role.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (!form.terms) return "Please accept the terms and conditions.";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        role: form.role, // PATIENT or HEALTH_WORKER
      });
      // Go to the login page and show "Account created".
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className="register-page">

      {/* Left Section */}
      <div className="register-left">
        <div className="register-brand">
          <div className="register-logo">
            <FaHeartbeat size={24} color="#087f8c" />
          </div>
          <div>
            <h2>RuralCare</h2>
            <span>Healthcare Navigation</span>
          </div>
        </div>

        <div className="register-left-content">
          <div className="register-badge">
            ✨ AI-Assisted Healthcare Platform
          </div>

          <h1>
            Better healthcare
            <br />
            <span>starts with access.</span>
          </h1>

          <p>
            Create your RuralCare account and access healthcare facilities,
            AI-assisted recommendations, appointments and digital referrals.
          </p>

          <div className="register-features">
            <div>
              <div className="reg-check"><MdCheckCircle size={16} color="#a8f0e7" /></div>
              <p>Find suitable healthcare facilities</p>
            </div>
            <div>
              <div className="reg-check"><MdCheckCircle size={16} color="#a8f0e7" /></div>
              <p>Get AI-assisted recommendations</p>
            </div>
            <div>
              <div className="reg-check"><MdCheckCircle size={16} color="#a8f0e7" /></div>
              <p>Manage appointments and referrals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="register-right">
        <div className="register-card">

          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join RuralCare to access healthcare services.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <div className="reg-input-wrap">
                  <MdPerson size={17} className="reg-icon" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={update("name")}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <div className="reg-input-wrap">
                  <MdPhone size={17} className="reg-icon" />
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    value={form.phone}
                    onChange={update("phone")}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="reg-input-wrap">
                <MdEmail size={17} className="reg-icon" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={update("email")}
                />
              </div>
            </div>

            <div className="form-group">
              <label>User Role</label>
              <div className="reg-input-wrap">
                <MdBadge size={17} className="reg-icon" />
                <select name="role" value={form.role} onChange={update("role")}>
                  <option value="" disabled>Select your role</option>
                  <option value="PATIENT">Patient / User</option>
                  <option value="HEALTH_WORKER">Healthcare Worker</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="reg-input-wrap">
                  <MdLock size={17} className="reg-icon" />
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Create password"
                    value={form.password}
                    onChange={update("password")}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="reg-input-wrap">
                  <MdLock size={17} className="reg-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={update("confirmPassword")}
                  />
                </div>
              </div>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" checked={form.terms} onChange={update("terms")} />
              <label htmlFor="terms">
                I agree to the terms and conditions.
              </label>
            </div>

            <FormMessage>{error}</FormMessage>

            <button
              type="submit"
              className="create-account-btn"
              disabled={loading}
              style={loading ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
            >
              {loading ? "Creating account..." : "Create Account"} <MdArrowForward size={18} />
            </button>

          </form>

          <div className="login-link">
            Already have an account?
            <Link to="/login"> Sign in</Link>
          </div>

          <div className="secure-register">
            <MdSecurity size={14} color="#059669" />
            Your information is securely handled
          </div>

        </div>
      </div>

    </div>
  );
}

export default Register;
