// Small message box for errors and success notices (used on forms and pages).
// It uses inline styles so that no CSS file has to change. Renders nothing when empty.
export default function FormMessage({ type = "error", children }) {
  if (!children) return null;
  const isError = type === "error";
  return (
    <p
      role={isError ? "alert" : "status"}
      style={{
        margin: "14px 0 0",
        padding: "10px 12px",
        borderRadius: "8px",
        fontSize: "13px",
        lineHeight: 1.4,
        color: isError ? "#b91c1c" : "#047857",
        background: isError ? "#fef2f2" : "#ecfdf5",
        border: `1px solid ${isError ? "#fecaca" : "#a7f3d0"}`,
      }}
    >
      {children}
    </p>
  );
}
