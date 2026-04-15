# 🏦 Credit Wise: Explainable AI Loan Approval System

[![Live Demo](https://img.shields.io/badge/Demo-Live_Web_App-007bff?style=for-the-badge&logo=vercel)](https://credit-wise-loan-approval-system.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg?style=for-the-badge&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

🚀 **Live Web Application:** [credit-wise-loan-approval-system.vercel.app](https://credit-wise-loan-approval-system.vercel.app/)

## 📖 Project Overview
Credit Wise is an end-to-end full-stack Machine Learning application designed to automate and explain loan approval decisions. Built with a focus on **MLOps and Explainable AI (XAI)**, the system not only predicts whether a user qualifies for a loan but also provides the exact financial factor that drove the decision (Adverse Action Notice compliance).

## ✨ Key Features
* **Predictive Intelligence:** Utilizes a highly tuned XGBoost algorithm to assess credit risk based on 18 financial and demographic features.
* **Explainable AI (XAI):** Integrates SHAP (SHapley Additive exPlanations) to crack open the "black box" of the model, returning the *Primary Decision Factor* for every applicant.
* **Modern Web Interface:** A fully responsive, React.js front-end that handles complex JSON payloads and dynamically renders model confidence scores.
* **Production-Ready API:** A robust FastAPI backend equipped with CORS middleware, automated data validation (Pydantic), and error handling.
* **Automated CI/CD Pipeline:** Fully integrated with GitHub. Code pushes automatically trigger Docker builds on Render (Backend) and static deployments on Vercel (Frontend).

## 🛠️ Tech Stack
* **Machine Learning:** XGBoost, Scikit-Learn, Pandas, Numpy, SHAP
* **Backend:** Python, FastAPI, Uvicorn
* **Frontend:** React.js, Vite, HTML5/CSS3
* **DevOps & Deployment:** Docker, Render (Cloud Container Hosting), Vercel (Static UI Hosting), Git/GitHub

## 🏗️ System Architecture
1. **User Input:** Client submits financial details via the React UI hosted on Vercel.
2. **API Request:** JSON payload is sent to the FastAPI backend running inside a Docker container on Render.
3. **Preprocessing:** Data is transformed using saved artifacts (`scaler.pkl`, `ohe.pkl`, `label_encoder.pkl`).
4. **Inference:** XGBoost model predicts the loan outcome and calculates the probability.
5. **Explainability:** SHAP TreeExplainer identifies the top contributing feature to the decision.
6. **Response:** API returns the decision, confidence score, and primary factor back to the UI.

## 📂 Project Structure
```text
credit-wise-fullstack/
│
├── artifacts/                  # Saved ML models, scalers, and encoders
│   ├── loan_model.pkl
│   ├── scaler.pkl
│   ├── ohe.pkl
│   ├── label_encoder.pkl
│   └── feature_columns.json
│
├── credit-frontend/            # React.js Frontend Application
│   ├── src/
│   │   ├── App.jsx             # Main UI and API connection logic
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── main.py                     # FastAPI backend and inference logic
├── Dockerfile                  # Containerization instructions
├── requirements.txt            # Python dependencies (fastapi, xgboost, shap, etc.)
└── .gitignore
💻 Local Setup & Installation
To run this project locally on your machine, follow these steps:

1. Clone the Repository
Bash
git clone [https://github.com/YOUR-USERNAME/credit-wise-fullstack.git](https://github.com/YOUR-USERNAME/credit-wise-fullstack.git)
cd credit-wise-fullstack
2. Run the Backend (Docker)
Ensure Docker is installed and running on your machine.

Bash
# Build the Docker image
docker build -t credit-wise-api .

# Run the container on port 8000
docker run -d -p 8000:8000 credit-wise-api
The API will be available at http://localhost:8000/docs

3. Run the Frontend (React)
Open a new terminal window.

Bash
cd credit-frontend

# Install Node modules
npm install

# Start the development server
npm run dev
The web app will be available at http://localhost:5173

(Note: To run locally, ensure line 52 in App.jsx points to http://localhost:8000/predict instead of the Render URL).

📬 API Endpoints
POST /predict

Expects: A JSON payload containing 18 applicant features (Income, Credit Score, Loan Amount, etc.)

Returns: ```json
{
"loan_approved": "Yes",
"approval_probability": 0.8942,
"top_factor": "Credit Score",
"status": "Success"
}


🤝 Contact
Developed as an end-to-end MLOps and Full-Stack Machine Learning portfolio project.
