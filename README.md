# MnVisionAI – AI-Powered Manganese Mining Intelligence Platform

> **An integrated AI/ML and space-technology platform for manganese prospectivity analysis, production forecasting, shortfall-risk prediction, geospatial intelligence, and AI-assisted decision support for MOIL.**
---

## 1. Project Information

- **Project Title:** MnVisionAI – AI-Powered Manganese Mining Intelligence Platform
- **PS ID:** 26009
- **PS Title:** Using AI/ML and Space Technology to Identify Manganese Reserves and Overcome Production Shortfalls.
- **Category:** Software
- **Theme:** Space Technology
- **Target Organization:** MOIL Limited, Ministry of Steel 

### Core Idea

MnVisionAI is designed around three stages:

> **Predict → Understand → Act**

The system predicts manganese prospectivity and production outcomes, converts these outputs into understandable risk intelligence, and generates actionable decision-support recommendations.

---

## 2. Problem Statement

Manganese is an important raw material for the steel industry and is increasingly relevant to several emerging industrial applications. Efficient manganese mining therefore requires both improved mineral exploration intelligence and better management of production risks.

### 2.1 Identifying Areas with High Manganese Prospectivity

Traditional mineral exploration requires the analysis of geological, topographical, geospatial, and field information. These datasets are often studied independently, making large-scale prioritization of prospective areas difficult and resource-intensive. Satellite imagery and terrain information provide an opportunity to identify surface characteristics associated with manganese-bearing environments and prioritize areas for further geological investigation.

### 2.2 Anticipating Production Shortfalls

Mining production can also be affected by variations in production trends and environmental conditions. If potential shortfalls are identified only after the production period is complete, management has limited opportunity to respond proactively.

### 2.3 Need for an Integrated Platform

Geospatial intelligence, production analytics, environmental data, and model outputs can become difficult to interpret when available through separate systems.
MnVisionAI addresses this by bringing these intelligence streams into a single interactive platform.

---

## 3. Proposed Solution

MnVisionAI is an integrated mining intelligence and decision-support platform containing two major analytical pipelines.

### A. Manganese Prospectivity Intelligence

This module answers:

> **Where should further manganese investigation be prioritized?**

It combines:
- multispectral satellite information,
- spectral indices,
- terrain characteristics,
- documented manganese-associated spatial references,
- and controlled background samples.

The resulting prospectivity predictions are visualized through an interactive geospatial interface.

### B. Production Intelligence

This module answers:

> **What production outcome can be expected, and is there a risk of shortfall?**

It combines:

- historical production behaviour,
- temporal lag features,
- expected production,
- month progress,
- rainfall stress,
- and soil-moisture stress.

A two-stage machine-learning architecture is used:

1. **Classification Model** – predicts whether shortfall risk exists and estimates its probability.
2. **Regression Model** – estimates the magnitude of the expected shortfall and derives forecast production.

### C. AI-Assisted Decision Support

The ML results are passed through a FastAPI backend to an AI recommendation layer powered by the Gemini API.

Gemini receives structured analytical context such as:

- expected production,
- forecast production,
- predicted shortfall percentage,
- shortfall probability,
- rainfall stress,
- soil-moisture stress,
- and recent production history.

It then converts these analytical outputs into prioritized management-oriented recommendations.

If Gemini is temporarily unavailable, the system contains deterministic fallback recommendation logic so that the recommendation module continues to provide useful output.

---
## 4. Key Features

### Prospectivity Intelligence
- Manganese prospectivity prediction
- Sentinel-2 multispectral feature analysis
- Spectral-index based analysis
- Terrain-based feature enrichment
- Probability-based prospectivity classification
- Interactive geospatial visualization
- Identification of high and very-high prospectivity areas
- Location-level exploration intelligence

### Production Intelligence
- Historical production trend analysis
- Production lag feature engineering
- Shortfall-risk classification
- Shortfall probability estimation
- Shortfall magnitude prediction
- Expected production estimation
- Forecast production calculation
- Rainfall stress analysis
- Soil-moisture stress analysis
- Historical vs target vs forecast visualization

### AI & Decision Support

- Gemini-powered recommendation generation
- Structured ML-to-GenAI context transfer
- Priority-based recommendations
- Management-oriented recommendation summaries
- Grounding recommendations on model outputs
- Rule-based fallback recommendations when Gemini is unavailable
- Guardrails against unsupported mine-level claims
- AI conversational backend capability for analytical queries

