import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import KpiCard from "../components/KpiCard";
import ProspectivityMap from "../components/ProspectivityMap";
import ProductionForecastChart from "../components/ProductionForecastChart";
import RiskOverview from "../components/RiskOverview";
import AIInsight from "../components/AIInsight";
import Footer from "../components/Footer";
import { kpiData } from "../data/kpiData";
import { prospectivityMockData } from "../data/prospectivityData";
import { productionData } from "../data/productionData";
import { riskData } from "../data/riskData";
import { aiInsightData } from "../data/aiInsightData";
import BorderGlow from "../components/borderglow";
import CursorGrid from "../components/CursorGrid";

export default function Dashboard() {
  return (
    
   
    <div className="min-h-screen bg-dark-bg flex flex-col">
       <div className="fixed inset-0 z-0 pointer-events-none">
               <CursorGrid
                 color="#ffffff"
                 opacity={0.08}
               />
             </div>
      {/* Navbar */}
      <Navbar />
       

      {/* Main Content */}
      <main className="flex-1 w-full pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Hero Section */}
          <HeroSection />

          {/* KPI Section */}
          <section id="kpis" aria-labelledby="kpis-heading" className="animate-slide-up">
            <h2 id="kpis-heading" className="sr-only">Key Performance Indicators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
                >   
                <KpiCard
                title={kpiData.prospectivity.label}
                value={kpiData.prospectivity.highVeryHighZones}
                unit={kpiData.prospectivity.unit}
                trend={kpiData.prospectivity.trend}
                trendLabel={kpiData.prospectivity.trendLabel}
                color="manganai"
              />
              </BorderGlow>
              <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
                >   
              <KpiCard
                title={kpiData.production.label}
                value={kpiData.production.forecastProduction}
                unit={kpiData.production.unit}
                trend={kpiData.production.trend}
                trendLabel={kpiData.production.trendLabel}
                color="yellow"
              />
              </BorderGlow>
              <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
                >   
              <KpiCard
                title={kpiData.shortfall.label}
                value={kpiData.shortfall.expectedShortfallPercent}
                unit={kpiData.shortfall.unit}
                trend={kpiData.shortfall.trend}
                trendLabel={kpiData.shortfall.trendLabel}
                color="orange"
              />
              </BorderGlow>
              <BorderGlow
                  glowColor="#ffffff"
                  glowRadius={80}
                  glowIntensity={1.2}
                  borderRadius={24}
                >   
              <KpiCard
                title={kpiData.risk.label}
                value={kpiData.risk.highRiskLocations}
                unit={kpiData.risk.unit}
                trend={kpiData.risk.trend}
                trendLabel={kpiData.risk.trendLabel}
                color="red"
              />
              </BorderGlow>
            </div>
          </section>

          {/* Main Map Section */}
          <section id="prospectivity" aria-labelledby="map-heading" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="mb-4">
              <h2 id="map-heading" className="text-xl font-semibold text-white mb-1">
                India Manganese Prospectivity
              </h2>
              <p className="text-sm text-zinc-400">
                AI-predicted manganese-associated prospectivity across sampled locations
              </p>
            </div>
            <ProspectivityMap 
              data={prospectivityMockData}
              initialView={{ center: [21.0, 78.0], zoom: 5 }}
            />
          </section>

          {/* Analytical Panels Below Map */}
          <section id="analytics" aria-labelledby="analytics-heading" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 id="analytics-heading" className="sr-only">Analytical Panels</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Production Forecast Chart */}
              <ProductionForecastChart
                historical={productionData.historical}
                forecast={productionData.forecast}
                target={productionData.target}
                unit={productionData.unit}
              />

              {/* Risk Overview */}
              <RiskOverview
                distribution={riskData.distribution}
                totalLocations={riskData.totalLocations}
                variant="bars"
              />
            </div>
          </section>

          {/* AI Intelligence Brief */}
          <section id="ai-insight" aria-labelledby="ai-heading" className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <AIInsight
              insights={aiInsightData.insights}
              modelVersion={aiInsightData.modelVersion}
              generatedAt={aiInsightData.generatedAt}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}