import { useLocation, useNavigate } from "react-router-dom";
import GooeyNav from "./GooeyNav";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Prospectivity", href: "/prospectivity" },
    { label: "Production", href: "/production" },
    { label: "Risk & Shortfall", href: "/RiskandShortfall" },
    { label: "Model Intelligence", href: "/Modelintelligence" },
  ];

  const currentIndex = navItems.findIndex(
    (item) => item.href === location.pathname
  );

  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zenith-bg/95 backdrop-blur-xl border-b border-zenith-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 flex-shrink-0"
            aria-label="Go to Dashboard"
          >
            <img
              src="logo.png"
              alt="Prithvia Logo"
              className="h-10 w-10 object-cover rounded-full"
            />

            <span className="text-white font-bold text-xl tracking-wider">
              PRITHVIA
            </span>
          </button>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden md:flex items-center">
            <GooeyNav
              items={navItems}
              initialActiveIndex={activeIndex}
              animationTime={600}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>

          {/* ================= MOBILE NAV ================= */}
          <div className="md:hidden">
            <select
              value={location.pathname}
              onChange={(e) => navigate(e.target.value)}
              className="bg-zenith-surface border border-zenith-border text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zenith-accent"
              aria-label="Navigation"
            >
              {navItems.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </nav>
  );
}