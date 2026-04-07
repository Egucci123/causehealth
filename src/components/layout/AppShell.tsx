import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Home, TestTube2, Pill, User, Search } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/app', icon: Home, label: 'HOME', end: true },
  { to: '/app/labs', icon: TestTube2, label: 'LABS' },
  { to: '/app/medications', icon: Pill, label: 'MEDS' },
  { to: '/app/settings', icon: User, label: 'PROFILE' },
];

export function AppShell() {
  const { user, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0C0F]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#282D33] border-t-[#1F403D] rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]/50">
            Loading
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  const initials = profile?.first_name?.[0]?.toUpperCase() || '?';

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0C0F]">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-[#0A0C0F]/80 backdrop-blur-xl border-b border-[#2C3433]/30 shadow-2xl">
        <div className="flex justify-between items-center px-6 h-20 w-full">
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#15181C] border border-[#1F403D]/30 flex items-center justify-center">
              <span className="text-sm font-bold text-[#E2E2E6]">{initials}</span>
            </div>
          </div>

          {/* Brand */}
          <h1 className="text-2xl font-['Newsreader',serif] tracking-tight text-[#E2E2E6]">
            CauseHealth.
          </h1>

          {/* Search */}
          <button className="p-2 text-[#A0ACAB] hover:opacity-80 transition-opacity active:scale-95 duration-150">
            <Search className="w-[22px] h-[22px]" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 pb-32 max-w-2xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 bg-[#0A0C0F]/90 backdrop-blur-xl border-t border-[#2C3433]/30">
        <div className="flex justify-around items-center h-20 px-6 pb-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                  isActive
                    ? 'text-[#1F403D] scale-110'
                    : 'text-[#A0ACAB]/60 hover:text-[#A0ACAB] active:scale-90'
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold">
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-4 h-[2px] bg-[#1F403D] rounded-full" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
