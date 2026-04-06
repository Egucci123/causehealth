import { Menu, Moon, Sun, Bell, LogOut } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';

export function TopNav() {
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-surface/80 dark:bg-bg-dark/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-2xl hover:bg-surface-container-high/40 transition-colors"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-2xl hover:bg-surface-container-high/40 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-on-surface-variant" />}
          </button>

          <button className="p-2.5 rounded-2xl hover:bg-surface-container-high/40 transition-colors relative">
            <Bell className="w-5 h-5 text-on-surface-variant" />
          </button>

          <div className="flex items-center gap-3 ml-2 pl-3">
            <div className="w-9 h-9 bg-secondary-container rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-on-secondary-container">
                {profile?.first_name?.[0] || 'U'}
              </span>
            </div>
            <span className="hidden sm:inline text-sm font-medium text-primary">
              {profile?.first_name || 'User'}
            </span>
            <button
              onClick={signOut}
              className="p-2 rounded-2xl hover:bg-surface-container-high/40 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
