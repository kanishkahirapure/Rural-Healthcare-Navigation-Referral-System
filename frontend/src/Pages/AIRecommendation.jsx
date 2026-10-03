import { useState } from "react";
import "./AIRecommendation.css";
import {
  MdAutoAwesome, MdPerson, MdLocationOn, MdMedicalServices,
  MdSmartToy, MdWarningAmber, MdLocalHospital, MdCheckCircle,
  MdRefresh, MdArrowForward
} from "react-icons/md";
import { FaHeartbeat, FaStethoscope } from "react-icons/fa";

// Simple rule-based AI recommendation logic
function generateRecommendation(age, location, symptoms, service) {
  const s = symptoms.toLowerCase();
  const a = parseInt(age);

  let facility = "";
  let severity = "";
  let advice = "";
  let suggestedServices = [];
  let urgency = "low";

  if (s.includes("chest pain") || s.includes("heart") || s.includes("breathe") || s.includes("breathing")) {
    facility = "Cardiology & Emergency Centre";
    severity = "Urgent";
    urgency = "high";
    advice = "Chest-related symptoms can be serious. Please seek emergency care immediately.";
    suggestedServices = ["Emergency Care", "Cardiology Consultation", "ECG Diagnostics"];
  } else if (s.includes("fever") || s.includes("cold") || s.includes("cough") || s.includes("flu")) {
    facility = "Primary Health Clinic / General OPD";
    severity = "Moderate";
    urgency = "medium";
    advice = "Common infections can be treated at a nearby primary health centre.";
    suggestedServices = ["General Consultation", "Blood Test", "Pharmacy"];
  } else if (s.includes("fracture") || s.includes("injury") || s.includes("accident") || s.includes("broken")) {
    facility = "RuralCare General Hospital";
    severity = "Urgent";
    urgency = "high";
    advice = "Physical injury requires immediate attention at a hospital with orthopaedic facilities.";
    suggestedServices = ["Emergency Care", "X-Ray", "Orthopaedic Consultation"];
  } else if (s.includes("pregnant") || s.includes("delivery") || s.includes("maternity") || s.includes("baby")) {
    facility = "Maternity & Women's Health Centre";
    severity = "Planned";
    urgency = "medium";
    advice = "Maternity care requires regular check-ups. Please consult a gynaecologist.";
    suggestedServices = ["Maternity Care", "Ultrasound", "Gynaecology Consultation"];
  } else if (s.includes("eye") || s.includes("vision") || s.includes("blind")) {
    facility = "Eye Care & Specialist Clinic";
    severity = "Moderate";
    urgency = "medium";
    advice = "Eye symptoms should be assessed by an ophthalmologist promptly.";
    suggestedServices = ["Specialist Consultation", "Eye Checkup", "Vision Test"];
  } else if (s.includes("diabetes") || s.includes("sugar") || s.includes("blood pressure") || s.includes("bp")) {
    facility = "Community Health Centre";
    severity = "Routine";
    urgency = "low";
    advice = "Chronic conditions like diabetes and BP need regular monitoring at a health centre.";
    suggestedServices = ["General Consultation", "Blood Sugar Test", "Diagnostic Services"];
  } else if (service && service !== "Select a service") {
    facility = "RuralCare General Hospital";
    severity = "Routine";
    urgency = "low";
    advice = `Based on your selected service (${service}), a general healthcare facility is recommended.`;
    suggestedServices = [service, "General Consultation"];
  } else {
    facility = "Primary Health Clinic";
    severity = "Routine";
    urgency = "low";
    advice = "Based on your information, a general health checkup at a nearby clinic is recommended.";
    suggestedServices = ["General Consultation", "Health Checkup"];
  }

  // Age-based adjustment
  if (a < 5) {
    advice = "For children under 5, please consult a paediatrician. " + advice;
    suggestedServices.unshift("Paediatric Consultation");
  } else if (a > 60) {
    advice = "For elderly patients, special care may be needed. " + advice;
    suggestedServices.push("Geriatric Care");
  }

  return { facility, severity, urgency, advice, suggestedServices, location };
}

