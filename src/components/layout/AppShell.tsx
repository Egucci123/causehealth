import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { Home, TestTube2, Pill, User, Bell } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/app', icon: Home, label: 'Home', end: true },
  { to: '/app/labs', icon: TestTube2, label: 'Labs' },
  { to: '/app/medications', icon: Pill, label: 'Meds' },
  { to: '/app/settings', icon: User, label: 'Profile' },
];

export function AppShell() {
  const { user, loading, profile } = useAuth();
  const darkMode = useUIStore((s) => s.darkMode);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#E4E2DF] border-t-[#1A3C34] rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844]/50">
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
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#FAF9F5]/70 backdrop-blur-3xl shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)]">
        <div className="flex justify-between items-center w-full h-full px-6">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#EAE8E5] flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold font-['Manrope',sans-serif] text-[#1A3C34]">
              {initials}
            </span>
          </div>

          {/* Brand */}
          <span className="font-['Fraunces',serif] italic text-xl text-[#1A3C34]">
            CauseHealth.
          </span>

          {/* Bell */}
          <NavLink
            to="/app/progress"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#1A3C34] hover:bg-[#F5F3F0] transition-all"
          >
            <Bell className="w-[22px] h-[22px]" strokeWidth={1.5} />
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-32 px-6 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#FAF9F5]/70 backdrop-blur-3xl rounded-t-[32px] shadow-[0_-8px_32px_rgba(27,28,26,0.05)]">
        <div className="flex justify-around items-center px-4 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
          {NAV_ITEMS.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={`flex flex-col items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1A3C34] text-white rounded-2xl px-5 py-2.5'
                    : 'text-[#1A3C34]/50 px-5 py-2.5'
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[11px] uppercase tracking-widest font-semibold">
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
