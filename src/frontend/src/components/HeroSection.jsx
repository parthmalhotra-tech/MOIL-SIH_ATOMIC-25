import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import BorderGlow from "../components/borderglow";

import { getProductionForecast } from "../services/productionService";
import { prospectivityMockData } from "../data/prospectivitydata";

const LAKH_TONNES_TO_MT = 0.1;

function toMt(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? Number((number * LAKH_TONNES_TO_MT).toFixed(3))
    : null;
}

export default function HeroSection() {
  const [production, setProduction] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProduction() {
      try {
        const data = await getProductionForecast();

        if (!cancelled) {
          setProduction(data);
        }
      } catch (error) {
        console.error("Failed to load hero production data:", error);
      }
    }

    loadProduction();

    return () => {
      cancelled = true;
    };
  }, []);

  const highVeryHighZones = useMemo(() => {
    return prospectivityMockData.filter((record) => {
      const probability = Number(
        record.probability ??
          record.prospectivity_score ??
          record.manganese_probability,
      );

      return Number.isFinite(probability) && probability >= 0.7;
    }).length;
  }, []);

  const forecastProduction = production
    ? toMt(production.forecast_production_lakh_tonnes)
    : null;

  const shortfallProbability = production
    ? Number(production.shortfall_probability)
    : null;

  const predictionPeriod = production?.prediction_date
    ? new Date(production.prediction_date).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Loading...";

  return (
    <section className="relative min-h-[90vh] flex items-center pt-18 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl w-full">
        {/* Background image/visual - right side */}
        <div className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] h-[80%] max-w-[800px] rounded-2xl bg-[url('https://images.unsplash.com/photo-1511593358241-7eea1f3c8c6d?w=800&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-zenith-bg via-zenith-bg/80 to-transparent" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 -z-10 opacity-20" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Text content */}
          <div className="animate-slide-up pr-8">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-white text-balance mb-8">
              <span className="block">Discover manganese</span>
              <span className="block">intelligence</span>
              <span className="block italic font-medium text-text-secondary mt-2">
                Powered by space technology.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-10 max-w-xl">
              AI/ML + Space Technology platform for manganese prospectivity
              mapping, production forecasting, and operational risk
              intelligence.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#prospectivity"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-zenith-bg font-semibold text-base uppercase tracking-wider transition-all duration-200 hover:bg-text-secondary hover:-translate-y-0.5"
              >
                Explore Prospectivity
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>

              <a
                href="https://drive.google.com/file/d/1XKI97vILhN0H1dSLQsx52TQUGCgJS5Bx/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-zenith-border text-white font-semibold text-base uppercase tracking-wider transition-all duration-200 hover:border-zenith-accent hover:text-zenith-accent hover:bg-zenith-accent/10"
              >
                <Play className="w-5 h-5" aria-hidden="true" />
                See How It Works
              </a>
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className="relative animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative aspect-[4/3] min-h-[420px] rounded-2xl overflow-hidden border border-zenith-border bg-zenith-surface flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-zenith-accent/5 via-transparent to-transparent" />

              <BorderGlow
                glowColor="#ffffff"
                glowRadius={220}
                glowIntensity={1.2}
                borderRadius={24}
              >
                <div className="relative h-full w-full flex flex-col items-center justify-between p-8 lg:p-10">
                  <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-md">
                    {/* Icon */}
                    <div className="mx-auto mb-6 w-20 h-20 rounded-xl bg-zenith-elevated flex items-center justify-center border border-zenith-border shrink-0">
                      <svg
                        className="w-10 h-10 text-zenith-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-semibold text-white text-xl lg:text-2xl mb-3 leading-snug">
                      Interactive Prospectivity Map
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary mb-6 leading-relaxed text-base lg:text-lg max-w-md">
                      AI predictions across India's manganese belts. Explore the
                      interactive map with detailed location-level prospectivity
                      insights.
                    </p>

                    {/* REAL KPI Row */}
                    <div className="w-full max-w-md flex flex-col sm:flex-row gap-4 mb-6 shrink-0">
                      {/* Forecast Production */}
                      <div className="flex-1 bg-zenith-elevated/80 backdrop-blur-xl p-4 lg:p-5 rounded-xl border border-zenith-border text-center min-w-0">
                        <p className="font-display font-bold text-white text-xl lg:text-2xl leading-tight">
                          {forecastProduction !== null
                            ? `${forecastProduction} Mt`
                            : "—"}
                        </p>

                        <p className="text-xs text-text-muted uppercase tracking-wide mt-1.5 leading-snug">
                          {predictionPeriod}
                          <br className="hidden sm:block" />
                          FORECAST
                        </p>
                      </div>

                      {/* High + Very High Zones */}
                      <div className="flex-1 bg-zenith-elevated/80 backdrop-blur-xl p-4 lg:p-5 rounded-xl border border-zenith-border text-center min-w-0">
                        <p className="font-display font-bold text-white text-xl lg:text-2xl leading-tight">
                          {highVeryHighZones.toLocaleString("en-IN")}
                        </p>

                        <p className="text-xs text-text-muted uppercase tracking-wide mt-1.5 leading-snug">
                          HIGH & VERY HIGH
                          <br className="hidden sm:block" />
                          ZONES
                        </p>
                      </div>
                    </div>

                    {/* Model status */}
                    {shortfallProbability !== null && (
                      <div className="mb-6 px-4 py-2 rounded-full bg-zenith-accent/10 border border-zenith-accent/20">
                        <span className="text-xs font-medium text-zenith-accent uppercase tracking-wider">
                          Shortfall Probability:{" "}
                          {Math.round(shortfallProbability * 100)}%
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap justify-center gap-2 shrink-0">
                      {[
                        "Satellite Intelligence",
                        "ML Predictions",
                        "Geological Data",
                        "Production Analytics",
                      ].map((item, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full bg-zenith-elevated border border-zenith-border text-xs text-text-secondary whitespace-nowrap"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
