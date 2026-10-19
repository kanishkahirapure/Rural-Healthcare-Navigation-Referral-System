import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DOCTORS, FACILITIES } from "../services/mockData";
import { adminService } from "../services/store";
import Navbar from "../components/Navbar";
import "./AdminManagement.css";
import {
  MdAdd, MdEdit, MdArrowBack, MdSearch, MdClose, MdCheck,
} from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";

const SPECS = ["General Medicine","Cardiology","Orthopaedics","Gynaecology","Paediatrics",
  "Neurology","Oncology","Ophthalmology","ENT","Surgery","Nephrology","Psychiatry",
  "Emergency Medicine","Dermatology","Nephrology"];

const EMPTY_FORM = {
  name:"", specialization:"General Medicine", qualification:"",
  experience:"", facilityId:"", fee:"", availableDays:"", availableTime:"", isAvailable:true,
};

export default function DoctorManagement() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([...DOCTORS]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState("");

  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.specialization||"").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setErrors({}); setShowForm(true); };

  const openEdit = (d) => {
    const fac = FACILITIES.find(f=>String(f.id)===String(d.facilityId));
    setForm({
      name: d.name, specialization: d.specialization,
      qualification: d.qualification||"", experience: d.experience||d.experienceYears||"",
      facilityId: d.facilityId||"", fee: d.fee||"",
      availableDays: Array.isArray(d.availability)?d.availability.join(", "):(d.availableDays||""),
      availableTime: d.availableTime||"", isAvailable: d.isAvailable!==false,
    });
    setEditId(d.id); setErrors({}); setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.facilityId) e.facilityId = "Please select a facility.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const fac = FACILITIES.find(f=>String(f.id)===String(form.facilityId));
    const data = {
      ...form,
      facilityName: fac?.name||"",
      availability: form.availableDays.split(",").map(s=>s.trim()).filter(Boolean),
      experienceYears: Number(form.experience)||0,
    };
    if (editId) {
      setDoctors(prev => prev.map(d => d.id===editId ? {...d,...data} : d));
      setSaved("Doctor updated successfully.");
    } else {
      const newD = adminService.addDoctor(data);
      setDoctors(prev => [...prev, newD]);
      setSaved("Doctor added successfully.");
    }
    setShowForm(false); setEditId(null);
    setTimeout(()=>setSaved(""),3000);
  };

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
                <h1><FaStethoscope size={20} color="#059669"/> Doctor Management</h1>
                <p>Manage doctors — {doctors.length} total</p>
              </div>
              <button className="amg-add-btn" onClick={openAdd}>
                <MdAdd size={18}/> Add Doctor
              </button>
            </div>
          </div>

          {saved && <div className="amg-toast"><MdCheck size={16}/> {saved}</div>}

          {/* Form */}
          {showForm && (
            <div className="amg-form-card">
              <div className="amg-form-head">
                <h2>{editId ? "Edit Doctor" : "Add New Doctor"}</h2>
                <button className="amg-close-btn" onClick={() => setShowForm(false)}><MdClose size={18}/></button>
              </div>
              <div className="amg-form-grid">
                <div className="amg-field amg-span2">
                  <label>Doctor Name *</label>
                  <input value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="Dr. Full Name"/>
                  {errors.name && <span className="amg-err">{errors.name}</span>}
                </div>
                <div className="amg-field">
                  <label>Specialization</label>
                  <select value={form.specialization} onChange={e=>setF("specialization",e.target.value)}>
                    {SPECS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="amg-field">
                  <label>Qualification</label>
                  <input value={form.qualification} onChange={e=>setF("qualification",e.target.value)} placeholder="MBBS, MD..."/>
                </div>
                <div className="amg-field">
                  <label>Experience (years)</label>
                  <input type="number" value={form.experience} onChange={e=>setF("experience",e.target.value)} placeholder="0"/>
                </div>
                <div className="amg-field">
                  <label>Consultation Fee (₹)</label>
                  <input type="number" value={form.fee} onChange={e=>setF("fee",e.target.value)} placeholder="0"/>
                </div>
                <div className="amg-field amg-span2">
                  <label>Associated Facility *</label>
                  <select value={form.facilityId} onChange={e=>setF("facilityId",e.target.value)}>
                    <option value="">Select facility</option>
                    {FACILITIES.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                  {errors.facilityId && <span className="amg-err">{errors.facilityId}</span>}
                </div>
                <div className="amg-field">
                  <label>Available Days (comma sep)</label>
                  <input value={form.availableDays} onChange={e=>setF("availableDays",e.target.value)} placeholder="Mon, Wed, Fri"/>
                </div>
                <div className="amg-field">
                  <label>Available Time</label>
                  <input value={form.availableTime} onChange={e=>setF("availableTime",e.target.value)} placeholder="9 AM – 1 PM"/>
                </div>
                <div className="amg-field">
                  <label className="amg-check-label">
                    <input type="checkbox" checked={form.isAvailable} onChange={e=>setF("isAvailable",e.target.checked)}/>
                    Currently Available
                  </label>
                </div>
              </div>
              <div className="amg-form-actions">
                <button className="amg-save-btn" onClick={handleSave}>
                  {editId ? "Update Doctor" : "Add Doctor"}
                </button>
                <button className="amg-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="amg-search-wrap">
            <MdSearch size={18} color="#9ab0c0"/>
            <input placeholder="Search by doctor name or specialization..." value={search}
              onChange={e=>setSearch(e.target.value)}/>
            {search && <button onClick={()=>setSearch("")}><MdClose size={15}/></button>}
          </div>

          {/* Table */}
          <div className="amg-table-wrap">
            <table className="amg-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                  <th>Facility</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong></td>
                    <td><span className="amg-spec-badge">{d.specialization}</span></td>
                    <td>{d.qualification||"—"}</td>
                    <td>{d.experience||d.experienceYears||"—"} yrs</td>
                    <td className="amg-addr">{d.facilityName||"—"}</td>
                    <td>{d.fee ? `₹${d.fee}` : "—"}</td>
                    <td>
                      <span className={`amg-status-badge ${d.isAvailable!==false&&d.status!=="INACTIVE"?"active":"inactive"}`}>
                        {d.isAvailable!==false&&d.status!=="INACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button className="amg-edit-btn" onClick={()=>openEdit(d)}>
                        <MdEdit size={14}/> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length===0 && <div className="amg-no-results">No doctors match your search.</div>}
          </div>

        </div>
      </main>
    </div>
  );
}
