import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { referralService } from "../services/store";
import Navbar from "../components/Navbar";
import "./AdminManagement.css";
import {
  MdArrowBack, MdSearch, MdClose, MdAssignment, MdArrowForward,
} from "react-icons/md";

const STATUS_OPTIONS = ["ALL","PENDING","ACCEPTED","REJECTED","COMPLETED"];
const STATUS_STYLE = {
  PENDING:   {bg:"#fef3c7",color:"#92400e"},
  ACCEPTED:  {bg:"#ede9fe",color:"#5b21b6"},
  COMPLETED: {bg:"#d1fae5",color:"#065f46"},
  REJECTED:  {bg:"#fee2e2",color:"#991b1b"},
};
const PRIORITY_STYLE = {
  HIGH:  {bg:"#fee2e2",color:"#991b1b"},
  MEDIUM:{bg:"#fef3c7",color:"#92400e"},
  LOW:   {bg:"#d1fae5",color:"#065f46"},
};

export default function ReferralMonitoring() {
  const navigate = useNavigate();
  const allReferrals = referralService.getAll();

  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("ALL");

  const filtered = allReferrals.filter(r => {
    const matchSearch =
      r.id?.toLowerCase().includes(search.toLowerCase()) ||
      r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      r.toFacilityName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // counts
  const counts = {};
  STATUS_OPTIONS.slice(1).forEach(s => {
    counts[s] = allReferrals.filter(r=>r.status===s).length;
  });

  return (
    <div className="amg-root">
      <Navbar />
      <main className="amg-main">
        <div className="amg-container">

          <div className="amg-page-header">
            <button className="amg-back" onClick={() => navigate("/admin")}>
              <MdArrowBack size={16}/> Admin Dashboard
            </button>
            <div className="amg-title-row">
              <div>
                <h1><MdAssignment size={22} color="#7c3aed"/> Referral Monitoring</h1>
                <p>All referrals — {allReferrals.length} total</p>
              </div>
            </div>
          </div>

          {/* Status summary */}
          <div className="amg-status-row">
            {STATUS_OPTIONS.slice(1).map(s => {
              const st = STATUS_STYLE[s]||{bg:"#f3f4f6",color:"#6b7280"};
              return (
                <div key={s} className={`amg-status-pill-big ${statusFilter===s?"ring":""}`}
                  style={{background:st.bg,color:st.color,cursor:"pointer"}}
                  onClick={()=>setStatus(s===statusFilter?"ALL":s)}>
                  <strong>{counts[s]||0}</strong>
                  <span>{s}</span>
                </div>
              );
            })}
          </div>

          {/* Search + filter */}
          <div className="amg-toolbar">
            <div className="amg-search-wrap" style={{flex:1}}>
              <MdSearch size={18} color="#9ab0c0"/>
              <input placeholder="Search by Referral ID, patient or facility..." value={search}
                onChange={e=>setSearch(e.target.value)}/>
              {search && <button onClick={()=>setSearch("")}><MdClose size={15}/></button>}
            </div>
            <select className="amg-select" value={statusFilter} onChange={e=>setStatus(e.target.value)}>
              {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="amg-table-wrap">
            <table className="amg-table">
              <thead>
                <tr>
                  <th>Referral ID</th>
                  <th>Patient</th>
                  <th>From Facility</th>
                  <th>To Facility</th>
                  <th>Specialization</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const ss = STATUS_STYLE[r.status]||{bg:"#f3f4f6",color:"#6b7280"};
                  const ps = PRIORITY_STYLE[r.priority]||{bg:"#f3f4f6",color:"#6b7280"};
                  return (
                    <tr key={r.id}>
                      <td><span className="amg-ref-id">{r.id}</span></td>
                      <td><strong>{r.patientName||"—"}</strong></td>
                      <td className="amg-addr">{r.fromFacilityName||"—"}</td>
                      <td className="amg-addr">{r.toFacilityName||"—"}</td>
                      <td>{r.specialization||"—"}</td>
                      <td>{r.priority
                        ? <span className="amg-priority-badge" style={{background:ps.bg,color:ps.color}}>{r.priority}</span>
                        : "—"}</td>
                      <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                      <td>
                        <span className="amg-status-badge active" style={{background:ss.bg,color:ss.color}}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button className="amg-view-btn"
                          onClick={() => navigate(`/referral/${r.id}`)}>
                          View <MdArrowForward size={13}/>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length===0 && (
              <div className="amg-no-results">No referrals match your search/filter.</div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
