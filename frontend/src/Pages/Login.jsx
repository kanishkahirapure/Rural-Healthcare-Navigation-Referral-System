import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiLogin } from "../services/api";
import { authService } from "../services/store";
import "./Login.css";
import { MdEmail, MdLock, MdArrowForward, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { login: mockLogin, setUserDirectly } = useAuth();

  const [form, setForm]     = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState("");

  const validate = () => {
    const e = {};
    if (!form.email.trim())                         e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))      e.email    = "Enter a valid email.";
    if (!form.password)                             e.password = "Password is required.";
    return e;
  };

  const goTo = (role) => {
    if (role === "ADMIN")              navigate("/admin");
    else if (role === "HEALTH_WORKER") navigate("/worker-dashboard");
    else                               navigate("/dashboard");
  };

  const isNetworkErr = (msg = "") =>
    ["cannot connect", "failed to fetch", "networkerror", "load failed"]
      .some(k => msg.toLowerCase().includes(k));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setApiErr(""); setLoading(true);

    try {
      // ── Try real backend ──────────────────────────────────────────────────
      const data = await apiLogin(form.email, form.password);
      // data = { token, role, name, userId }
      setUserDirectly({
        id: String(data.userId),
        name: data.name,
        role: data.role,
        email: form.email,
        status: "ACTIVE",
      });
      goTo(data.role);

    } catch (err) {
      if (isNetworkErr(err.message)) {
        // ── Backend offline → use demo localStorage auth ──────────────────
        const res = mockLogin(form.email, form.password);
        if (!res.success) { setApiErr(res.message); setLoading(false); return; }
        goTo(res.user.role);
      } else {
        setApiErr(err.message || "Login failed. Please try again.");
        setLoading(false);
      }
    }
  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
    setApiErr("");
  };

  return (
    <div className="login-page">

      {/* Left */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo"><FaHeartbeat size={24} color="white" /></div>
          <div><h2>RuralCare</h2><span>Healthcare Navigation</span></div>
        </div>

        <div className="login-content">
          <div className="login-badge">✨ AI-Assisted Healthcare Platform</div>
          <h1>Healthcare access,<br /><span>made simpler.</span></h1>
          <p>Connect with healthcare facilities, manage referrals and access smart healthcare navigation.</p>
          <div className="login-features">
            <div><div className="feat-check">✓</div><p>Find suitable healthcare facilities</p></div>
            <div><div className="feat-check">✓</div><p>AI-assisted recommendations</p></div>
            <div><div className="feat-check">✓</div><p>Digital referral management</p></div>
          </div>
        </div>

        <p className="login-copyright">© 2026 RuralCare Healthcare Navigation</p>
      </div>

      {/* Right */}
      <div className="login-right">
        <div className="login-card">

          <div className="mobile-logo">
            <div className="login-logo"><FaHeartbeat size={22} color="white" /></div>
            <h2>RuralCare</h2>
          </div>

          <div className="form-header">
            <span>WELCOME BACK</span>
            <h1>Sign in to your account</h1>
            <p>Enter your details to continue to RuralCare.</p>
          </div>

          {apiErr && <div className="login-error">{apiErr}</div>}

          <form onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label>Email Address</label>
              <div className={`input-wrapper ${errors.email ? "inp-error" : ""}`}>
                <MdEmail size={18} className="inp-icon" />
                <input type="email" placeholder="Enter your email address"
                  value={form.email} onChange={e => set("email", e.target.value)}
                  autoComplete="email" />
              </div>
              {errors.email && <span className="field-err">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="password-label">
                <label>Password</label>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>
              <div className={`input-wrapper ${errors.password ? "inp-error" : ""}`}>
                <MdLock size={18} className="inp-icon" />
                <input type={showPw ? "text" : "password"} placeholder="Enter your password"
                  value={form.password} onChange={e => set("password", e.target.value)}
                  autoComplete="current-password" />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {errors.password && <span className="field-err">{errors.password}</span>}
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading
                ? <><span className="btn-spinner" /> Signing in…</>
                : <><span>Sign In</span><MdArrowForward size={18} /></>}
            </button>

          </form>

          <p className="register-text">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>

        </div>
        <p className="security-text"><MdLock size={13} /> Secure access • Privacy protected</p>
      </div>

    </div>
  );
}
