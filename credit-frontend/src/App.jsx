import { useState } from 'react'
import './App.css'

function App() {
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Parse numbers correctly
      const payload = Object.keys(formData).reduce((acc, key) => {
        const val = formData[key];
        acc[key] = ["Age", "Applicant_Income", "Coapplicant_Income", "Dependents", 
                    "Credit_Score", "Existing_Loans", "DTI_Ratio", "Savings", 
                    "Collateral_Value", "Loan_Amount", "Loan_Term"].includes(key) 
                    ? Number(val) : val;
        return acc;
      }, {});

      const response = await fetch("https://credit-wise-loan-approval-system.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Error connecting to API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
      <h1 style={{ textAlign: 'center' }}>🏦 Credit Wise AI</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{key.replace("_", " ")}</label>
            {typeof formData[key] === "string" && !["Age", "Dependents"].includes(key) ? (
              <input name={key} value={formData[key]} onChange={handleChange} />
            ) : (
              <input type="number" name={key} value={formData[key]} onChange={handleChange} />
            )}
          </div>
        ))}

        <button type="submit" style={{ gridColumn: 'span 2', padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          {loading ? "Analyzing Risk..." : "Submit Application"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', padding: '20px', borderRadius: '10px', textAlign: 'center', 
                      backgroundColor: result.loan_approved === "Yes" ? '#d4edda' : '#f8d7da' }}>
          <h2>Result: {result.loan_approved === "Yes" ? "Approved 🎉" : "Rejected ❌"}</h2>
          <p>Confidence: {(result.approval_probability * 100).toFixed(1)}%</p>
          <p><strong>Primary Decision Factor:</strong> {result.top_factor}</p>
        </div>
      )}
    </div>
  )
}

export default App