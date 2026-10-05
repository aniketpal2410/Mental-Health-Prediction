# MindCare — Mental Health Prediction & Well-Being Platform

> **"Understand your mind. Take care of yourself."**

MindCare is a modern, responsive web application that leverages machine learning to assess mental health balance and digital strain. By analyzing lifestyle factors—including daily screen time, sleep patterns, study habits, physical activity, and subjective stress—MindCare predicts a mental health score, categorizes risk levels, and provides personalized, actionable recommendations with persistent historical tracking.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Database Setup](#4-database-setup)
  - [5. Frontend Setup](#5-frontend-setup)
- [API Reference](#api-reference)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Machine Learning Pipeline](#machine-learning-pipeline)
- [Medical Disclaimer](#medical-disclaimer)

---

## Overview

MindCare combines a trained `RandomForestRegressor` pipeline with an intuitive, calming React user interface and a robust FastAPI backend backed by PostgreSQL. The system evaluates 12 demographic and lifestyle features to predict a continuous mental well-being score on a 0–10 scale:

- **Low Risk (Score ≥ 7.2)**: Healthy balance across screen habits, sleep, and physical activity.
- **Moderate Risk (Score 5.3 – 7.19)**: Moderate digital strain with room for recovery optimization.
- **High Risk (Score < 5.3)**: Elevated strain requiring intentional digital boundaries and rest.

---

## Key Features

- **Guided 4-Step Assessment**: Step-by-step questionnaire with instant validation covering demographics, digital usage, daily routines, and stress indicators.
- **Instant ML Inference**: Real-time scoring using a pre-trained scikit-learn pipeline with custom compatibility shims.
- **Personalized Insights**: Tailored status messages, lifestyle tips, and actionable well-being suggestions.
- **Persistent Assessment History**: Anonymous, visitor-scoped history stored in PostgreSQL and tracked via client UUID.
- **Fully Responsive UI**: Mobile-first design optimized for devices from 360px width up to 4K desktop displays.
- **Privacy Conscious**: No mandatory account creation; assessments are associated only with an anonymous visitor token.

---

## Tech Stack

### Frontend
- **React 19** with **Vite 6**
- **Tailwind CSS v4** for modern utility-first styling
- **React Router v7** for single-page routing
- **Lucide React** for icons

### Backend
- **FastAPI** (Python 3.10+)
- **SQLAlchemy 2.0** ORM
- **PostgreSQL** via **psycopg v3**
- **Pydantic v2** for request/response validation
- **Uvicorn** ASGI server

### Machine Learning
- **Scikit-learn 1.6.1+** (`RandomForestRegressor` with `ColumnTransformer`)
- **Joblib** for model serialization
- **NumPy & Pandas** for feature preparation

---

## Project Structure

```text
Mental-Health-Prediction/
├── backend/
│   ├── models/
│   │   └── Mental_Health_Model.pkl   # Pre-trained ML pipeline (25.7MB)
│   ├── config.py                     # Environment & app configuration
│   ├── crud.py                       # SQLAlchemy database operations
│   ├── database.py                   # DB connection & sessionmaker
│   ├── main.py                       # FastAPI application & route handlers
│   ├── model_loader.py               # Robust ML model loading & version shims
│   ├── models.py                     # SQLAlchemy database models
│   ├── prediction.py                 # Prediction logic & score thresholding
│   ├── requirements.txt              # Python package dependencies
│   ├── schemas.py                    # Pydantic validation schemas
│   ├── test_api.py                   # API smoke tests
│   └── test_db_flow.py               # Database & history integration tests
├── frontend/
│   ├── public/                       # Static public assets and SVG icons
│   ├── src/
│   │   ├── api/                      # Axios/fetch API clients
│   │   ├── assets/                   # UI graphics and brand illustrations
│   │   ├── components/               # Reusable React components
│   │   ├── pages/                    # Route pages (Home, Assessment, Result, Tips, History, About)
│   │   ├── services/                 # API service layer
│   │   ├── utils/                    # Visitor UUID and helper utilities
│   │   ├── App.jsx                   # Main routing & application layout
│   │   ├── index.css                 # Global CSS and Tailwind directives
│   │   └── main.jsx                  # React DOM entry point
│   ├── package.json                  # Frontend dependencies and npm scripts
│   └── vite.config.js                # Vite build configuration
├── .env.example                      # Root environment configuration template
├── .gitignore                        # Git ignore patterns
└── README.md                         # Project documentation
```

---

## Prerequisites

Before running the project locally, make sure you have:

- **Python**: Version 3.10, 3.11, or 3.12
- **Node.js**: Version 18.x or 20.x+ (with `npm`)
- **PostgreSQL**: Version 14+ running locally or remotely

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Mental-Health-Prediction.git
cd Mental-Health-Prediction
```

### 2. Environment Configuration

Copy `.env.example` to create your local `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` to configure your PostgreSQL credentials and server settings:

```env
DATABASE_URL=postgresql+psycopg://postgres:yourpassword@localhost:5432/mindcare
HOST=0.0.0.0
PORT=8000
DEBUG=false
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

### 3. Backend Setup

Create a virtual environment and install the required Python packages:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 4. Database Setup

Ensure PostgreSQL is running and create the `mindcare` database:

```sql
CREATE DATABASE mindcare;
```

When you start the backend server, SQLAlchemy automatically creates the required tables (`prediction_results`) if they do not already exist.

Start the FastAPI server:

```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will now be accessible at `http://localhost:8000`. You can explore interactive Swagger documentation at `http://localhost:8000/docs`.

### 5. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173` to view the application.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning model and DB connection status |
| `GET` | `/api/model-info` | Returns model type, input features, and supported categories |
| `POST` | `/api/predict` | Computes mental health score and risk level for an assessment |
| `POST` | `/api/results/save` | Persists an assessment result linked to a `visitor_id` |
| `GET` | `/api/results/history/{visitor_id}` | Retrieves all saved assessments for a visitor (newest first) |
| `GET` | `/api/results/{result_id}?visitor_id={visitor_id}` | Retrieves a single result with visitor ownership check |
| `DELETE` | `/api/results/{result_id}?visitor_id={visitor_id}` | Deletes a saved result record |

---

## Testing & Quality Assurance

### Backend Smoke Tests
Verify API connectivity, model inference, and input validation:
```bash
python backend/test_api.py
```

### Database & History Integration Tests
Verify database persistence, visitor history ordering, ownership security, and deletion:
```bash
python backend/test_db_flow.py
```

### Frontend Production Build
Verify that the React production bundle builds cleanly with zero errors:
```bash
cd frontend
npm run build
```

---

## Machine Learning Pipeline

The mental health prediction model is a `RandomForestRegressor` trained with scikit-learn.

### Inputs (12 Features)
- **Demographics**: `Age`, `Gender`, `Grouped_Country`, `Academic_Level`
- **Digital Engagement**: `Most_Used_Platform`, `Purpose_Of_Use`, `Avg_Daily_Usage_Hours`, `Daily_Unlocks`
- **Lifestyle & Well-being**: `Study_Hours`, `Physical_Activity_Hours`, `Sleep_Hours_Per_Night`, `Stress_Level`

### Model Compatibility
The model was serialized with scikit-learn 1.6.1. The backend loader (`backend/model_loader.py`) includes runtime shims to seamlessly load and evaluate across newer scikit-learn releases (1.6.x – 1.9.x) without warnings or compatibility errors.

---

## Medical Disclaimer

> **Important**: MindCare is an informational and educational self-assessment tool designed to provide general insights into digital wellness and lifestyle balance. It does **not** provide medical diagnoses, psychological evaluations, or clinical advice. If you or someone you know is experiencing acute distress, mental health challenges, or a crisis, please reach out to a licensed healthcare professional or a local mental health helpline.
