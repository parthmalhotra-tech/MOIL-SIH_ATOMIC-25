/**
 * Production Risk Data
 * 
 * Risk distribution for mines/locations.
 * Replace with real risk model output when backend is connected.
 * 
 * Expected API shape:
 * {
 *   distribution: [
 *     { level: 'Low', count: number, percentage: number },
 *     { level: 'Medium', count: number, percentage: number },
 *     { level: 'High', count: number, percentage: number },
 *     { level: 'Very High', count: number, percentage: number },
 *   ],
 *   totalLocations: number,
 *   highRiskDetails: [
 *     { location: string, state: string, riskScore: number, shortfallRisk: number }
 *   ]
 * }
 */

export const riskData = {
  distribution: [
    { level: "Low", count: 156, percentage: 42.2, color: "#22c55e" },
    { level: "Medium", count: 128, percentage: 34.6, color: "#eab308" },
    { level: "High", count: 62, percentage: 16.8, color: "#f97316" },
    { level: "Very High", count: 24, percentage: 6.5, color: "#ef4444" },
  ],
  totalLocations: 370,
  highRiskDetails: [
    { location: "Sundargarh Block A", state: "Odisha", riskScore: 0.92, shortfallRisk: 0.85 },
    { location: "Balaghat Deep Mine", state: "Madhya Pradesh", riskScore: 0.89, shortfallRisk: 0.81 },
    { location: "Nagpur Sector 3", state: "Maharashtra", riskScore: 0.87, shortfallRisk: 0.78 },
    { location: "West Singhbhum Zone", state: "Jharkhand", riskScore: 0.85, shortfallRisk: 0.75 },
    { location: "Keonjhar Extension", state: "Odisha", riskScore: 0.83, shortfallRisk: 0.72 },
  ],
};