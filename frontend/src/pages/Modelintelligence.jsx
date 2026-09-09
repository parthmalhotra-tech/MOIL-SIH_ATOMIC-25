import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CountUp from "../components/CountUp";
import BorderGlow from "../components/borderglow";
import CursorGrid from "../components/CursorGrid";

import {
  Brain,
  Database,
  Activity,
  Clock,
  Layers,
  RefreshCw,
} from "lucide-react";

/* ------------------------------------------------ */
/* BACKEND CONFIG */
/* ------------------------------------------------ */

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ------------------------------------------------ */
/* MODEL INFORMATION */
/* ------------------------------------------------ */

const modelInfo = {
  activeVersion: "v1.0",
  availableVersions: ["v1.0"],
  lastRetrained: "8 Sept 2026",
};

/* ------------------------------------------------ */
/* MODEL PERFORMANCE */
/* ------------------------------------------------ */
/*
  Real values will be added here when provided.
*/

const modelPerformance = {
  production: {
    name: "Production Model",
    description:
      "Production forecasting and shortfall prediction",
    rmse: 2.54,
    inferenceSpeed: 42 ,
  },

  prospectivity: {
    name: "Prospectivity Model",
    description:
      "Manganese prospectivity classification",
    rmse: null,
    inferenceSpeed: 0.59,
  },
};

/* ------------------------------------------------ */
/* FEATURE IMPORTANCE */
/* ------------------------------------------------ */

/* Production Model */

const productionFeatureImportance = [
  {
    name: "Rainfall Stress Index",
    value: 23.67,
  },
  {
    name: "Production Lag 2M",
    value: 19.20,
  },
  {
    name: "Soil-Moisture Stress Index",
    value: 15.74,
  },
  {
    name: "Production Lag 1M",
    value: 13.23,
  },
  {
    name: "Expected Production",
    value: 11.66,
  },
  {
    name: "Month Progress",
    value: 10.67,
  },
  {
    name: "Production Lag 3M",
    value: 5.83,
  },
];

/* Prospectivity Model */

const prospectivityFeatureImportance = [
  {
    name: "elevation_m",
    value: 24.37,
  },
  {
    name: "elev_relief_ratio",
    value: 7.68,
  },
  {
    name: "BSI",
    value: 5.50,
  },
  {
    name: "terrain_relief_m",
    value: 5.40,
  },
  {
    name: "B08",
    value: 4.84,
  },
  {
    name: "SWIR1_SWIR2_ratio",
    value: 4.81,
  },
  {
    name: "SWIR_difference",
    value: 4.68,
  },
  {
    name: "B03",
    value: 4.40,
  },
  {
    name: "SWIR_mean",
    value: 3.99,
  },
  {
    name: "terrain_complexity",
    value: 3.80,
  },
  {
    name: "B12",
    value: 3.71,
  },
  {
    name: "BLUE_RED_ratio",
    value: 3.61,
  },
  {
    name: "B02",
    value: 3.54,
  },
  {
    name: "slope_deg",
    value: 3.26,
  },
  {
    name: "NDWI",
    value: 2.98,
  },
  {
    name: "VIS_mean",
    value: 2.87,
  },
  {
    name: "BLUE_RED_diff",
    value: 2.76,
  },
  {
    name: "B11",
    value: 2.72,
  },
  {
    name: "spectral_mean",
    value: 2.59,
  },
  {
    name: "NIR_RED_diff",
    value: 2.53,
  },
];

/* ------------------------------------------------ */
/* DATASET LINEAGE */
/* ------------------------------------------------ */

const datasetLineage = [
  {
    name: "NASA POWER Environmental Data",
    type: "Environmental",
    frequency: "Updated daily",
  },
  {
    name: "MOIL Production Records",
    type: "Production",
    frequency: "Updated monthly",
  },
  {
    name: "Satellite Imagery",
    type: "Raster",
    frequency: "Updated monthly",
  },
  {
    name: "Terrain and geological data",
    type: "Spatial",
    frequency: "Updated on source refresh (static)",
  },
];

