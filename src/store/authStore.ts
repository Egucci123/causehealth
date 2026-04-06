import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, HealthProfile } from '@/types/user.types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  healthProfile: HealthProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setHealthProfile: (healthProfile: HealthProfile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  healthProfile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setHealthProfile: (healthProfile) => set({ healthProfile }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ user: null, session: null, profile: null, healthProfile: null }),
}));
