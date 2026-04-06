import { create } from 'zustand';
import type { LabDraw, LabValue, LabAnalysis } from '@/types/lab.types';

interface LabState {
  draws: LabDraw[];
  values: LabValue[];
  currentAnalysis: LabAnalysis | null;
  processingStatus: 'idle' | 'uploading' | 'parsing' | 'analyzing' | 'complete' | 'error';
  setDraws: (draws: LabDraw[]) => void;
  setValues: (values: LabValue[]) => void;
  setCurrentAnalysis: (analysis: LabAnalysis | null) => void;
  setProcessingStatus: (status: LabState['processingStatus']) => void;
  addDraw: (draw: LabDraw) => void;
  addValues: (values: LabValue[]) => void;
}

export const useLabStore = create<LabState>((set) => ({
  draws: [],
  values: [],
  currentAnalysis: null,
  processingStatus: 'idle',
  setDraws: (draws) => set({ draws }),
  setValues: (values) => set({ values }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setProcessingStatus: (status) => set({ processingStatus: status }),
  addDraw: (draw) => set((s) => ({ draws: [...s.draws, draw] })),
  addValues: (newValues) => set((s) => ({ values: [...s.values, ...newValues] })),
}));
