import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import KpiCard from "../components/KpiCard";
import ProspectivityMap from "../components/ProspectivityMap";
import ProductionForecastChart from "../components/ProductionForecastChart";
import RiskOverview from "../components/RiskOverview";
import AIInsight from "../components/AIInsight";
import Footer from "../components/Footer";
import BorderGlow from "../components/borderglow";
import CursorGrid from "../components/CursorGrid";

import { prospectivityMockData } from "../data/prospectivitydata";
import { riskData } from "../data/riskData";
import { aiInsightData } from "../data/aiInsightData";

import { getProductionForecast } from "../services/productionService";
import {
  classifyProspectivity,
  getProspectivityStats,
} from "../services/prospectivityService";

const LAKH_TONNES_TO_MT = 0.1;

function toMt(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Number((number * LAKH_TONNES_TO_MT).toFixed(3))
    : 0;
}

export default function Dashboard() {
  const [production, setProduction] = useState(null);
  const [productionLoading, setProductionLoading] = useState(true);
  const [productionError, setProductionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduction() {
      try {
        setProductionLoading(true);
        setProductionError("");

        const data = await getProductionForecast();

        if (!cancelled) {
          setProduction(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load production forecast:", error);
          setProductionError(
            error?.message || "Unable to load production data."
          );
        }
      } finally {
        if (!cancelled) {
          setProductionLoading(false);
        }
      }
    }

    loadProduction();

    return () => {
      cancelled = true;
    };
  }, []);

  const prospectivityStats = useMemo(
    () => getProspectivityStats(prospectivityMockData),
    []
  );

  const prospectivityZones = useMemo(() => {
    return prospectivityMockData.filter((record) => {
      const probability = Number(
        record.probability ??
          record.prospectivity_score ??
          record.manganese_probability
      );

      return (
        Number.isFinite(probability) &&
        probability >= 0.7
      );
    }).length;
  }, []);

  const productionChartData = useMemo(() => {
    if (!production) {
      return {
        historical: [],
        forecast: [],
        target: null,
      };
    }

    const historical = (production.historical || []).map((item) => ({
      year: item.month,
      production: toMt(item.production_lakh_tonnes),
    }));

    const forecastDate = production.prediction_date
      ? new Date(production.prediction_date)
      : null;

    const forecastLabel =
      forecastDate && !Number.isNaN(forecastDate.getTime())
        ? forecastDate.toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          })
        : production.prediction_date || "Forecast";

    const forecast = [
      {
        year: forecastLabel,
        production: toMt(
          production.forecast_production_lakh_tonnes
        ),
        shortfallProbability:
          Number(production.shortfall_probability) || 0,
      },
    ];

    return {
      historical,
      forecast,
      target: toMt(
        production.expected_production_lakh_tonnes
      ),
    };
  }, [production]);

  const productionValue = production
    ? toMt(production.forecast_production_lakh_tonnes)
    : 0;

  const shortfallValue = production
    ? Number(production.predicted_shortfall_pct) || 0
    : 0;

  const productionPeriod = production?.prediction_date
    ? new Date(production.prediction_date).toLocaleDateString(
        "en-IN",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "Loading...";

  return (
    <div className="relative isolate min-h-screen bg-zenith-bg flex flex-col overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-[center_top] bg-no-repeat opacity-85"
        style={{ backgroundImage: "url('/backgorund_pic.png')" }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,5,5,0.94)_0%,rgba(5,5,5,0.75)_38%,rgba(5,5,5,0.28)_100%),linear-gradient(180deg,rgba(5,5,5,0.12)_0%,rgba(5,5,5,0.72)_68%,rgba(5,5,5,0.96)_100%)]"
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-[2] pointer-events-none">
        <CursorGrid color="#ffffff" opacity={0.08} />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 w-full pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <HeroSection />

          {/* KPIs */}
          <section
            id="kpis"
            aria-labelledby="kpis-heading"
            className="animate-slide-up"
          >
            <h2 id="kpis-heading" className="sr-only">
              Key Performance Indicators
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Prospectivity */}
              <BorderGlow
                glowColor="#ffffff"
                glowRadius={80}
                glowIntensity={1.2}
                borderRadius={24}
              >
                <KpiCard
                  title="High & Very High Zones"
                  value={prospectivityZones}
                  unit="zones"
                  trend={`${prospectivityStats.total}`}
                  trendLabel="total predictions"
                  color="manganai"
                />
              </BorderGlow>

              {/* Production */}
              <BorderGlow
                glowColor="#ffffff"
                glowRadius={80}
                glowIntensity={1.2}
                borderRadius={24}
              >
                <KpiCard
                  title="Forecast Production"
                  value={
                    productionLoading
                      ? "—"
                      : productionValue
                  }
                  unit="Mt"
                  trend={
                    productionLoading
                      ? ""
                      : production
                        ? production.classification
                        : "Unavailable"
                  }
                  trendLabel={productionPeriod}
                  color="yellow"
                />
              </BorderGlow>

              {/* Shortfall */}
              <BorderGlow
                glowColor="#ffffff"
                glowRadius={80}
                glowIntensity={1.2}
                borderRadius={24}
              >
                <KpiCard
                  title="Expected Shortfall"
                  value={
                    productionLoading
                      ? "—"
                      : Number(shortfallValue.toFixed(1))
                  }
                  unit="%"
                  trend={
                    productionLoading
                      ? ""
                      : production
                        ? `${Math.round(
                            production.shortfall_probability * 100
                          )}%`
                        : "Unavailable"
                  }
                  trendLabel="shortfall probability"
                  color="orange"
                />
              </BorderGlow>

              {/* Risk — intentionally unchanged */}
              <BorderGlow
                glowColor="#ffffff"
                glowRadius={80}
                glowIntensity={1.2}
                borderRadius={24}
              >
                <KpiCard
                  title={riskData.distribution
                    ? "High Risk Locations"
                    : "Risk"}
                  value={riskData.distribution
                    ? riskData.distribution
                        .filter(
                          (item) =>
                            item.level === "High" ||
                            item.level === "Very High"
                        )
                        .reduce(
                          (sum, item) => sum + item.count,
                          0
                        )
                    : 0}
                  unit="sites"
                  trend="+5"
                  trendLabel="new risk sites"
                  color="red"
                />
              </BorderGlow>
            </div>
          </section>

          {/* Prospectivity */}
          <section
            id="prospectivity"
            aria-labelledby="prospectivity-heading"
          >
            <h2
              id="prospectivity-heading"
              className="sr-only"
            >
              India Predicted Prospectivity
            </h2>

            <div className="mb-4">
              <h2 className="font-display font-semibold text-white text-xl">
                India Predicted Prospectivity
              </h2>

              <p className="text-sm text-text-muted mt-1">
                AI-predicted manganese-associated prospectivity
                across sampled locations
              </p>
            </div>

            <ProspectivityMap
              data={prospectivityMockData}
              initialView={{
                center: [21.0, 78.0],
                zoom: 5,
              }}
            />
          </section>

          {/* Analytics */}
          <section id="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <ProductionForecastChart
                historical={productionChartData.historical}
                forecast={productionChartData.forecast}
                target={productionChartData.target}
                unit="Mt"
                loading={productionLoading}
                error={productionError}
              />

              {/* Leave Risk Overview unchanged */}
              <RiskOverview
                distribution={riskData.distribution}
                totalLocations={riskData.totalLocations}
                variant="bars"
              />
            </div>
          </section>

          {/* Leave AI Insight unchanged */}
          <section id="ai-insight">
            <AIInsight
              insights={aiInsightData.insights}
              modelVersion={aiInsightData.modelVersion}
              generatedAt={aiInsightData.generatedAt}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}