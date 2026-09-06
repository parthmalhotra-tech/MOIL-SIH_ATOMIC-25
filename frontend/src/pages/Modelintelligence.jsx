import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CountUp from "../components/CountUp";
import BorderGlow from "../components/borderglow";

import {
  Brain,
  Database,
  Activity,
  RefreshCw,
  Play,
  CheckCircle,
  Clock,
  Layers,
} from "lucide-react";

const modelInfo = {
  activeVersion: "v1.0",
  availableVersions: ["v1.0", "v0.9", "v0.8"],
  lastRetrained: "12 Aug 2026",
  apiStatus: "Active",
};

const performanceKpis = [
  {
    title: "Reserve Accuracy",
    value: 94.2,
    suffix: "%",
    trend: "+2.1%",
  },
  {
    title: "Shortfall RMSE",
    value: 8.6,
    suffix: "%",
    trend: "-1.4%",
  },
  {
    title: "Spatial Precision",
    value: 91.7,
    suffix: "%",
    trend: "+3.2%",
  },
  {
    title: "Inference Speed",
    value: 42,
    suffix: "ms",
    trend: "-8.5%",
  },
];

const featureImportance = [
  { name: "Geological Structure", value: 28 },
  { name: "Geochemical Signature", value: 24 },
  { name: "Remote Sensing", value: 19 },
  { name: "Mineral Occurrence", value: 15 },
  { name: "Topography", value: 9 },
  { name: "Distance to Fault", value: 5 },
];

const datasetLineage = [
  {
    name: "Geological Survey Data",
    type: "Spatial",
    frequency: "Monthly",
  },
  {
    name: "Geochemical Samples",
    type: "Numeric",
    frequency: "Weekly",
  },
  {
    name: "Satellite Imagery",
    type: "Raster",
    frequency: "Daily",
  },
  {
    name: "Mineral Occurrence Records",
    type: "Spatial",
    frequency: "Monthly",
  },
];

const pipelineStages = [
  "Data Ingestion",
  "Data Fusion",
  "Feature Engineering",
  "ML Model",
  "Prediction",
];

/* ------------------------------------------------ */
/* KPI CARD */
/* ------------------------------------------------ */

