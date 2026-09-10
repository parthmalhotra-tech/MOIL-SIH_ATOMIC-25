/**
 * Shared prospectivity data helpers.
 *
 * Predictions are deliberately normalised from a single record only.  We never
 * join a coordinate dataset to a prediction dataset by row number: an upstream
 * source must provide latitude, longitude and prediction values in the same
 * record (or have already joined them using a stable identifier).
 */
const numberFrom = (...values) => {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

// Reverse geocoding is intentionally requested only after someone selects a
// point.  Never bulk-geocode the prediction grid in the browser.
const locationCache = new Map();

export async function getLocationName(latitude, longitude, signal) {
  const cacheKey = `${Number(latitude).toFixed(5)},${Number(longitude).toFixed(5)}`;
  if (locationCache.has(cacheKey)) return locationCache.get(cacheKey);

  const query = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    zoom: "10",
    addressdetails: "1",
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${query}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Location lookup failed");

  const result = await response.json();
  const address = result.address ?? {};
  const locality = address.village ?? address.town ?? address.city ?? address.municipality ?? address.county ?? "Location unavailable";
  const district = address.state_district ?? address.county ?? "";
  const state = address.state ?? "";
  const location = { locality, district, state, label: [locality, district, state].filter(Boolean).join(", ") };
  locationCache.set(cacheKey, location);
  return location;
}

const valueFrom = (record, keys) => {
  for (const key of keys) {
    if (record?.[key] !== undefined && record?.[key] !== null && record[key] !== "") {
      return record[key];
    }
  }
  return undefined;
};

export function classifyProspectivity(probability) {
  if (!Number.isFinite(probability)) return "Unknown";
  if (probability < 0.5) return "Very Low";
  if (probability < 0.6) return "Low";
  if (probability < 0.7) return "Moderate";
  if (probability < 0.8) return "High";
  return "Very High";
}

export function prospectivityColor(probability, alpha = 1) {
  const value = Math.max(0, Math.min(1, Number(probability) || 0));
  // Geological ramp: blue-grey → slate → amber → orange → burgundy.  This is
  // deliberately interpolated continuously; classification is only a label.
  const stops = [
    [0, [99, 119, 133]],
    [0.5, [112, 132, 145]],
    [0.6, [182, 139, 82]],
    [0.7, [190, 100, 55]],
    [0.8, [145, 53, 57]],
    [1, [112, 37, 49]],
  ];
  const upperIndex = stops.findIndex(([stop]) => value <= stop);
  const upper = stops[upperIndex === -1 ? stops.length - 1 : upperIndex];
  const lower = stops[Math.max(0, upperIndex - 1)] ?? upper;
  const progress = upper[0] === lower[0] ? 0 : (value - lower[0]) / (upper[0] - lower[0]);
  const rgb = lower[1].map((channel, index) => Math.round(channel + (upper[1][index] - channel) * progress));
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${Math.max(0, Math.min(1, alpha))})`;
}

export function normaliseProspectivityPredictions(records = []) {
  return records.reduce((normalised, record, sourceIndex) => {
    const latitude = numberFrom(valueFrom(record, ["latitude", "lat"]));
    const longitude = numberFrom(valueFrom(record, ["longitude", "lng", "lon"]));
    const probability = numberFrom(valueFrom(record, [
      "manganese_probability",
      "prospectivity_score",
      "probability",
      "prospectivity",
    ]));

    // Invalid/incomplete records are excluded rather than paired with another
    // row.  This keeps the displayed coordinate-prediction association sound.
    if (
      latitude === null || longitude === null || probability === null ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180
    ) {
      return normalised;
    }

    const rawPrediction = valueFrom(record, ["manganese_prediction", "prediction"]);
    const prediction = rawPrediction === undefined
      ? probability >= 0.5
      : [true, 1, "1", "true", "positive", "yes"].includes(
          typeof rawPrediction === "string" ? rawPrediction.toLowerCase() : rawPrediction,
        );

    normalised.push({
      ...record,
      id: valueFrom(record, ["id", "prediction_id", "grid_id"]) ?? `${latitude}:${longitude}:${sourceIndex}`,
      latitude,
      longitude,
      probability: Math.max(0, Math.min(1, probability)),
      prediction,
      classification: classifyProspectivity(probability),
      // Compatibility aliases keep existing detail UI data-driven while the
      // backend migrates to its canonical field names.
      prospectivity_score: probability,
      prospectivity_class: classifyProspectivity(probability),
      manganese_prediction: prediction,
    });
    return normalised;
  }, []);
}

export function getProspectivityStats(records = []) {
  const predictedPositive = records.filter((record) => record.prediction);
  return {
    total: records.length,
    predictedPositive: predictedPositive.length,
  };
}

export function filterProspectivityPredictions(records, { threshold = 0, positiveOnly = false, search = "" } = {}) {
  const query = search.trim().toLowerCase();
  return records.filter((record) => {
    const matchesThreshold = record.probability >= threshold;
    const matchesPrediction = !positiveOnly || record.prediction;
    const searchable = [record.state, record.district, record.location, record.name, record.classification,
      record.prediction ? "positive predicted" : "negative", record.latitude?.toFixed(6),
      record.longitude?.toFixed(6), record.probability?.toFixed(3), `${record.latitude}, ${record.longitude}`]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return matchesThreshold && matchesPrediction && (!query || searchable.includes(query));
  });
}
