import { useEffect, useState } from "react";
import "./Profile.css";
import {
  MdPerson, MdEdit, MdEmail, MdPhone, MdLocationOn,
  MdCake, MdVerified, MdBloodtype, MdMedicalServices,
  MdWarning, MdContacts, MdWc, MdLock
} from "react-icons/md";
import { useAuth } from "../context/useAuth";
import { getMyProfile, updateMyProfile, changePassword } from "../api/profile";
import { getErrorMessage } from "../api/client";
import { formatRole } from "../utils/roles";
import FormMessage from "../components/FormMessage";

const EMPTY_PASSWORDS = { oldPassword: "", newPassword: "", confirmPassword: "" };

// Backend profile -> values for the edit form (null becomes an empty text).
function toForm(profile) {
  return {
    name: profile.name ?? "",
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    age: profile.age ?? "",
    gender: profile.gender ?? "",
  };
}

// Inline styles so no CSS file has to change.
const selectStyle = {
  width: "100%", padding: "12px 14px 12px 40px", border: "1.5px solid #dbe7ee",
  borderRadius: "10px", background: "#fafcfe", color: "#526673", fontSize: "13px",
  outline: "none", fontFamily: "inherit",
};
// Fields that can be edited get a clear border so the user sees the edit mode.
const editingStyle = { background: "white", color: "#102b4e", borderColor: "#087ea4" };

