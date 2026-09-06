import { useState, useMemo, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BorderGlow from "../components/borderglow";
import CursorGrid from "../components/CursorGrid";

import {
  ChevronDown,
  MapPin,
  Pickaxe,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  Trophy,
  Medal,
} from "lucide-react";

import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* =========================================================
   FILTER DATA
========================================================= */

const filterOptions = {
  states: [
    "Select State",
    "Odisha",
    "Jharkhand",
    "Chhattisgarh",
    "Rajasthan",
  ],

  districts: {
    "Select State": ["Select City"],

    Odisha: [
      "Select City",
      "Keonjhar",
      "Sundargarh",
      "Mayurbhanj",
    ],

    Jharkhand: [
      "Select City",
      "Singhbhum",
      "Ramgarh",
      "Dhanbad",
    ],

    Chhattisgarh: [
      "Select City",
      "Korba",
      "Bastar",
      "Surguja",
    ],

    Rajasthan: [
      "Select City",
      "Bhilwara",
      "Udaipur",
      "Ajmer",
    ],
  },

  mines: {
    "Select City": ["Select Mine"],

    Keonjhar: [
      "Select Mine",
      "Joda Mine",
      "Barbil Mine",
    ],

    Sundargarh: [
      "Select Mine",
      "Sundargarh Central",
      "Koida Mine",
    ],

    Mayurbhanj: [
      "Select Mine",
      "Gorumahisani",
    ],

    Singhbhum: [
      "Select Mine",
      "Noamundi Mine",
    ],

    Ramgarh: [
      "Select Mine",
      "Rajrappa Mine",
    ],

    Dhanbad: [
      "Select Mine",
      "Jharia Mine",
    ],

    Korba: [
      "Select Mine",
      "Gevra Mine",
      "Dipka Mine",
    ],

    Bastar: [
      "Select Mine",
      "Bailadila Mine",
    ],

    Surguja: [
      "Select Mine",
      "Hasdeo Mine",
    ],

    Bhilwara: [
      "Select Mine",
      "Bhilwara Central",
    ],

    Udaipur: [
      "Select Mine",
      "Zawar Mine",
    ],

    Ajmer: [
      "Select Mine",
      "Ajmer Mine",
    ],
  },

  years: [
    "2024",
    "2025",
    "2026",
  ],
};

/* =========================================================
   PRODUCTION KPI DATA
========================================================= */

const productionKpis = {
  currentOutput: {
    label: "Current Output",
    value: 48200,
    unit: "t",
    trend: 4.8,
    trendLabel: "vs previous period",
  },

  targetOutput: {
    label: "Target Output",
    value: 51000,
    unit: "t",
    trend: 0,
    trendLabel: "planned",
  },

  forecastOutput: {
    label: "Forecast Output",
    value: 53400,
    unit: "t",
    trend: 7.2,
    trendLabel: "model forecast",
  },

  variance: {
    label: "Target Variance",
    value: -5.5,
    unit: "%",
    status: "Below Target",
    trend: -5.5,
    trendLabel: "current vs target",
  },

  confidence: {
    label: "Forecast Confidence",
    value: 91.4,
    unit: "%",
    trend: 2.3,
    trendLabel: "model confidence",
  },
};

/* =========================================================
   CHART DATA
========================================================= */

const productionForecastSeries = [
  {
    period: "Jan",
    historical: 42000,
    forecast: null,
    confidenceLow: null,
    confidenceHigh: null,
    target: 45000,
  },

  {
    period: "Feb",
    historical: 43800,
    forecast: null,
    confidenceLow: null,
    confidenceHigh: null,
    target: 45000,
  },

  {
    period: "Mar",
    historical: 45200,
    forecast: null,
    confidenceLow: null,
    confidenceHigh: null,
    target: 46000,
  },

  {
    period: "Apr",
    historical: 46800,
    forecast: null,
    confidenceLow: null,
    confidenceHigh: null,
    target: 47000,
  },

  {
    period: "May",
    historical: 47500,
    forecast: null,
    confidenceLow: null,
    confidenceHigh: null,
    target: 48000,
  },

  {
    period: "Jun",
    historical: 48200,
    forecast: null,
    confidenceLow: null,
    confidenceHigh: null,
    target: 49000,
  },

  {
    period: "Jul",
    historical: null,
    forecast: 49500,
    confidenceLow: 47000,
    confidenceHigh: 52000,
    target: 50000,
  },

  {
    period: "Aug",
    historical: null,
    forecast: 50800,
    confidenceLow: 48000,
    confidenceHigh: 53600,
    target: 50500,
  },

  {
    period: "Sep",
    historical: null,
    forecast: 51900,
    confidenceLow: 48700,
    confidenceHigh: 55000,
    target: 51000,
  },

  {
    period: "Oct",
    historical: null,
    forecast: 52800,
    confidenceLow: 49200,
    confidenceHigh: 56400,
    target: 51500,
  },

  {
    period: "Nov",
    historical: null,
    forecast: 53600,
    confidenceLow: 49800,
    confidenceHigh: 57400,
    target: 52000,
  },

  {
    period: "Dec",
    historical: null,
    forecast: 54800,
    confidenceLow: 50500,
    confidenceHigh: 59100,
    target: 52500,
  },
];

/* =========================================================
   DATA ORIGIN
========================================================= */

const dataOrigin = [
  "Production Records",
  "Mine Telemetry",
  "Historical Output",
  "Operational Reports",
];

/* =========================================================
   STATE PRODUCTION DATA
========================================================= */

const stateProductionData = [
  {
    state: "Odisha",
    production: 128400,
  },
  {
    state: "Jharkhand",
    production: 113200,
  },
  {
    state: "Chhattisgarh",
    production: 98400,
  },
  {
    state: "Rajasthan",
    production: 76200,
  },
];

/* =========================================================
   CURSOR GRID
========================================================= */



/* =========================================================
   COUNT UP
========================================================= */

function CountUp({
  end,
  duration = 1.4,
  decimals = 0,
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrame;
    let startTime = null;

    const animate = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed =
        timestamp - startTime;

      const progress = Math.min(
        elapsed /
          (duration * 1000),
        1
      );

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      setValue(end * eased);

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(
            animate
          );
      } else {
        setValue(end);
      }
    };

    animationFrame =
      requestAnimationFrame(
        animate
      );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );
    };
  }, [end, duration]);

  return value.toLocaleString(
    undefined,
    {
      minimumFractionDigits:
        decimals,

      maximumFractionDigits:
        decimals,
    }
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  icon: Icon,
  value,
  onChange,
  options,
  ariaLabel,
}) {
  return (
    <div className="relative">

      <Icon
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
        aria-hidden="true"
      />

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="appearance-none pl-10 pr-9 py-2.5 rounded-lg bg-zenith-surface border border-zenith-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all cursor-pointer"
        aria-label={ariaLabel}
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
        aria-hidden="true"
      />

    </div>
  );
}

