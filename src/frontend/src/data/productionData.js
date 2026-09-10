/**
 * Production Forecast Data
 * 
 * Historical production data and forecast for the chart.
 * Replace with real API data when backend is connected.
 * 
 * Expected API shape:
 * {
 *   historical: [{ year: string, production: number, unit: string }],
 *   forecast: [{ year: string, production: number, unit: string, confidence?: number }],
 *   target: number,
 *   unit: string,
 * }
 */

export const productionData = {
  unit: "Mt",
  target: 3.5, // Target production in Mt
  historical: [
    { year: "2018-19", production: 2.45 },
    { year: "2019-20", production: 2.52 },
    { year: "2020-21", production: 2.38 },
    { year: "2021-22", production: 2.61 },
    { year: "2022-23", production: 2.68 },
    { year: "2023-24", production: 2.66 },
  ],
  forecast: [
    { year: "2024-25", production: 2.72, confidence: 0.85 },
    { year: "2025-26", production: 2.84, confidence: 0.78 },
    { year: "2026-27", production: 2.95, confidence: 0.70 },
    { year: "2027-28", production: 3.08, confidence: 0.62 },
    { year: "2028-29", production: 3.22, confidence: 0.55 },
  ],
};