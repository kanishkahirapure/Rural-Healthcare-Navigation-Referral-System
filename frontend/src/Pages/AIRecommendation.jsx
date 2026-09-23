import "./AIRecommendation.css";

function AIRecommendation() {
  return (
    <div className="ai-page">

      {/* Header */}
      <header className="ai-header">
        <div>
          <span className="ai-badge">✨ AI Healthcare Assistant</span>
          <h1>AI Health Recommendation</h1>
          <p>
            Get personalized healthcare guidance based on your symptoms
            and requirements.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="ai-content">

        {/* Form */}
        <section className="ai-form-card">
          <h2>Tell us about your health concern</h2>
          <p className="form-description">
            Enter basic information to receive a suitable healthcare
            recommendation.
          </p>

          <label>Age</label>
          <input type="number" placeholder="Enter your age" />

          <label>Location</label>
          <input type="text" placeholder="Enter your village / city" />

          <label>Symptoms</label>
          <textarea
            placeholder="Describe your symptoms..."
            rows="5"
          ></textarea>

          <label>Healthcare Service</label>
          <select>
            <option>Select a service</option>
            <option>General Consultation</option>
            <option>Emergency Care</option>
            <option>Diagnostic Services</option>
            <option>Specialist Consultation</option>
            <option>Maternity Care</option>
          </select>

          <button className="recommend-btn">
            ✨ Get AI Recommendation
          </button>
        </section>

        {/* Recommendation Info */}
        <section className="ai-info-card">
          <div className="ai-icon">🤖</div>

          <h2>How AI Assistance Works</h2>

          <div className="ai-step">
            <span>1</span>
            <div>
              <h3>Enter your symptoms</h3>
              <p>Provide basic information about your health concern.</p>
            </div>
          </div>

          <div className="ai-step">
            <span>2</span>
            <div>
              <h3>AI analyzes your information</h3>
              <p>
                The system processes the information to identify
                suitable healthcare options.
              </p>
            </div>
          </div>

          <div className="ai-step">
            <span>3</span>
            <div>
              <h3>Get healthcare guidance</h3>
              <p>
                Receive recommended services or healthcare facilities
                for further assistance.
              </p>
            </div>
          </div>

          <div className="ai-warning">
            ⚠️ This AI recommendation is for guidance only and is not
            a substitute for professional medical advice.
          </div>
        </section>

      </div>

    </div>
  );
}

export default AIRecommendation;