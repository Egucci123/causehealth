import { useState } from 'react';
import { analyzeLabs, generateWellnessPlan, generateDoctorPrepDocument } from '@/lib/claude';
import type { LabValue, LabAnalysis } from '@/types/lab.types';
import type { Profile, Medication, Symptom } from '@/types/user.types';

export function useAI() {
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runLabAnalysis(
    labValues: LabValue[],
    profile: Profile | null,
    medications: Medication[]
  ): Promise<LabAnalysis | null> {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeLabs(labValues, profile, medications);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      return null;
    } finally {
      setAnalyzing(false);
    }
  }

  async function runWellnessPlan(
    profile: Profile | null,
    labHistory: LabValue[][],
    medications: Medication[],
    symptoms: Symptom[]
  ): Promise<Record<string, unknown> | null> {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateWellnessPlan(profile, labHistory, medications, symptoms);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Plan generation failed');
      return null;
    } finally {
      setGenerating(false);
    }
  }

  async function runDoctorPrep(
    profile: Profile | null,
    labHistory: LabValue[][],
    medications: Medication[],
    symptoms: Symptom[],
    appointmentInfo: { date?: string; provider?: string; reason?: string }
  ): Promise<Record<string, unknown> | null> {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateDoctorPrepDocument(profile, labHistory, medications, symptoms, appointmentInfo);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Document generation failed');
      return null;
    } finally {
      setGenerating(false);
    }
  }

  return {
    analyzing,
    generating,
    error,
    runLabAnalysis,
    runWellnessPlan,
    runDoctorPrep,
  };
}
