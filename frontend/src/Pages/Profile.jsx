import "./Profile.css";
import {
  MdPerson, MdEdit, MdEmail, MdPhone, MdLocationOn,
  MdCake, MdVerified, MdBloodtype, MdMedicalServices,
  MdWarning, MdContacts
} from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";

function Profile() {
  return (
    <div className="profile-page">

      <header className="profile-header">
        <div>
          <div className="profile-badge">
            <MdPerson size={14} />
            <span>User Profile</span>
          </div>
          <h1>My Profile</h1>
          <p>Manage your personal information and healthcare details.</p>
        </div>
        <button className="edit-profile-btn">
          <MdEdit size={16} /> Edit Profile
        </button>
      </header>

      <section className="profile-content">

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">U</div>
            <div>
              <h2>User</h2>
              <p>Patient</p>
              <span className="profile-active">
                <MdVerified size={13} /> Active
              </span>
            </div>
          </div>

          <div className="profile-divider"></div>

          <div className="profile-info">

            <div className="profile-info-item">
              <div className="pinfo-icon blue-bg">
                <MdEmail size={20} color="#087ea4" />
              </div>
              <div>
                <small>Email Address</small>
                <strong>user@example.com</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="pinfo-icon green-bg">
                <MdPhone size={20} color="#059669" />
              </div>
              <div>
                <small>Phone Number</small>
                <strong>+91 XXXXX XXXXX</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="pinfo-icon orange-bg">
                <MdLocationOn size={20} color="#d97706" />
              </div>
              <div>
                <small>Location</small>
                <strong>Rural / Local Area</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="pinfo-icon purple-bg">
                <MdCake size={20} color="#7c3aed" />
              </div>
              <div>
                <small>Age</small>
                <strong>25 Years</strong>
              </div>
            </div>

          </div>
        </div>

        {/* Personal Information */}
        <div className="personal-card">
          <div className="card-heading">
            <h2>Personal Information</h2>
            <p>Your basic personal details</p>
          </div>

          <div className="personal-grid">

            <div className="input-group">
              <label>Full Name</label>
              <div className="pinput-wrap">
                <MdPerson size={16} className="pinput-icon" />
                <input type="text" value="User" readOnly />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="pinput-wrap">
                <MdEmail size={16} className="pinput-icon" />
                <input type="email" value="user@example.com" readOnly />
              </div>
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <div className="pinput-wrap">
                <MdPhone size={16} className="pinput-icon" />
                <input type="text" value="+91 XXXXX XXXXX" readOnly />
              </div>
            </div>

            <div className="input-group">
              <label>Age</label>
              <div className="pinput-wrap">
                <MdCake size={16} className="pinput-icon" />
                <input type="text" value="25" readOnly />
              </div>
            </div>

          </div>
        </div>

        {/* Healthcare Information */}
        <div className="health-profile-card">
          <div className="card-heading">
            <h2>Healthcare Information</h2>
            <p>Basic information useful for healthcare services</p>
          </div>

          <div className="health-grid">

            <div className="health-item">
              <div className="health-icon red-bg">
                <MdBloodtype size={22} color="#dc2626" />
              </div>
              <div>
                <small>Blood Group</small>
                <strong>Not Provided</strong>
              </div>
            </div>

            <div className="health-item">
              <div className="health-icon blue-bg">
                <MdMedicalServices size={22} color="#087ea4" />
              </div>
              <div>
                <small>Medical Conditions</small>
                <strong>Not Provided</strong>
              </div>
            </div>

            <div className="health-item">
              <div className="health-icon orange-bg">
                <MdWarning size={22} color="#d97706" />
              </div>
              <div>
                <small>Allergies</small>
                <strong>Not Provided</strong>
              </div>
            </div>

            <div className="health-item">
              <div className="health-icon green-bg">
                <MdContacts size={22} color="#059669" />
              </div>
              <div>
                <small>Emergency Contact</small>
                <strong>Not Provided</strong>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}

export default Profile;
