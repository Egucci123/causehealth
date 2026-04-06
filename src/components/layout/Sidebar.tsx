import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  TestTube2,
  Pill,
  HeartPulse,
  Stethoscope,
  Shield,
  TrendingUp,
  Settings,
  Activity,
  X,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Sanctuary', end: true },
  { to: '/app/labs', icon: TestTube2, label: 'Labs' },
  { to: '/app/medications', icon: Pill, label: 'Medications' },
  { to: '/app/symptoms', icon: HeartPulse, label: 'Symptoms' },
  { to: '/app/wellness', icon: Activity, label: 'Wellness Plan' },
  { to: '/app/doctor-prep', icon: Stethoscope, label: 'Doctor Prep' },
  { to: '/app/insurance', icon: Shield, label: 'Insurance Guide' },
  { to: '/app/progress', icon: TrendingUp, label: 'Progress' },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-primary/30 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-64 bg-surface-container-lowest flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto shadow-lg lg:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-6 py-5 flex items-center justify-between">
          <NavLink to="/app" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary-container rounded-2xl flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-on-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-primary">CauseHealth.</span>
          </NavLink>
          <button className="lg:hidden p-1 rounded-xl hover:bg-surface-container-high transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150',
                  isActive || (end ? location.pathname === to : location.pathname.startsWith(to))
                    ? 'bg-primary-container text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-high/40'
                )
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Settings */}
        <div className="px-3 py-4">
          <NavLink
            to="/app/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary-container text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high/40'
              )
            }
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </div>

        {/* Disclaimer */}
        <div className="px-5 py-3 text-[9px] text-on-surface-variant/40 leading-relaxed">
          Not medical advice. For educational purposes only. Always consult your healthcare provider.
        </div>
      </aside>
    </>
  );
}
