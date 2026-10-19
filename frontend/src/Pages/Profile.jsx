import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/store";
import Navbar from "../components/Navbar";
import "./Profile.css";
import {
  MdPerson, MdEdit, MdEmail, MdPhone, MdLocationOn,
  MdCake, MdVerified, MdBloodtype, MdMedicalServices,
  MdWarning, MdContacts, MdSave, MdClose, MdLogout,
  MdLock, MdCheckCircle, MdBadge,
} from "react-icons/md";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [pwMode,   setPwMode]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [pwSaved,  setPwSaved]  = useState(false);

  // Edit form state — pre-filled with real user data
  const [form, setForm] = useState({
    name:     user?.name     || "",
    email:    user?.email    || "",
    phone:    user?.phone    || "",
    location: user?.location || "",
    age:      user?.age      || "",
    gender:   user?.gender   || "",
    language: user?.language || "",
  });

  // Password change state
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwErr,  setPwErr]  = useState("");

  const [formErr, setFormErr] = useState("");

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Save profile ──
  const handleSave = () => {
    if (!form.name.trim()) { setFormErr("Name is required."); return; }
    setFormErr("");
    const res = updateProfile({
      name:     form.name.trim(),
      phone:    form.phone.trim(),
      location: form.location.trim(),
      age:      form.age ? Number(form.age) : null,
      gender:   form.gender,
      language: form.language,
    });
    if (res.success) {
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  // ── Change password ──
  const handlePwSave = () => {
    setPwErr("");
    if (!pwForm.current)              { setPwErr("Enter current password."); return; }
    if (pwForm.newPw.length < 6)      { setPwErr("New password must be at least 6 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwErr("Passwords do not match."); return; }
    const res = authService.changePassword(pwForm.current, pwForm.newPw);
    if (!res.success) { setPwErr(res.message); return; }
    setPwSaved(true);
    setPwMode(false);
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 3000);
  };

  // ── Logout ──
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ── Derived ──
  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const roleLabel = {
    PATIENT:      "Patient",
    HEALTH_WORKER:"Healthcare Worker",
    ADMIN:        "Administrator",
  }[user?.role] || user?.role || "User";

  const roleColor = {
    PATIENT:      { bg: "#dbeafe", color: "#1e40af" },
    HEALTH_WORKER:{ bg: "#d1fae5", color: "#065f46" },
    ADMIN:        { bg: "#ede9fe", color: "#5b21b6" },
  }[user?.role] || { bg: "#f3f4f6", color: "#6b7280" };

  return (
    <div className="prf-root">
      <Navbar />
      <main className="prf-main">
        <div className="prf-container">

          {/* Success toasts */}
          {saved   && <div className="prf-toast success"><MdCheckCircle size={18}/> Profile updated successfully.</div>}
          {pwSaved && <div className="prf-toast success"><MdCheckCircle size={18}/> Password changed successfully.</div>}

          {/* ── Hero Card ───────────────────────────────────────────── */}
          <div className="prf-hero">
            <div className="prf-avatar-wrap">
              <div className="prf-avatar">{initials}</div>
            </div>
            <div className="prf-hero-info">
              <h1>{user?.name || "User"}</h1>
              <div className="prf-hero-meta">
                <span className="prf-role-badge" style={{ background: roleColor.bg, color: roleColor.color }}>
                  <MdBadge size={13}/> {roleLabel}
                </span>
                <span className="prf-status-badge">
                  <MdVerified size={13}/> Active
                </span>
              </div>
              {user?.email && <p className="prf-hero-email"><MdEmail size={14}/> {user.email}</p>}
            </div>
            <div className="prf-hero-actions">
              {!editMode && (
                <button className="prf-edit-btn" onClick={() => { setEditMode(true); setPwMode(false); }}>
                  <MdEdit size={15}/> Edit Profile
                </button>
              )}
              <button className="prf-logout-btn" onClick={handleLogout}>
                <MdLogout size={15}/> Logout
              </button>
            </div>
          </div>

          {/* ── Quick Info Row ──────────────────────────────────────── */}
          <div className="prf-info-row">
            <div className="prf-info-item">
              <div className="prf-info-icon blue-bg"><MdEmail size={18} color="#087ea4"/></div>
              <div><small>Email</small><strong>{user?.email || "—"}</strong></div>
            </div>
            <div className="prf-info-item">
              <div className="prf-info-icon green-bg"><MdPhone size={18} color="#059669"/></div>
              <div><small>Phone</small><strong>{user?.phone || "Not provided"}</strong></div>
            </div>
            <div className="prf-info-item">
              <div className="prf-info-icon orange-bg"><MdLocationOn size={18} color="#d97706"/></div>
              <div><small>Location</small><strong>{user?.location || "Not provided"}</strong></div>
            </div>
            <div className="prf-info-item">
              <div className="prf-info-icon purple-bg"><MdCake size={18} color="#7c3aed"/></div>
              <div><small>Age</small><strong>{user?.age ? `${user.age} Years` : "Not provided"}</strong></div>
            </div>
          </div>

          {/* ── Edit Form ───────────────────────────────────────────── */}
          {editMode && (
            <div className="prf-card">
              <div className="prf-card-head">
                <h2>Edit Profile</h2>
                <button className="prf-close-btn" onClick={() => { setEditMode(false); setFormErr(""); }}>
                  <MdClose size={18}/>
                </button>
              </div>

              {formErr && <div className="prf-field-err-bar">{formErr}</div>}

              <div className="prf-form-grid">
                <div className="prf-field">
                  <label>Full Name *</label>
                  <div className="prf-input-wrap">
                    <MdPerson size={15} color="#9ab0c0"/>
                    <input value={form.name} onChange={e => setF("name", e.target.value)} placeholder="Full name"/>
                  </div>
                </div>
                <div className="prf-field">
                  <label>Email Address</label>
                  <div className="prf-input-wrap prf-disabled">
                    <MdEmail size={15} color="#9ab0c0"/>
                    <input value={form.email} readOnly title="Email cannot be changed"/>
                  </div>
                </div>
                <div className="prf-field">
                  <label>Phone Number</label>
                  <div className="prf-input-wrap">
                    <MdPhone size={15} color="#9ab0c0"/>
                    <input value={form.phone} onChange={e => setF("phone", e.target.value)} placeholder="10-digit mobile"/>
                  </div>
                </div>
                <div className="prf-field">
                  <label>Location / Village</label>
                  <div className="prf-input-wrap">
                    <MdLocationOn size={15} color="#9ab0c0"/>
                    <input value={form.location} onChange={e => setF("location", e.target.value)} placeholder="Village, city or area"/>
                  </div>
                </div>
                <div className="prf-field">
                  <label>Age</label>
                  <div className="prf-input-wrap">
                    <MdCake size={15} color="#9ab0c0"/>
                    <input type="number" value={form.age} onChange={e => setF("age", e.target.value)} placeholder="Your age" min="1" max="120"/>
                  </div>
                </div>
                <div className="prf-field">
                  <label>Gender</label>
                  <div className="prf-input-wrap">
                    <MdPerson size={15} color="#9ab0c0"/>
                    <select value={form.gender} onChange={e => setF("gender", e.target.value)}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="prf-field">
                  <label>Preferred Language</label>
                  <div className="prf-input-wrap">
                    <MdPerson size={15} color="#9ab0c0"/>
                    <select value={form.language} onChange={e => setF("language", e.target.value)}>
                      <option value="">Select language</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="prf-form-actions">
                <button className="prf-save-btn" onClick={handleSave}>
                  <MdSave size={16}/> Save Changes
                </button>
                <button className="prf-cancel-btn" onClick={() => { setEditMode(false); setFormErr(""); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Personal Details (view mode) ────────────────────────── */}
          {!editMode && (
            <div className="prf-card">
              <h2>Personal Information</h2>
              <div className="prf-details-grid">
                <div className="prf-detail-row"><span>Full Name</span><strong>{user?.name || "—"}</strong></div>
                <div className="prf-detail-row"><span>Email</span><strong>{user?.email || "—"}</strong></div>
                <div className="prf-detail-row"><span>Phone</span><strong>{user?.phone || "Not provided"}</strong></div>
                <div className="prf-detail-row"><span>Location</span><strong>{user?.location || "Not provided"}</strong></div>
                <div className="prf-detail-row"><span>Age</span><strong>{user?.age ? `${user.age} yrs` : "Not provided"}</strong></div>
                <div className="prf-detail-row"><span>Gender</span><strong>{user?.gender || "Not provided"}</strong></div>
                <div className="prf-detail-row"><span>Language</span><strong>{user?.language || "Not provided"}</strong></div>
                <div className="prf-detail-row"><span>Role</span><strong>{roleLabel}</strong></div>
              </div>
            </div>
          )}

          {/* ── Change Password ─────────────────────────────────────── */}
          <div className="prf-card">
            <div className="prf-card-head">
              <h2><MdLock size={18} color="#087ea4"/> Change Password</h2>
              {!pwMode && (
                <button className="prf-edit-btn" onClick={() => { setPwMode(true); setEditMode(false); }}>
                  Change
                </button>
              )}
            </div>

            {pwMode ? (
              <>
                {pwErr && <div className="prf-field-err-bar">{pwErr}</div>}
                <div className="prf-pw-grid">
                  <div className="prf-field">
                    <label>Current Password</label>
                    <div className="prf-input-wrap">
                      <MdLock size={15} color="#9ab0c0"/>
                      <input type="password" value={pwForm.current}
                        onChange={e => setPwForm(f=>({...f,current:e.target.value}))}
                        placeholder="Current password"/>
                    </div>
                  </div>
                  <div className="prf-field">
                    <label>New Password</label>
                    <div className="prf-input-wrap">
                      <MdLock size={15} color="#9ab0c0"/>
                      <input type="password" value={pwForm.newPw}
                        onChange={e => setPwForm(f=>({...f,newPw:e.target.value}))}
                        placeholder="Min 6 characters"/>
                    </div>
                  </div>
                  <div className="prf-field">
                    <label>Confirm New Password</label>
                    <div className="prf-input-wrap">
                      <MdLock size={15} color="#9ab0c0"/>
                      <input type="password" value={pwForm.confirm}
                        onChange={e => setPwForm(f=>({...f,confirm:e.target.value}))}
                        placeholder="Repeat new password"/>
                    </div>
                  </div>
                </div>
                <div className="prf-form-actions">
                  <button className="prf-save-btn" onClick={handlePwSave}>
                    <MdSave size={16}/> Update Password
                  </button>
                  <button className="prf-cancel-btn" onClick={() => { setPwMode(false); setPwErr(""); }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p className="prf-pw-hint">Keep your account secure with a strong password.</p>
            )}
          </div>

          {/* ── Account Info ────────────────────────────────────────── */}
          <div className="prf-card prf-account-card">
            <h2>Account</h2>
            <div className="prf-details-grid">
              <div className="prf-detail-row"><span>User ID</span><strong>{user?.id || "—"}</strong></div>
              <div className="prf-detail-row"><span>Role</span>
                <strong>
                  <span className="prf-role-badge" style={{background:roleColor.bg,color:roleColor.color}}>
                    {roleLabel}
                  </span>
                </strong>
              </div>
              <div className="prf-detail-row"><span>Status</span>
                <strong><span className="prf-status-badge"><MdVerified size={12}/> Active</span></strong>
              </div>
            </div>
            <button className="prf-logout-full-btn" onClick={handleLogout}>
              <MdLogout size={16}/> Sign Out
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
