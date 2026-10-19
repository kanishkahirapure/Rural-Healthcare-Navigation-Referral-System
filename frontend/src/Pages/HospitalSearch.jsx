// HospitalSearch = same as Facilities, just redirect
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HospitalSearch() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/facilities", { replace: true }); }, [navigate]);
  return null;
}
