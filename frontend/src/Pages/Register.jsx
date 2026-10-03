import "./Register.css";
import { Link } from "react-router-dom";
import {
  MdPerson, MdPhone, MdEmail, MdLock, MdCheckCircle,
  MdBadge, MdArrowForward, MdSecurity
} from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";

function Register() {
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

          <form>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <div className="reg-input-wrap">
                  <MdPerson size={17} className="reg-icon" />
                  <input type="text" placeholder="Enter your full name" />
                </div>
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <div className="reg-input-wrap">
                  <MdPhone size={17} className="reg-icon" />
                  <input type="tel" placeholder="Enter mobile number" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="reg-input-wrap">
                <MdEmail size={17} className="reg-icon" />
                <input type="email" placeholder="Enter your email" />
              </div>
            </div>

            <div className="form-group">
              <label>User Role</label>
              <div className="reg-input-wrap">
                <MdBadge size={17} className="reg-icon" />
                <select defaultValue="">
                  <option value="" disabled>Select your role</option>
                  <option value="patient">Patient / User</option>
                  <option value="healthcare-worker">Healthcare Worker</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="reg-input-wrap">
                  <MdLock size={17} className="reg-icon" />
                  <input type="password" placeholder="Create password" />
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="reg-input-wrap">
                  <MdLock size={17} className="reg-icon" />
                  <input type="password" placeholder="Confirm password" />
                </div>
              </div>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the terms and conditions.
              </label>
            </div>

            <button type="submit" className="create-account-btn">
              Create Account <MdArrowForward size={18} />
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
