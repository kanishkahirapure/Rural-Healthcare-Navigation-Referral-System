import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRegister } from "../services/api";
import "./Register.css";
import {
  MdPerson, MdPhone, MdEmail, MdLock, MdBadge,
  MdArrowForward, MdVisibility, MdVisibilityOff, MdCheckCircle
} from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const { register: mockRegister } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "",
    password: "", confirm: "", language: "Hindi", terms: false,
  });
  const [showPw, setShowPw]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [apiErr, setApiErr]   = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const setF = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
    setApiErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                        e.name     = "Full name is required.";
    if (!form.email.trim())                       e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email    = "Enter a valid email.";
    if (!form.phone.trim())                       e.phone    = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phone))        e.phone    = "Enter a valid 10-digit number.";
    if (!form.role)                               e.role     = "Please select a role.";
    if (!form.password)                           e.password = "Password is required.";
    else if (form.password.length < 6)            e.password = "Min 6 characters.";
    if (form.password !== form.confirm)           e.confirm  = "Passwords do not match.";
    if (!form.terms)                              e.terms    = "You must accept the terms.";
    return e;
  };

  const isNetworkErr = (msg = "") =>
    ["cannot connect", "failed to fetch", "networkerror", "load failed"]
      .some(k => msg.toLowerCase().includes(k));

  const goTo = (role) => {
    if (role === "ADMIN")              navigate("/admin");
    else if (role === "HEALTH_WORKER") navigate("/worker-dashboard");
    else                               navigate("/dashboard");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setApiErr(""); setLoading(true);

    try {
      // ── Try real backend ────────────────────────────────────────────────
      await apiRegister({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });
      // Backend registered successfully — now login to get JWT
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);

    } catch (err) {
      if (isNetworkErr(err.message)) {
        // ── Backend offline → use mock localStorage register ────────────
        const res = mockRegister({
          name: form.name, email: form.email, phone: form.phone,
          password: form.password, role: form.role, language: form.language,
        });
        setLoading(false);
        if (!res.success) { setApiErr(res.message); return; }
        goTo(res.user.role);
      } else {
        setApiErr(err.message || "Registration failed. Please try again.");
        setLoading(false);
      }
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="register-page">
        <div className="reg-success-screen">
          <div className="reg-success-icon">
            <MdCheckCircle size={60} color="#059669" />
          </div>
          <h2>Account Created!</h2>
          <p>Your RuralCare account has been created successfully.</p>
          <p className="reg-redirect-note">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">

      {/* Left */}
      <div className="register-left">
        <div className="register-brand">
          <div className="register-logo"><FaHeartbeat size={24} color="#087f8c" /></div>
          <div><h2>RuralCare</h2><span>Healthcare Navigation</span></div>
        </div>

        <div className="register-left-content">
          <div className="register-badge">✨ AI-Assisted Healthcare Platform</div>
          <h1>Better healthcare<br /><span>starts with access.</span></h1>
          <p>Create your RuralCare account and access healthcare facilities, AI-assisted recommendations, appointments and digital referrals.</p>
          <div className="register-features">
            <div><div className="reg-check">✓</div><p>Find suitable healthcare facilities</p></div>
            <div><div className="reg-check">✓</div><p>Get AI-assisted recommendations</p></div>
            <div><div className="reg-check">✓</div><p>Manage appointments and referrals</p></div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="register-right">
        <div className="register-card">

          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join RuralCare to access healthcare services.</p>
          </div>

          {apiErr && <div className="reg-api-err">{apiErr}</div>}

          <form onSubmit={handleSubmit} noValidate>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <div className={`reg-input-wrap ${errors.name ? "reg-inp-err" : ""}`}>
                  <MdPerson size={17} className="reg-icon" />
                  <input type="text" placeholder="Enter your full name"
                    value={form.name} onChange={e => setF("name", e.target.value)} />
                </div>
                {errors.name && <span className="reg-field-err">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <div className={`reg-input-wrap ${errors.phone ? "reg-inp-err" : ""}`}>
                  <MdPhone size={17} className="reg-icon" />
                  <input type="tel" placeholder="10-digit mobile number"
                    value={form.phone} onChange={e => setF("phone", e.target.value)} />
                </div>
                {errors.phone && <span className="reg-field-err">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className={`reg-input-wrap ${errors.email ? "reg-inp-err" : ""}`}>
                <MdEmail size={17} className="reg-icon" />
                <input type="email" placeholder="Enter your email"
                  value={form.email} onChange={e => setF("email", e.target.value)} />
              </div>
              {errors.email && <span className="reg-field-err">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>User Role</label>
                <div className={`reg-input-wrap ${errors.role ? "reg-inp-err" : ""}`}>
                  <MdBadge size={17} className="reg-icon" />
                  <select value={form.role} onChange={e => setF("role", e.target.value)}>
                    <option value="">Select your role</option>
                    <option value="PATIENT">Patient / User</option>
                    <option value="HEALTH_WORKER">Healthcare Worker</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                {errors.role && <span className="reg-field-err">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label>Preferred Language</label>
                <div className="reg-input-wrap">
                  <MdPerson size={17} className="reg-icon" />
                  <select value={form.language} onChange={e => setF("language", e.target.value)}>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className={`reg-input-wrap ${errors.password ? "reg-inp-err" : ""}`}>
                  <MdLock size={17} className="reg-icon" />
                  <input type={showPw ? "text" : "password"} placeholder="Min 6 characters"
                    value={form.password} onChange={e => setF("password", e.target.value)} />
                  <button type="button" className="reg-pw-toggle" onClick={() => setShowPw(v => !v)}>
                    {showPw ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                  </button>
                </div>
                {errors.password && <span className="reg-field-err">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className={`reg-input-wrap ${errors.confirm ? "reg-inp-err" : ""}`}>
                  <MdLock size={17} className="reg-icon" />
                  <input type={showPw ? "text" : "password"} placeholder="Confirm password"
                    value={form.confirm} onChange={e => setF("confirm", e.target.value)} />
                </div>
                {errors.confirm && <span className="reg-field-err">{errors.confirm}</span>}
              </div>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms"
                checked={form.terms} onChange={e => setF("terms", e.target.checked)} />
              <label htmlFor="terms">I agree to the terms and conditions.</label>
            </div>
            {errors.terms && <span className="reg-field-err">{errors.terms}</span>}

            <button type="submit" className="create-account-btn" disabled={loading}>
              {loading
                ? <><span className="btn-spinner" /> Creating account…</>
                : <><span>Create Account</span><MdArrowForward size={18} /></>}
            </button>

          </form>

          <div className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>

        </div>
      </div>

    </div>
  );
}
