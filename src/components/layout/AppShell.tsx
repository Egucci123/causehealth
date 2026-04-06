import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { Home, TestTube2, Pill, User } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#E4E2DF] border-t-[#1B4332] rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/50">
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

  return (
    <div className={`min-h-screen flex flex-col bg-[#FBF9F6] ${darkMode ? 'dark' : ''}`}>
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#FBF9F6] transition-all duration-300">
        <div className="flex justify-between items-center w-full px-6 py-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#EAE8E5] flex items-center justify-center">
            <span className="text-sm font-bold text-[#012D1D]">
              {profile?.first_name?.[0]?.toUpperCase() || '?'}
            </span>
          </div>

          {/* Brand */}
          <span className="text-2xl font-display font-bold text-[#012D1D]">
            CauseHealth.
          </span>

          {/* Bell */}
          <NavLink
            to="/app/progress"
            className="p-2 rounded-full text-[#012D1D] hover:bg-[#F5F3F0] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-28 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation — Hims style */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 bg-[#FBF9F6]/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-4px_40px_rgba(27,28,26,0.05)]">
        {NAV_ITEMS.map((item) => {
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={`flex flex-col items-center justify-center px-5 py-2.5 transition-all duration-200 ${
                isActive
                  ? 'bg-[#1B4332] text-[#FBF9F6] rounded-2xl scale-95'
                  : 'text-[#1B4332]/60 hover:opacity-80'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
