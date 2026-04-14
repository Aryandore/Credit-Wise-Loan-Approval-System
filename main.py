import json
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel

# 1. Initialize the app exactly ONCE
app = FastAPI(title="Credit Wise Loan Approval API")

# 2. Add CORS middleware immediately
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows your React app to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── LOAD ARTIFACTS ───
try:
    model = joblib.load("artifacts/loan_model.pkl")
    scaler = joblib.load("artifacts/scaler.pkl")
    ohe = joblib.load("artifacts/ohe.pkl")
    le_edu = joblib.load("artifacts/label_encoder.pkl")
    
    with open("artifacts/feature_columns.json", "r") as f:
        feat_cols = json.load(f)
except Exception as e:
    print(f"Error loading artifacts: {e}")

# (Notice the duplicate 'app = FastAPI...' is completely gone from here)

# ─── DATA MODEL ───
class LoanApplication(BaseModel):
    Applicant_Income: float
    Coapplicant_Income: float
    Employment_Status: str
    Age: int
    Marital_Status: str
    Dependents: float
    Credit_Score: float
    Existing_Loans: float
    DTI_Ratio: float
    Savings: float
    Collateral_Value: float
    Loan_Amount: float
    Loan_Term: float
    Loan_Purpose: str
    Property_Area: str
    Education_Level: str
    Gender: str
    Employer_Category: str

@app.get("/")
def home():
    return {"message": "Credit Wise API is running. Visit /docs for testing."}

@app.post("/predict")
def predict_loan(data: LoanApplication):
    try:
        input_dict = data.model_dump()
        input_df = pd.DataFrame([input_dict])
        
        input_df["Education_Level"] = le_edu.transform(input_df["Education_Level"])
        
        cat_cols = ["Employment_Status", "Marital_Status", "Loan_Purpose", 
                    "Property_Area", "Gender", "Employer_Category"]
        
        encoded_cats = ohe.transform(input_df[cat_cols])
        encoded_df = pd.DataFrame(encoded_cats, 
                                  columns=ohe.get_feature_names_out(cat_cols), 
                                  index=input_df.index)
        
        final_df = pd.concat([input_df.drop(columns=cat_cols), encoded_df], axis=1)
        final_df = final_df.reindex(columns=feat_cols, fill_value=0)
        
        scaled_data = scaler.transform(final_df)
        
        prediction = model.predict(scaled_data)[0]
        probability = model.predict_proba(scaled_data)[0][1]
        
        return {
            "loan_approved": "Yes" if int(prediction) == 1 else "No",
            "approval_probability": round(float(probability), 4),
            "status": "Success"
        }

    except ValueError as v_err:
        raise HTTPException(status_code=400, detail=f"Data Error: {str(v_err)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")