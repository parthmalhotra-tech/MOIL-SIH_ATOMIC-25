import {
  AlertTriangle,
  TrendingDown,
  ShieldCheck,
  Clock,
  MapPin,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorGrid from "../components/CursorGrid";
import CountUp from "../components/CountUp";
import BorderGlow from "../components/borderglow";

/* =========================================================
   DATA
========================================================= */

const riskKpis = [
  {
    title: "High Risk Zones",
    value: 12,
    change: "+2",
    description: "vs previous assessment",
    icon: AlertTriangle,
  },
  {
    title: "Expected Shortfall",
    value: 3.8,
    suffix: " MT",
    change: "-12.5%",
    description: "vs previous forecast",
    icon: TrendingDown,
  },
  {
    title: "Mitigation Coverage",
    value: 78,
    suffix: "%",
    change: "+6.4%",
    description: "of identified risks",
    icon: ShieldCheck,
  },
  {
    title: "Critical Alerts",
    value: 4,
    change: "-2",
    description: "active alerts",
    icon: Clock,
  },
];

const riskData = [
  {
    region: "Odisha — Keonjhar",
    risk: "High",
    probability: "82%",
    shortfall: "0.92 MT",
    status: "Mitigation Active",
  },
  {
    region: "Jharkhand — Singhbhum",
    risk: "High",
    probability: "76%",
    shortfall: "0.71 MT",
    status: "Under Review",
  },
  {
    region: "Chhattisgarh — Korba",
    risk: "Medium",
    probability: "58%",
    shortfall: "0.54 MT",
    status: "Mitigation Active",
  },
  {
    region: "Karnataka — Bellary",
    risk: "Medium",
    probability: "47%",
    shortfall: "0.38 MT",
    status: "Monitoring",
  },
  {
    region: "Odisha — Sundargarh",
    risk: "Low",
    probability: "24%",
    shortfall: "0.18 MT",
    status: "Monitoring",
  },
];

const shortfallData = [
  {
    region: "Keonjhar",
    value: 0.92,
    percentage: 92,
  },
  {
    region: "Singhbhum",
    value: 0.71,
    percentage: 71,
  },
  {
    region: "Korba",
    value: 0.54,
    percentage: 54,
  },
  {
    region: "Bellary",
    value: 0.38,
    percentage: 38,
  },
  {
    region: "Sundargarh",
    value: 0.18,
    percentage: 18,
  },
];

/* =========================================================
   KPI CARD
========================================================= */

function RiskKpiCard({ item }) {
  const Icon = item.icon;

  const decimals =
    Number.isInteger(item.value) ? 0 : 1;

  return (
    <div className="bg-zenith-elevated/90 rounded-xl border border-zenith-border p-5 h-full">
      
      <div className="flex items-start justify-between">

        <div>

          <p className="text-text-secondary text-sm">
            {item.title}
          </p>

          {/* COUNT UP */}
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 tabular-nums">
            <CountUp
              start={0}
              end={item.value}
              duration={1.5}
              decimals={decimals}
            />
            {item.suffix && (
              <span className="ml-1">
                {item.suffix}
              </span>
            )}
          </h3>

          <div className="flex items-center gap-2 mt-2">

            <span className="text-zenith-accent text-sm font-medium">
              {item.change}
            </span>

            <span className="text-text-secondary text-xs">
              {item.description}
            </span>

          </div>

        </div>

        {/* ICON */}
        <div className="w-10 h-10 rounded-lg bg-zenith-accent/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-zenith-accent" />
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   RISK TABLE
========================================================= */

function RiskTable() {
  return (
    <div className="bg-zenith-elevated/90 rounded-xl border border-zenith-border overflow-hidden">

      <div className="p-5 sm:p-6 border-b border-zenith-border">

        <h2 className="text-white text-lg font-semibold">
          Regional Risk Assessment
        </h2>

        <p className="text-text-secondary text-sm mt-1">
          AI-generated risk levels and projected production impact.
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead>

            <tr className="border-b border-zenith-border">

              <th className="text-left px-5 py-4 text-xs font-medium text-text-secondary uppercase">
                Region
              </th>

              <th className="text-left px-5 py-4 text-xs font-medium text-text-secondary uppercase">
                Risk
              </th>

              <th className="text-left px-5 py-4 text-xs font-medium text-text-secondary uppercase">
                Probability
              </th>

              <th className="text-left px-5 py-4 text-xs font-medium text-text-secondary uppercase">
                Expected Shortfall
              </th>

              <th className="text-left px-5 py-4 text-xs font-medium text-text-secondary uppercase">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {riskData.map((item) => (

              <tr
                key={item.region}
                className="border-b border-zenith-border last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >

                <td className="px-5 py-4">

                  <div className="flex items-center gap-2">

                    <MapPin className="w-4 h-4 text-zenith-accent" />

                    <span className="text-white text-sm">
                      {item.region}
                    </span>

                  </div>

                </td>

                <td className="px-5 py-4">
                  <RiskBadge risk={item.risk} />
                </td>

                <td className="px-5 py-4 text-white text-sm">
                  {item.probability}
                </td>

                <td className="px-5 py-4 text-white text-sm">
                  {item.shortfall}
                </td>

                <td className="px-5 py-4">

                  <span className="text-text-secondary text-sm">
                    {item.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* =========================================================
   RISK BADGE
========================================================= */

function RiskBadge({ risk }) {

  const styles = {
    High:
      "bg-red-500/10 text-red-400 border-red-500/20",

    Medium:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    Low:
      "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium ${styles[risk]}`}
    >
      {risk}
    </span>
  );
}

/* =========================================================
   SHORTFALL PANEL
========================================================= */

function ShortfallPanel() {
  return (
    <div className="bg-zenith-elevated/90 rounded-xl border border-zenith-border p-5 sm:p-6">

      <div className="mb-6">

        <h2 className="text-white text-lg font-semibold">
          Expected Production Shortfall
        </h2>

        <p className="text-text-secondary text-sm mt-1">
          Projected shortfall by high-impact region.
        </p>

      </div>

      <div className="space-y-5">

        {shortfallData.map((item) => (

          <div key={item.region}>

            <div className="flex items-center justify-between mb-2">

              <span className="text-white text-sm">
                {item.region}
              </span>

              <span className="text-text-secondary text-sm">
                {item.value} MT
              </span>

            </div>

            <div className="h-2 bg-zenith-bg rounded-full overflow-hidden">

              <div
                className="h-full bg-zenith-accent rounded-full transition-all duration-700"
                style={{
                  width: `${item.percentage}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

/* =========================================================
   MITIGATION PANEL
========================================================= */

function MitigationPanel() {

  return (
    <div className="bg-zenith-elevated/90 rounded-xl border border-zenith-border p-5 sm:p-6">

      <div className="flex items-center gap-2 mb-6">

        <ShieldCheck className="w-5 h-5 text-zenith-accent" />

        <div>

          <h2 className="text-white text-lg font-semibold">
            Mitigation Status
          </h2>

          <p className="text-text-secondary text-sm">
            Current response to identified risks.
          </p>

        </div>

      </div>

      <div className="space-y-5">

        <MitigationRow
          label="Active Mitigation"
          value={78}
        />

        <MitigationRow
          label="Under Review"
          value={46}
        />

        <MitigationRow
          label="Monitoring"
          value={91}
        />

        <MitigationRow
          label="Unresolved"
          value={18}
        />

      </div>

    </div>
  );
}

/* =========================================================
   MITIGATION ROW
========================================================= */

function MitigationRow({ label, value }) {

  return (
    <div>

      <div className="flex justify-between mb-2">

        <span className="text-white text-sm">
          {label}
        </span>

        <span className="text-text-secondary text-sm">
          {value}%
        </span>

      </div>

      <div className="h-2 bg-zenith-bg rounded-full overflow-hidden">

        <div
          className="h-full bg-zenith-accent rounded-full"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function RiskandShortfall() {

  return (

    <div className="min-h-screen bg-zenith-bg text-white relative overflow-hidden">

      {/* =====================================================
          CURSOR GRID
      ===================================================== */}

      <div className="fixed inset-0 z-0 pointer-events-none">
        <CursorGrid
          color="#ffffff"
          opacity={0.08}
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10">

        <Navbar />

        <main className="pt-24 pb-16">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-8">

              <p className="text-zenith-accent text-sm font-medium mb-2">
                RISK INTELLIGENCE
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Risk & Shortfall
              </h1>

              <p className="text-text-secondary mt-2 max-w-2xl">
                Identify high-risk regions, estimate production
                shortfalls and monitor mitigation activity.
              </p>

            </div>

            {/* =================================================
                KPI SECTION
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              {riskKpis.map((item) => (
                 <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
                >
                <RiskKpiCard
                  key={item.title}
                  item={item}
                /></BorderGlow>

              ))}

            </div>

            {/* =================================================
                RISK TABLE
            ================================================= */}

            <div className="mb-8">
<BorderGlow
                  glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
                ><RiskTable /></BorderGlow>
              

            </div>

            {/* =================================================
                LOWER PANELS
            ================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
             <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
                ><ShortfallPanel /></BorderGlow>

              <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
                ><MitigationPanel/></BorderGlow>

            </div>

          </div>

        </main>

        <Footer />

      </div>

    </div>
  );
}