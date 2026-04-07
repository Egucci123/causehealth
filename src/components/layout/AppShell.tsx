import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Home, TestTube2, Pill, User, Search } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/app', icon: Home, label: 'Home', end: true },
  { to: '/app/labs', icon: TestTube2, label: 'Labs' },
  { to: '/app/medications', icon: Pill, label: 'Meds' },
  { to: '/app/settings', icon: User, label: 'Profile' },
];

export function AppShell() {
  const { user, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#282D33] border-t-[#1F403D] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (profile && !profile.onboarding_completed) return <Navigate to="/onboarding" replace />;

  const initials = profile?.first_name?.[0]?.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-[#0A0C0F] text-[#E2E2E6] font-['DM_Sans',sans-serif] select-none">
      {/* TopAppBar — exact from stitch29 */}
      <header className="bg-[#0A0C0F]/80 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-[#2C3433]/30 shadow-2xl flex items-center justify-between px-6 h-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1F403D]/30 bg-[#1E2226] flex items-center justify-center">
            <span className="text-sm font-bold text-[#E2E2E6]">{initials}</span>
          </div>
          <h1 className="font-['Newsreader',serif] text-2xl tracking-tight text-[#E2E2E6]">CauseHealth.</h1>
        </div>
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 text-[#A0ACAB] hover:text-[#1F403D] transition-colors active:scale-95 cursor-pointer" strokeWidth={1.5} />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <Outlet />
      </main>

      {/* BottomNavBar — exact from stitch29 */}
      <nav className="bg-[#0A0C0F]/95 backdrop-blur-xl fixed bottom-0 w-full z-50 rounded-t-2xl border-t border-[#2C3433]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] h-20 px-4 flex justify-around items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={`flex flex-col items-center justify-center transition-all duration-300 ${
                isActive ? 'text-[#1F403D]' : 'text-[#A0ACAB]/50 hover:text-[#A0ACAB]'
              }`}
            >
              <item.icon className="w-7 h-7" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
