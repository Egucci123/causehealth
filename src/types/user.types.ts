export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  sex: 'male' | 'female' | 'other' | null;
  height_cm: number | null;
  weight_kg: number | null;
  subscription_tier: 'free' | 'core' | 'premium' | 'family';
  onboarding_completed: boolean;
  primary_goals: string[];
  notification_preferences: Record<string, boolean>;
}

export interface HealthProfile {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  diagnoses: string[];
  family_history: FamilyHistory;
  genetic_testing_done: boolean;
  genetic_data: Record<string, unknown> | null;
  diet_type: string | null;
  exercise_frequency: string | null;
  sleep_hours: number | null;
  sleep_quality: number | null;
  stress_level: number | null;
  alcohol_frequency: string | null;
  smoking_status: string | null;
  snoring: boolean;
  bowel_frequency: string | null;
  environmental_exposures: string[];
}

export interface FamilyHistory {
  cardiovascular: boolean;
  autoimmune: boolean;
  cancer: boolean;
  diabetes: boolean;
  thyroid: boolean;
  mental_health: boolean;
  notes: string;
}

export interface Medication {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
  dose: string | null;
  frequency: string | null;
  start_date: string | null;
  prescribing_condition: string | null;
  is_active: boolean;
}

export interface Supplement {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
  dose: string | null;
  frequency: string | null;
  is_active: boolean;
}

export interface Symptom {
  id: string;
  user_id: string;
  created_at: string;
  symptom: string;
  severity: number;
  duration: string | null;
  notes: string | null;
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  created_at: string;
  entry_date: string;
  weight_kg: number | null;
  energy_level: number | null;
  sleep_quality: number | null;
  mood: number | null;
  symptom_scores: Record<string, number>;
  supplement_compliance: Record<string, boolean>;
  notes: string | null;
}

export type SubscriptionTier = 'free' | 'core' | 'premium' | 'family';

export const TIER_FEATURES = {
  free: {
    lab_uploads: 1,
    wellness_plans: false,
    supplement_stack: 'basic_only' as const,
    medication_checker: false,
    doctor_prep: false,
    trend_tracking: false,
    genetic_upload: false,
    insurance_guide: false,
    hormone_module: false,
    hair_module: false,
  },
  core: {
    lab_uploads: 'unlimited' as const,
    wellness_plans: true,
    supplement_stack: 'full' as const,
    medication_checker: true,
    doctor_prep: false,
    trend_tracking: true,
    genetic_upload: false,
    insurance_guide: false,
    hormone_module: true,
    hair_module: true,
  },
  premium: {
    lab_uploads: 'unlimited' as const,
    wellness_plans: true,
    supplement_stack: 'full' as const,
    medication_checker: true,
    doctor_prep: true,
    trend_tracking: true,
    genetic_upload: true,
    insurance_guide: true,
    hormone_module: true,
    hair_module: true,
  },
  family: {
    lab_uploads: 'unlimited' as const,
    wellness_plans: true,
    supplement_stack: 'full' as const,
    medication_checker: true,
    doctor_prep: true,
    trend_tracking: true,
    genetic_upload: true,
    insurance_guide: true,
    hormone_module: true,
    hair_module: true,
    profiles: 4,
  },
} as const;