## 5. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, JavaScript, Tailwind CSS, Leaflet.js |
| **Backend** | Python, FastAPI, Pydantic, Uvicorn|
| **Machine Learning** | Scikit-learn, Random Forest Classifier, Random Forest Regressor, HistGradientBoosting, LightGBM, XGBoost, Pandas, NumPy, Joblib, Pickle|
| **Generative AI** | Google Gemini API |
| **Geospatial & Remote Sensing** | Sentinel-2 Imagery, SRTM DEM, NDVI, BSI, Geospatial Data Processing |
| **Feature Engineering** | Lag Features, Rolling Statistics, Month/Trend Features, Rainfall Stress Index, Soil-Moisture Stress Index, Expected Production, Production Trend Estimation |
| **Data Sources** | Historical Production Data, Rainfall & Weather Data, Sentinel-2 Data, NASA POWER |
| **Cloud/Deployment** | Vercel, Render |
| **Version Control** | Git, GitHub |
| **Development Tools** | Jupyter Notebook, Visual Studio Code |
---

### 5.1 Manganese Prospectivity Features

The prospectivity pipeline combines multispectral, environmental, and terrain information.

#### Sentinel-2 Spectral Bands
- `B02` – Blue
- `B03` – Green
- `B04` – Red
- `B08` – Near Infrared
- `B11` – SWIR
- `B12` – SWIR

#### Spectral / Environmental Indices
- NDVI – Normalized Difference Vegetation Index
- NDWI – Normalized Difference Water Index
- BSI – Bare Soil Index
- visible/NIR relationships
- SWIR-derived information
- spectral ratios and statistics

#### Terrain Features

The satellite feature space is enriched using terrain characteristics such as:

- elevation,
- slope,
- terrain relief,
- relative elevation,
- and terrain complexity.

The combined representation can therefore be summarized as:

```text
Satellite Spectral Information
            +
Environmental / Spectral Indices
            +
Terrain Context
            ↓
Manganese Prospectivity Intelligence
```

The prospectivity model is designed to identify **areas of relatively higher manganese prospectivity**.

### 5.2 Prospectivity Development Data
This creates a supervised learning dataset in which spatial characteristics associated with known manganese occurrences can be compared with background locations.
The model output is subsequently converted into prospectivity scores/classes that can be displayed geographically.

---

### 5.3 Production Intelligence Features

The deployed production prediction models use seven primary features:

1. `production_lag_1m_lakh_tonnes`
2. `production_lag_2m_lakh_tonnes`
3. `production_lag_3m_lakh_tonnes`
4. `expected_production_lakh_tonnes`
5. `month_progress_pct`
6. `moil_weighted_rainfall_stress_index`
7. `moil_weighted_soil_moisture_stress_index`

These variables capture both historical production behaviour and current environmental conditions.

---

### 5.4 Production Model Architecture

Two machine-learning models are used.

#### Model 1 – Shortfall Classifier

The classifier determines whether the current production period indicates shortfall risk.

Outputs include:

```text
shortfall_risk
shortfall_probability
classification
```

Typical interpretation:

```text
0 / NO  → Lower shortfall risk
1 / YES → Shortfall risk detected
```

#### Model 2 – Shortfall Regressor

The regression model estimates the predicted magnitude of production shortfall.

Outputs include:

```text
predicted_shortfall_pct
expected_production_lakh_tonnes
forecast_production_lakh_tonnes
```

Forecast production is derived as:

```text
Forecast Production = Expected Production × (1 - Predicted Shortfall % / 100)
```

This two-stage architecture enables the platform to answer:

> **Is a shortfall likely? If so, what magnitude of shortfall is expected?**

---

### 5.5 Production Training Data Construction

The development panel contains approximately:

```text
10 MOIL mine reference points × 640 calendar days= ~6,400 mine-day observations
```
The environmental component was obtained from the **NASA POWER Daily API**, including rainfall and soil-moisture related information.

Public production information was obtained from MOIL public releases and Ministry of Steel reports.

### Important Data Granularity Note

Public MOIL production information is primarily available at a **company-month level**, rather than as historical mine-wise daily production.
Therefore, the ~6,400-row panel must not be interpreted as 6,400 independent production observations.
The mine-day construction primarily enables environmental information to be spatially and temporally aligned with production information.
For model validation, temporal/group-based separation should be preferred over randomly splitting repeated monthly labels across training and test data.

---

### 5.6 Public Shortfall Proxy

A complete historical series of official mine-wise planned-versus-actual production was not available in the public data used for prototype development.

Conceptually:

