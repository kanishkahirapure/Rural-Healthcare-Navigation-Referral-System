import { useState } from "react";
import "./AIRecommendation.css";
import {
  MdAutoAwesome, MdPerson, MdLocationOn, MdMedicalServices,
  MdSmartToy, MdWarningAmber, MdLocalHospital, MdCheckCircle,
  MdRefresh, MdMyLocation
} from "react-icons/md";
import { FaHeartbeat, FaStethoscope } from "react-icons/fa";
import { recommend } from "../api/ai";
import { getErrorMessage } from "../api/client";
import FormMessage from "../components/FormMessage";

const DEFAULT_SERVICE = "Select a service";
const EMPTY_FORM = { age: "", symptoms: "", service: DEFAULT_SERVICE };

// Backend urgency (LOW | MEDIUM | HIGH) -> label and the CSS class that already exists.
const URGENCY_UI = {
  HIGH: { label: "Urgent", className: "urgency-high" },
  MEDIUM: { label: "Moderate", className: "urgency-medium" },
  LOW: { label: "Routine", className: "urgency-low" },
};

function AIRecommendation() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [coords, setCoords] = useState(null);      // { latitude, longitude } from the browser, or null
  const [locating, setLocating] = useState(false);
  const [locationMsg, setLocationMsg] = useState("");
  const [result, setResult] = useState(null);      // the real answer from the backend
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});        // field errors (shown under the field)
  const [apiError, setApiError] = useState("");    // error from the server (shown above the button)

  const validate = () => {
    const e = {};
    if (!form.symptoms.trim()) e.symptoms = "Please describe your symptoms.";
    if (form.age && (Number(form.age) < 1 || Number(form.age) > 120)) {
      e.age = "Age must be between 1 and 120.";
    }
    return e;
  };

  // Ask the browser for the position. This is optional: the AI also works without it.
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationMsg("Your browser does not support location.");
      return;
    }
    setLocating(true);
    setLocationMsg("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocating(false);
      },
      (geoError) => {
        setLocationMsg(
          geoError.code === 1
            ? "Location permission was denied. You can still continue without it."
            : "Could not get your location. You can still continue without it."
        );
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    setResult(null);

    // The backend only has a "symptoms" text field, so age and service are added as a short hint.
    const hints = [];
    if (form.age) hints.push(`Patient age: ${form.age}.`);
    if (form.service !== DEFAULT_SERVICE) hints.push(`Preferred service: ${form.service}.`);
    const symptoms = [form.symptoms.trim().replace(/[.\s]+$/, "") + ".", ...hints].join(" ");

    const body = {
      symptoms,
      isEmergency: form.service === "Emergency Care", // "Emergency Care" marks the request as an emergency
    };
    if (coords) {
      body.latitude = coords.latitude;
      body.longitude = coords.longitude;
    }

    try {
      setResult(await recommend(body));
    } catch (err) {
      // A server crash gets a friendly text. Other errors (timeout, validation) use their own message.
      const status = err.response?.status;
      setApiError(
        status >= 500
          ? "The AI assistant is not available right now. Please try again in a moment."
          : getErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setCoords(null);
    setLocationMsg("");
    setResult(null);
    setErrors({});
    setApiError("");
  };

  const urgency = URGENCY_UI[result?.urgency] ?? URGENCY_UI.MEDIUM;
  const recommendations = result?.recommendations ?? [];

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
                <label>Age (optional)</label>
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
                <label>Location (optional)</label>
                <div className="ai-input-wrap">
                  <MdLocationOn size={18} className="ai-input-icon" />
                  <input
                    type="text"
                    readOnly
                    placeholder="Use the button below"
                    value={
                      coords
                        ? `Location found (${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)})`
                        : ""
                    }
                  />
                </div>
                <button
                  type="button"
                  className="reset-btn"
                  style={{ marginTop: "8px" }}
                  onClick={handleUseLocation}
                  disabled={locating}
                >
                  <MdMyLocation size={15} /> {locating ? "Finding you..." : "Use my location"}
                </button>
                {locationMsg && <span className="ai-error">{locationMsg}</span>}
              </div>
            </div>

            <div className="ai-form-group">
              <label>Symptoms</label>
              <div className="ai-input-wrap ai-textarea-wrap">
                <MdMedicalServices size={18} className="ai-input-icon ai-textarea-icon" />
                <textarea
                  placeholder="Describe your symptoms (e.g. fever, chest pain, cough...)"
                  rows="4"
                  maxLength={900}
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

            <FormMessage type="error">{apiError}</FormMessage>

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
                <span className={`urgency-badge ${urgency.className}`}>
                  {urgency.label}
                </span>
              </div>

              {result.suggestedSpecialization && (
                <div className="ai-result-advice">
                  <FaStethoscope size={15} color="#087ea4" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p>Suggested specialization: <strong>{result.suggestedSpecialization}</strong></p>
                </div>
              )}

              {recommendations.length === 0 && (
                <div className="ai-result-advice">
                  <p>No matching facility was found right now. Please try describing your symptoms in more detail.</p>
                </div>
              )}

              {recommendations.map((item, index) => (
                <div className="ai-result-facility" key={`${item.facilityId}-${item.doctorName ?? index}`}>
                  <div className="result-facility-icon">
                    <MdLocalHospital size={22} color="#087ea4" />
                  </div>
                  <div>
                    <small>{index === 0 ? "RECOMMENDED FACILITY" : "ALTERNATIVE"}</small>
                    <strong>{item.facilityName}</strong>
                    {item.doctorName && (
                      <p><MdPerson size={12} /> {item.doctorName}</p>
                    )}
                    {item.matchScore != null && (
                      <p><MdCheckCircle size={12} /> Match score: {item.matchScore}%</p>
                    )}
                    {item.reason && <p>{item.reason}</p>}
                  </div>
                </div>
              ))}

              {result.disclaimer && (
                <div className="ai-warning" style={{ marginBottom: "16px" }}>
                  <MdWarningAmber size={18} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p>{result.disclaimer}</p>
                </div>
              )}

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