function Profile() {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwNotice, setPwNotice] = useState("");

  // Load my profile once.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getMyProfile();
        if (cancelled) return;
        setProfile(data);
        setForm(toForm(data));
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit() {
    setNotice("");
    setFormError("");
    setEditing(true);
  }

  function cancelEdit() {
    setForm(toForm(profile)); // throw away the changes
    setFormError("");
    setEditing(false);
  }

  async function handleSave() {
    setFormError("");
    setNotice("");

    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      setFormError("Phone number must be exactly 10 digits.");
      return;
    }
    if (form.age !== "" && (Number(form.age) < 0 || Number(form.age) > 120)) {
      setFormError("Age must be between 0 and 120.");
      return;
    }

    const body = {
      name: form.name.trim(),
      phone: form.phone || null,
      location: form.location.trim(),
      age: form.age === "" ? null : Number(form.age),
      gender: form.gender || null,
    };

    setSaving(true);
    try {
      const saved = await updateMyProfile(body);
      setProfile(saved);
      setForm(toForm(saved));
      updateUser({ name: saved.name }); // keep the name on the Dashboard in sync
      setEditing(false);
      setNotice("Profile updated successfully.");
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();
    setPwError("");
    setPwNotice("");

    if (!passwords.oldPassword || !passwords.newPassword) {
      setPwError("Please fill in the old and the new password.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPwError("The new password must be at least 6 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError("The new passwords do not match.");
      return;
    }

    setPwSaving(true);
    try {
      await changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords(EMPTY_PASSWORDS);
      setPwNotice("Password changed successfully.");
    } catch (err) {
      setPwError(getErrorMessage(err));
    } finally {
      setPwSaving(false);
    }
  }

  const displayName = profile?.name || "User";

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
        {profile && (
          <button className="edit-profile-btn" onClick={editing ? cancelEdit : startEdit}>
            <MdEdit size={16} /> {editing ? "Cancel Editing" : "Edit Profile"}
          </button>
        )}
      </header>

      <FormMessage type="success">{notice}</FormMessage>
      <FormMessage type="error">{error}</FormMessage>
      {loading && <p style={{ color: "#6c7885" }}>Loading your profile...</p>}

      {profile && (
        <section className="profile-content" style={{ marginTop: "20px" }}>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-top">
              <div className="profile-avatar">{displayName.charAt(0).toUpperCase()}</div>
              <div>
                <h2>{displayName}</h2>
                <p>{formatRole(profile.role)}</p>
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
                  <strong>{profile.email}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="pinfo-icon green-bg">
                  <MdPhone size={20} color="#059669" />
                </div>
                <div>
                  <small>Phone Number</small>
                  <strong>{profile.phone || "Not provided"}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="pinfo-icon orange-bg">
                  <MdLocationOn size={20} color="#d97706" />
                </div>
                <div>
                  <small>Location</small>
                  <strong>{profile.location || "Not provided"}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="pinfo-icon purple-bg">
                  <MdCake size={20} color="#7c3aed" />
                </div>
                <div>
                  <small>Age</small>
                  <strong>{profile.age != null ? `${profile.age} Years` : "Not provided"}</strong>
                </div>
              </div>

            </div>
          </div>

          {/* Personal Information */}
          <div className="personal-card">
            <div className="card-heading">
              <h2>Personal Information</h2>
              <p>{editing ? "Change your details and press Save Changes." : "Your basic personal details"}</p>
            </div>

            <div className="personal-grid">

              <div className="input-group">
                <label>Full Name</label>
                <div className="pinput-wrap">
                  <MdPerson size={16} className="pinput-icon" />
                  <input
                    type="text" value={form.name} readOnly={!editing} maxLength={100}
                    style={editing ? editingStyle : undefined}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <div className="pinput-wrap">
                  <MdEmail size={16} className="pinput-icon" />
                  <input type="email" value={profile.email} readOnly />
                </div>
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <div className="pinput-wrap">
                  <MdPhone size={16} className="pinput-icon" />
                  <input
                    type="text" inputMode="numeric" maxLength={10} value={form.phone}
                    readOnly={!editing} placeholder={editing ? "10 digit number" : ""}
                    style={editing ? editingStyle : undefined}
                    onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Age</label>
                <div className="pinput-wrap">
                  <MdCake size={16} className="pinput-icon" />
                  <input
                    type="number" min="0" max="120" value={form.age}
                    readOnly={!editing}
                    style={editing ? editingStyle : undefined}
                    onChange={(e) => updateField("age", e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Location</label>
                <div className="pinput-wrap">
                  <MdLocationOn size={16} className="pinput-icon" />
                  <input
                    type="text" value={form.location} readOnly={!editing} maxLength={150}
                    style={editing ? editingStyle : undefined}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Gender</label>
                <div className="pinput-wrap">
                  <MdWc size={16} className="pinput-icon" />
                  <select
                    value={form.gender} disabled={!editing}
                    style={editing ? { ...selectStyle, ...editingStyle } : selectStyle}
                    onChange={(e) => updateField("gender", e.target.value)}
                  >
                    <option value="">Not specified</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

            </div>

            {editing && (
              <>
                <FormMessage type="error">{formError}</FormMessage>
                <div style={{ marginTop: "20px" }}>
                  <button className="edit-profile-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Healthcare Information (the backend does not store these yet) */}
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

          {/* Change Password */}
          <div className="personal-card">
            <div className="card-heading">
              <h2>Change Password</h2>
              <p>Use at least 6 characters.</p>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="personal-grid">

                <div className="input-group">
                  <label>Old Password</label>
                  <div className="pinput-wrap">
                    <MdLock size={16} className="pinput-icon" />
                    <input
                      type="password" autoComplete="current-password" value={passwords.oldPassword}
                      onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>New Password</label>
                  <div className="pinput-wrap">
                    <MdLock size={16} className="pinput-icon" />
                    <input
                      type="password" autoComplete="new-password" value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Confirm New Password</label>
                  <div className="pinput-wrap">
                    <MdLock size={16} className="pinput-icon" />
                    <input
                      type="password" autoComplete="new-password" value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

              </div>

              <FormMessage type="error">{pwError}</FormMessage>
              <FormMessage type="success">{pwNotice}</FormMessage>

              <div style={{ marginTop: "20px" }}>
                <button type="submit" className="edit-profile-btn" disabled={pwSaving}>
                  {pwSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>

        </section>
      )}
    </div>
  );
}

export default Profile;