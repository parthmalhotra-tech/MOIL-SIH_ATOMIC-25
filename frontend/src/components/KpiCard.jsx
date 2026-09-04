import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * KpiCard - Reusable KPI metric card component (Zenith style: minimal, no colorful gradients)
 */
export default function KpiCard({ title, value, unit, trend, trendLabel, icon: Icon, highlight = false }) {
  const isPositive = trend?.startsWith("+");
  const isNegative = trend?.startsWith("-");
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const trendColor = isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-text-muted";

  return (
    <article
      className={`relative bg-zenith-elevated/80 backdrop-blur-xl rounded-xl p-6 border border-zenith-border transition-all duration-300 hover:border-zenith-border/50 ${highlight ? 'border-zenith-accent/30' : ''}`}
    >
      <div className="mb-4">
        <p className="text-xs uppercase tracking-widest text-text-muted font-medium">{title}</p>
      </div>

      <div className="flex items-baseline gap-1.5 mb-4">
        <span className="font-display font-bold text-white text-3xl sm:text-4xl tabular-nums leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-text-muted self-end mb-1 font-medium">{unit}</span>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-2 text-sm font-medium">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} aria-hidden="true" />
          <span className={trendColor}>{trend}</span>
          <span className="text-text-muted">{trendLabel}</span>
        </div>
      )}
    </article>
  );
}