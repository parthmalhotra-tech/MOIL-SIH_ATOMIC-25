/**
 * KPI Data Configuration
 * 
 * This file provides the data structure for KPI cards.
 * Replace with real API data when backend is connected.
 * 
 * Expected API shape:
 * {
 *   prospectivity: { highVeryHighZones: number },
 *   production: { forecastProduction: number, unit: string, period: string },
 *   shortfall: { expectedShortfallPercent: number },
 *   risk: { highRiskLocations: number }
 * }
 */

export const kpiData = {
  prospectivity: {
    highVeryHighZones: 247,
    label: "High & Very High Zones",
    unit: "zones",
    trend: "+12%",
    trendLabel: "vs last quarter",
  },
  production: {
    forecastProduction: 2.84,
    label: "Forecast Production",
    unit: "Mt",
    period: "FY 2025-26",
    trend: "+0.18 Mt",
    trendLabel: "vs FY 2024-25",
  },
  shortfall: {
    expectedShortfallPercent: 18.7,
    label: "Expected Shortfall",
    unit: "%",
    trend: "-2.3%",
    trendLabel: "improvement YoY",
  },
  risk: {
    highRiskLocations: 34,
    label: "High Risk Locations",
    unit: "sites",
    trend: "+5",
    trendLabel: "new risk sites",
  },
};

/**
 * Type definitions for TypeScript consumers
 * For TS projects, use: import type { KpiData } from './kpiData';
 */