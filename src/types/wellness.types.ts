export interface WellnessPlan {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string | null;
  executive_summary: string | null;
  root_cause_analysis: RootCauseAnalysis | null;
  priority_findings: PriorityFindings | null;
  nutrition_plan: NutritionPlan | null;
  supplement_stack: SupplementStack | null;
  exercise_prescription: ExercisePrescription | null;
  sleep_protocol: SleepProtocol | null;
  stress_protocol: StressProtocol | null;
  testing_recommendations: TestingRecommendation[] | null;
  medication_discussion_points: MedicationDiscussionPoint[] | null;
  specialist_referrals: SpecialistReferral[] | null;
  milestones: Milestones | null;
  is_active: boolean;
  version: number;
}

export interface RootCauseAnalysis {
  primary_drivers: string[];
  contributing_factors: string[];
  interconnections: string[];
}

export interface PriorityFindings {
  critical: string[];
  monitor: string[];
  optimal: string[];
}

export interface NutritionPlan {
  foods_to_eliminate: string[];
  foods_to_emphasize: string[];
  meal_timing: string;
  protein_target: string;
  specific_to_conditions: string[];
}

export interface SupplementRecommendation {
  name: string;
  dose: string;
  timing: string;
  form: string;
  reason: string;
  evidence_rating: number;
  monthly_cost: string;
}

export interface SupplementStack {
  tier_1_start_immediately: SupplementRecommendation[];
  tier_2_add_week_2: SupplementRecommendation[];
  tier_3_optional: SupplementRecommendation[];
}

export interface ExercisePrescription {
  type: string;
  frequency: string;
  duration: string;
  intensity: string;
  specific_recommendations: string[];
  contraindications: string[];
}

export interface SleepProtocol {
  target_hours: string;
  recommendations: string[];
  supplements: string[];
  environment_changes: string[];
}

export interface StressProtocol {
  techniques: string[];
  supplements: string[];
  lifestyle_changes: string[];
}

export interface TestingRecommendation {
  test_name: string;
  reason: string;
  priority: 'urgent' | 'high' | 'moderate';
  icd10_codes: { code: string; description: string }[];
  medical_necessity: string;
  estimated_coverage: 'likely_covered' | 'maybe_covered' | 'likely_not_covered';
}

export interface MedicationDiscussionPoint {
  medication: string;
  concern: string;
  request: string;
  icd10_for_concern: string;
}

export interface SpecialistReferral {
  specialty: string;
  reason: string;
  urgency: 'routine' | 'soon' | 'urgent';
}

export interface Milestones {
  day_30: string[];
  day_60: string[];
  day_90: string[];
}

export interface DoctorPrepDocument {
  id: string;
  user_id: string;
  created_at: string;
  appointment_date: string | null;
  provider_name: string | null;
  patient_summary: string | null;
  test_requests: TestingRecommendation[] | null;
  medication_discussion_points: MedicationDiscussionPoint[] | null;
  specialist_referrals: SpecialistReferral[] | null;
  symptom_report: string | null;
  pdf_url: string | null;
  icd10_codes_used: { code: string; description: string }[] | null;
}
