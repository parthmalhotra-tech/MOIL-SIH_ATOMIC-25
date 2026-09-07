/**
 * Prospectivity Map Mock Data
 * 
 * This file provides sample prediction points for UI development.
 * Replace with real ML model output (CSV/API) when backend is connected.
 * 
 * Expected API shape (array of prediction points):
 * [
 *   {
 *     latitude: number,
 *     longitude: number,
 *     state: string,
 *     district: string,
 *     prospectivity_score: number,  // 0-1
 *     prospectivity_class: 'Low' | 'Medium' | 'High' | 'Very High',
 *     B02: number,   // Blue band
 *     B03: number,   // Green band
 *     B04: number,   // Red band
 *     B08: number,   // NIR band
 *     B11: number,   // SWIR 1
 *     B12: number,   // SWIR 2
 *     NDVI: number,  // Normalized Difference Vegetation Index
 *     NDWI: number,  // Normalized Difference Water Index
 *     BSI: number,   // Bare Soil Index
 *     elevation_m: number,
 *     slope_deg: number,
 *     terrain_relief_m: number
 *   },
 *   ...
 * ]
 */

export const prospectivityMockData = [
  // Odisha - Major manganese belt
  {
    latitude: 21.9425,
    longitude: 85.2968,
    state: "Odisha",
    district: "Sundargarh",
    prospectivity_score: 0.92,
    prospectivity_class: "Very High",
    B02: 0.08, B03: 0.12, B04: 0.15, B08: 0.42, B11: 0.28, B12: 0.22,
    NDVI: 0.35, NDWI: 0.08, BSI: 0.42,
    elevation_m: 480, slope_deg: 12.5, terrain_relief_m: 180,
  },
  {
    latitude: 21.7589,
    longitude: 85.0784,
    state: "Odisha",
    district: "Sundargarh",
    prospectivity_score: 0.87,
    prospectivity_class: "High",
    B02: 0.09, B03: 0.13, B04: 0.16, B08: 0.38, B11: 0.30, B12: 0.24,
    NDVI: 0.31, NDWI: 0.06, BSI: 0.38,
    elevation_m: 520, slope_deg: 15.2, terrain_relief_m: 210,
  },
  {
    latitude: 22.0234,
    longitude: 85.4123,
    state: "Odisha",
    district: "Keonjhar",
    prospectivity_score: 0.78,
    prospectivity_class: "High",
    B02: 0.10, B03: 0.14, B04: 0.17, B08: 0.35, B11: 0.32, B12: 0.26,
    NDVI: 0.28, NDWI: 0.05, BSI: 0.35,
    elevation_m: 450, slope_deg: 10.8, terrain_relief_m: 160,
  },
  {
    latitude: 21.6345,
    longitude: 85.6789,
    state: "Odisha",
    district: "Mayurbhanj",
    prospectivity_score: 0.65,
    prospectivity_class: "Medium",
    B02: 0.12, B03: 0.16, B04: 0.19, B08: 0.30, B11: 0.35, B12: 0.28,
    NDVI: 0.42, NDWI: 0.12, BSI: 0.28,
    elevation_m: 380, slope_deg: 8.5, terrain_relief_m: 120,
  },
  
  // Madhya Pradesh
  {
    latitude: 22.9734,
    longitude: 80.2345,
    state: "Madhya Pradesh",
    district: "Balaghat",
    prospectivity_score: 0.94,
    prospectivity_class: "Very High",
    B02: 0.07, B03: 0.11, B04: 0.14, B08: 0.45, B11: 0.25, B12: 0.20,
    NDVI: 0.29, NDWI: 0.04, BSI: 0.48,
    elevation_m: 550, slope_deg: 18.3, terrain_relief_m: 240,
  },
  {
    latitude: 22.7654,
    longitude: 80.4567,
    state: "Madhya Pradesh",
    district: "Balaghat",
    prospectivity_score: 0.89,
    prospectivity_class: "High",
    B02: 0.08, B03: 0.12, B04: 0.15, B08: 0.41, B11: 0.27, B12: 0.22,
    NDVI: 0.32, NDWI: 0.05, BSI: 0.41,
    elevation_m: 510, slope_deg: 14.7, terrain_relief_m: 200,
  },
  {
    latitude: 23.1234,
    longitude: 80.7890,
    state: "Madhya Pradesh",
    district: "Chhindwara",
    prospectivity_score: 0.58,
    prospectivity_class: "Medium",
    B02: 0.13, B03: 0.17, B04: 0.20, B08: 0.28, B11: 0.36, B12: 0.29,
    NDVI: 0.45, NDWI: 0.15, BSI: 0.25,
    elevation_m: 420, slope_deg: 7.2, terrain_relief_m: 95,
  },
  {
    latitude: 22.4567,
    longitude: 80.1234,
    state: "Madhya Pradesh",
    district: "Jabalpur",
    prospectivity_score: 0.42,
    prospectivity_class: "Low",
    B02: 0.15, B03: 0.19, B04: 0.22, B08: 0.24, B11: 0.38, B12: 0.31,
    NDVI: 0.52, NDWI: 0.18, BSI: 0.18,
    elevation_m: 360, slope_deg: 5.8, terrain_relief_m: 70,
  },

  // Maharashtra
  {
    latitude: 21.1458,
    longitude: 79.0882,
    state: "Maharashtra",
    district: "Nagpur",
    prospectivity_score: 0.83,
    prospectivity_class: "High",
    B02: 0.09, B03: 0.13, B04: 0.16, B08: 0.39, B11: 0.29, B12: 0.23,
    NDVI: 0.33, NDWI: 0.07, BSI: 0.39,
    elevation_m: 440, slope_deg: 11.5, terrain_relief_m: 170,
  },
  {
    latitude: 20.9345,
    longitude: 79.5678,
    state: "Maharashtra",
    district: "Bhandara",
    prospectivity_score: 0.76,
    prospectivity_class: "High",
    B02: 0.10, B03: 0.14, B04: 0.17, B08: 0.36, B11: 0.31, B12: 0.25,
    NDVI: 0.36, NDWI: 0.09, BSI: 0.34,
    elevation_m: 390, slope_deg: 9.8, terrain_relief_m: 140,
  },
  {
    latitude: 20.4567,
    longitude: 79.8901,
    state: "Maharashtra",
    district: "Gadchiroli",
    prospectivity_score: 0.54,
    prospectivity_class: "Medium",
    B02: 0.13, B03: 0.17, B04: 0.20, B08: 0.29, B11: 0.37, B12: 0.30,
    NDVI: 0.48, NDWI: 0.14, BSI: 0.22,
    elevation_m: 320, slope_deg: 6.5, terrain_relief_m: 85,
  },

  // Karnataka
  {
    latitude: 15.3173,
    longitude: 75.7139,
    state: "Karnataka",
    district: "Ballari",
    prospectivity_score: 0.68,
    prospectivity_class: "Medium",
    B02: 0.11, B03: 0.15, B04: 0.18, B08: 0.32, B11: 0.34, B12: 0.27,
    NDVI: 0.40, NDWI: 0.11, BSI: 0.30,
    elevation_m: 580, slope_deg: 13.2, terrain_relief_m: 190,
  },
  {
    latitude: 14.9876,
    longitude: 75.4321,
    state: "Karnataka",
    district: "Chitradurga",
    prospectivity_score: 0.48,
    prospectivity_class: "Low",
    B02: 0.14, B03: 0.18, B04: 0.21, B08: 0.26, B11: 0.39, B12: 0.32,
    NDVI: 0.46, NDWI: 0.13, BSI: 0.20,
    elevation_m: 620, slope_deg: 8.9, terrain_relief_m: 110,
  },

  // Andhra Pradesh / Telangana
  {
    latitude: 17.6868,
    longitude: 81.3456,
    state: "Andhra Pradesh",
    district: "Visakhapatnam",
    prospectivity_score: 0.71,
    prospectivity_class: "High",
    B02: 0.10, B03: 0.14, B04: 0.17, B08: 0.34, B11: 0.33, B12: 0.26,
    NDVI: 0.38, NDWI: 0.10, BSI: 0.32,
    elevation_m: 720, slope_deg: 16.5, terrain_relief_m: 220,
  },
  {
    latitude: 18.1234,
    longitude: 80.5678,
    state: "Telangana",
    district: "Khammam",
    prospectivity_score: 0.52,
    prospectivity_class: "Medium",
    B02: 0.13, B03: 0.17, B04: 0.20, B08: 0.29, B11: 0.36, B12: 0.29,
    NDVI: 0.44, NDWI: 0.12, BSI: 0.24,
    elevation_m: 280, slope_deg: 7.8, terrain_relief_m: 90,
  },

  // Gujarat
  {
    latitude: 23.0225,
    longitude: 72.5714,
    state: "Gujarat",
    district: "Panchmahal",
    prospectivity_score: 0.45,
    prospectivity_class: "Low",
    B02: 0.15, B03: 0.19, B04: 0.22, B08: 0.25, B11: 0.38, B12: 0.31,
    NDVI: 0.50, NDWI: 0.16, BSI: 0.19,
    elevation_m: 220, slope_deg: 4.5, terrain_relief_m: 55,
  },

  // Rajasthan
  {
    latitude: 25.9123,
    longitude: 73.5678,
    state: "Rajasthan",
    district: "Udaipur",
    prospectivity_score: 0.38,
    prospectivity_class: "Low",
    B02: 0.16, B03: 0.20, B04: 0.23, B08: 0.23, B11: 0.40, B12: 0.33,
    NDVI: 0.41, NDWI: 0.08, BSI: 0.35,
    elevation_m: 580, slope_deg: 12.0, terrain_relief_m: 150,
  },

  // Jharkhand
  {
    latitude: 23.3441,
    longitude: 85.3096,
    state: "Jharkhand",
    district: "West Singhbhum",
    prospectivity_score: 0.81,
    prospectivity_class: "High",
    B02: 0.09, B03: 0.13, B04: 0.16, B08: 0.38, B11: 0.29, B12: 0.23,
    NDVI: 0.34, NDWI: 0.07, BSI: 0.40,
    elevation_m: 460, slope_deg: 13.8, terrain_relief_m: 175,
  },
  {
    latitude: 22.9876,
    longitude: 85.6543,
    state: "Jharkhand",
    district: "Seraikela Kharsawan",
    prospectivity_score: 0.62,
    prospectivity_class: "Medium",
    B02: 0.12, B03: 0.16, B04: 0.19, B08: 0.31, B11: 0.35, B12: 0.28,
    NDVI: 0.43, NDWI: 0.11, BSI: 0.27,
    elevation_m: 340, slope_deg: 8.2, terrain_relief_m: 105,
  },
];

/**
 * Color mapping for prospectivity classes - Zenith style
 */
export const prospectivityColors = {
  "Low": "#22c55e",
  "Medium": "#eab308",
  "High": "#f97316",
  "Very High": "#e53935", // Zenith accent red
};

/**
 * Helper to get color for a prospectivity class
 */
export function getProspectivityColor(prospectivityClass) {
  return prospectivityColors[prospectivityClass] || "#737373";
}

/**
 * Helper to get class from score (for future use with continuous scores)
 */
export function getProspectivityClassFromScore(score) {
  if (score >= 0.8) return "Very High";
  if (score >= 0.6) return "High";
  if (score >= 0.4) return "Medium";
  return "Low";
}