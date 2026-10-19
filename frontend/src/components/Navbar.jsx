import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/store";
import { FaHeartbeat } from "react-icons/fa";
import {
  MdDashboard, MdLocalHospital, MdPerson, MdLogout,
  MdAssignment, MdCalendarMonth, MdEmergency, MdNotifications,
  MdMenu, MdClose, MdGroup, MdMedicalServices, MdAdd,
  MdAdminPanelSettings, MdMonitor, MdMap,
} from "react-icons/md";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const unreadCount = user
    ? notificationService.getUnread(user.id).length
    : 0;

  const isActive = (path) =>
    location.pathname === path ? "nav-item active-nav" : "nav-item";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const patientLinks = [
    { to: "/dashboard",     icon: <MdDashboard size={18} />,    label: "Dashboard" },
    { to: "/hospital-search", icon: <MdLocalHospital size={18} />, label: "Find Hospitals" },
    { to: "/doctor-search", icon: <MdMedicalServices size={18} />, label: "Find Doctors" },
    { to: "/referrals",     icon: <MdAssignment size={18} />,   label: "My Referrals" },
    { to: "/appointments",  icon: <MdCalendarMonth size={18} />, label: "Appointments" },
    { to: "/emergency",     icon: <MdEmergency size={18} />,    label: "Emergency" },
    { to: "/map",           icon: <MdMap size={18} />,          label: "Map" },
  ];

  const workerLinks = [
    { to: "/worker-dashboard", icon: <MdDashboard size={18} />, label: "Dashboard" },
    { to: "/hospital-search", icon: <MdLocalHospital size={18} />, label: "Find Hospitals" },
    { to: "/create-referral", icon: <MdAdd size={18} />, label: "Create Referral" },
    { to: "/referrals", icon: <MdAssignment size={18} />, label: "Referrals" },
    { to: "/emergency", icon: <MdEmergency size={18} />, label: "Emergency" },
  ];

  const adminLinks = [
    { to: "/admin", icon: <MdAdminPanelSettings size={18} />, label: "Dashboard" },
    { to: "/admin/facilities", icon: <MdLocalHospital size={18} />, label: "Facilities" },
    { to: "/admin/doctors", icon: <MdMedicalServices size={18} />, label: "Doctors" },
    { to: "/admin/users", icon: <MdGroup size={18} />, label: "Users" },
    { to: "/admin/referrals", icon: <MdMonitor size={18} />, label: "Referrals" },
  ];

  const links =
    user?.role === "ADMIN"
      ? adminLinks
      : user?.role === "HEALTH_WORKER"
      ? workerLinks
      : patientLinks;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="app-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to={user?.role === "ADMIN" ? "/admin" : user?.role === "HEALTH_WORKER" ? "/worker-dashboard" : "/dashboard"} className="navbar-logo">
          <FaHeartbeat size={20} color="white" />
          <span>RuralCare</span>
        </Link>

        {/* Desktop Links */}
        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={isActive(l.to)}
              onClick={() => setMenuOpen(false)}
            >
              {l.icon}
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="navbar-right">
          {user?.role !== "ADMIN" && (
            <Link to="/notifications" className={`notif-btn ${isActive("/notifications")}`}>
              <MdNotifications size={22} />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}
            </Link>
          )}

          <Link to="/profile" className="nav-avatar" title="Profile">
            <span>{initials}</span>
          </Link>

          <button className="nav-logout-btn" onClick={handleLogout} title="Logout">
            <MdLogout size={18} />
            <span>Logout</span>
          </button>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