function AIRecommendation() {
  const [form, setForm] = useState({ age: "", location: "", symptoms: "", service: "Select a service" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.age) e.age = "Please enter your age.";
    if (!form.location.trim()) e.location = "Please enter your location.";
    if (!form.symptoms.trim()) e.symptoms = "Please describe your symptoms.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setLoading(true);
    setResult(null);

    // Simulate AI processing delay
    setTimeout(() => {
      const res = generateRecommendation(form.age, form.location, form.symptoms, form.service);
      setResult(res);
      setLoading(false);
    }, 1800);
  };

  const handleReset = () => {
    setForm({ age: "", location: "", symptoms: "", service: "Select a service" });
    setResult(null);
    setErrors({});
  };

  return (
    <div className="ai-page">

      {/* Header */}
      <header className="ai-header">
        <div className="ai-header-badge">
          <MdAutoAwesome size={14} />
          <span>AI Healthcare Assistant</span>
        </div>
        <h1>AI Health Recommendation</h1>
        <p>Get personalized healthcare guidance based on your symptoms and requirements.</p>
      </header>

      {/* Main Content */}
      <div className="ai-content">

        {/* Form */}
        <section className="ai-form-card">
          <h2>Tell us about your health concern</h2>
          <p className="form-description">
            Enter basic information to receive a suitable healthcare recommendation.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="ai-form-row">
              <div className="ai-form-group">
                <label>Age</label>
                <div className="ai-input-wrap">
                  <MdPerson size={18} className="ai-input-icon" />
                  <input
                    type="number"
                    placeholder="Enter your age"
                    value={form.age}
                    onChange={e => setForm({ ...form, age: e.target.value })}
                    min="1" max="120"
                  />
                </div>
                {errors.age && <span className="ai-error">{errors.age}</span>}
              </div>

              <div className="ai-form-group">
                <label>Location</label>
                <div className="ai-input-wrap">
                  <MdLocationOn size={18} className="ai-input-icon" />
                  <input
                    type="text"
                    placeholder="Enter your village / city"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                  />
                </div>
                {errors.location && <span className="ai-error">{errors.location}</span>}
              </div>
            </div>

            <div className="ai-form-group">
              <label>Symptoms</label>
              <div className="ai-input-wrap ai-textarea-wrap">
                <MdMedicalServices size={18} className="ai-input-icon ai-textarea-icon" />
                <textarea
                  placeholder="Describe your symptoms (e.g. fever, chest pain, cough...)"
                  rows="4"
                  value={form.symptoms}
                  onChange={e => setForm({ ...form, symptoms: e.target.value })}
                />
              </div>
              {errors.symptoms && <span className="ai-error">{errors.symptoms}</span>}
            </div>

            <div className="ai-form-group">
              <label>Healthcare Service</label>
              <div className="ai-input-wrap">
                <MdMedicalServices size={18} className="ai-input-icon" />
                <select
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                >
                  <option>Select a service</option>
                  <option>General Consultation</option>
                  <option>Emergency Care</option>
                  <option>Diagnostic Services</option>
                  <option>Specialist Consultation</option>
                  <option>Maternity Care</option>
                </select>
              </div>
            </div>

            <button type="submit" className="recommend-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="ai-spinner"></span>
                  Analyzing your symptoms...
                </>
              ) : (
                <>
                  <MdAutoAwesome size={18} />
                  Get AI Recommendation
                </>
              )}
            </button>

          </form>

          {/* Result */}
          {result && (
            <div className="ai-result">
              <div className="ai-result-header">
                <div className="ai-result-icon">
                  <MdCheckCircle size={26} color="#059669" />
                </div>
                <div>
                  <h3>AI Recommendation Ready</h3>
                  <p>Based on your symptoms and information</p>
                </div>
                <span className={`urgency-badge urgency-${result.urgency}`}>
                  {result.severity}
                </span>
              </div>

              <div className="ai-result-facility">
                <div className="result-facility-icon">
                  <MdLocalHospital size={22} color="#087ea4" />
                </div>
                <div>
                  <small>RECOMMENDED FACILITY</small>
                  <strong>{result.facility}</strong>
                  <p><MdLocationOn size={12} /> {result.location}</p>
                </div>
              </div>

              <div className="ai-result-advice">
                <FaStethoscope size={15} color="#087ea4" style={{ flexShrink: 0, marginTop: 2 }} />
                <p>{result.advice}</p>
              </div>

              <div className="ai-result-services">
                <small>SUGGESTED SERVICES</small>
                <div className="service-tags">
                  {result.suggestedServices.map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
              </div>

              <button className="reset-btn" onClick={handleReset}>
                <MdRefresh size={16} /> New Recommendation
              </button>
            </div>
          )}
        </section>

        {/* Info Card */}
        <section className="ai-info-card">
          <div className="ai-robot-icon">
            <MdSmartToy size={32} color="#7c3aed" />
          </div>

          <h2>How AI Assistance Works</h2>

          <div className="ai-step">
            <div className="ai-step-num">1</div>
            <div>
              <h3>Enter your symptoms</h3>
              <p>Provide your age, location and describe your health concern.</p>
            </div>
          </div>

          <div className="ai-step">
            <div className="ai-step-num">2</div>
            <div>
              <h3>AI analyzes your information</h3>
              <p>The system processes your symptoms to identify suitable options.</p>
            </div>
          </div>

          <div className="ai-step">
            <div className="ai-step-num">3</div>
            <div>
              <h3>Get healthcare guidance</h3>
              <p>Receive recommended facility and services for your condition.</p>
            </div>
          </div>

          <div className="ai-warning">
            <MdWarningAmber size={18} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
            <p>This AI recommendation is for guidance only and is not a substitute for professional medical advice.</p>
          </div>

          <div className="ai-platform-badge">
            <FaHeartbeat size={14} color="#087ea4" />
            <span>Powered by RuralCare AI</span>
          </div>
        </section>

      </div>

    </div>
  );
}

export default AIRecommendation;
