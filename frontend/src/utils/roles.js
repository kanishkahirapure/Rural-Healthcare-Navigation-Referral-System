// Turn the backend role code into a friendly label for the screen.
const LABELS = {
  PATIENT: "Patient",
  HEALTH_WORKER: "Health Worker",
  ADMIN: "Admin",
};

export function formatRole(role) {
  return LABELS[role] ?? role ?? "";
}
