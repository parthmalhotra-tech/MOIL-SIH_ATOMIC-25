def get_prospectivity_locations() -> list[dict]:
    """
    HARDCODED for now — no satellite data pipeline connected yet.
    Each entry has display fields (lat/lon/state/district) plus the
    13 raw model inputs. Swap this for a real satellite/GIS data source later.
    """
    return [
        {
            "latitude": 21.9425, "longitude": 85.2968,
            "state": "Odisha", "district": "Sundargarh",
            "B02": 0.08, "B03": 0.12, "B04": 0.15, "B08": 0.42,
            "B11": 0.28, "B12": 0.22, "NDVI": 0.35, "NDWI": 0.08, "BSI": 0.42,
            "cloud_cover": 0.0, "elevation_m": 480, "slope_deg": 12.5, "terrain_relief_m": 180,
        },
        {
            "latitude": 22.9734, "longitude": 80.2345,
            "state": "Madhya Pradesh", "district": "Balaghat",
            "B02": 0.07, "B03": 0.11, "B04": 0.14, "B08": 0.45,
            "B11": 0.25, "B12": 0.20, "NDVI": 0.29, "NDWI": 0.04, "BSI": 0.48,
            "cloud_cover": 0.0, "elevation_m": 550, "slope_deg": 18.3, "terrain_relief_m": 240,
        },
        {
            "latitude": 21.1458, "longitude": 79.0882,
            "state": "Maharashtra", "district": "Nagpur",
            "B02": 0.09, "B03": 0.13, "B04": 0.16, "B08": 0.39,
            "B11": 0.29, "B12": 0.23, "NDVI": 0.33, "NDWI": 0.07, "BSI": 0.39,
            "cloud_cover": 0.0, "elevation_m": 440, "slope_deg": 11.5, "terrain_relief_m": 170,
        },
        {
            "latitude": 14.9876, "longitude": 75.4321,
            "state": "Karnataka", "district": "Chitradurga",
            "B02": 0.14, "B03": 0.18, "B04": 0.21, "B08": 0.26,
            "B11": 0.39, "B12": 0.32, "NDVI": 0.46, "NDWI": 0.13, "BSI": 0.20,
            "cloud_cover": 0.0, "elevation_m": 620, "slope_deg": 8.9, "terrain_relief_m": 110,
        },
        {
            "latitude": 23.3441, "longitude": 85.3096,
            "state": "Jharkhand", "district": "West Singhbhum",
            "B02": 0.09, "B03": 0.13, "B04": 0.16, "B08": 0.38,
            "B11": 0.29, "B12": 0.23, "NDVI": 0.34, "NDWI": 0.07, "BSI": 0.40,
            "cloud_cover": 0.0, "elevation_m": 460, "slope_deg": 13.8, "terrain_relief_m": 175,
        },
    ]