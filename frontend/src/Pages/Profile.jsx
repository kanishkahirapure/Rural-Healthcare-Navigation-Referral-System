import "./Profile.css";

function Profile() {
  return (
    <div className="profile-page">

      <header className="profile-header">
        <div>
          <span className="profile-badge">👤 User Profile</span>
          <h1>My Profile</h1>
          <p>Manage your personal information and healthcare details.</p>
        </div>

        <button className="edit-profile-btn">
          ✏️ Edit Profile
        </button>
      </header>

      <section className="profile-content">

        {/* Profile Card */}
        <div className="profile-card">

          <div className="profile-top">
            <div className="profile-avatar">
              U
            </div>

            <div>
              <h2>User</h2>
              <p>Patient</p>
              <span className="profile-active">
                ● Active
              </span>
            </div>
          </div>

          <div className="profile-divider"></div>

          <div className="profile-info">

            <div className="profile-info-item">
              <span>📧</span>
              <div>
                <small>Email Address</small>
                <strong>user@example.com</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <span>📱</span>
              <div>
                <small>Phone Number</small>
                <strong>+91 XXXXX XXXXX</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <span>📍</span>
              <div>
                <small>Location</small>
                <strong>Rural / Local Area</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <span>🎂</span>
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
            <div>
              <h2>Personal Information</h2>
              <p>Your basic personal details</p>
            </div>
          </div>

          <div className="personal-grid">

            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value="User" readOnly />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                value="user@example.com"
                readOnly
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="text"
                value="+91 XXXXX XXXXX"
                readOnly
              />
            </div>

            <div className="input-group">
              <label>Age</label>
              <input type="text" value="25" readOnly />
            </div>

          </div>

        </div>

        {/* Healthcare Information */}
        <div className="health-profile-card">

          <div className="card-heading">
            <div>
              <h2>Healthcare Information</h2>
              <p>Basic information useful for healthcare services</p>
            </div>
          </div>

          <div className="health-grid">

            <div className="health-item">
              <span>🩺</span>
              <div>
                <small>Blood Group</small>
                <strong>Not Provided</strong>
              </div>
            </div>

            <div className="health-item">
              <span>💊</span>
              <div>
                <small>Medical Conditions</small>
                <strong>Not Provided</strong>
              </div>
            </div>

            <div className="health-item">
              <span>⚕️</span>
              <div>
                <small>Allergies</small>
                <strong>Not Provided</strong>
              </div>
            </div>

            <div className="health-item">
              <span>📋</span>
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