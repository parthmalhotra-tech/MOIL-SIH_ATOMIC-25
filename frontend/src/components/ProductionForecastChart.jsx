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

/**
 * ProductionForecastChart - Line chart (Zenith style: minimal, clean)
 */
export default function ProductionForecastChart({ historical, forecast, target, unit = "Mt" }) {
  const chartData = [
    ...historical.map(d => ({ ...d, type: 'historical', production: d.production })),
    ...forecast.map(d => ({ ...d, type: 'forecast', production: d.production, confidence: d.confidence })),
  ];

  return (
    <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl p-6 border border-zenith-border h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-white text-lg mb-1">Production Forecast</h3>
          <p className="text-xs text-text-muted">Historical vs AI Forecast — FY 2018-2029</p>
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255, 255, 255, 0.03)"
              vertical={false}
            />
            
            {target && (
              <ReferenceArea
                y1={target - 0.1}
                y2={target + 0.1}
                fill="rgba(229, 57, 53, 0.08)"
                fillOpacity={1}
              />
            )}
            
            <ReferenceLine
              y={target}
              stroke="rgba(229, 57, 53, 0.5)"
              strokeDasharray="6 6"
              strokeWidth={1.5}
              label={{
                value: `Target: ${target} ${unit}`,
                position: 'right',
                fill: '#e53935',
                fontSize: 11,
                fontWeight: 600,
                fontFamily: 'Inter, system-ui, sans-serif',
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(229, 57, 53, 0.3)',
              }}
            />

            <XAxis
              dataKey="year"
              tick={{ 
                fill: '#737373', 
                fontSize: 11, 
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 500
              }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
              tickLine={false}
              interval={0}
              tickMargin={8}
            />
            <YAxis
              tick={{ 
                fill: '#737373', 
                fontSize: 11, 
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 500
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value} ${unit}`}
              domain={['auto', 'dataMax + 0.6']}
              tickMargin={16}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(229, 57, 53, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                padding: '12px 16px',
              }}
              labelStyle={{ 
                color: '#fff', 
                fontWeight: 600, 
                fontFamily: 'Playfair Display, serif',
                fontSize: '13px'
              }}
              itemStyle={{ color: '#fff', fontSize: '12px' }}
              formatter={(value, name) => [
                `${value} ${unit}`,
                name === 'historical' ? 'Historical Production' : name === 'forecast' ? 'Forecast Production' : 'Target',
              ]}
              labelFormatter={(label) => `FY ${label}`}
              separator=" : "
            />
            <Legend
              wrapperStyle={{ paddingTop: '12px', paddingLeft: '8px' }}
              iconType="circle"
              iconSize={8}
              formatter={(value) => value === 'historical' ? 'Historical Production' : value === 'forecast' ? 'AI Forecast' : 'Target'}
            />
            
            {/* Historical line - white */}
            <Line
              type="monotone"
              dataKey="production"
              name="historical"
              stroke="#ffffff"
              strokeWidth={2.5}
              dot={{ 
                r: 4, 
                strokeWidth: 2, 
                fill: '#ffffff',
                stroke: '#050505',
              }}
              activeDot={{ r: 7, strokeWidth: 3, fill: '#ffffff', stroke: '#050505' }}
              isAnimationActive={false}
            />

            {/* Forecast line - red accent */}
            <Line
              type="monotone"
              dataKey="production"
              name="forecast"
              stroke="#e53935"
              strokeWidth={2.5}
              strokeDasharray="8 6"
              dot={{ 
                r: 4, 
                strokeWidth: 2, 
                fill: '#e53935',
                stroke: '#050505',
              }}
              activeDot={{ r: 7, strokeWidth: 3, fill: '#e53935', stroke: '#050505' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Key metrics */}
      <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-6 pt-6 border-t border-zenith-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white" />
          <span className="text-text-secondary text-sm font-medium">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-1.5 bg-gradient-to-r from-zenith-accent to-zenith-accent/50 rounded" style={{ maskImage: 'repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 8px)' }} />
          <span className="text-text-secondary text-sm font-medium">AI Forecast</span>
        </div>
        {target && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-1.5 border-t-2 border-dashed border-zenith-accent/50" />
            <span className="text-text-secondary text-sm font-medium">Target</span>
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-text-muted">
            Latest: <span className="font-mono font-semibold text-white">{historical[historical.length - 1]?.production} {unit}</span>
          </span>
        </div>
        
        {/* Confidence indicator */}
        <div className="flex items-center gap-2 ml-4 md:ml-auto">
          <span className="px-3 py-1 rounded-full bg-zenith-accent/10 border border-zenith-accent/20 text-xs font-medium text-zenith-accent">
            Model Confidence: {Math.round((forecast[0]?.confidence || 0) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}