```text
Expected Production(t) = Mean of Production(t-1), Production(t-2), Production(t-3)
```

and:

```text
Shortfall(t) = max(0, Expected Production(t) - Actual Production(t))
```

with:

```text
Shortfall %(t) = Shortfall(t) / Expected Production(t) × 100
```


For operational deployment, the same architecture can directly consume internal:

- planned production,
- actual production,
- mine-wise production,
- equipment availability,
- downtime information,
- blasting delay information,
- and additional operational constraints.

---

### 5.7 Environmental Data Integration

The backend integrates environmental information from the **NASA POWER Daily API**.

Current production forecasting uses environmental indicators related to:

- rainfall,
- surface soil moisture,
- and derived rainfall / soil-moisture stress.

For multiple MOIL localities, environmental information can be aggregated into MOIL-wide weighted indicators before being supplied to the production models.

This allows the production model to combine:

```text
Historical Production Behaviour
              +
Current Environmental Stress
              ↓
Production Risk & Forecast
```

---

### 5.8 AI Recommendation Engine

The recommendation engine follows a hybrid ML + GenAI architecture.
The machine-learning models remain responsible for numerical prediction.

Instead:

```text
Production ML Models
        ↓
Structured Prediction Context
        ↓
      Gemini
        ↓
Management-Oriented Recommendations
```

The context supplied to the AI layer may include:

- current production forecast,
- target/expected production,
- shortfall probability,
- predicted shortfall percentage,
- rainfall stress,
- soil-moisture stress,
- month progress,
- and recent historical production.

Recommendations contain information such as:

```text
Priority
Category
Recommended Action
Reason / Supporting Context
```

The recommendation engine includes:

- grounding instructions,
- scope limitations,
- structured response validation,
- fallback rules,
- and safeguards against inventing unavailable mine-specific or equipment-specific information.

---

### AI Recommendations

Gemini is used as an interpretation and recommendation layer.

The architecture deliberately separates:

```text
ML Models → Quantitative Prediction
Gemini    → Interpretation / Recommendation
```
This prevents the generative model from replacing the underlying predictive models.

---

## 6. Future Scope

MnVisionAI provides an extensible architecture that can be strengthened considerably when additional operational data becomes available.

### Production Intelligence

- Integrate mine-wise planned and actual production data
- Incorporate blasting schedules, blasting delays and equipment downtime information
- Continuously retrain models as new production data becomes available

### Prospectivity Intelligence

- Expand manganese occurrence databases
- Integrate additional geological layers
- Add geochemical sampling, aeromagnetic / geophysical information
- Incorporate field-validation feedback into model retraining

### Explainable AI

- Add SHAP-based feature contribution analysis
- Add confidence and uncertainty intervals
- Improve model monitoring and drift detection

### Backend & Platform

- Add PostgreSQL/PostGIS for persistent spatial data management
- Add role-based authentication
- Add API rate limiting and caching for external API responses
- Introduce asynchronous processing for expensive workflows
- Add scheduled environmental-data ingestion
- Containerize services using Docker
- Add automated CI/CD pipelines
- Implement monitoring and observability

### Decision Support

- Automated high-risk alerts
- Configurable production thresholds
- Scenario-based production planning
- Mine-specific recommendations
- Recommendation feedback loops
- Human-in-the-loop validation
- Integration with internal MOIL operational systems

---

## Project Summary

**MnVisionAI** demonstrates an end-to-end approach for transforming mining, satellite, environmental, and production data into decision-support intelligence.

The platform integrates:

```text
SPACE TECHNOLOGY
       +
GEOSPATIAL INTELLIGENCE
       +
MACHINE LEARNING
       +
PRODUCTION ANALYTICS
       +
GENERATIVE AI
       ↓
MANGANESE MINING DECISION SUPPORT
```
---
## Installation

### Prerequisites

Before running the project locally, install:

- Git
- Python
- Node.js
- npm

A Gemini API key is required for live Gemini-powered AI functionality.

---

### Clone the Repository

```bash
git clone https://github.com/parthmalhotra-tech/MOIH-SIH.git
cd MOIH-SIH
```

---

### Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

#### Windows PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

#### macOS / Linux

```bash
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

---

### Configure Gemini API

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=YOUR_SUPPORTED_GEMINI_MODEL_ID
```

For example, if your Gemini API project supports the model used by the deployed application:

```env
GEMINI_MODEL=gemini-3.7-flash
```

The model is configured through the environment rather than being hard-coded, allowing it to be changed without modifying the application source code.


