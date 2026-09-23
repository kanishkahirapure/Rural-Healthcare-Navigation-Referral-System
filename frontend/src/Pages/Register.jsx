import "./Register.css";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="register-page">

      {/* Left Section */}
      <div className="register-left">
        <div className="register-brand">
          <div className="register-logo">✚</div>

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
              <span>✓</span>
              <p>Find suitable healthcare facilities</p>
            </div>

            <div>
              <span>✓</span>
              <p>Get AI-assisted recommendations</p>
            </div>

            <div>
              <span>✓</span>
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

          <form>

            <div className="form-row">

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                />
              </div>

            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>User Role</label>

              <select defaultValue="">
                <option value="" disabled>
                  Select your role
                </option>

                <option value="patient">
                  Patient / User
                </option>

                <option value="healthcare-worker">
                  Healthcare Worker
                </option>
              </select>
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Create password"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                />
              </div>

            </div>

            <div className="terms">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the terms and conditions.
              </label>
            </div>

            <button type="submit" className="create-account-btn">
              Create Account →
            </button>

          </form>

          <div className="login-link">
            Already have an account?
            <Link to="/login"> Sign in</Link>
          </div>

          <div className="secure-register">
            🔒 Your information is securely handled
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;