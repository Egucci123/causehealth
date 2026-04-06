import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { Home, TestTube2, Pill, User, Bell } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/app', icon: Home, label: 'HOME', end: true },
  { to: '/app/labs', icon: TestTube2, label: 'LABS' },
  { to: '/app/medications', icon: Pill, label: 'MEDS' },
  { to: '/app/settings', icon: User, label: 'PROFILE' },
];

export function AppShell() {
  const { user, loading, profile } = useAuth();
  const darkMode = useUIStore((s) => s.darkMode);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#E3E2DF] border-t-[#1A3C34] rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846]/50">
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
    <div className={`min-h-screen flex flex-col bg-[#FAF9F5] ${darkMode ? 'dark' : ''}`}>
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-[#FAF9F5]/70 backdrop-blur-3xl shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)]">
        <div className="flex justify-between items-center px-6 h-20 w-full">
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E3E2DF] ring-1 ring-[#C1C8C4]/20 flex items-center justify-center">
              <span className="text-sm font-bold text-[#01261F]">{initials}</span>
            </div>
          </div>

          {/* Brand */}
          <h1 className="text-xl font-['Fraunces',serif] italic tracking-tighter text-[#1A3C34]">
            CauseHealth.
          </h1>

          {/* Bell */}
          <button className="p-2 text-[#1A3C34] hover:opacity-80 transition-opacity active:scale-95 duration-150">
            <Bell className="w-[22px] h-[22px]" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 px-6 pb-32 max-w-5xl mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 bg-white/70 backdrop-blur-3xl rounded-t-[32px] shadow-[0_-8px_32px_-4px_rgba(27,28,26,0.06)]">
        <div className="flex justify-around items-center h-24 px-8 pb-4">
          {NAV_ITEMS.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={`flex flex-col items-center relative active:scale-90 transition-transform duration-200 ${
                  isActive
                    ? 'text-[#1A3C34] after:content-[\'\'] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-[#1A3C34] after:rounded-full'
                    : 'text-[#1A3C34]/40 hover:text-[#1A3C34] transition-colors'
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="uppercase tracking-widest text-[10px] font-bold mt-1">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
