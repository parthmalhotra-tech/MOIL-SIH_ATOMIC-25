import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  ChevronDown,
  CircleAlert,
  Factory,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  X,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BorderGlow from "../components/borderglow";
import CursorGrid from "../components/CursorGrid";

import { prospectivityMockData } from "../data/prospectivitydata";
import { getProductionForecast } from "../services/productionService";
import { getAIRecommendations } from "../services/aiService";
const LAKH_TONNES_TO_MT = 0.1;
const FILTERS = ["All", "Critical", "High", "Medium"];

// UI-only placeholders. Keep this shape when replacing the source with Gemini.
const initialRecommendations = [
  {
    id: 1,
    priority: "High",
    category: "Prospectivity",
    title: "Prioritize high-prospectivity zones for validation",
    summary:
      "Focus near-term geological validation on locations with elevated manganese-associated prospectivity.",
    location: "High-prospectivity locations",
    action:
      "Prioritize field validation, geological review, and detailed exploration planning for the highest-scoring zones.",
    status: "Ready for review",
    evidence: [
      ["Signal", "High / Very High prospectivity"],
      ["Source", "Prospectivity model"],
      ["Decision", "Exploration priority"],
    ],
  },
  {
    id: 2,
    priority: "High",
    category: "Production",
    title: "Review the current production forecast",
    summary:
      "Use the latest production forecast alongside operational plans before finalizing the next assessment.",
    location: "MOIL-wide",
    action:
      "Compare the forecast with operational plans and investigate the principal drivers behind the predicted variance.",
    status: "Requires review",
    evidence: [
      ["Signal", "Live production forecast"],
      ["Source", "Production model"],
      ["Decision", "Operational review"],
    ],
  },
  {
    id: 3,
    priority: "Medium",
    category: "Shortfall",
    title: "Assess the predicted shortfall risk",
    summary:
      "The current shortfall prediction warrants review of the operational assumptions contributing to the model result.",
    location: "MOIL-wide",
    action:
      "Review production constraints and mitigation options before the next operational assessment.",
    status: "Monitor",
    evidence: [
      ["Signal", "Shortfall prediction"],
      ["Source", "Production model"],
      ["Decision", "Mitigation review"],
    ],
  },
  {
    id: 4,
    priority: "Medium",
    category: "Operations",
    title: "Combine model signals before prioritizing action",
    summary:
      "Use prospectivity and production indicators together rather than relying on a single signal for decisions.",
    location: "Cross-model",
    action:
      "Review locations and operational conditions where multiple signals indicate the greatest potential impact.",
    status: "Recommended",
    evidence: [
      ["Signal", "Multi-model"],
      ["Source", " outputs"],
      ["Decision", "Decision support"],
    ],
  },
];

function AnimatedNumber({ value, duration = 800 }) {
  const target = Number(value) || 0;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return current.toLocaleString("en-IN");
}

function priorityClasses(priority) {
  if (priority === "Critical") return "text-red-300 bg-red-500/10 border-red-500/25";
  if (priority === "High") return "text-orange-300 bg-orange-500/10 border-orange-500/25";
  return "text-yellow-300 bg-yellow-500/10 border-yellow-500/25";
}

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <BorderGlow glowColor="#ffffff" glowRadius={80} glowIntensity={1.05} borderRadius={22}>
      <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border p-5 h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted">{label}</p>
            <p className="font-display text-3xl font-semibold text-white mt-3">
              <AnimatedNumber value={value} />
            </p>
            <p className="text-xs text-text-muted mt-2">{detail}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/[0.035] border border-zenith-border flex items-center justify-center">
            <Icon className="w-5 h-5 text-zenith-accent" />
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}

function ContextMetric({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-xl border border-zenith-border bg-zenith-surface/60 p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/[0.035] border border-zenith-border flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-text-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-text-muted">{label}</p>
          <p className="font-mono text-lg text-white mt-1">{value}</p>
          <p className="text-[11px] text-text-muted mt-1">{detail}</p>
        </div>
      </div>
    </div>
  );
}
function mapAIRecommendations(data) {
  return (data.recommendations || []).map((item, index) => {
    const priority =
      item.priority === "HIGH"
        ? "High"
        : item.priority === "MEDIUM"
        ? "Medium"
        : "Low";

    return {
      id: index + 1,
      priority,
      category: item.category,

      // Use category as the card title
      title: item.category,

      // Gemini's reason becomes the explanatory summary
      summary: item.reason,

      location: "MOIL-wide",

      action: item.action,

      status:
        item.priority === "HIGH"
          ? "Requires review"
          : item.priority === "MEDIUM"
          ? "Monitor"
          : "Recommended",

      evidence: [
        ["Risk", data.overall_risk || "N/A"],
        ["Source", data.source === "gemini" ? "Gemini + Production Model" : "Fallback Rules"],
        ["Scope", "MOIL-wide"],
      ],
    };
  });
}






