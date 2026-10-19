import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FACILITIES } from "../services/mockData";
import { adminService } from "../services/store";
import Navbar from "../components/Navbar";
import "./AdminManagement.css";
import {
  MdAdd, MdEdit, MdArrowBack, MdSearch, MdClose,
  MdLocalHospital, MdEmergency, MdVerified, MdCheck,
} from "react-icons/md";

const EMPTY_FORM = {
  name:"", type:"PHC", area:"Rural", address:"", phone:"",
  hours:"", emergency:false, govtScheme:false, departments:"", services:"",
};

const TYPE_OPTIONS = ["PHC","DISTRICT_HOSPITAL","SPECIALIST_HOSPITAL","CLINIC"];

export default function FacilityManagement() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([...FACILITIES]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState("");

  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  const filtered = facilities.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.address||"").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setErrors({}); setShowForm(true); };

  const openEdit = (f) => {
    setForm({
      name: f.name, type: f.type, area: f.area||"Rural",
      address: f.address||"", phone: f.phone||f.contactNumber||"",
      hours: f.hours||"", emergency: f.emergency||false,
      govtScheme: f.govtScheme||f.acceptsGovtScheme||false,
      departments: (f.departments||[]).join(", "),
      services: (f.services||[]).join(", "),
    });
    setEditId(f.id); setErrors({}); setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.address.trim()) e.address = "Address is required.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const data = {
      ...form,
      departments: form.departments.split(",").map(s=>s.trim()).filter(Boolean),
      services:    form.services.split(",").map(s=>s.trim()).filter(Boolean),
    };
    if (editId) {
      setFacilities(prev => prev.map(f => f.id===editId ? {...f,...data} : f));
      setSaved("Facility updated successfully.");
    } else {
      const newF = adminService.addFacility(data);
      setFacilities(prev => [...prev, {...newF, id: newF.id||`fe${Date.now()}`}]);
      setSaved("Facility added successfully.");
    }
    setShowForm(false); setEditId(null);
    setTimeout(()=>setSaved(""),3000);
  };

  const TYPE_META = {
    PHC:{label:"PHC",bg:"#d1fae5",color:"#065f46"},
    DISTRICT_HOSPITAL:{label:"District",bg:"#dbeafe",color:"#1e40af"},
    SPECIALIST_HOSPITAL:{label:"Specialist",bg:"#ede9fe",color:"#5b21b6"},
    CLINIC:{label:"Clinic",bg:"#fef3c7",color:"#92400e"},
  };

  return (
    <div className="amg-root">
      <Navbar />
      <main className="amg-main">
        <div className="amg-container">

          {/* Header */}
          <div className="amg-page-header">
            <button className="amg-back" onClick={() => navigate("/admin")}>
              <MdArrowBack size={16}/> Admin Dashboard
            </button>
            <div className="amg-title-row">
              <div>
                <h1><MdLocalHospital size={22} color="#087ea4"/> Facility Management</h1>
                <p>Manage healthcare facilities — {facilities.length} total</p>
              </div>
              <button className="amg-add-btn" onClick={openAdd}>
                <MdAdd size={18}/> Add Facility
              </button>
            </div>
          </div>

          {saved && <div className="amg-toast"><MdCheck size={16}/> {saved}</div>}

          {/* Form */}
          {showForm && (
            <div className="amg-form-card">
              <div className="amg-form-head">
                <h2>{editId ? "Edit Facility" : "Add New Facility"}</h2>
                <button className="amg-close-btn" onClick={() => setShowForm(false)}><MdClose size={18}/></button>
              </div>
              <div className="amg-form-grid">
                <div className="amg-field amg-span2">
                  <label>Facility Name *</label>
                  <input value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="Full facility name"/>
                  {errors.name && <span className="amg-err">{errors.name}</span>}
                </div>
                <div className="amg-field">
                  <label>Type</label>
                  <select value={form.type} onChange={e=>setF("type",e.target.value)}>
                    {TYPE_OPTIONS.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="amg-field">
                  <label>Area</label>
                  <select value={form.area} onChange={e=>setF("area",e.target.value)}>
                    <option>Rural</option><option>Urban</option>
                  </select>
                </div>
                <div className="amg-field amg-span2">
                  <label>Address *</label>
                  <input value={form.address} onChange={e=>setF("address",e.target.value)} placeholder="Full address"/>
                  {errors.address && <span className="amg-err">{errors.address}</span>}
                </div>
                <div className="amg-field">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e=>setF("phone",e.target.value)} placeholder="+91 XXXXX XXXXX"/>
                </div>
                <div className="amg-field">
                  <label>Operating Hours</label>
                  <input value={form.hours} onChange={e=>setF("hours",e.target.value)} placeholder="e.g. 24/7 or 9 AM–5 PM"/>
                </div>
                <div className="amg-field amg-span2">
                  <label>Departments (comma separated)</label>
                  <input value={form.departments} onChange={e=>setF("departments",e.target.value)} placeholder="General Medicine, Cardiology..."/>
                </div>
                <div className="amg-field amg-span2">
                  <label>Services (comma separated)</label>
                  <input value={form.services} onChange={e=>setF("services",e.target.value)} placeholder="OPD, Emergency Care, Pharmacy..."/>
                </div>
                <div className="amg-field">
                  <label className="amg-check-label">
                    <input type="checkbox" checked={form.emergency} onChange={e=>setF("emergency",e.target.checked)}/>
                    Emergency Services Available
                  </label>
                </div>
                <div className="amg-field">
                  <label className="amg-check-label">
                    <input type="checkbox" checked={form.govtScheme} onChange={e=>setF("govtScheme",e.target.checked)}/>
                    Accepts Govt Scheme
                  </label>
                </div>
              </div>
              <div className="amg-form-actions">
                <button className="amg-save-btn" onClick={handleSave}>
                  {editId ? "Update Facility" : "Add Facility"}
                </button>
                <button className="amg-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="amg-search-wrap">
            <MdSearch size={18} color="#9ab0c0"/>
            <input placeholder="Search facilities by name or location..." value={search}
              onChange={e=>setSearch(e.target.value)}/>
            {search && <button onClick={()=>setSearch("")}><MdClose size={15}/></button>}
          </div>

          {/* Table */}
          <div className="amg-table-wrap">
            <table className="amg-table">
              <thead>
                <tr>
                  <th>Facility Name</th>
                  <th>Type</th>
                  <th>Area</th>
                  <th>Address</th>
                  <th>Emergency</th>
                  <th>Govt Scheme</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => {
                  const tm = TYPE_META[f.type]||{label:f.type,bg:"#f3f4f6",color:"#6b7280"};
                  return (
                    <tr key={f.id}>
                      <td><strong>{f.name}</strong></td>
                      <td><span className="amg-type-badge" style={{background:tm.bg,color:tm.color}}>{tm.label}</span></td>
                      <td><span className={`amg-area-badge ${(f.area||"").toLowerCase()==="rural"?"rural":"urban"}`}>{f.area||"—"}</span></td>
                      <td className="amg-addr">{f.address||"—"}</td>
                      <td>{(f.emergency||f.operatingStatus==="EMERGENCY_ONLY")
                        ? <span className="amg-yes"><MdEmergency size={13}/> Yes</span>
                        : <span className="amg-no">No</span>}</td>
                      <td>{(f.govtScheme||f.acceptsGovtScheme)
                        ? <span className="amg-yes"><MdVerified size={13}/> Yes</span>
                        : <span className="amg-no">No</span>}</td>
                      <td>
                        <button className="amg-edit-btn" onClick={()=>openEdit(f)}>
                          <MdEdit size={14}/> Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length===0 && <div className="amg-no-results">No facilities match your search.</div>}
          </div>

        </div>
      </main>
    </div>
  );
}
