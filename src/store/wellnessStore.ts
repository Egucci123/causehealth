import { create } from 'zustand';
import type { WellnessPlan } from '@/types/wellness.types';

interface WellnessState {
  activePlan: WellnessPlan | null;
  plans: WellnessPlan[];
  generating: boolean;
  setActivePlan: (plan: WellnessPlan | null) => void;
  setPlans: (plans: WellnessPlan[]) => void;
  setGenerating: (generating: boolean) => void;
}

export const useWellnessStore = create<WellnessState>((set) => ({
  activePlan: null,
  plans: [],
  generating: false,
  setActivePlan: (plan) => set({ activePlan: plan }),
  setPlans: (plans) => set({ plans }),
  setGenerating: (generating) => set({ generating }),
}));