/* ------------------------------------------------ */
/* MODEL KPI CARD */
/* ------------------------------------------------ */

function ModelKpiCard({
  label,
  value,
  suffix = "",
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    Number.isFinite(Number(value));

  const decimals =
    hasValue && Number(value) % 1 !== 0 ? 2 : 0;

  return (
    <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border h-full">
      <div className="p-5">

        <p className="text-text-secondary text-sm">
          {label}
        </p>

        <div className="flex items-end gap-1.5 mt-2">

          <span className="text-white text-2xl sm:text-3xl font-bold tabular-nums">
            {hasValue ? (
              <CountUp
                start={0}
                end={Number(value)}
                duration={1.5}
                decimals={decimals}
              />
            ) : (
              "—"
            )}
          </span>

          {hasValue && suffix && (
            <span className="text-text-secondary text-sm mb-1">
              {suffix}
            </span>
          )}

        </div>

        <p className="text-text-muted text-xs mt-3">
          {hasValue
            ? "Current model value"
            : "Data pending"}
        </p>

      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* FEATURE IMPORTANCE PANEL */
/* ------------------------------------------------ */

function FeatureImportancePanel({
  title,
  subtitle,
  features,
}) {
  return (
    <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl h-full border border-zenith-border">

      <div className="p-5 sm:p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-lg bg-zenith-accent/10 border border-zenith-accent/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-zenith-accent" />
          </div>

          <div>
            <h2 className="text-white text-lg font-semibold">
              {title}
            </h2>

            <p className="text-text-secondary text-xs mt-1">
              {subtitle}
            </p>
          </div>

        </div>

        <div className="space-y-5">

          {features.map((feature) => (

            <div key={feature.name}>

              <div className="flex justify-between mb-2 gap-4">

                <span className="text-white text-sm truncate">
                  {feature.name}
                </span>

                <span className="text-text-secondary text-sm font-mono shrink-0">
                  {feature.value.toFixed(2)}%
                </span>

              </div>

              <div className="h-2 bg-zenith-surface rounded-full overflow-hidden">

                <div
                  className="h-full bg-zenith-accent rounded-full transition-all duration-700"
                  style={{
                    width: `${feature.value}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* DATASET LINEAGE */
/* ------------------------------------------------ */

function DatasetLineagePanel() {
  return (
    <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border">

      <div className="p-5 sm:p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-lg bg-zenith-accent/10 border border-zenith-accent/20 flex items-center justify-center">

            <Database className="w-5 h-5 text-zenith-accent" />

          </div>

          <div>

            <h2 className="text-white text-lg font-semibold">
              Dataset Lineage
            </h2>

            <p className="text-text-secondary text-xs mt-1">
              Data sources feeding the Hermes models
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {datasetLineage.map((dataset) => (

            <div
              key={dataset.name}
              className="bg-zenith-surface/80 rounded-xl p-4 border border-zenith-border transition-all hover:border-zenith-accent/30"
            >

              <div className="flex items-start gap-3">

                <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/[0.03] border border-zenith-border flex items-center justify-center shrink-0">

                  <Database className="w-4 h-4 text-text-secondary" />

                </div>

                <div className="min-w-0">

                  <p className="text-white text-sm font-medium">
                    {dataset.name}
                  </p>

                  <span className="inline-flex mt-2 px-2 py-1 rounded-full bg-zenith-accent/10 border border-zenith-accent/20 text-[10px] uppercase tracking-wider text-zenith-accent">
                    {dataset.type}
                  </span>

                </div>

              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary">

                <Clock className="w-3.5 h-3.5 text-text-muted" />

                <span>
                  {dataset.frequency}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* MAIN PAGE */
/* ------------------------------------------------ */

export default function ModelIntelligence() {
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [apiChecking, setApiChecking] = useState(true);

  const checkApiStatus = async () => {
    try {
      setApiChecking(true);
      setApiStatus("Checking...");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/health`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data = await response.json();

      if (data?.status === "ok") {
        setApiStatus("Connected");
      } else {
        setApiStatus("Unavailable");
      }
    } catch (error) {
      console.error(
        "Backend health check failed:",
        error
      );

      setApiStatus("Disconnected");
    } finally {
      setApiChecking(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div className="model-intelligence-page min-h-screen bg-zenith-bg text-white relative overflow-hidden">

      {/* Background Image */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-[center_top] bg-no-repeat opacity-85"
        style={{
          backgroundImage:
            "url('/backgorund_pic.png')",
        }}
        aria-hidden="true"
      />

      {/* Dark Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.75) 38%, rgba(5,5,5,0.28) 100%), linear-gradient(180deg, rgba(5,5,5,0.12) 0%, rgba(5,5,5,0.72) 68%, rgba(5,5,5,0.96) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Cursor Grid */}
      <div className="fixed inset-0 z-[2] pointer-events-none">
        <CursorGrid
          color="#ffffff"
          opacity={0.08}
        />
      </div>

      {/* Page */}
      <div className="relative z-10 flex min-h-screen flex-col">

        <Navbar />

        <main className="pt-24 pb-16">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* HEADER */}

            <section className="mb-8">

              <div className="flex items-center gap-3 mb-3">

                <div className="w-10 h-10 rounded-xl bg-zenith-accent/10 border border-zenith-accent/20 flex items-center justify-center">

                  <Brain className="w-5 h-5 text-zenith-accent" />

                </div>

                <span className="text-zenith-accent text-sm font-medium">
                  AI / ML Intelligence
                </span>

              </div>

              <h1 className="text-3xl sm:text-4xl font-bold">
                Model Intelligence
              </h1>

              <p className="text-text-secondary mt-2 max-w-2xl">
                Monitor model performance, feature importance,
                dataset lineage and prediction infrastructure.
              </p>

            </section>

            {/* MODEL STATUS */}

            <section className="mb-8">

              <BorderGlow
                glowColor="#ffffff"
                glowRadius={100}
                glowIntensity={1.1}
                borderRadius={24}
              >

                <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border">

                  <div className="p-5">

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

                      <div>

                        <p className="text-text-secondary text-xs">
                          Active Version
                        </p>

                        <p className="text-white font-semibold mt-1">
                          {modelInfo.activeVersion}
                        </p>

                      </div>

                      <div>

                        <p className="text-text-secondary text-xs">
                          Last Retrained
                        </p>

                        <p className="text-white font-semibold mt-1">
                          {modelInfo.lastRetrained}
                        </p>

                      </div>

                      <div>

                        <p className="text-text-secondary text-xs">
                          API Status
                        </p>

                        <div className="flex items-center gap-2 mt-1">

                          <span
                            className={`w-2 h-2 rounded-full ${
                              apiChecking
                                ? "bg-yellow-400 animate-pulse"
                                : apiStatus === "Connected"
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                          />

                          <p
                            className={`font-semibold ${
                              apiChecking
                                ? "text-yellow-400"
                                : apiStatus === "Connected"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {apiStatus}
                          </p>

                        </div>

                      </div>

                      <div>

                        <p className="text-text-secondary text-xs">
                          Available Versions
                        </p>

                        <p className="text-white font-semibold mt-1">
                          {modelInfo.availableVersions.length}
                        </p>

                      </div>

                    </div>

                    {/* Manual status check */}

                    <div className="mt-5 pt-4 border-t border-zenith-border flex justify-end">

                      <button
                        onClick={checkApiStatus}
                        disabled={apiChecking}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zenith-surface border border-zenith-border text-xs text-text-secondary hover:text-white hover:border-zenith-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >

                        <RefreshCw
                          className={`w-3.5 h-3.5 ${
                            apiChecking
                              ? "animate-spin"
                              : ""
                          }`}
                        />

                        Check Connection

                      </button>

                    </div>

                  </div>

                </div>

              </BorderGlow>

            </section>

            {/* MODEL PERFORMANCE */}

            <section className="mb-8">

              <div className="flex items-center gap-2 mb-6">

                <Activity className="w-4 h-4 text-zenith-accent" />

                <h2 className="text-white font-semibold">
                  Model Performance
                </h2>

              </div>

              {/* Production Model */}

              <div className="mb-7">

                <div className="mb-3">

                  <h3 className="text-white font-semibold text-base">
                    Production Model
                  </h3>

                  <p className="text-text-muted text-xs mt-1">
                    {modelPerformance.production.description}
                  </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <BorderGlow
                    glowColor="#ffffff"
                    glowRadius={80}
                    glowIntensity={1.2}
                    borderRadius={24}
                  >

                    <ModelKpiCard
                      label="RMSE"
                      value={
                        modelPerformance.production.rmse
                      }
                    />

                  </BorderGlow>

                  <BorderGlow
                    glowColor="#ffffff"
                    glowRadius={80}
                    glowIntensity={1.2}
                    borderRadius={24}
                  >

                    <ModelKpiCard
                      label="Inference Speed"
                      value={
                        modelPerformance.production.inferenceSpeed
                      }
                      suffix="ms"
                    />

                  </BorderGlow>

                </div>

              </div>

              {/* Prospectivity Model */}

              <div>

                <div className="mb-3">

                  <h3 className="text-white font-semibold text-base">
                    Prospectivity Model
                  </h3>

                  <p className="text-text-muted text-xs mt-1">
                    {modelPerformance.prospectivity.description}
                  </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <BorderGlow
                    glowColor="#ffffff"
                    glowRadius={80}
                    glowIntensity={1.2}
                    borderRadius={24}
                  >

                    <ModelKpiCard
                      label="RMSE"
                      value={
                        modelPerformance.prospectivity.rmse
                      }
                    />

                  </BorderGlow>

                  <BorderGlow
                    glowColor="#ffffff"
                    glowRadius={80}
                    glowIntensity={1.2}
                    borderRadius={24}
                  >

                    <ModelKpiCard
                      label="Inference Speed"
                      value={
                        modelPerformance.prospectivity
                          .inferenceSpeed
                      }
                      suffix="ms"
                    />

                  </BorderGlow>

                </div>

              </div>

            </section>

            {/* FEATURE IMPORTANCE */}

            <section className="mb-8">

              <div className="flex items-center gap-2 mb-6">

                <Layers className="w-4 h-4 text-zenith-accent" />

                <h2 className="text-white font-semibold">
                  Feature Importance
                </h2>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={90}
                  glowIntensity={1.2}
                  borderRadius={24}
                >

                  <FeatureImportancePanel
                    title="Production Model"
                    subtitle="Relative contribution to production predictions"
                    features={
                      productionFeatureImportance
                    }
                  />

                </BorderGlow>

                <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={90}
                  glowIntensity={1.2}
                  borderRadius={24}
                >

                  <FeatureImportancePanel
                    title="Prospectivity Model"
                    subtitle="Relative contribution to prospectivity predictions"
                    features={
                      prospectivityFeatureImportance
                    }
                  />

                </BorderGlow>

              </div>

            </section>

            {/* DATASET LINEAGE */}

            <section>

              <div className="flex items-center gap-2 mb-6">

                <Database className="w-4 h-4 text-zenith-accent" />

                <h2 className="text-white font-semibold">
                  Dataset Lineage
                </h2>

              </div>

              <BorderGlow
                glowColor="#ffffff"
                glowRadius={90}
                glowIntensity={1.2}
                borderRadius={24}
              >

                <DatasetLineagePanel />

              </BorderGlow>

            </section>

          </div>

        </main>

        <Footer />

      </div>

    </div>
  );
}