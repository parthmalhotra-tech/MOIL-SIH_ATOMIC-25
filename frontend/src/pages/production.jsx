import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BorderGlow from "../components/borderglow";
import CursorGrid from "../components/CursorGrid";
import { getProductionForecast } from "../services/productionService";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function CountUp({ end = 0, duration = 1.2, decimals = 0 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const target = Number(end) || 0;
    let frame;
    let startTime = null;

    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / (duration * 1000),
        1
      );
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(target * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);

  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function ProductionKpiCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  status,
  accent = "white",
}) {
  const accentColors = {
    white: "#ffffff",
    red: "#ef4444",
    orange: "#f97316",
    green: "#22c55e",
  };

  const accentColor = accentColors[accent] || accentColors.white;
  const numericValue = Number(value) || 0;
  const hasTrend = typeof trend === "number" && trend !== 0;
  const isPositive = hasTrend && trend > 0;
  const decimals = unit === "%" ? 1 : numericValue % 1 !== 0 ? 2 : 0;

  return (
    <div className="group bg-zenith-elevated/80 backdrop-blur-xl rounded-xl p-5 border border-zenith-border relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-400/40">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10 space-y-2">
        <span className="text-sm font-medium text-text-secondary">
          {label}
        </span>

        <div className="flex items-baseline gap-1.5">
          <p className="font-display font-bold text-white text-2xl sm:text-3xl tabular-nums">
            <CountUp end={numericValue} decimals={decimals} />
          </p>
          {unit && <span className="text-text-muted text-sm">{unit}</span>}
        </div>

        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          {status && (
            <span
              className="px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
                border: `1px solid ${accentColor}40`,
              }}
            >
              {status}
            </span>
          )}

          {hasTrend ? (
            <span
              className={`inline-flex items-center gap-0.5 ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </span>
          ) : (
            <Minus className="w-3 h-3 text-text-muted" />
          )}

          {trendLabel && (
            <span className="text-text-muted">{trendLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-zenith-bg/95 backdrop-blur-xl border border-zenith-border rounded-lg px-4 py-3 shadow-2xl">
      <p className="text-xs uppercase tracking-widest text-text-muted mb-3">
        {label}
      </p>

      {payload
        .filter((item) => item.value !== null && item.value !== undefined)
        .map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-8 text-sm mb-1"
          >
            <span className="text-text-secondary">{item.name}</span>
            <span className="font-mono text-white tabular-nums">
              {Number(item.value).toFixed(2)} Lakh Tonnes
            </span>
          </div>
        ))}
    </div>
  );
}

function ProductionForecastMainChart({ data }) {
  return (
    <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-white text-lg">
            Historical vs Forecast Output
          </h2>
          <p className="text-sm text-text-muted">
            Values returned by the production API
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full bg-zinc-500" />
          Historical
          <span className="w-2 h-2 rounded-full bg-red-500 ml-3" />
          Forecast
        </div>
      </div>

      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="productionConfidenceFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />

            <XAxis
              dataKey="period"
              stroke="#71717a"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />

            <YAxis
              stroke="#71717a"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => Number(value).toFixed(1)}
              width={48}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
              iconType="circle"
            />

            <Line
              type="linear"
              dataKey="historicalLine"
              name="Actual Production"
              stroke="#a1a1aa"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#a1a1aa", strokeWidth: 0 }}
              connectNulls={false}
            />

            <Area
              type="linear"
              dataKey="confidenceHigh"
              stroke="none"
              fill="url(#productionConfidenceFill)"
              fillOpacity={1}
              baseValue="confidenceLow"
            />

            <Line
              type="linear"
              dataKey="forecastLine"
              name="Forecast"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 5, fill: "#ef4444", strokeWidth: 0 }}
              connectNulls={false}
            />

            <Line
              type="linear"
              dataKey="targetLine"
              name="Target"
              stroke="#b85c5c"
              strokeWidth={2.5}
              strokeOpacity={0.65}
              strokeDasharray="6 4"
              dot={{ r: 5, fill: "#b85c5c", strokeWidth: 0 }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Production() {
  const [backendData, setBackendData] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProductionForecast = async () => {
    try {
      setLoading(true);
      setBackendError(null);
      const data = await getProductionForecast();
      setBackendData(data);
      console.log("Production API:", data);
    } catch (error) {
      console.error("Production API error:", error);
      setBackendError(error?.message || "Unable to load production data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductionForecast();
  }, []);

  const latestHistorical =
    backendData?.historical?.length > 0
      ? backendData.historical[backendData.historical.length - 1]
      : null;

  const previousHistorical =
    backendData?.historical?.length > 1
      ? backendData.historical[backendData.historical.length - 2]
      : null;

  const currentOutput = Number(latestHistorical?.production_lakh_tonnes) || 0;
  const forecastOutput =
    Number(backendData?.forecast_production_lakh_tonnes) || 0;
  const targetOutput =
    Number(backendData?.expected_production_lakh_tonnes) || 0;
  const shortfallPct = Number(backendData?.predicted_shortfall_pct) || 0;
  const shortfallProbability =
    (Number(backendData?.shortfall_probability) || 0) * 100;

  const currentTrend =
    previousHistorical?.production_lakh_tonnes
      ? ((currentOutput - Number(previousHistorical.production_lakh_tonnes)) /
          Number(previousHistorical.production_lakh_tonnes)) *
        100
      : 0;

  const scaledSeries = useMemo(() => {
    if (!backendData?.historical?.length) return [];

    const historicalPoints = backendData.historical.map((item) => ({
      period: new Date(`${item.month}-01`).toLocaleString("en-US", {
        month: "short",
      }),
      historicalLine: Number(item.production_lakh_tonnes),
      forecastLine: null,
      targetLine: null,
      confidenceLow: null,
      confidenceHigh: null,
    }));

    const lastIndex = historicalPoints.length - 1;
    const lastActual = historicalPoints[lastIndex]?.historicalLine;

    if (lastIndex >= 0) {
      historicalPoints[lastIndex].forecastLine = lastActual;
      historicalPoints[lastIndex].targetLine = lastActual;
    }

    const forecastMonth = backendData.prediction_date
      ? new Date(backendData.prediction_date).toLocaleString("en-US", {
          month: "short",
        })
      : "Forecast";

    return [
      ...historicalPoints,
      {
        period: forecastMonth,
        historicalLine: null,
        forecastLine: Number(backendData.forecast_production_lakh_tonnes),
        targetLine: Number(backendData.expected_production_lakh_tonnes),
        confidenceLow: null,
        confidenceHigh: null,
      },
    ];
  }, [backendData]);

  return (
    <div className="relative min-h-screen bg-zenith-bg flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CursorGrid color="#ffffff" opacity={0.08} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <section className="space-y-3 animate-slide-up">
              <h1 className="font-display font-semibold text-3xl sm:text-4xl text-white tracking-tight">
                PRODUCTION INTELLIGENCE
              </h1>
              <p className="text-text-secondary text-lg max-w-2xl">
                Production history, model forecast, target output and
                shortfall indicators returned directly by the backend.
              </p>
              <p className="text-xs text-text-muted">
                Live backend data · no hardcoded production values
              </p>
            </section>

            {backendError && (
              <section className="flex items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{backendError}</span>
                </div>
                <button
                  onClick={loadProductionForecast}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 hover:bg-red-500/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </section>
            )}

            <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-up">
              <BorderGlow glowColor="#ffffff" glowRadius={80} glowIntensity={1.2} borderRadius={24}>
                <ProductionKpiCard
                  label="Current Output"
                  value={currentOutput}
                  unit="Lakh Tonnes"
                  trend={currentTrend}
                  trendLabel={latestHistorical ? `Latest actual (${latestHistorical.month})` : ""}
                />
              </BorderGlow>

              <BorderGlow glowColor="#ffffff" glowRadius={80} glowIntensity={1.2} borderRadius={24}>
                <ProductionKpiCard
                  label="Target Output"
                  value={targetOutput}
                  unit="Lakh Tonnes"
                  trend={0}
                  trendLabel="Backend target"
                  accent="red"
                />
              </BorderGlow>

              <BorderGlow glowColor="#ffffff" glowRadius={80} glowIntensity={1.2} borderRadius={24}>
                <ProductionKpiCard
                  label="Forecast Output"
                  value={forecastOutput}
                  unit="Lakh Tonnes"
                  trend={0}
                  trendLabel="Model forecast"
                  accent="red"
                />
              </BorderGlow>

              <BorderGlow glowColor="#ffffff" glowRadius={80} glowIntensity={1.2} borderRadius={24}>
                <ProductionKpiCard
                  label="Predicted Shortfall"
                  value={shortfallPct}
                  unit="%"
                  trend={0}
                  status={backendData?.classification === "YES" ? "Shortfall Expected" : "No Shortfall"}
                  trendLabel="Backend estimate"
                  accent="orange"
                />
              </BorderGlow>

              <BorderGlow glowColor="#ffffff" glowRadius={80} glowIntensity={1.2} borderRadius={24}>
                <ProductionKpiCard
                  label="Shortfall Probability"
                  value={shortfallProbability}
                  unit="%"
                  trend={0}
                  trendLabel="Classifier probability"
                  accent="green"
                />
              </BorderGlow>
            </section>

            <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <BorderGlow glowColor="#ffffff" glowRadius={80} glowIntensity={1.2} borderRadius={24}>
                {loading ? (
                  <div className="h-[430px] flex items-center justify-center bg-zenith-elevated/80 rounded-xl text-text-muted">
                    Loading production data from backend…
                  </div>
                ) : (
                  <ProductionForecastMainChart data={scaledSeries} />
                )}
              </BorderGlow>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
