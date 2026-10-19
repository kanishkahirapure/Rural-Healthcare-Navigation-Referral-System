import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/store";
import Navbar from "../components/Navbar";
import "./Notifications.css";
import {
  MdNotifications, MdAssignment, MdCalendarMonth,
  MdEmergency, MdInfo, MdCheckCircle, MdArrowForward,
  MdDoneAll,
} from "react-icons/md";

const TYPE_META = {
  REFERRAL:    { icon: <MdAssignment size={18} />,   bg: "#ede9fe", color: "#5b21b6" },
  APPOINTMENT: { icon: <MdCalendarMonth size={18} />, bg: "#d1fae5", color: "#065f46" },
  EMERGENCY:   { icon: <MdEmergency size={18} />,    bg: "#fee2e2", color: "#991b1b" },
  GENERAL:     { icon: <MdInfo size={18} />,         bg: "#f3f4f6", color: "#6b7280" },
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)   return "Just now";
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)} hr ago`;
  return `${Math.floor(diff/86400)} days ago`;
}

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifs,  setNotifs]  = useState([]);
  const [filter,  setFilter]  = useState("all"); // all | unread

  useEffect(() => {
    if (user) {
      setNotifs(notificationService.getAll(String(user.id)));
    }
  }, [user]);

  const markRead = (id) => {
    notificationService.markRead(id);
    setNotifs(notificationService.getAll(String(user.id)));
  };

  const markAllRead = () => {
    notificationService.markAllRead(String(user.id));
    setNotifs(notificationService.getAll(String(user.id)));
  };

  const handleClick = (n) => {
    if (!n.read) markRead(n.id);
    if (n.referralId)    navigate(`/referral/${n.referralId}`);
    else if (n.appointmentId) navigate(`/appointment/${n.appointmentId}`);
  };

  const displayed = filter === "unread" ? notifs.filter(n => !n.read) : notifs;
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="notif-root">
      <Navbar />
      <main className="notif-main">
        <div className="notif-container">

          <div className="notif-header">
            <div>
              <h1><MdNotifications size={22} /> Notifications
                {unreadCount > 0 && <span className="notif-count-badge">{unreadCount} new</span>}
              </h1>
              <p>Your recent referral and appointment updates.</p>
            </div>
            {unreadCount > 0 && (
              <button className="notif-mark-all-btn" onClick={markAllRead}>
                <MdDoneAll size={16} /> Mark All as Read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="notif-tabs">
            <button className={`notif-tab ${filter==="all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              All ({notifs.length})
            </button>
            <button className={`notif-tab ${filter==="unread" ? "active" : ""}`} onClick={() => setFilter("unread")}>
              Unread ({unreadCount})
            </button>
          </div>

          {/* List */}
          {displayed.length === 0 ? (
            <div className="notif-empty">
              <MdNotifications size={52} color="#d1d5db" />
              <h3>{filter === "unread" ? "No unread notifications" : "No notifications yet"}</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="notif-list">
              {displayed.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.GENERAL;
                return (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? "notif-unread" : ""}`}
                    onClick={() => handleClick(n)}
                  >
                    <div className="notif-item-icon" style={{ background: meta.bg, color: meta.color }}>
                      {meta.icon}
                    </div>
                    <div className="notif-item-body">
                      <strong>{n.title || "Notification"}</strong>
                      <p>{n.message}</p>
                      <small>{timeAgo(n.createdAt)}</small>
                    </div>
                    <div className="notif-item-right">
                      {!n.read && <span className="notif-unread-dot" />}
                      {(n.referralId || n.appointmentId) && (
                        <MdArrowForward size={16} color="#a0aec0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
