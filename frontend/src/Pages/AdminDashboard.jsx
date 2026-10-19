import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminService, referralService, appointmentService } from "../services/store";
import { FACILITIES, DOCTORS } from "../services/mockData";
import Navbar from "../components/Navbar";
import "./AdminDashboard.css";
import {
  MdPeople, MdLocalHospital, MdAssignment, MdCalendarMonth,
  MdPerson, MdAdminPanelSettings, MdArrowForward, MdTrendingUp,
  MdVerified, MdEmergency, MdMonitor, MdGroup,
} from "react-icons/md";
import { FaStethoscope, FaHeartbeat } from "react-icons/fa";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const s = adminService.getStats();
    setStats(s);
    setRecentReferrals(referralService.getAll().slice(-5).reverse());
    setRecentAppointments(appointmentService.getAll().slice(-5).reverse());
  }, []);

  const STAT_CARDS = stats ? [
    { label: "Total Users",        value: stats.totalUsers,        icon: <MdPeople size={22} color="#087ea4" />,       bg: "blue-bg",   onClick: () => navigate("/admin/users") },
    { label: "Total Patients",     value: stats.totalPatients,     icon: <MdPerson size={22} color="#059669" />,       bg: "green-bg",  onClick: () => navigate("/admin/users") },
    { label: "Health Workers",     value: stats.totalWorkers,      icon: <FaStethoscope size={20} color="#7c3aed" />,  bg: "purple-bg", onClick: () => navigate("/admin/users") },
    { label: "Total Facilities",   value: stats.totalFacilities,   icon: <MdLocalHospital size={22} color="#d97706" />,bg: "orange-bg", onClick: () => navigate("/admin/facilities") },
    { label: "Rural Facilities",   value: stats.ruralFacilities,   icon: <FaHeartbeat size={20} color="#0891b2" />,    bg: "teal-bg",   onClick: () => navigate("/admin/facilities") },
    { label: "Total Doctors",      value: stats.totalDoctors,      icon: <FaStethoscope size={20} color="#059669" />,  bg: "green-bg",  onClick: () => navigate("/admin/doctors") },
    { label: "Total Referrals",    value: stats.totalReferrals,    icon: <MdAssignment size={22} color="#7c3aed" />,   bg: "purple-bg", onClick: () => navigate("/admin/referrals") },
    { label: "Pending Referrals",  value: stats.pendingReferrals,  icon: <MdMonitor size={22} color="#d97706" />,      bg: "orange-bg", onClick: () => navigate("/admin/referrals") },
    { label: "Completed Referrals",value: stats.completedReferrals,icon: <MdVerified size={22} color="#059669" />,     bg: "green-bg",  onClick: () => navigate("/admin/referrals") },
    { label: "Total Appointments", value: stats.totalAppointments, icon: <MdCalendarMonth size={22} color="#087ea4" />,bg: "blue-bg",   onClick: null },
  ] : [];

  const STATUS_STYLE = {
    PENDING:   { bg: "#fef3c7", color: "#92400e" },
    ACCEPTED:  { bg: "#ede9fe", color: "#5b21b6" },
    COMPLETED: { bg: "#d1fae5", color: "#065f46" },
    REJECTED:  { bg: "#fee2e2", color: "#991b1b" },
    CONFIRMED: { bg: "#d1fae5", color: "#065f46" },
    REQUESTED: { bg: "#fef3c7", color: "#92400e" },
    CANCELLED: { bg: "#fee2e2", color: "#991b1b" },
  };

  return (
    <div className="adm-root">
      <Navbar />
      <main className="adm-main">
        <div className="adm-container">

          {/* Header */}
          <div className="adm-header">
            <div>
              <div className="adm-badge"><MdAdminPanelSettings size={14}/> Admin Panel</div>
              <h1>Admin Dashboard</h1>
              <p>Welcome back, <strong>{user?.name || "Admin"}</strong> — here's your system overview.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="adm-stats-grid">
            {STAT_CARDS.map((c, i) => (
              <div key={i} className={`adm-stat-card ${c.onClick ? "clickable" : ""}`}
                onClick={c.onClick || undefined}>
                <div className={`adm-stat-icon ${c.bg}`}>{c.icon}</div>
                <div>
                  <span className="adm-stat-num">{c.value}</span>
                  <span className="adm-stat-label">{c.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Management Cards */}
          <section className="adm-section">
            <h2 className="adm-section-title">Management</h2>
            <div className="adm-mgmt-grid">
              <div className="adm-mgmt-card" onClick={() => navigate("/admin/facilities")}>
                <div className="adm-mgmt-icon blue-bg"><MdLocalHospital size={28} color="#087ea4"/></div>
                <h3>Facility Management</h3>
                <p>Add, edit or deactivate healthcare facilities.</p>
                <span className="adm-mgmt-count">{FACILITIES.length} facilities</span>
                <button>Manage <MdArrowForward size={14}/></button>
              </div>
              <div className="adm-mgmt-card" onClick={() => navigate("/admin/doctors")}>
                <div className="adm-mgmt-icon green-bg"><FaStethoscope size={26} color="#059669"/></div>
                <h3>Doctor Management</h3>
                <p>Manage doctor records and availability.</p>
                <span className="adm-mgmt-count">{DOCTORS.length} doctors</span>
                <button>Manage <MdArrowForward size={14}/></button>
              </div>
              <div className="adm-mgmt-card" onClick={() => navigate("/admin/users")}>
                <div className="adm-mgmt-icon purple-bg"><MdGroup size={28} color="#7c3aed"/></div>
                <h3>User Management</h3>
                <p>View and manage user accounts by role.</p>
                <span className="adm-mgmt-count">{stats?.totalUsers || 0} users</span>
                <button>Manage <MdArrowForward size={14}/></button>
              </div>
              <div className="adm-mgmt-card" onClick={() => navigate("/admin/referrals")}>
                <div className="adm-mgmt-icon orange-bg"><MdMonitor size={28} color="#d97706"/></div>
                <h3>Referral Monitoring</h3>
                <p>Monitor all referrals across the system.</p>
                <span className="adm-mgmt-count">{stats?.totalReferrals || 0} referrals</span>
                <button>Monitor <MdArrowForward size={14}/></button>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <div className="adm-two-col">

            {/* Recent Referrals */}
            <div className="adm-card">
              <div className="adm-card-head">
                <h2><MdAssignment size={17} color="#7c3aed"/> Recent Referrals</h2>
                <button onClick={() => navigate("/admin/referrals")}>View All <MdArrowForward size={13}/></button>
              </div>
              {recentReferrals.length === 0
                ? <p className="adm-empty-text">No referrals yet.</p>
                : recentReferrals.map(r => (
                  <div key={r.id} className="adm-row">
                    <div className="adm-row-id">{r.id}</div>
                    <div className="adm-row-info">
                      <strong>{r.patientName}</strong>
                      <span>{r.toFacilityName}</span>
                    </div>
                    <span className="adm-status-pill"
                      style={{ background: (STATUS_STYLE[r.status]||{}).bg||"#f3f4f6",
                               color: (STATUS_STYLE[r.status]||{}).color||"#6b7280" }}>
                      {r.status}
                    </span>
                  </div>
                ))
              }
            </div>

            {/* Recent Appointments */}
            <div className="adm-card">
              <div className="adm-card-head">
                <h2><MdCalendarMonth size={17} color="#087ea4"/> Recent Appointments</h2>
                <button onClick={() => navigate("/appointments")}>View All <MdArrowForward size={13}/></button>
              </div>
              {recentAppointments.length === 0
                ? <p className="adm-empty-text">No appointments yet.</p>
                : recentAppointments.map(a => (
                  <div key={a.id} className="adm-row">
                    <div className="adm-row-id">{a.id}</div>
                    <div className="adm-row-info">
                      <strong>{a.patientName}</strong>
                      <span>{a.facilityName}</span>
                    </div>
                    <span className="adm-status-pill"
                      style={{ background: (STATUS_STYLE[a.status]||{}).bg||"#f3f4f6",
                               color: (STATUS_STYLE[a.status]||{}).color||"#6b7280" }}>
                      {a.status}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
