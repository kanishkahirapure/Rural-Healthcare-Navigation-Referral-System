// Helpers that turn backend facility values into labels, icons and colours.
// Pure data only, so Facilities.jsx stays short and the CSS files do not change.
import { FaClinicMedical, FaHospital, FaStethoscope } from "react-icons/fa";
import { MdVerified, MdEmergency, MdBlock, MdMedicalServices } from "react-icons/md";

// Backend type -> label, icon, icon background class (already in Facilities.css) and icon colour.
const TYPE_INFO = {
  DISTRICT_HOSPITAL: { label: "District Hospital", Icon: FaHospital, bg: "blue-bg", color: "#087ea4" },
  SPECIALIST_HOSPITAL: { label: "Specialist Hospital", Icon: MdMedicalServices, bg: "blue-bg", color: "#087ea4" },
  PHC: { label: "Primary Health Centre", Icon: FaStethoscope, bg: "purple-bg", color: "#7c3aed" },
  CLINIC: { label: "Clinic", Icon: FaClinicMedical, bg: "green-bg", color: "#059669" },
};

const DEFAULT_TYPE = { label: "Healthcare Facility", Icon: FaHospital, bg: "blue-bg", color: "#087ea4" };

export function getTypeInfo(type) {
  return TYPE_INFO[type] ?? DEFAULT_TYPE;
}

// Backend operatingStatus -> badge text, icon and extra inline style.
// OPEN keeps the original green ".available" look, so it needs no extra style.
const STATUS_INFO = {
  OPEN: { label: "Available", Icon: MdVerified, style: {} },
  EMERGENCY_ONLY: {
    label: "Emergency Only",
    Icon: MdEmergency,
    style: { background: "#fef3c7", color: "#92400e" },
  },
  CLOSED: {
    label: "Closed",
    Icon: MdBlock,
    style: { background: "#fee2e2", color: "#991b1b" },
  },
};

export function getStatusInfo(status) {
  return STATUS_INFO[status] ?? STATUS_INFO.OPEN;
}