export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zenith-border py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zenith-accent">
              <span className="text-white font-bold text-xl leading-none">+</span>
            </div>
            <span className="text-lg font-semibold tracking-wider uppercase text-white">MANGANAI</span>
          </div>

          {/* Center: SIH badge */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm text-text-secondary font-medium">SIH 2026 · National Level</p>
            <p className="text-xs text-text-muted">
              © {currentYear} MnAI. AI/ML + Space Technology Platform for Manganese Intelligence.
            </p>
          </div>

          {/* Right: Domain tags + version */}
          <div className="flex items-center gap-3 md:gap-5 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zenith-accent" />
              Prospectivity
            </span>
            <span className="w-px h-4 bg-zenith-border hidden md:block" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zenith-accent/50" />
              Production
            </span>
            <span className="w-px h-4 bg-zenith-border hidden md:block" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Risk
            </span>
            <span className="w-px h-4 bg-zenith-border hidden md:block" />
            <span className="font-mono text-text-secondary">v2.3.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}