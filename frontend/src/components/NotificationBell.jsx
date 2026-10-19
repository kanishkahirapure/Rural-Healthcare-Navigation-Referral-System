import { useEffect, useState } from "react";
import { MdNotifications, MdDoneAll } from "react-icons/md";
import { useAuth } from "../context/useAuth";
import {
  getNotifications, markNotificationRead, markAllNotificationsRead
} from "../api/notifications";
import { getErrorMessage } from "../api/client";
import FormMessage from "./FormMessage";

// Bell icon with the unread count. Click it to open the list of notifications.
// Inline styles are used so that no CSS file has to change.
const REFRESH_MS = 60000; // check for new notifications every minute

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export default function NotificationBell() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0); // change it to load the list again

  // Load notifications (newest first).
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getNotifications(userId);
        if (cancelled) return;
        setItems([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setError("");
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
  }, [userId, reloadKey]);

  // Reload in the background so the badge stays fresh.
  useEffect(() => {
    const timer = setInterval(() => setReloadKey((k) => k + 1), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const unread = items.filter((n) => !n.isRead).length;

  function toggle() {
    if (!open) setReloadKey((k) => k + 1); // refresh when the list opens
    setOpen(!open);
  }

  async function handleMarkRead(id) {
    setError("");
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleMarkAll() {
    setError("");
    try {
      await markAllNotificationsRead(userId);
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggle}
        aria-label={`Notifications, ${unread} unread`}
        style={{
          position: "relative", width: "46px", height: "46px", border: "none",
          borderRadius: "12px", background: "white", cursor: "pointer",
          boxShadow: "0 4px 18px rgba(0, 0, 0, 0.07)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <MdNotifications size={22} color="#087ea4" />
        {unread > 0 && (
          <span
            style={{
              position: "absolute", top: "-6px", right: "-6px", minWidth: "20px", height: "20px",
              padding: "0 5px", borderRadius: "10px", background: "#dc2626", color: "white",
              fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute", right: 0, top: "56px", zIndex: 30, width: "360px",
            maxWidth: "85vw", maxHeight: "420px", overflowY: "auto", padding: "16px",
            background: "white", borderRadius: "14px", boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ color: "#102b4e", fontSize: "15px" }}>Notifications</strong>
            {unread > 0 && (
              <button
                onClick={handleMarkAll}
                style={{
                  display: "flex", alignItems: "center", gap: "5px", border: "none",
                  background: "transparent", color: "#087ea4", fontSize: "12px",
                  fontWeight: 600, cursor: "pointer",
                }}
              >
                <MdDoneAll size={16} /> Mark all as read
              </button>
            )}
          </div>

          <FormMessage type="error">{error}</FormMessage>

          {loading && <p style={{ color: "#6c7885", fontSize: "13px" }}>Loading...</p>}
          {!loading && !error && items.length === 0 && (
            <p style={{ color: "#6c7885", fontSize: "13px" }}>No notifications yet.</p>
          )}

          {items.map((n) => (
            <div
              key={n.id}
              style={{
                marginTop: "10px", padding: "12px", borderRadius: "10px",
                background: n.isRead ? "#f7fafb" : "#e0f4f8",
                borderLeft: `3px solid ${n.isRead ? "#dbe7ee" : "#087ea4"}`,
              }}
            >
              <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#102b4e", lineHeight: 1.4 }}>
                {n.message}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <small style={{ color: "#7b8492", fontSize: "11px" }}>
                  {n.type} • {formatDateTime(n.createdAt)}
                </small>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    style={{
                      border: "none", background: "transparent", color: "#087ea4",
                      fontSize: "11px", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}