/* =========================================================
   PRODUCTION FILTER BAR
========================================================= */

function ProductionFilterBar({
  filters,
  onChange,
}) {
  const cityOptions =
    filterOptions.districts[
      filters.state
    ] || ["Select City"];

  const mineOptions =
    filterOptions.mines[
      filters.district
    ] || ["Select Mine"];

  return (
    <section className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border p-4 sm:p-6">

      <div className="flex flex-wrap items-center gap-3">

        <FilterSelect
          icon={MapPin}
          ariaLabel="Select state"
          value={filters.state}
          onChange={(value) =>
            onChange({
              state: value,
              district: "Select City",
              mine: "Select Mine",
            })
          }
          options={filterOptions.states}
        />

        <FilterSelect
          icon={MapPin}
          ariaLabel="Select city"
          value={filters.district}
          onChange={(value) =>
            onChange({
              district: value,
              mine: "Select Mine",
            })
          }
          options={cityOptions}
        />

        <FilterSelect
          icon={Pickaxe}
          ariaLabel="Select mine"
          value={filters.mine}
          onChange={(value) =>
            onChange({
              mine: value,
            })
          }
          options={mineOptions}
        />

        <FilterSelect
          icon={CalendarDays}
          ariaLabel="Filter by year"
          value={filters.year}
          onChange={(value) =>
            onChange({
              year: value,
            })
          }
          options={filterOptions.years}
        />

      </div>

    </section>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function ProductionKpiCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  status,
  accent = "white",
}) {
  const colorMap = {
    white: "#ffffff",
    purple: "#a78bfa",
    orange: "#f97316",
    red: "#ef4444",
    green: "#22c55e",
  };

  const accentColor =
    colorMap[accent] ||
    colorMap.white;

  const hasTrend =
    typeof trend === "number" &&
    trend !== 0;

  const isPositive =
    hasTrend && trend > 0;

  const decimals =
    typeof value === "number" &&
    !Number.isInteger(value)
      ? 1
      : 0;

  return (
    <div
      className="group bg-zenith-elevated/80 backdrop-blur-xl rounded-xl p-5 border border-zenith-border relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-400/40"
    >

      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          backgroundColor:
            accentColor,
        }}
      />

      <div
        className="absolute -top-20 -right-20 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          backgroundColor:
            accentColor,
        }}
      />

      <div className="relative z-10 space-y-2">

        <span className="text-sm font-medium text-text-secondary">
          {label}
        </span>

        <div className="flex items-baseline gap-1.5">

          <p className="font-display font-bold text-white text-2xl sm:text-3xl tabular-nums">

            <CountUp
              end={value}
              duration={1.4}
              decimals={decimals}
            />

          </p>

          {unit && (
            <span className="text-text-muted text-sm">
              {unit}
            </span>
          )}

        </div>

        <div className="flex items-center gap-1.5 text-xs flex-wrap">

          {status && (
            <span
              className="px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
              style={{
                backgroundColor:
                  `${accentColor}20`,
                color:
                  accentColor,
                border:
                  `1px solid ${accentColor}40`,
              }}
            >
              {status}
            </span>
          )}

          {hasTrend && (
            <span
              className={
                `inline-flex items-center gap-0.5 ${
                  isPositive
                    ? "text-emerald-400"
                    : "text-red-400"
                }`
              }
            >

              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}

              {Math.abs(trend)}%

            </span>
          )}

          {!hasTrend &&
            !status && (
              <Minus className="w-3 h-3 text-text-muted" />
            )}

          {trendLabel && (
            <span className="text-text-muted">
              {trendLabel}
            </span>
          )}

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   CHART TOOLTIP
========================================================= */