function ModelKpiCard({ item }) {
  return (
    <div className="bg-zenith-elevated border border-zenith-border rounded-2xl">
      <div className="p-5">
        <p className="text-text-secondary text-sm">
          {item.title}
        </p>

        <div className="flex items-end gap-1 mt-2">
          <span className="text-white text-2xl font-bold">
            <CountUp
              start={0}
              end={item.value}
              duration={1.5}
              decimals={Number.isInteger(item.value) ? 0 : 1}
            />
          </span>

          <span className="text-text-secondary text-sm mb-1">
            {item.suffix}
          </span>
        </div>

        <p className="text-green-400 text-xs mt-3">
          {item.trend} vs previous version
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* FEATURE IMPORTANCE */
/* ------------------------------------------------ */

function FeatureImportancePanel() {
  return (
    <div className="bg-zenith-elevated rounded-xl h-full border border-zenith-border">
      <div className="p-5 sm:p-6">

        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-5 h-5 text-zenith-accent" />

          <div>
            <h2 className="text-white text-lg font-semibold">
              Feature Importance
            </h2>

            <p className="text-text-secondary text-xs mt-1">
              Relative contribution to model predictions
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {featureImportance.map((feature) => (
            <div key={feature.name}>

              <div className="flex justify-between mb-2">
                <span className="text-white text-sm">
                  {feature.name}
                </span>

                <span className="text-text-secondary text-sm">
                  {feature.value}%
                </span>
              </div>

              <div className="h-2 bg-zenith-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-zenith-accent rounded-full transition-all"
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
    <div className="bg-zenith-elevated rounded-xl h-full border border-zenith-border">
      <div className="p-5 sm:p-6">

        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-zenith-accent" />

          <div>
            <h2 className="text-white text-lg font-semibold">
              Dataset Lineage
            </h2>

            <p className="text-text-secondary text-xs mt-1">
              Sources feeding the current model
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {datasetLineage.map((dataset) => (
            <div
              key={dataset.name}
              className="bg-zenith-surface rounded-xl p-4 border border-zenith-border"
            >

              <div className="flex items-center justify-between gap-4">
                <span className="text-white text-sm">
                  {dataset.name}
                </span>

                <span className="text-xs text-zenith-accent">
                  {dataset.type}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                <Clock className="w-3.5 h-3.5" />
                Updated {dataset.frequency}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* PIPELINE SIMULATOR */
/* ------------------------------------------------ */

function PipelineSimulator() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [inferenceResult, setInferenceResult] = useState(null);

  const retrainModel = () => {
    if (running) return;

    setRunning(true);
    setProgress(0);
    setInferenceResult(null);

    const interval = setInterval(() => {
      setProgress((previous) => {
        const next = previous + 10;

        if (next >= 100) {
          clearInterval(interval);
          setRunning(false);
          return 100;
        }

        return next;
      });
    }, 180);
  };

  const testInference = () => {
    setInferenceResult(null);

    setTimeout(() => {
      setInferenceResult({
        prospectivity_score: 0.812,
        prospectivity_class: "High",
        latency_ms: 42,
      });
    }, 900);
  };

  return (
    <div className="bg-zenith-elevated rounded-xl border border-zenith-border">
      <div className="p-5 sm:p-6">

        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-5 h-5 text-zenith-accent" />

          <div>
            <h2 className="text-white text-lg font-semibold">
              Model Pipeline
            </h2>

            <p className="text-text-secondary text-xs mt-1">
              Simulate retraining and inference
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 mb-8">
          {pipelineStages.map((stage, index) => (
            <React.Fragment key={stage}>

              <div className="flex-1 w-full text-center">
                <div
                  className={`rounded-xl border p-3 transition-all ${
                    progress > index * 20
                      ? "border-zenith-accent bg-zenith-accent/10"
                      : "border-zenith-border bg-zenith-surface"
                  }`}
                >
                  <span className="text-xs text-white">
                    {stage}
                  </span>
                </div>
              </div>

              {index < pipelineStages.length - 1 && (
                <span className="text-text-secondary hidden md:block">
                  →
                </span>
              )}

            </React.Fragment>
          ))}
        </div>

        {running && (
          <div className="mb-6">

            <div className="flex justify-between text-xs mb-2">
              <span className="text-text-secondary">
                Retraining model...
              </span>

              <span className="text-white">
                {progress}%
              </span>
            </div>

            <div className="h-2 bg-zenith-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-zenith-accent rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

          </div>
        )}

        <div className="flex flex-wrap gap-3">

          <button
            onClick={retrainModel}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zenith-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                running ? "animate-spin" : ""
              }`}
            />

            {running ? "Retraining..." : "Retrain Model"}
          </button>

          <button
            onClick={testInference}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zenith-surface border border-zenith-border text-white text-sm font-medium hover:border-zenith-accent/50"
          >
            <Play className="w-4 h-4" />
            Test Inference
          </button>

        </div>

        {inferenceResult && (
          <div className="mt-6 bg-black/20 border border-zenith-border rounded-xl p-4">

            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />

              <span className="text-white text-sm font-medium">
                Inference Complete
              </span>
            </div>

            <pre className="text-xs text-text-secondary overflow-x-auto">
              {JSON.stringify(inferenceResult, null, 2)}
            </pre>

          </div>
        )}

      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* MAIN PAGE */
/* ------------------------------------------------ */

export default function ModelIntelligence() {
  return (
    <>
      {/* 
        PAGE-SCOPED FIX

        This disables cursor/spotlight pseudo-elements that may be
        coming from globally loaded CSS or shared components.

        It only applies while this page is rendered.
      */}
      <style>{`
        .model-intelligence-page *,
        .model-intelligence-page *::before,
        .model-intelligence-page *::after {
          --glow-x: none !important;
          --glow-y: none !important;
        }

        .model-intelligence-page [class*="spotlight"],
        .model-intelligence-page [class*="cursor-grid"] {
          background-image: none !important;
          box-shadow: none !important;
          filter: none !important;
        }

        .model-intelligence-page::before,
        .model-intelligence-page::after {
          display: none !important;
          content: none !important;
        }
      `}</style>

      <div className="model-intelligence-page min-h-screen bg-zenith-bg text-white relative overflow-hidden">

        <div className="relative z-10">

          <Navbar />

          <main className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* HEADER */}

              <div className="mb-8">

                <div className="flex items-center gap-3 mb-3">

                  <div className="w-10 h-10 rounded-xl bg-zenith-accent/10 flex items-center justify-center">
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

              </div>

              {/* MODEL STATUS */}

              <div className="mb-6 bg-zenith-elevated rounded-xl border border-zenith-border">

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

                        <span className="w-2 h-2 rounded-full bg-green-400" />

                        <p className="text-green-400 font-semibold">
                          {modelInfo.apiStatus}
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

                </div>

              </div>

              {/* PERFORMANCE */}

              <div className="mb-6">

                <div className="flex items-center gap-2 mb-4">

                  <Activity className="w-4 h-4 text-zenith-accent" />

                  <h2 className="text-white font-semibold">
                    Model Performance
                  </h2>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                  {performanceKpis.map((item) => (
                      <BorderGlow
      
      glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
    >
                    <ModelKpiCard
                      key={item.title}
                      item={item}
                    />
                    </BorderGlow>
                  ))}

                </div>

              </div>

              {/* FEATURES + DATASETS */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                   <BorderGlow
      
      glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
    >
                <FeatureImportancePanel />
                </BorderGlow>
 <BorderGlow
      
      glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
    >

                <DatasetLineagePanel />
</BorderGlow>
              </div>

              {/* PIPELINE */}

              <PipelineSimulator />

            </div>
          </main>

          <Footer />

        </div>
      </div>
    </>
  );
}