export default function AIRecommendations() {
  const [production, setProduction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [overallRisk, setOverallRisk] = useState(null);
  const [aiSource, setAiSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getProductionForecast();
        if (!cancelled) setProduction(data);
      } catch (error) {
        console.error("AI Recommendations production context failed:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const highVeryHighZones = useMemo(
    () =>
      prospectivityMockData.filter((record) => {
        const probability = Number(
          record.probability ?? record.prospectivity_score ?? record.manganese_probability
        );
        return Number.isFinite(probability) && probability >= 0.7;
      }).length,
    []
  );

  const forecastMt = production
    ? Number(
        (Number(production.forecast_production_lakh_tonnes) * LAKH_TONNES_TO_MT).toFixed(3)
      )
    : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recommendations.filter((item) => {
      const priorityMatch = filter === "All" || item.priority === filter;
      const searchMatch =
        !q ||
        [item.title, item.summary, item.category, item.location, item.action]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return priorityMatch && searchMatch;
    });
  }, [recommendations, filter, search]);

  const generateRecommendations = async () => {
  if (generating) return;

  setGenerating(true);
  setStatus("Analyzing data...");

  try {
    const data = await getAIRecommendations();

    const mappedRecommendations = mapAIRecommendations(data);

    setRecommendations(mappedRecommendations);
    setAiSummary(data.summary || "");
    setOverallRisk(data.overall_risk || null);
    setAiSource(data.source || null);

    if (mappedRecommendations.length > 0) {
      setExpanded(mappedRecommendations[0].id);
    }

    setStatus(
      data.source === "gemini"
        ? "Generated by Gemini"
        : "Generated using fallback rules"
    );
  } catch (error) {
    console.error("Gemini recommendation generation failed:", error);
    setStatus("Unable to generate recommendations");
  } finally {
    setGenerating(false);
  }
};

  return (
    <div className="relative isolate min-h-screen bg-zenith-bg text-white flex flex-col overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-[center_top] bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('/backgorund_pic.png')" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.80)_42%,rgba(5,5,5,0.34)_100%),linear-gradient(180deg,rgba(5,5,5,0.14)_0%,rgba(5,5,5,0.78)_70%,rgba(5,5,5,0.98)_100%)]"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[2] pointer-events-none">
        <CursorGrid color="#ffffff" opacity={0.08} />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 w-full pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-zenith-accent mb-3">
                AI Decision Support
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
                AI Recommendations
              </h1>
              <p className="mt-4 max-w-3xl text-base sm:text-lg text-text-secondary leading-relaxed">
                Convert model outputs into prioritized, explainable actions for exploration and operational planning.
              </p>
            </div>

            <button
              type="button"
              onClick={generateRecommendations}
              disabled={generating}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-zenith-bg font-semibold transition-all hover:bg-text-secondary disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? "Analyzing  Data..." : "Generate AI Recommendations"}
            </button>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
           <MetricCard
              icon={Sparkles}
              label="Active Recommendations"
              value={recommendations.length}
              detail="Current recommendation queue"
            />
            <MetricCard
              icon={ShieldAlert}
              label="High Priority"
              value={
                recommendations.filter(
                  (x) => x.priority === "High" || x.priority === "Critical"
                ).length
              }
              detail="Requires focused review"
            />
            <MetricCard icon={Target} label="High & Very High Zones" value={highVeryHighZones} detail={`${prospectivityMockData.length.toLocaleString("en-IN")} total predictions`} />
            <BorderGlow glowColor="#ffffff" glowRadius={80} glowIntensity={1.05} borderRadius={22}>
              <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border p-5 h-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted">Analysis Status</p>
                    <p className="font-display text-3xl font-semibold mt-3">{status === "Analysis complete" ? "Updated" : "Ready"}</p>
                    <p className="text-xs text-text-muted mt-2">Gemini integration slot</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-zenith-accent/10 border border-zenith-accent/20 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-zenith-accent" />
                  </div>
                </div>
              </div>
            </BorderGlow>
          </section>

          <section className="grid xl:grid-cols-[minmax(0,1fr)_350px] gap-6 items-start">
            <div className="bg-zenith-elevated/75 backdrop-blur-xl rounded-2xl border border-zenith-border overflow-hidden">
              <div className="px-6 py-6 border-b border-zenith-border">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                  <div>
                    <h2 className="font-display text-2xl font-semibold">Recommendation Queue</h2>
                    <p className="mt-1 text-sm text-text-muted">Prioritized actions from model signals.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search recommendations"
                        aria-label="Search recommendations"
                        className="w-full sm:w-56 bg-zenith-surface border border-zenith-border rounded-lg pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-text-muted outline-none focus:border-zenith-accent/50"
                      />
                      {search && (
                        <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex gap-1.5 bg-zenith-surface border border-zenith-border rounded-lg p-1 overflow-x-auto">
                      {FILTERS.map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setFilter(item)}
                          aria-pressed={filter === item}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${
                            filter === item ? "bg-white text-zenith-bg" : "text-text-secondary hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-zenith-border">
                {filtered.map((item) => {
                  const isOpen = expanded === item.id;
                  return (
                    <article key={item.id} className="px-6 py-6 hover:bg-white/[0.015] transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider ${priorityClasses(item.priority)}`}>
                              {item.priority}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-white/[0.035] border border-zenith-border text-[11px] text-text-muted uppercase tracking-wider">
                              {item.category}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                              <MapPin className="w-3.5 h-3.5" />
                              {item.location}
                            </span>
                          </div>

                          <h3 className="font-display text-xl font-semibold leading-snug">{item.title}</h3>
                          <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-3xl">{item.summary}</p>

                          <div className="mt-5 rounded-xl bg-zenith-surface/70 border border-zenith-border p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                                <Zap className="w-4 h-4 text-red-400" />
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-wider text-text-muted">Recommended action</p>
                                <p className="mt-1.5 text-sm text-white leading-relaxed">{item.action}</p>
                              </div>
                            </div>
                          </div>

                          {isOpen && (
                            <div className="mt-4 pt-4 border-t border-zenith-border">
                              <div className="flex items-center gap-2 mb-3">
                                <CircleAlert className="w-4 h-4 text-zenith-accent" />
                                <p className="text-xs uppercase tracking-wider text-text-muted">Why this recommendation?</p>
                              </div>
                              <div className="grid sm:grid-cols-3 gap-3">
                                {item.evidence.map(([label, value]) => (
                                  <div key={label} className="rounded-lg border border-zenith-border bg-black/20 p-3">
                                    <p className="text-[11px] uppercase tracking-wider text-text-muted">{label}</p>
                                    <p className="mt-1.5 text-sm font-medium text-white">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 lg:min-w-[145px]">
                          <span className="text-xs text-text-muted">{item.status}</span>
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : item.id)}
                            aria-expanded={isOpen}
                            className="inline-flex items-center gap-2 text-xs font-medium text-white hover:text-zenith-accent transition"
                          >
                            {isOpen ? "Hide evidence" : "View evidence"}
                            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {!filtered.length && (
                  <div className="px-6 py-16 text-center">
                    <Search className="mx-auto w-8 h-8 text-text-muted mb-3" />
                    <p className="text-white font-medium">No recommendations found</p>
                    <p className="text-sm text-text-muted mt-1">Adjust the filter or search query.</p>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-6 xl:sticky xl:top-24">
              <BorderGlow glowColor="#ffffff" glowRadius={100} glowIntensity={1} borderRadius={20}>
                <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-xl border border-zenith-border p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-zenith-accent/10 border border-zenith-accent/20 flex items-center justify-center">
                      <BrainCircuit className="w-5 h-5 text-zenith-accent" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-lg">Decision Context</h2>
                      <p className="text-xs text-text-muted">Current outputs</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <ContextMetric icon={Target} label="High & Very High Zones" value={highVeryHighZones.toLocaleString("en-IN")} detail={`${prospectivityMockData.length.toLocaleString("en-IN")} total predictions`} />
                    <ContextMetric
                      icon={Factory}
                      label="Forecast Production"
                      value={loading ? "—" : forecastMt !== null ? `${forecastMt} Mt` : "Unavailable"}
                      detail={production?.prediction_date ? new Date(production.prediction_date).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Production model"}
                    />
                    <ContextMetric
                      icon={TrendingDown}
                      label="Expected Shortfall"
                      value={loading ? "—" : production ? `${Number(production.predicted_shortfall_pct).toFixed(1)}%` : "Unavailable"}
                      detail={production ? `${Math.round(Number(production.shortfall_probability) * 100)}% probability` : "Production model"}
                    />
                  </div>

                  <div className="mt-5 pt-5 border-t border-zenith-border">
                    <p className="text-[11px] uppercase tracking-wider text-text-muted">Data sources</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Prospectivity Model", "Production Model", "Operational Signals"].map((source) => (
                        <span key={source} className="px-2.5 py-1.5 rounded-full bg-white/[0.035] border border-zenith-border text-[11px] text-text-secondary">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </BorderGlow>

              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