function CustomTooltip({
  active,
  payload,
  label,
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  return (
    <div className="bg-zenith-bg/95 backdrop-blur-xl border border-zenith-border rounded-lg px-4 py-3 shadow-2xl">

      <p className="text-xs uppercase tracking-widest text-text-muted mb-3">
        {label}
      </p>

      {payload
        .filter(
          (item) =>
            item.value !== null &&
            item.value !== undefined &&
            item.dataKey !== "confidenceHigh" &&
            item.dataKey !== "confidenceLow"
        )
        .map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-8 text-sm mb-1"
          >

            <span className="text-text-secondary">
              {item.name}
            </span>

            <span className="font-mono text-white tabular-nums">
              {Number(
                item.value
              ).toLocaleString()}{" "}
              Tonnes
            </span>

          </div>
        ))}

    </div>
  );
}

/* =========================================================
   PRODUCTION FORECAST CHART
========================================================= */

function ProductionForecastMainChart({
  data,
}) {
  const formatYAxis = (
    value
  ) => `${(value / 1000).toFixed(0)}k`;

  return (
    <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border p-4 sm:p-6">

      <div className="flex items-center justify-between mb-4">

        <div>

          <h2 className="font-display font-semibold text-white text-lg">
            Historical vs Forecast Output
          </h2>

          <p className="text-sm text-text-muted">
            Yield in Tonnes, with model confidence interval
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

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 12,
              left: 0,
              bottom: 0,
            }}
          >

            <defs>

              <linearGradient
                id="productionConfidenceFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#ef4444"
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor="#ef4444"
                  stopOpacity={0.02}
                />

              </linearGradient>

              <filter
                id="productionForecastGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >

                <feGaussianBlur
                  stdDeviation="3"
                  result="blur"
                />

                <feMerge>

                  <feMergeNode in="blur" />

                  <feMergeNode in="SourceGraphic" />

                </feMerge>

              </filter>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />

            <XAxis
              dataKey="period"
              stroke="#71717a"
              tick={{
                fill: "#a1a1aa",
                fontSize: 12,
              }}
              axisLine={{
                stroke: "#27272a",
              }}
              tickLine={false}
            />

            <YAxis
              stroke="#71717a"
              tick={{
                fill: "#a1a1aa",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxis}
              width={48}
            />

            <Tooltip
              content={<CustomTooltip />}
            />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#a1a1aa",
              }}
              iconType="circle"
            />

            <Area
              type="monotone"
              dataKey="confidenceHigh"
              stroke="none"
              fill="url(#productionConfidenceFill)"
              name="Confidence"
              legendType="none"
              connectNulls
            />

            <Area
              type="monotone"
              dataKey="confidenceLow"
              stroke="none"
              fill="#18181b"
              fillOpacity={1}
              name="Confidence Lower"
              legendType="none"
              connectNulls
            />

            <Bar
              dataKey="historical"
              name="Historical"
              fill="#3f3f46"
              radius={[3, 3, 0, 0]}
              barSize={28}
            />

            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              connectNulls
            />

            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{
                r: 3,
                fill: "#ef4444",
                strokeWidth: 0,
              }}
              connectNulls
              filter="url(#productionForecastGlow)"
            />

          </ComposedChart>

        </ResponsiveContainer>

      </div>
    </div>
  );
}

