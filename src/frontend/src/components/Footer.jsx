export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zenith-border py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zenith-accent">
              <img src="logo.png" />
            </div>
            <span className="text-lg font-semibold tracking-wider uppercase text-white">MnVisionAI</span>
          </div>

          {/* Center: SIH badge */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm text-text-secondary font-medium">SIH 2026 · National Level</p>
            <p className="text-xs text-text-muted">
              © {currentYear} MnVisionAI. Space Technology Platform for Manganese Intelligence.
            </p>
          </div>

          
        </div>
      </div>
    </footer>
  );
}