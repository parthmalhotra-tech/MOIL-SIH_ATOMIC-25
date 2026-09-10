import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

export default function ProductionForecastChart({
  historical = [],
  forecast = [],
  target,
  unit = "Mt",
  loading = false,
  error = "",
}) {
  const chartData = [
    ...historical.map((item) => ({
      year: item.year,
      historicalProduction: item.production,
      forecastProduction: null,
      type: "historical",
    })),

    ...forecast.map((item) => ({
      year: item.year,
      historicalProduction: null,
      forecastProduction: item.production,
      shortfallProbability: item.shortfallProbability,
      type: "forecast",
    })),
  ];

  const latestHistorical =
    historical[historical.length - 1]?.production;

  const shortfallProbability =
    forecast[0]?.shortfallProbability;

  return (
    <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl p-6 border border-zenith-border h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-white text-lg mb-1">
            Production Forecast
          </h3>

          <p className="text-xs text-text-muted">
            Historical production vs current AI forecast
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-zenith-accent/10 border border-zenith-accent/20 text-xs font-medium text-zenith-accent uppercase tracking-wider flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-zenith-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zenith-accent" />
          </span>
          Live Model
        </span>
      </div>

      <div className="h-[360px] relative">
        {loading ? (
          <div className="h-full flex items-center justify-center text-text-muted text-sm">
            Loading production forecast...
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-red-400 text-sm text-center px-6">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-text-muted text-sm">
            No production data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(255, 255, 255, 0.03)"
                vertical={false}
              />

              {target !== null &&
                target !== undefined && (
                  <>
                    <ReferenceArea
                      y1={target - 0.01}
                      y2={target + 0.01}
                      fill="rgba(229, 57, 53, 0.08)"
                      fillOpacity={1}
                    />

                    <ReferenceLine
                      y={target}
                      stroke="rgba(229, 57, 53, 0.5)"
                      strokeDasharray="6 6"
                      strokeWidth={1.5}
                      label={{
                        value: `Expected: ${target} ${unit}`,
                        position: "right",
                        fill: "#e53935",
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily:
                          "Inter, system-ui, sans-serif",
                      }}
                    />
                  </>
                )}

              <XAxis
                dataKey="year"
                tick={{
                  fill: "#737373",
                  fontSize: 11,
                  fontFamily:
                    "JetBrains Mono, monospace",
                  fontWeight: 500,
                }}
                axisLine={{
                  stroke: "rgba(255, 255, 255, 0.05)",
                }}
                tickLine={false}
                interval={0}
                tickMargin={8}
              />

              <YAxis
                tick={{
                  fill: "#737373",
                  fontSize: 11,
                  fontFamily:
                    "JetBrains Mono, monospace",
                  fontWeight: 500,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value} ${unit}`}
                domain={["auto", "dataMax + 0.1"]}
                tickMargin={16}
                width={55}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor:
                    "rgba(10, 10, 10, 0.95)",
                  backdropFilter: "blur(20px)",
                  border:
                    "1px solid rgba(229, 57, 53, 0.3)",
                  borderRadius: "12px",
                  boxShadow:
                    "0 20px 50px rgba(0, 0, 0, 0.5)",
                  padding: "12px 16px",
                }}
                labelStyle={{
                  color: "#fff",
                  fontWeight: 600,
                  fontFamily:
                    "Playfair Display, serif",
                  fontSize: "13px",
                }}
                itemStyle={{
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value, name, item) => {
                  if (
                    name === "Historical Production"
                  ) {
                    return [
                      `${value} ${unit}`,
                      "Historical Production",
                    ];
                  }

                  if (name === "AI Forecast") {
                    const probability =
                      item?.payload
                        ?.shortfallProbability;

                    return [
                      `${value} ${unit}`,
                      probability !== undefined
                        ? `AI Forecast (${Math.round(
                            probability * 100
                          )}% shortfall probability)`
                        : "AI Forecast",
                    ];
                  }

                  return [`${value} ${unit}`, name];
                }}
                labelFormatter={(label) => label}
                separator=" : "
              />

              <Legend
                wrapperStyle={{
                  paddingTop: "12px",
                  paddingLeft: "8px",
                }}
                iconType="circle"
                iconSize={8}
                formatter={(value) => value}
              />

              {/* Historical */}
              <Line
                type="monotone"
                dataKey="historicalProduction"
                name="Historical Production"
                stroke="#ffffff"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  stroke: "#050505",
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 3,
                  fill: "#ffffff",
                  stroke: "#050505",
                }}
                connectNulls={false}
                isAnimationActive={false}
              />

              {/* Forecast */}
              <Line
                type="monotone"
                dataKey="forecastProduction"
                name="AI Forecast"
                stroke="#e53935"
                strokeWidth={2.5}
                strokeDasharray="8 6"
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "#e53935",
                  stroke: "#050505",
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 3,
                  fill: "#e53935",
                  stroke: "#050505",
                }}
                connectNulls={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer metrics */}
      <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-6 pt-6 border-t border-zenith-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white" />
          <span className="text-text-secondary text-sm font-medium">
            Historical
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-1.5 bg-gradient-to-r from-zenith-accent to-zenith-accent/50 rounded" />
          <span className="text-text-secondary text-sm font-medium">
            AI Forecast
          </span>
        </div>

        {target !== null &&
          target !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 border-t-2 border-dashed border-zenith-accent/50" />
              <span className="text-text-secondary text-sm font-medium">
                Expected
              </span>
            </div>
          )}

        {latestHistorical !== undefined && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-text-muted">
              Latest:{" "}
              <span className="font-mono font-semibold text-white">
                {latestHistorical} {unit}
              </span>
            </span>
          </div>
        )}

        {shortfallProbability !== undefined && (
          <div className="flex items-center gap-2 ml-4 md:ml-auto">
            <span className="px-3 py-1 rounded-full bg-zenith-accent/10 border border-zenith-accent/20 text-xs font-medium text-zenith-accent">
              Shortfall Probability:{" "}
              {Math.round(shortfallProbability * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}