/* =========================================================
   DATA ORIGIN SECTION
========================================================= */

function DataOriginSection() {
  return (
    <section className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border p-5 sm:p-6">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">

          <Database className="w-5 h-5 text-red-400" />

        </div>

        <div>

          <h2 className="font-display font-semibold text-white text-lg">
            Data Origin
          </h2>

          <p className="text-sm text-text-muted">
            Sources used to generate production insights
          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        {dataOrigin.map((source) => (

          <div
            key={source}
            className="flex items-center gap-3 bg-zenith-surface/60 border border-zenith-border rounded-lg px-4 py-3"
          >

            <span className="w-2 h-2 rounded-full bg-red-400" />

            <span className="text-sm text-text-secondary">
              {source}
            </span>

          </div>

        ))}

      </div>

    </section>
  );
}

/* =========================================================
   STATE PRODUCTION RANKING
========================================================= */

function StateProductionRanking({
  data,
}) {
  const rankedStates =
    [...data].sort(
      (a, b) =>
        b.production -
        a.production
    );

  const highestProduction =
    rankedStates[0]?.production || 1;

  return (
    <section className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border p-5 sm:p-6">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="font-display font-semibold text-white text-lg">
            Highest Production by State
          </h2>

          <p className="text-sm text-text-muted">
            States ranked by total production output
          </p>

        </div>

        <Trophy className="w-6 h-6 text-red-400" />

      </div>

      <div className="space-y-4">

        {rankedStates.map(
          (item, index) => {

            const percentage =
              (
                item.production /
                highestProduction
              ) * 100;

            return (

              <div
                key={item.state}
                className="group"
              >

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-lg bg-zenith-surface border border-zenith-border flex items-center justify-center">

                      {index < 3 ? (
                        <Medal
                          className={`w-4 h-4 ${
                            index === 0
                              ? "text-yellow-400"
                              : index === 1
                              ? "text-zinc-300"
                              : "text-orange-400"
                          }`}
                        />
                      ) : (
                        <span className="text-sm font-mono text-text-muted">
                          #{index + 1}
                        </span>
                      )}

                    </div>

                    <span className="text-sm sm:text-base font-medium text-white">
                      {item.state}
                    </span>

                  </div>

                  <div className="text-right">

                    <span className="font-mono text-white tabular-nums">
                      <CountUp
                        end={item.production}
                        duration={1.4}
                      />
                    </span>

                    <span className="text-xs text-text-muted ml-1">
                      t
                    </span>

                  </div>

                </div>

                <div className="h-2 w-full bg-zenith-surface rounded-full overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

    </section>
  );
}

/* =========================================================
   MAIN PRODUCTION PAGE
========================================================= */

export default function Production() {

  const [filters, setFilters] =
    useState({
      state: "Select State",
      district: "Select City",
      mine: "Select Mine",
      year: "2026",
    });

  /* -------------------------------------------------------
     UPDATE FILTERS
  ------------------------------------------------------- */

  const updateFilters = (
    partial
  ) => {
    setFilters(
      (previous) => ({
        ...previous,
        ...partial,
      })
    );
  };

  /* -------------------------------------------------------
     FILTER SCALING
  ------------------------------------------------------- */

  const filterFactor =
    useMemo(() => {

      const seed =
        `${filters.state}-${filters.district}-${filters.mine}-${filters.year}`;

      let hash = 0;

      for (
        let i = 0;
        i < seed.length;
        i++
      ) {
        hash =
          (
            hash * 31 +
            seed.charCodeAt(i)
          ) >>> 0;
      }

      return (
        0.9 +
        (hash % 200) /
          1000
      );

    }, [filters]);

  /* -------------------------------------------------------
     SCALE KPI VALUES
  ------------------------------------------------------- */

  const scaledKpis =
    useMemo(() => {

      const scale =
        (number) =>
          Math.round(
            number *
              filterFactor
          );

      return {

        currentOutput: {
          ...productionKpis.currentOutput,
          value: scale(
            productionKpis
              .currentOutput
              .value
          ),
        },

        targetOutput: {
          ...productionKpis.targetOutput,
          value: scale(
            productionKpis
              .targetOutput
              .value
          ),
        },

        forecastOutput: {
          ...productionKpis.forecastOutput,
          value: scale(
            productionKpis
              .forecastOutput
              .value
          ),
        },

        variance:
          productionKpis.variance,

        confidence:
          productionKpis.confidence,
      };

    }, [filterFactor]);

  /* -------------------------------------------------------
     SCALE CHART VALUES
  ------------------------------------------------------- */

  const scaledSeries =
    useMemo(() => {

      return productionForecastSeries.map(
        (point) => ({

          ...point,

          historical:
            point.historical !== null
              ? Math.round(
                  point.historical *
                    filterFactor
                )
              : null,

          forecast:
            point.forecast !== null
              ? Math.round(
                  point.forecast *
                    filterFactor
                )
              : null,

          confidenceLow:
            point.confidenceLow !== null
              ? Math.round(
                  point.confidenceLow *
                    filterFactor
                )
              : null,

          confidenceHigh:
            point.confidenceHigh !== null
              ? Math.round(
                  point.confidenceHigh *
                    filterFactor
                )
              : null,

          target:
            point.target !== null
              ? Math.round(
                  point.target *
                    filterFactor
                )
              : null,
        })
      );

    }, [filterFactor]);

  /* -------------------------------------------------------
     SCALE STATE PRODUCTION
  ------------------------------------------------------- */

  const scaledStateProduction =
    useMemo(() => {

      return stateProductionData.map(
        (item) => ({
          ...item,

          production:
            Math.round(
              item.production *
                filterFactor
            ),
        })
      );

    }, [filterFactor]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="relative min-h-screen bg-zenith-bg flex flex-col overflow-hidden">

       <div className="fixed inset-0 z-0 pointer-events-none">
                     <CursorGrid
                       color="#ffffff"
                       opacity={0.08}
                     />
                   </div>

      <div className="relative z-10 flex min-h-screen flex-col">

        <Navbar />

        <main className="flex-1 pt-24 pb-8 px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-7xl space-y-8">

            {/* PAGE HEADER */}

            <section className="space-y-3 animate-slide-up">

              <h1 className="font-display font-semibold text-3xl sm:text-4xl text-white tracking-tight">

                PRODUCTION INTELLIGENCE

              </h1>

              <p className="text-text-secondary text-lg max-w-2xl">

                Track output against target
                and review model-forecast
                production by mine, city
                and state.

              </p>

              <p className="text-xs text-text-muted flex items-center gap-1.5">

                <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-mono">

                  Demo Data

                </span>

                <span>

                  Based on sample forecast
                  output — not a live model
                  inference

                </span>

              </p>

            </section>

            {/* FILTER BAR */}

            <div
              className="animate-slide-up"
              style={{
                animationDelay: "100ms",
              }}
            >

              <ProductionFilterBar
                filters={filters}
                onChange={updateFilters}
              />

            </div>

            {/* KPI STRIP */}

            <section
              aria-labelledby="production-kpis-heading"
              className="animate-slide-up"
              style={{
                animationDelay: "150ms",
              }}
            >

              <h2
                id="production-kpis-heading"
                className="sr-only"
              >
                Production KPIs
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <BorderGlow
  glowColor="#ffffff"
  glowRadius={80}
  glowIntensity={1.2}
  borderRadius={24}
>
                <ProductionKpiCard
                  label={
                    scaledKpis.currentOutput.label
                  }
                  value={
                    scaledKpis.currentOutput.value
                  }
                  unit={
                    scaledKpis.currentOutput.unit
                  }
                  trend={
                    scaledKpis.currentOutput.trend
                  }
                  trendLabel={
                    scaledKpis.currentOutput.trendLabel
                  }
                  accent="white"
                />
                </BorderGlow>

                {/* CHANGED FROM PURPLE TO RED */}
                <BorderGlow
  glowColor="#ffffff"
  glowRadius={80}
  glowIntensity={1.2}
  borderRadius={24}
>
                <ProductionKpiCard
                  label={
                    scaledKpis.targetOutput.label
                  }
                  value={
                    scaledKpis.targetOutput.value
                  }
                  unit={
                    scaledKpis.targetOutput.unit
                  }
                  trend={
                    scaledKpis.targetOutput.trend
                  }
                  trendLabel={
                    scaledKpis.targetOutput.trendLabel
                  }
                  accent="red"
                /></BorderGlow>
 <BorderGlow
  glowColor="#ffffff"
  glowRadius={80}
  glowIntensity={1.2}
  borderRadius={24}
>
                <ProductionKpiCard
                  label={
                    scaledKpis.forecastOutput.label
                  }
                  value={
                    scaledKpis.forecastOutput.value
                  }
                  unit={
                    scaledKpis.forecastOutput.unit
                  }
                  trend={
                    scaledKpis.forecastOutput.trend
                  }
                  trendLabel={
                    scaledKpis.forecastOutput.trendLabel
                  }
                  accent="purple"
                /></BorderGlow>
 <BorderGlow
  glowColor="#ffffff"
  glowRadius={80}
  glowIntensity={1.2}
  borderRadius={24}
>
                <ProductionKpiCard
                  label={
                    scaledKpis.variance.label
                  }
                  value={
                    scaledKpis.variance.value
                  }
                  unit={
                    scaledKpis.variance.unit
                  }
                  status={
                    scaledKpis.variance.status
                  }
                  trend={
                    scaledKpis.variance.trend
                  }
                  trendLabel={
                    scaledKpis.variance.trendLabel
                  }
                  accent="orange"
                /></BorderGlow>
 <BorderGlow
  glowColor="#ffffff"
  glowRadius={80}
  glowIntensity={1.2}
  borderRadius={24}
>
                <ProductionKpiCard
                  label={
                    scaledKpis.confidence.label
                  }
                  value={
                    scaledKpis.confidence.value
                  }
                  unit={
                    scaledKpis.confidence.unit
                  }
                  trend={
                    scaledKpis.confidence.trend
                  }
                  trendLabel={
                    scaledKpis.confidence.trendLabel
                  }
                  accent="green"
                /></BorderGlow>

              </div>

            </section>

            {/* MAIN CHART */}

            <section
              className="animate-slide-up"
              style={{
                animationDelay: "200ms",
              }}
            >
              <BorderGlow
                               glowColor="#ffffff"
                               glowRadius={80}
                               glowIntensity={1.2}
                               borderRadius={24}
                             >   
              <ProductionForecastMainChart
                data={scaledSeries}
              />
              </BorderGlow>

            </section>

            {/* STATE PRODUCTION RANKING */}

            <section
              className="animate-slide-up"
              style={{
                animationDelay: "250ms",
              }}
            >
                 <BorderGlow
                                  glowColor="#ffffff"
                                  glowRadius={80}
                                  glowIntensity={1.2}
                                  borderRadius={24}
                                >   
              <StateProductionRanking
                data={scaledStateProduction}
              /></BorderGlow>

            </section>

            {/* DATA ORIGIN */}

            <section
              className="animate-slide-up"
              style={{
                animationDelay: "300ms",
              }}
            >
                 <BorderGlow
                                  glowColor="#ffffff"
                                  glowRadius={80}
                                  glowIntensity={1.2}
                                  borderRadius={24}
                                >   
              <DataOriginSection />
              </BorderGlow>

            </section>

          </div>

        </main>

        <Footer />

      </div>

    </div>
  );
}