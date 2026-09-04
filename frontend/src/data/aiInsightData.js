/**
 * AI Intelligence Brief Data
 * 
 * Dynamic insights generated from ML models.
 * Replace with real LLM/ML-generated insights when backend is connected.
 * 
 * Expected API shape:
 * {
 *   insights: [
 *     { id: string, type: 'prospectivity' | 'production' | 'risk' | 'operational', title: string, content: string, confidence: number, timestamp: string },
 *     ...
 *   ],
 *   generatedAt: string,
 *   modelVersion: string,
 * }
 */

export const aiInsightData = {
  modelVersion: "MnAI-Prospectivity-v2.3.1",
  generatedAt: "2026-01-15T08:30:00Z",
  insights: [
    {
      id: "insight-1",
      type: "prospectivity",
      title: "Concentrated High-Prospectivity Zones Identified",
      content: "Model predictions indicate concentrated high-prospectivity zones in several established manganese belts across Odisha, Madhya Pradesh, and Maharashtra. The Sundargarh-Keonjhar corridor (Odisha) and Balaghat district (Madhya Pradesh) show the highest prospectivity scores (>0.85), correlating strongly with known Gondite and Kodurite formations.",
      confidence: 0.91,
      timestamp: "2026-01-15T08:30:00Z",
    },
    {
      id: "insight-2",
      type: "production",
      title: "Production Shortfall Narrowing",
      content: "Forecast models project a gradual reduction in production shortfall from 18.7% (FY 2025-26) to 8.2% (FY 2028-29), driven by capacity expansions at MOIL's Balaghat and Ukwa mines, plus new lease auctions in Odisha. However, logistical bottlenecks in rail evacuation from Sundargarh remain a key constraint.",
      confidence: 0.84,
      timestamp: "2026-01-15T08:30:00Z",
    },
    {
      id: "insight-3",
      type: "risk",
      title: "Elevated Operational Risk in 34 Locations",
      content: "Risk assessment flags 34 mining locations with High/Very High shortfall risk. Primary drivers: aging infrastructure (avg. 28 years), monsoon-related access disruptions in Odisha/Jharkhand, and pending environmental clearances for 12 lease extensions. Priority mitigation: infrastructure renewal at Balaghat Deep Mine and Sundargarh Block A.",
      confidence: 0.88,
      timestamp: "2026-01-15T08:30:00Z",
    },
    {
      id: "insight-4",
      type: "operational",
      title: "Satellite-Detected Anomalies Warrant Field Verification",
      content: "Sentinel-2 time-series analysis (B08/B11 ratio + BSI trends) reveals 7 previously undocumented surface mineralization anomalies in Chhindwara (MP) and Gadchiroli (MH) districts. Recommend targeted ground-truthing campaigns in Q2 FY 2025-26 to validate prospectivity model extensions.",
      confidence: 0.76,
      timestamp: "2026-01-15T08:30:00Z",
    },
  ],
};