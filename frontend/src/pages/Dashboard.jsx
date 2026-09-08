import { useEffect, useMemo, useState } from "react";
import { Bot, Send, Sparkles, Trash2, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import KpiCard from "../components/KpiCard";
import ProspectivityMap from "../components/ProspectivityMap";
import ProductionForecastChart from "../components/ProductionForecastChart";
import Footer from "../components/Footer";
import BorderGlow from "../components/borderglow";
import CursorGrid from "../components/CursorGrid";

import { prospectivityMockData } from "../data/prospectivitydata";
import { getProductionForecast } from "../services/productionService";

const API_BASE_URL = "http://127.0.0.1:8000";
const LAKH_TONNES_TO_MT = 0.1;

function toMt(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Number((number * LAKH_TONNES_TO_MT).toFixed(3))
    : 0;
}

function formatPercent(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${(number * 100).toFixed(1)}%` : "—";
}

/* ------------------------------------------------ */
/* GEMINI CHAT ASSISTANT */
/* ------------------------------------------------ */

function GeminiChatbot({ production, prospectivityStats }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hello. I’m your AI Assistant. Ask me about the current prospectivity results, production forecast, shortfall, or model outputs.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const context = useMemo(
    () => ({
      prospectivity: {
        total_predictions: prospectivityStats.total,
        high_and_very_high_zones: prospectivityStats.highAndVeryHigh,
        very_high_zones: prospectivityStats.veryHigh,
        high_zones: prospectivityStats.high,
        moderate_zones: prospectivityStats.moderate,
        low_zones: prospectivityStats.low,
      },
      production: production
        ? {
            prediction_date: production.prediction_date,
            forecast_production_lakh_tonnes:
              production.forecast_production_lakh_tonnes,
            expected_production_lakh_tonnes:
              production.expected_production_lakh_tonnes,
            predicted_shortfall_pct: production.predicted_shortfall_pct,
            shortfall_probability: production.shortfall_probability,
            classification: production.classification,
          }
        : null,
    }),
    [production, prospectivityStats],
  );

  const suggestedQuestions = [
    "Explain the current production forecast.",
    "Why is the shortfall probability high or low?",
    "How many high prospectivity zones are there?",
  ];

  const sendMessage = async (messageOverride) => {
    const message = (messageOverride ?? input).trim();

    if (!message || sending) return;

    setError("");
    setInput("");
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        text: message,
      },
    ]);
    setSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`service returned ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data?.response ?? data?.message ?? data?.text ?? data?.answer;

      if (!reply) {
        throw new Error("No response was returned.");
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: String(reply),
        },
      ]);
    } catch (requestError) {
      console.error(" chat request failed:", requestError);
      setError(
        "Unable to reach ai assistant right now. Check the AI backend connection.",
      );
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text: "Chat cleared. Ask me about the current prospectivity, production forecast, or shortfall results.",
      },
    ]);
    setError("");
  };

  return (
    <section id="gemini-assistant" className="animate-slide-up">
      <BorderGlow
        glowColor="#ffffff"
        glowRadius={120}
        glowIntensity={1.15}
        borderRadius={24}
      >
        <div className="bg-zenith-elevated/80 backdrop-blur-xl rounded-2xl border border-zenith-border overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zenith-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-zenith-accent/10 border border-zenith-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-zenith-accent" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl font-semibold text-white">
                    AI Assistant
                  </h2>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zenith-accent/10 border border-zenith-accent/20 text-[10px] font-semibold uppercase tracking-wider text-zenith-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-zenith-accent animate-pulse" />
                    AI
                  </span>
                </div>

                <p className="text-xs text-text-muted mt-1">
                  Ask questions about the latest model results and operational
                  indicators.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zenith-surface border border-zenith-border text-xs text-text-secondary hover:text-white hover:border-zenith-accent/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear chat
            </button>
          </div>

          {/* Conversation */}
          <div className="max-h-[430px] min-h-[300px] overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-zenith-accent/10 border border-zenith-accent/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-zenith-accent" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                      isUser
                        ? "bg-white text-zenith-bg border-white"
                        : "bg-zenith-surface/80 text-white border-zenith-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    </p>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-zenith-border flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-text-secondary" />
                    </div>
                  )}
                </div>
              );
            })}

            {sending && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-zenith-accent/10 border border-zenith-accent/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-zenith-accent" />
                </div>

                <div className="bg-zenith-surface/80 border border-zenith-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                      style={{ animationDelay: "120ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                      style={{ animationDelay: "240ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={sending}
                  onClick={() => sendMessage(question)}
                  className="px-3 py-2 rounded-full bg-zenith-surface/80 border border-zenith-border text-xs text-text-secondary hover:text-white hover:border-zenith-accent/40 transition-colors disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="p-4 sm:p-5 border-t border-zenith-border"
          >
            <div className="flex items-end gap-3 rounded-xl bg-zenith-surface/80 border border-zenith-border p-2 focus-within:border-zenith-accent/50 transition-colors">
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask AI Assistant about the current results..."
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white placeholder:text-text-muted outline-none min-h-[40px] max-h-32"
                aria-label="Message "
                disabled={sending}
              />

              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="w-10 h-10 rounded-lg bg-white text-zenith-bg flex items-center justify-center shrink-0 hover:bg-text-secondary transition disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {sending ? (
                  <Sparkles className="w-4 h-4 animate-pulse" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-text-muted mt-2 px-1">
              Responses are generated from the current application context
              supplied to the AI service.
            </p>
          </form>
        </div>
      </BorderGlow>
    </section>
  );
}

/* ------------------------------------------------ */
/* DASHBOARD */
/* ------------------------------------------------ */

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
            error?.message || "Unable to load production data.",
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

  const prospectivityStats = useMemo(() => {
    const records = prospectivityMockData
      .map((record) => {
        const probability = Number(
          record.probability ??
            record.prospectivity_score ??
            record.manganese_probability,
        );

        return Number.isFinite(probability) ? probability : null;
      })
      .filter((value) => value !== null);

    const veryHigh = records.filter((value) => value >= 0.8).length;
    const high = records.filter((value) => value >= 0.7 && value < 0.8).length;
    const moderate = records.filter(
      (value) => value >= 0.6 && value < 0.7,
    ).length;
    const low = records.filter((value) => value >= 0.5 && value < 0.6).length;

    return {
      total: prospectivityMockData.length,
      predictedPositive: records.filter((value) => value >= 0.5).length,
      veryHigh,
      high,
      moderate,
      low,
      highAndVeryHigh: veryHigh + high,
    };
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
        production: toMt(production.forecast_production_lakh_tonnes),
        shortfallProbability: Number(production.shortfall_probability) || 0,
      },
    ];

    return {
      historical,
      forecast,
      target: toMt(production.expected_production_lakh_tonnes),
    };
  }, [production]);

  const productionValue = production
    ? toMt(production.forecast_production_lakh_tonnes)
    : 0;

  const shortfallValue = production
    ? Number(production.predicted_shortfall_pct) || 0
    : 0;

  const productionPeriod = production?.prediction_date
    ? new Date(production.prediction_date).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Loading...";

  return (
    <div className="relative isolate min-h-screen bg-zenith-bg flex flex-col overflow-hidden">
      {/* Background Image */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-[center_top] bg-no-repeat opacity-85"
        style={{ backgroundImage: "url('/backgorund_pic.png')" }}
        aria-hidden="true"
      />

      {/* Dark Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,5,5,0.94)_0%,rgba(5,5,5,0.75)_38%,rgba(5,5,5,0.28)_100%),linear-gradient(180deg,rgba(5,5,5,0.12)_0%,rgba(5,5,5,0.72)_68%,rgba(5,5,5,0.96)_100%)]"
        aria-hidden="true"
      />

      {/* Cursor Grid */}
      <div className="fixed inset-0 z-[2] pointer-events-none">
        <CursorGrid color="#ffffff" opacity={0.08} />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 w-full pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Hero */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Prospectivity */}
              <BorderGlow
                glowColor="#ffffff"
                glowRadius={80}
                glowIntensity={1.2}
                borderRadius={24}
              >
                <KpiCard
                  title="High & Very High Zones"
                  value={prospectivityStats.highAndVeryHigh}
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
                  value={productionLoading ? "—" : productionValue}
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
                    productionLoading ? "—" : Number(shortfallValue.toFixed(1))
                  }
                  unit="%"
                  trend={
                    productionLoading
                      ? ""
                      : production
                        ? formatPercent(production.shortfall_probability)
                        : "Unavailable"
                  }
                  trendLabel="shortfall probability"
                  color="orange"
                />
              </BorderGlow>
            </div>
          </section>

          {/* Prospectivity */}
          <section id="prospectivity" aria-labelledby="prospectivity-heading">
            <h2 id="prospectivity-heading" className="sr-only">
              India Predicted Prospectivity
            </h2>

            <div className="mb-4">
              <h2 className="font-display font-semibold text-white text-xl">
                India Predicted Prospectivity
              </h2>

              <p className="text-sm text-text-muted mt-1">
                AI-predicted manganese-associated prospectivity across sampled
                locations
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

          {/* Production Analytics */}
          <section id="analytics" className="animate-slide-up">
            <ProductionForecastChart
              historical={productionChartData.historical}
              forecast={productionChartData.forecast}
              target={productionChartData.target}
              unit="Mt"
              loading={productionLoading}
              error={productionError}
            />
          </section>

          {/* Gemini AI Assistant */}
          <GeminiChatbot
            production={production}
            prospectivityStats={prospectivityStats}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
