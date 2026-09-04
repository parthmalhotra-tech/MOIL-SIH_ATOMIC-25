import { ArrowRight } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "#", active: true },
  { label: "Prospectivity", href: "#", active: false },
  { label: "Production", href: "#", active: false },
  { label: "Risk", href: "#", active: false },
  { label: "Recommendations", href: "#", active: false },
  { label: "Model & Data", href: "#", active: false },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zenith-bg border-b border-zenith-border">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo - Red plus + MANGANAI */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zenith-accent">
              <span className="text-white font-bold text-xl leading-none">+</span>
            </div>
            <span className="text-xl font-semibold tracking-wider uppercase text-white">MANGANAI</span>
          </div>

          {/* Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                  item.active
                    ? "text-white"
                    : "text-text-muted hover:text-white"
                }`}
                aria-current={item.active ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions - Log in + Start Now */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-4 py-2 text-sm font-medium uppercase tracking-wide text-text-secondary hover:text-white transition-colors">
              Log in
            </button>
            <a
              href="#prospectivity"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-zenith-bg font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:bg-text-secondary hover:-translate-y-0.5"
            >
              Start Now
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}