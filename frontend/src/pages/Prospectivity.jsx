import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, X, Map, ArrowRight, ExternalLink } from "lucide-react";
import ProspectivityExplorationMap from "../components/ProspectivityExplorationMap";
import { prospectivityMockData } from "../data/prospectivitydata";
import { filterProspectivityPredictions, getLocationName, normaliseProspectivityPredictions, prospectivityColor } from "../services/prospectivityService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BorderGlow from "../components/borderglow";
import CursorGrid from "../components/CursorGrid";

/**
 * Prospectivity Intelligence Page
 * Dedicated geospatial exploration workspace for manganese prospectivity
 */
export default function Prospectivity() {
  const [searchQuery, setSearchQuery] = useState("");
  const [threshold, setThreshold] = useState(0.5);
  const [showProspectivityLayer, setShowProspectivityLayer] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [visibleLocations, setVisibleLocations] = useState(0);
  const [locationName, setLocationName] = useState(null);

  const predictionRecords = useMemo(() => normaliseProspectivityPredictions(prospectivityMockData), []);

  useEffect(() => {
    if (!selectedLocation) return undefined;
    const controller = new AbortController();
    setLocationName(null);
    getLocationName(selectedLocation.latitude, selectedLocation.longitude, controller.signal)
      .then(setLocationName)
      .catch((error) => {
        if (error.name !== "AbortError") {
          setLocationName({ label: "Location unavailable" });
        }
      });

    return () => controller.abort();
  }, [selectedLocation]);

  // All filters work on the same coordinate + prediction record. No row-based
  // association is performed when the backend data source is swapped in.
  const filteredData = useMemo(() => {
    if (!showProspectivityLayer) return [];
    return filterProspectivityPredictions(predictionRecords, {
      threshold,
      search: searchQuery,
    });
  }, [predictionRecords, searchQuery, showProspectivityLayer, threshold]);

  // Calculate summary statistics from actual data
  const stats = useMemo(() => {
    const total = predictionRecords.length;
    const count = (classification) =>
      predictionRecords.filter(
        (point) => point.classification === classification
      ).length;

    const veryHigh = count("Very High");
    const high = count("High");
    const moderate = count("Moderate");
    const low = count("Low");
    const scores = predictionRecords.map((point) => point.probability);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);

    return {
      total,
      veryHigh,
      high,
      moderate,
      low,
      avgScore,
      maxScore,
    };
  }, [predictionRecords]);

  // Top locations ranked by score
  const topLocations = useMemo(() => {
    return [...predictionRecords]
      .sort((a, b) => b.prospectivity_score - a.prospectivity_score)
      .slice(0, 10);
  }, [predictionRecords]);

  const handlePointClick = (point) => {
    setSelectedLocation(point);
    setShowDetailPanel(true);
  };

  const handleMapCenter = (point) => {
    setSelectedLocation(point);
    setShowDetailPanel(true);
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setShowDetailPanel(false);
  };

  const handleAnalyzeLocation = () => {
    if (selectedLocation) {
      console.log("Navigate to analysis for:", selectedLocation);
    }
  };

  const formatNumber = (num, decimals = 4) => {
    if (num === undefined || num === null) return "—";
    return Number(num).toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-zenith-bg flex flex-col relative overflow-hidden">

      {/* Background image */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-[center_top] bg-no-repeat opacity-85"
        style={{ backgroundImage: "url('/backgorund_pic.png')" }}
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.75) 38%, rgba(5,5,5,0.28) 100%), linear-gradient(180deg, rgba(5,5,5,0.12) 0%, rgba(5,5,5,0.72) 68%, rgba(5,5,5,0.96) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Existing Cursor Grid */}
      <div className="fixed inset-0 z-[2] pointer-events-none">
        <CursorGrid
          color="#ffffff"
          opacity={0.08}
        />
      </div>

      {/* Navbar + page content */}
      <div className="relative z-10 flex min-h-screen flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-full space-y-8">

            {/* 1. PAGE HEADER */}
            <section className="space-y-3">
              <h1 className="font-display font-semibold text-3xl sm:text-4xl text-white tracking-tight">
                PROSPECTIVITY INTELLIGENCE
              </h1>

              <p className="text-text-secondary text-lg max-w-2xl">
                Explore manganese prospectivity across sampled locations. Model-derived visualization for SIH 2026.
              </p>
            </section>

            {/* 2. EXPLORATION CONTROLS */}
            <section className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
                    aria-hidden="true"
                  />

                  <input
                    type="text"
                    placeholder="Search coordinates, score, or classification..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-zenith-surface border border-zenith-border text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-zenith-accent focus:border-transparent transition-all"
                    aria-label="Search locations"
                  />
                </div>

                <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-3 lg:justify-end">
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input
                      type="checkbox"
                      checked={showProspectivityLayer}
                      onChange={(event) =>
                        setShowProspectivityLayer(event.target.checked)
                      }
                      className="accent-zenith-accent"
                    />
                    Prospectivity Layer
                  </label>

                  <label className="flex min-w-[220px] items-center gap-3 text-sm text-text-secondary">
                    Score threshold
                    <span className="font-mono text-white">
                      {threshold.toFixed(2)}
                    </span>

                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.01"
                      value={threshold}
                      onChange={(event) =>
                        setThreshold(Number(event.target.value))
                      }
                      className="accent-zenith-accent"
                      aria-label="Prospectivity score threshold"
                    />
                  </label>

                  <div className="hidden sm:flex items-center px-4 py-2.5 rounded-lg bg-zenith-accent/10 border border-zenith-accent/20 text-sm font-medium text-zenith-accent">
                    {visibleLocations.toLocaleString()} visible
                  </div>
                </div>
              </div>
            </section>

            {/* 3. LARGE INTERACTIVE MAP + DETAIL PANEL */}
            <section className="relative">
              <div className="grid lg:grid-cols-[1fr_380px] gap-6">

                {/* Map Container */}
                <div className="relative min-h-[700px] rounded-xl overflow-hidden border border-zenith-border bg-zenith-surface">
                  <ProspectivityExplorationMap
                    data={filteredData}
                    initialView={{
                      center: [21.0, 78.0],
                      zoom: 5,
                    }}
                    onPointClick={handlePointClick}
                    onViewportChange={setVisibleLocations}
                    selectedPoint={selectedLocation}
                  />

                  {/* Map Info Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-zenith-bg/95 backdrop-blur-sm border border-zenith-border text-xs text-text-secondary">
                    <MapPin
                      className="w-3.5 h-3.5 text-zenith-accent"
                      aria-hidden="true"
                    />
                    <span>
                      {visibleLocations.toLocaleString()} locations visible
                    </span>
                  </div>
                </div>

                {/* 5. SELECTED LOCATION DETAIL PANEL */}
                <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={200}
                  glowIntensity={1.2}
                  borderRadius={24}
                >
                  <div className="relative">
                    {showDetailPanel && selectedLocation ? (
                      <div className="sticky top-24 h-[700px] bg-zenith-elevated/95 backdrop-blur-xl rounded-xl border border-zenith-border overflow-hidden flex flex-col animate-slide-up">

                        {/* Panel Header */}
                        <div className="flex items-center justify-between p-4 border-b border-zenith-border">
                          <h2 className="font-display font-semibold text-white text-lg">
                            SELECTED LOCATION
                          </h2>

                          <button
                            onClick={clearSelection}
                            className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-zenith-surface transition-colors"
                            aria-label="Close detail panel"
                          >
                            <X
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">

                          {/* Location Info */}
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-text-muted font-medium mb-2">
                                Location
                              </p>

                              <p className="font-display font-semibold text-white text-xl">
                                {locationName?.label ??
                                  "Locating selected coordinates…"}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-zenith-surface rounded-lg p-3 border border-zenith-border">
                                <p className="text-[10px] uppercase tracking-wide text-text-muted mb-1">
                                  Latitude
                                </p>
                                <p className="font-mono text-white text-sm">
                                  {formatNumber(
                                    selectedLocation.latitude,
                                    4
                                  )}° N
                                </p>
                              </div>

                              <div className="bg-zenith-surface rounded-lg p-3 border border-zenith-border">
                                <p className="text-[10px] uppercase tracking-wide text-text-muted mb-1">
                                  Longitude
                                </p>
                                <p className="font-mono text-white text-sm">
                                  {formatNumber(
                                    selectedLocation.longitude,
                                    4
                                  )}° E
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Prospectivity */}
                          <div className="pt-4 border-t border-zenith-border space-y-4">
                            <p className="text-xs uppercase tracking-widest text-text-muted font-medium">
                              PROSPECTIVITY
                            </p>

                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    prospectivityColor(
                                      selectedLocation.probability,
                                      0.12
                                    ),
                                  border: `2px solid ${prospectivityColor(
                                    selectedLocation.probability
                                  )}`,
                                }}
                              >
                                <span
                                  className="font-display font-bold"
                                  style={{
                                    color: prospectivityColor(
                                      selectedLocation.probability
                                    ),
                                  }}
                                >
                                  {selectedLocation.classification ===
                                  "Very High"
                                    ? "VH"
                                    : selectedLocation.classification ===
                                      "High"
                                    ? "H"
                                    : selectedLocation.classification ===
                                      "Moderate"
                                    ? "M"
                                    : "L"}
                                </span>
                              </div>

                              <div>
                                <p
                                  className="font-display font-semibold text-lg"
                                  style={{
                                    color: prospectivityColor(
                                      selectedLocation.probability
                                    ),
                                  }}
                                >
                                  {selectedLocation.classification}
                                </p>

                                <p className="text-text-muted text-sm">
                                  Model classification
                                </p>
                              </div>
                            </div>

                            <div className="bg-zenith-surface rounded-lg p-4 border border-zenith-border">
                              <div className="flex items-center justify-between">
                                <span className="text-text-secondary">
                                  MODEL SCORE
                                </span>

                                <span className="font-display font-bold text-white text-2xl tabular-nums">
                                  {formatNumber(
                                    selectedLocation.probability,
                                    3
                                  )}
                                </span>
                              </div>

                              <div className="mt-2 h-1.5 bg-zenith-border rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      selectedLocation.probability * 100
                                    }%`,
                                    backgroundColor:
                                      prospectivityColor(
                                        selectedLocation.probability
                                      ),
                                  }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-zenith-border bg-zenith-surface px-4 py-3 text-sm">
                              <span className="text-text-secondary">
                                Prediction
                              </span>

                              <span className="font-medium text-white">
                                {selectedLocation.prediction
                                  ? "Positive"
                                  : "Negative"}
                              </span>
                            </div>
                          </div>

                          {/* Spectral & Terrain Data */}
                          <div className="pt-4 border-t border-zenith-border space-y-3">
                            <p className="text-xs uppercase tracking-widest text-text-muted font-medium">
                              SPECTRAL & TERRAIN FEATURES
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-zenith-surface rounded-lg p-2.5 border border-zenith-border">
                                <p className="text-text-muted">NDVI</p>
                                <p className="font-mono text-white">
                                  {formatNumber(
                                    selectedLocation.NDVI,
                                    3
                                  )}
                                </p>
                              </div>

                              <div className="bg-zenith-surface rounded-lg p-2.5 border border-zenith-border">
                                <p className="text-text-muted">NDWI</p>
                                <p className="font-mono text-white">
                                  {formatNumber(
                                    selectedLocation.NDWI,
                                    3
                                  )}
                                </p>
                              </div>

                              <div className="bg-zenith-surface rounded-lg p-2.5 border border-zenith-border">
                                <p className="text-text-muted">BSI</p>
                                <p className="font-mono text-white">
                                  {formatNumber(
                                    selectedLocation.BSI,
                                    3
                                  )}
                                </p>
                              </div>

                              <div className="bg-zenith-surface rounded-lg p-2.5 border border-zenith-border">
                                <p className="text-text-muted">Elevation</p>
                                <p className="font-mono text-white">
                                  {selectedLocation.elevation_m} m
                                </p>
                              </div>

                              <div className="bg-zenith-surface rounded-lg p-2.5 border border-zenith-border">
                                <p className="text-text-muted">Slope</p>
                                <p className="font-mono text-white">
                                  {formatNumber(
                                    selectedLocation.slope_deg,
                                    1
                                  )}°
                                </p>
                              </div>

                              <div className="bg-zenith-surface rounded-lg p-2.5 border border-zenith-border">
                                <p className="text-text-muted">Relief</p>
                                <p className="font-mono text-white">
                                  {selectedLocation.terrain_relief_m} m
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Spectral Bands */}
                          <div className="pt-4 border-t border-zenith-border">
                            <p className="text-xs uppercase tracking-widest text-text-muted font-medium mb-3">
                              SPECTRAL BANDS
                            </p>

                            <div className="space-y-1.5 text-xs font-mono">
                              {[
                                {
                                  label: "B02 (Blue)",
                                  value: selectedLocation.B02,
                                },
                                {
                                  label: "B03 (Green)",
                                  value: selectedLocation.B03,
                                },
                                {
                                  label: "B04 (Red)",
                                  value: selectedLocation.B04,
                                },
                                {
                                  label: "B08 (NIR)",
                                  value: selectedLocation.B08,
                                },
                                {
                                  label: "B11 (SWIR1)",
                                  value: selectedLocation.B11,
                                },
                                {
                                  label: "B12 (SWIR2)",
                                  value: selectedLocation.B12,
                                },
                              ].map((band) => (
                                <div
                                  key={band.label}
                                  className="flex justify-between py-1 border-b border-zenith-border/30"
                                >
                                  <span className="text-text-muted">
                                    {band.label}
                                  </span>

                                  <span className="text-white">
                                    {formatNumber(band.value, 3)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-4 border-t border-zenith-border">
                            <button
                              onClick={handleAnalyzeLocation}
                              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-zenith-bg font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:bg-text-secondary hover:-translate-y-0.5"
                            >
                              Analyze Location
                              <ArrowRight
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                            </button>

                            <p className="text-center text-xs text-text-muted mt-2">
                              Opens AI analysis (future integration)
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="sticky top-24 h-[700px] bg-zenith-elevated/95 backdrop-blur-xl rounded-xl border border-zenith-border flex flex-col items-center justify-center p-8 text-center">
                        <Map
                          className="w-16 h-16 text-text-muted mb-4"
                          aria-hidden="true"
                        />

                        <h3 className="font-display font-semibold text-white text-xl mb-2">
                          No Location Selected
                        </h3>

                        <p className="text-text-secondary max-w-sm mb-6">
                          Click a location on the map to view detailed
                          prospectivity information and spectral features.
                        </p>

                        <div className="text-xs text-text-muted space-y-1">
                          <p>
                            • {predictionRecords.length.toLocaleString()}{" "}
                            sampled locations available
                          </p>

                          <p>
                            • {stats.veryHigh} Very High · {stats.high} High ·{" "}
                            {stats.moderate} Moderate · {stats.low} Low
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </BorderGlow>
              </div>
            </section>

            {/* 7. PROSPECTIVITY SUMMARY */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-white text-xl">
                  PROSPECTIVITY DISTRIBUTION
                </h2>

                <span className="text-xs text-text-muted font-mono">
                  {stats.total} sampled locations
                </span>
              </div>

              <BorderGlow
                glowColor="#ffffff"
                glowRadius={80}
                glowIntensity={1.2}
                borderRadius={24}
              >
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    {
                      label: "Very High",
                      count: stats.veryHigh,
                      color: "#e53935",
                      percentage: (
                        (stats.veryHigh / stats.total) *
                        100
                      ).toFixed(1),
                    },
                    {
                      label: "High",
                      count: stats.high,
                      color: "#f97316",
                      percentage: (
                        (stats.high / stats.total) *
                        100
                      ).toFixed(1),
                    },
                    {
                      label: "Moderate",
                      count: stats.moderate,
                      color: prospectivityColor(0.4),
                      percentage: (
                        (stats.moderate / stats.total) *
                        100
                      ).toFixed(1),
                    },
                    {
                      label: "Low",
                      count: stats.low,
                      color: prospectivityColor(0.2),
                      percentage: (
                        (stats.low / stats.total) *
                        100
                      ).toFixed(1),
                    },
                    {
                      label: "Avg Score",
                      count: stats.avgScore.toFixed(3),
                      color: "#e53935",
                      percentage: null,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl p-5 border border-zenith-border relative overflow-hidden group"
                    >
                      {item.percentage !== null && (
                        <div
                          className="absolute top-0 right-0 w-full h-1"
                          style={{
                            backgroundColor: item.color,
                          }}
                        />
                      )}

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: item.color,
                            }}
                          />

                          <span className="text-sm font-medium text-white capitalize">
                            {item.label}
                          </span>
                        </div>

                        <p className="font-display font-bold text-white text-3xl sm:text-4xl tabular-nums">
                          {item.count}
                        </p>

                        {item.percentage !== null && (
                          <p className="text-xs text-text-muted mt-1">
                            {item.percentage}% of total
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </BorderGlow>
            </section>

            {/* 8. RANKED / PRIORITY LOCATIONS */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-white text-xl">
                  TOP PROSPECTIVITY LOCATIONS
                </h2>

                <span className="text-xs text-text-muted">
                  Ranked by model score
                </span>
              </div>

              <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border overflow-hidden">

                {/* Table Header */}
                <div className="grid grid-cols-[1fr_100px_130px_120px] gap-4 px-6 py-4 border-b border-zenith-border text-xs uppercase tracking-wider font-medium text-text-muted">
                  <div>Coordinates</div>
                  <div className="text-center">Score</div>
                  <div className="text-center">Class</div>
                  <div className="text-center">Action</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-zenith-border">
                  {topLocations.map((location, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_100px_130px_120px] gap-4 px-6 py-4 items-center hover:bg-zenith-surface/50 transition-colors cursor-pointer"
                      onClick={() => handleMapCenter(location)}
                    >
                      <div className="font-mono text-sm text-white">
                        {formatNumber(location.latitude, 4)}° N,{" "}
                        {formatNumber(location.longitude, 4)}° E
                      </div>

                      <div className="text-center font-mono font-semibold text-white tabular-nums">
                        {formatNumber(
                          location.prospectivity_score,
                          3
                        )}
                      </div>

                      <div className="text-center">
                        <span
                          className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: prospectivityColor(
                              location.probability,
                              0.12
                            ),
                            color: prospectivityColor(
                              location.probability
                            ),
                            border: `1px solid ${prospectivityColor(
                              location.probability,
                              0.35
                            )}`,
                          }}
                        >
                          {location.prospectivity_class}
                        </span>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMapCenter(location);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zenith-accent/10 border border-zenith-accent/20 text-zenith-accent text-xs font-medium uppercase tracking-wider hover:bg-zenith-accent/20 transition-colors"
                        >
                          <ExternalLink
                            className="w-3 h-3"
                            aria-hidden="true"
                          />
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}