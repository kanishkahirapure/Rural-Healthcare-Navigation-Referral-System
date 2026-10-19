import { useEffect, useState } from "react";
import { MdLocalHospital, MdMedicalServices, MdAssignment, MdEmergency } from "react-icons/md";
import { getAdminStats } from "../api/admin";
import { getErrorMessage } from "../api/client";
import FormMessage from "./FormMessage";

// Platform numbers for the ADMIN. It reuses the dashboard card classes from Dashboard.css.

// "DISTRICT_HOSPITAL" -> "District Hospital"
 function pretty(key) {
  if (key === "PHC") return "PHC"; // keep this short name in capital letters
  return String(key)
  
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const rowStyle = {
  display: "flex", justifyContent: "space-between", padding: "8px 0",
  borderTop: "1px solid #edf1f4", fontSize: "13px", color: "#536472",
};

// A small card with rows like "Pending ... 3".
function BreakdownCard({ title, rows }) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      {rows.length === 0 && <p>No data yet.</p>}
      {rows.map(([label, count]) => (
        <div style={rowStyle} key={label}>
          <span>{label}</span>
          <strong style={{ color: "#102b4e" }}>{count}</strong>
        </div>
      ))}
    </div>
  );
}

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getAdminStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const numbers = stats && [
    { label: "Total Facilities", value: stats.totalFacilities, Icon: MdLocalHospital, bg: "blue-bg", color: "#087ea4" },
    { label: "Total Doctors", value: stats.totalDoctors, Icon: MdMedicalServices, bg: "purple-bg", color: "#7c3aed" },
    { label: "Total Referrals", value: stats.totalReferrals, Icon: MdAssignment, bg: "orange-bg", color: "#d97706" },
    { label: "Emergency Referrals", value: stats.emergencyReferrals, Icon: MdEmergency, bg: "green-bg", color: "#059669" },
  ];

  return (
    <section className="quick-section">
      <h2>Platform Statistics</h2>

      <FormMessage type="error">{error}</FormMessage>
      {!stats && !error && <p style={{ color: "#6c7885" }}>Loading statistics...</p>}

      {stats && (
        <>
          <div className="dashboard-cards" style={{ marginBottom: "20px" }}>
            {numbers.map(({ label, value, Icon, bg, color }) => (
              <div className="dashboard-card" key={label}>
                <div className={`card-icon ${bg}`}>
                  <Icon size={28} color={color} />
                </div>
                <h3 style={{ fontSize: "28px", margin: "0 0 4px" }}>{value}</h3>
                <p>{label}</p>
              </div>
            ))}
          </div>

          <div className="dashboard-cards">
            <BreakdownCard
              title="Referrals by Status"
              rows={Object.entries(stats.referralsByStatus ?? {}).map(([k, v]) => [pretty(k), v])}
            />
            <BreakdownCard
              title="Appointments by Status"
              rows={Object.entries(stats.appointmentsByStatus ?? {}).map(([k, v]) => [pretty(k), v])}
            />
            <BreakdownCard
              title="Facilities by Type"
              rows={Object.entries(stats.facilitiesByType ?? {}).map(([k, v]) => [pretty(k), v])}
            />
            <BreakdownCard
              title="Top Specializations"
              rows={(stats.topSpecializations ?? []).map((s) => [s.specialization, s.doctorCount])}
            />
          </div>
        </>
      )}
    </section>
  );
}