import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">✚</div>
          <div>
            <h2>RuralCare</h2>
            <span>Healthcare Navigation</span>
          </div>
        </div>

        <div className="login-content">
          <div className="login-badge">
            ✨ AI-Assisted Healthcare Platform
          </div>

          <h1>
            Healthcare access,
            <br />
            <span>made simpler.</span>
          </h1>

          <p>
            Connect with healthcare facilities, manage referrals and
            access smart healthcare navigation through one secure platform.
          </p>

          <div className="login-features">
            <div>
              <span>✓</span>
              <p>Find suitable healthcare facilities</p>
            </div>

            <div>
              <span>✓</span>
              <p>AI-assisted healthcare recommendations</p>
            </div>

            <div>
              <span>✓</span>
              <p>Digital referral management</p>
            </div>
          </div>
        </div>

        <p className="login-copyright">
          © 2026 RuralCare Healthcare Navigation
        </p>
      </div>

      {/* Right Side */}
      <div className="login-right">

        <div className="login-card">

          <div className="mobile-logo">
            <div className="login-logo">✚</div>
            <h2>RuralCare</h2>
          </div>

          <div className="form-header">
            <span>WELCOME BACK</span>
            <h1>Sign in to your account</h1>
            <p>
              Enter your details to continue to RuralCare.
            </p>
          </div>

          <form>

            <div className="form-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <span>✉</span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-label">
                <label>Password</label>
                <a href="#forgot">Forgot password?</a>
              </div>

              <div className="input-wrapper">
                <span>🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button type="submit" className="login-submit">
              Sign In
              <span>→</span>
            </button>

          </form>

          <div className="divider-login">
            <span>OR</span>
          </div>

          <div className="demo-login">
            <span>🔐</span>
            <div>
              <strong>Secure Healthcare Platform</strong>
              <p>Your information is handled through authorized access.</p>
            </div>
          </div>

          <p className="register-text">
            Don't have an account?
            <Link to="/register">Create Account</Link>
          </p>

        </div>

        <p className="security-text">
          🔒 Secure access • Privacy protected • Healthcare platform
        </p>

      </div>

    </div>
  );
}

export default Login;