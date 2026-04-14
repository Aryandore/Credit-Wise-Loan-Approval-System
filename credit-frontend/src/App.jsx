import { useState } from 'react'
import './App.css'

function App() {
  // 1. Set up the default form data
  const [formData, setFormData] = useState({
    Applicant_Income: 5000,
    Coapplicant_Income: 0,
    Employment_Status: "Salaried",
    Age: 35,
    Marital_Status: "Married",
    Dependents: 0,
    Credit_Score: 700,
    Existing_Loans: 0,
    DTI_Ratio: 0.25,
    Savings: 10000,
    Collateral_Value: 50000,
    Loan_Amount: 20000,
    Loan_Term: 360,
    Loan_Purpose: "Personal",
    Property_Area: "Urban",
    Education_Level: "Graduate",
    Gender: "Male",
    Employer_Category: "Private"
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Handle typing in the inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Handle clicking the submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Ensure number fields are parsed as numbers before sending
      const payload = {
        ...formData,
        Applicant_Income: Number(formData.Applicant_Income),
        Coapplicant_Income: Number(formData.Coapplicant_Income),
        Age: Number(formData.Age),
        Dependents: Number(formData.Dependents),
        Credit_Score: Number(formData.Credit_Score),
        Existing_Loans: Number(formData.Existing_Loans),
        DTI_Ratio: Number(formData.DTI_Ratio),
        Savings: Number(formData.Savings),
        Collateral_Value: Number(formData.Collateral_Value),
        Loan_Amount: Number(formData.Loan_Amount),
        Loan_Term: Number(formData.Loan_Term)
      };

      // Call your FastAPI Docker container
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.detail || "Error from API");
      }
    } catch (err) {
      setError("Could not connect to the API. Is your Docker container running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🏦 Credit Wise Loan Approval</h1>
      <p>Fill out the application below to get an instant AI-powered decision.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Simple grouping for inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <label>
            Age: <br/>
            <input type="number" name="Age" value={formData.Age} onChange={handleChange} required />
          </label>
          <label>
            Credit Score: <br/>
            <input type="number" name="Credit_Score" value={formData.Credit_Score} onChange={handleChange} required />
          </label>
          <label>
            Applicant Income ($): <br/>
            <input type="number" name="Applicant_Income" value={formData.Applicant_Income} onChange={handleChange} required />
          </label>
          <label>
            Loan Amount ($): <br/>
            <input type="number" name="Loan_Amount" value={formData.Loan_Amount} onChange={handleChange} required />
          </label>
          <label>
            Education: <br/>
            <select name="Education_Level" value={formData.Education_Level} onChange={handleChange}>
              <option value="Graduate">Graduate</option>
              <option value="Not Graduate">Not Graduate</option>
            </select>
          </label>
          <label>
            Employment: <br/>
            <select name="Employment_Status" value={formData.Employment_Status} onChange={handleChange}>
              <option value="Salaried">Salaried</option>
              <option value="Self-employed">Self-employed</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: '20px', padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
          {loading ? "Analyzing..." : "Get Loan Decision"}
        </button>
      </form>

      {/* 4. Display Results */}
      {error && <div style={{ color: 'red', marginTop: '20px', padding: '10px', border: '1px solid red' }}>🚨 {error}</div>}
      
      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: result.loan_approved === "Yes" ? '#d4edda' : '#f8d7da',
          color: result.loan_approved === "Yes" ? '#155724' : '#721c24'
        }}>
          <h2>{result.loan_approved === "Yes" ? "🎉 Approved!" : "❌ Rejected"}</h2>
          <p><strong>Confidence Score:</strong> {(result.approval_probability * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  )
}

export default App