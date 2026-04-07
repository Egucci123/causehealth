import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-[#0A0C0F] text-[#E2E2E6] font-['DM_Sans',sans-serif] antialiased overflow-hidden selection:bg-[#1F403D]/30 min-h-screen">
      {/* Background Grain Texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* Screen 1: Splash Section */}
      <main className="relative h-screen w-full flex flex-col items-center justify-center px-8 z-10">
        {/* ECG Pulse Graphic Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <svg className="max-w-4xl" fill="none" height="200" viewBox="0 0 1000 200" width="100%" xmlns="http://www.w3.org/2000/svg">
            <path className="ecg-path" d="M0 100H200L220 70L250 130L280 20L310 180L340 100H1000" stroke="#1F403D" strokeWidth="2" />
          </svg>
        </div>

        {/* Brand Identity */}
        <div className="text-center relative z-20 space-y-6">
          <h1 className="font-['Newsreader',serif] text-6xl md:text-8xl text-[#1F403D] tracking-tight font-medium">
            CauseHealth.
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-lg md:text-xl text-[#A0ACAB] max-w-md mx-auto leading-relaxed">
            Your doctor has <span className="text-[#C9A84C]">12 minutes</span>.<br />
            We have everything they miss.
          </p>
        </div>

        {/* Primary Action */}
        <div className="absolute bottom-20 w-full max-w-xs px-6">
          <Link
            to="/register"
            className="group relative w-full bg-[#2D5A56] py-4 rounded-xl text-[#E6F0EE] font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:brightness-110 active:scale-95 shadow-[0_0_40px_rgba(31,64,61,0.2)] flex items-center justify-center"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link
            to="/login"
            className="block text-center text-[#A0ACAB] text-sm mt-4 hover:text-[#E2E2E6] transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Ambient Medical Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#1F403D]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#C9A84C]/5 blur-[120px] rounded-full pointer-events-none" />
      </main>

      {/* Visual Polish: Ghost Border Effect */}
      <div className="fixed inset-0 border border-[#2C3433]/10 pointer-events-none" />
    </div>
  );
}
