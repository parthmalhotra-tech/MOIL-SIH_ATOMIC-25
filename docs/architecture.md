# System Architecture

``` text
                                  USER
                                    │
                                    ▼
                           ┌─────────────────┐
                           │   WEB BROWSER   │
                           └────────┬────────┘
                                    │
                                    ▼
                    ╔══════════════════════════╗
                    ║      REACT FRONTEND      ║
                    ║          (JSX)           ║
                    ╚════════════╤═════════════╝
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        HTML / CSS          JavaScript        React Components
        UI / Styling        Functionality     & JSX
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │      DASHBOARD UI      │
                    └────────────┬───────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
             ▼                   ▼                   ▼
       ┌────────────┐     ┌────────────────┐   ┌──────────────┐
       │ GIS MODULE │     │ PRODUCTION &    │   │  GEMINI AI   │
       │  Leaflet   │     │   SHORTFALL     │   │  ASSISTANT   │
       └─────┬──────┘     └───────┬────────┘   └──────┬───────┘
             │                    │                   │
             ▼                    ▼                   ▼
      Interactive GIS       Production Data      AI Interaction
      Layer Overlay         & Shortfall Risk
             │                    │                   │
             └────────────────────┼───────────────────┘
                                  │
                                  ▼
                    ┌────────────────────────┐
                    │    API INTEGRATION     │
                    │     Fetch +JSON        │
                    └────────────┬───────────┘
                                 │
                                 ▼
              ╔════════════════════════════════════╗
              ║          FASTAPI BACKEND            ║
              ║             REST APIs               ║
              ╚════════════════╤═══════════════════╝
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Prospectivity      Production      Risk / Shortfall
             API               API               API
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                 ╔════════════════════════════╗
                 ║       ML ENGINE            ║
                 ╚════════════╤═══════════════╝
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ GEE + SENTINEL-2 DATA    │
                 │    Satellite Imagery     │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │    FEATURE EXTRACTION    │
                 └────────────┬─────────────┘
                              │
          ┌───────────────────┼────────────────────┐
          │                   │                    │
          ▼                   ▼                    ▼
   Spectral Bands       Spectral Indices     Terrain Features
   B02 B03 B04          NDVI NDWI BSI        Elevation
   B08 B11 B12                               Slope
                                             Relief
          │                   │                    │
          └───────────────────┼────────────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │   DATASET CREATION       │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ DATA CLEANING &          │
                 │ PREPROCESSING            │
                 │ Imputation / Scaling /   │
                 │ Feature Preparation      │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ FEATURE ENGINEERING      │
                 │ Ratios / Differences /   │
                 │ Means / Terrain Features │
                 └────────────┬─────────────┘
                              │
                              ▼
                    FEATURE MATRIX (X)
                       + TARGET (y)
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ MODEL TRAINING &         │
                 │ COMPARISON               │
                 └────────────┬─────────────┘
                              │
          ┌───────────┬────────┼────────┬───────────┐
          ▼           ▼        ▼        ▼           ▼
      Logistic     Random   Extra    HistGradient  LightGBM
      Regression   Forest   Trees      Boosting
          │           │        │        │           │
          └───────────┴────────┼────────┴───────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ MODEL EVALUATION &       │
                 │ SELECTION                │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ BEST PERFORMING MODEL    │
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │    FINAL MODEL TRAINING  │
                 └────────────┬─────────────┘
                              │
                              ▼
                    NEW GEE / SENTINEL-2
                           DATA
                              │
                              ▼
                 SAME FEATURE PREPROCESSING
                              │
                              ▼
                    ┌──────────────────┐
                    │ MODEL PREDICTION │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    ▼                  ▼
             Manganese             Manganese
             Probability           Prediction
                (0–1)                (0 / 1)
                    │                  │
                    └────────┬─────────┘
                             ▼
                  PROSPECTIVITY
                  CLASSIFICATION
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
           Very Low         Low          Moderate
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
                  High            Very High
                    │                 │
                    └────────┬────────┘
                             ▼
                 INDIA PROSPECTIVITY MAP
                  / HIGH-POTENTIAL ZONES
                             │
                             ▼
                 ╔════════════════════════╗
                 ║   RECOMMENDATION      ║
                 ║       LAYER           ║
                 ╚════════════╤═══════════╝
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             ML / Rule-Based       GEMINI AI
             Recommendations       Processing
                    │                   │
                    └─────────┬─────────┘
                              ▼
                 ┌────────────────────────┐
                 │ GEMINI AI              │
                 │ RECOMMENDATION ENGINE   │
                 └────────────┬───────────┘
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
        Production Target   Corrective     Operational
        Recommendations      Actions          Alerts
              │               │                │
              └───────────────┼────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  JSON RESPONSE   │
                    └────────┬─────────┘
                             │
                             ▼
                    REACT STATE UPDATE
                             │
              ┌──────────────┼───────────────┐
              ▼              ▼               ▼
         UPDATE GIS     UPDATE CHARTS    LIVE ACTION
           LAYERS                          CARDS
                                              │
                                              ▼
                                    RECOMMENDATIONS
```
