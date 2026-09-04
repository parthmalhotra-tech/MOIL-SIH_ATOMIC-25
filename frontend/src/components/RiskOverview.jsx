/**
 * RiskOverview - Compact risk distribution visualization (Zenith style)
 */
export default function RiskOverview({ distribution, totalLocations, variant = "bars" }) {
  const riskOrder = ["Low", "Medium", "High", "Very High"];
  const sortedDistribution = [...distribution].sort((a, b) => 
    riskOrder.indexOf(a.level) - riskOrder.indexOf(b.level)
  );

  // Zenith color palette for risk levels - using red accent family
  const zenithColors = {
    "Low": "#22c55e",
    "Medium": "#eab308", 
    "High": "#f97316",
    "Very High": "#e53935",
  };

  if (variant === "donut") {
    return <DonutChart distribution={sortedDistribution} totalLocations={totalLocations} colors={zenithColors} />;
  }

  return <BarsChart distribution={sortedDistribution} totalLocations={totalLocations} colors={zenithColors} />;
}

/**
 * Horizontal bars variant - minimal
 */
function BarsChart({ distribution, totalLocations, colors }) {
  return (
    <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl p-6 border border-zenith-border h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-white text-lg mb-1">Production Risk Overview</h3>
          <p className="text-xs text-text-muted">Risk distribution across mining locations</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-zenith-accent/10 border border-zenith-accent/20 text-xs font-mono font-medium text-zenith-accent">
          {totalLocations} Sites
        </span>
      </div>

      <div className="space-y-4">
        {distribution.map((item, index) => {
          const color = colors[item.level] || item.color;
          return (
            <div key={item.level} className="group relative" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-sm font-medium text-white capitalize">{item.level} Risk</span>
                </div>
                <span className="text-sm font-mono tabular-nums text-text-secondary">
                  {item.count} <span className="text-text-muted">({item.percentage}%)</span>
                </span>
              </div>
              <div className="h-2 bg-zenith-border rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) relative"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${color}80`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Summary row */}
        <div className="pt-4 border-t border-zenith-border flex flex-wrap gap-2 md:gap-4">
          {distribution.map((item) => {
            const color = colors[item.level] || item.color;
            return (
              <div key={item.level} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zenith-surface/50 border border-zenith-border/50 transition-all hover:border-zenith-border">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-text-secondary text-sm font-medium capitalize">{item.level}</span>
                <span className="font-mono text-white text-sm">{item.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* High risk alert badge - minimal */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
        </span>
        {distribution.filter(d => d.level === 'High' || d.level === 'Very High').reduce((sum, d) => sum + d.count, 0)} High Risk Sites
      </div>
    </div>
  );
}

/**
 * Donut chart variant using SVG - minimal
 */
function DonutChart({ distribution, totalLocations, colors }) {
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = distribution.map((item) => {
    const percentage = item.percentage / 100;
    const offset = circumference - percentage * circumference - cumulative * circumference;
    cumulative += percentage;
    return { ...item, offset, percentage, color: colors[item.level] || item.color };
  });

  return (
    <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl p-6 border border-zenith-border h-full flex flex-col items-center justify-center relative">
      <div className="mb-6">
        <h3 className="font-display font-semibold text-white text-lg mb-1">Production Risk Overview</h3>
        <p className="text-xs text-text-muted">Risk distribution across mining locations</p>
      </div>
      
      <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />
          
          {segments.map((segment, index) => (
            <circle
              key={segment.level}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={segment.offset}
              strokeLinecap="round"
              className="transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
          
          {/* Center glow */}
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(229, 57, 53, 0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle
            cx="80"
            cy="80"
            r={radius - strokeWidth / 2}
            fill="url(#centerGlow)"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-display font-bold text-white font-mono">{totalLocations}</span>
          <span className="text-xs text-text-muted uppercase tracking-wider mt-1">Total Sites</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-2 md:gap-4 w-full">
        {distribution.map((item) => {
          const color = colors[item.level] || item.color;
          return (
            <div key={item.level} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zenith-surface/50 border border-zenith-border/50 transition-all hover:border-zenith-border">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-text-secondary text-sm font-medium capitalize">{item.level}</span>
              <span className="font-mono text-white text-sm">{item.percentage}%</span>
            </div>
          );
        })}
      </div>
      
      {/* High risk alert */}
      <div className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 w-fit">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
        </span>
        {distribution.filter(d => d.level === 'High' || d.level === 'Very High').reduce((sum, d) => sum + d.count, 0)} High Risk Sites
      </div>
    </div>
  );
}