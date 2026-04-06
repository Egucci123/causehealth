export interface MedicationDepletion {
  nutrient: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  mechanism: string;
  symptoms_of_depletion?: string[];
  recommended_supplement: string;
  evidence: 'strong' | 'moderate' | 'emerging';
  important_note?: string;
  fda_warning?: boolean;
  fda_warning_text?: string;
  medical_supervision_required?: boolean;
  warning?: string;
}

export interface MedicationInfo {
  generic_name: string;
  brand_names: string[];
  depletes: MedicationDepletion[];
  liver_impact?: string;
  liver_notes?: string;
  alternatives?: string[];
  muscle_pain_risk?: string;
  monitoring_required?: string[];
  notes?: string;
  immunosuppressant?: boolean;
  immunosuppressant_notes?: string;
  drug_interactions?: string[];
  bone_loss_risk?: string;
  bone_loss_notes?: string;
  blood_sugar_impact?: string;
  blood_sugar_notes?: string;
  hair_loss_connection?: string;
  hair_loss_notes?: string;
  drug_interactions_extensive?: boolean;
}

export interface SupplementInfo {
  name: string;
  category: string;
  evidence_rating: number;
  primary_uses: string[];
  dose_standard: string;
  timing: string;
  timing_notes: string;
  form_matters: boolean;
  best_form?: string;
  drug_interactions?: string[];
  contraindications?: string[];
  time_to_benefit: string;
  cost_monthly: string;
  brands_to_look_for?: string;
  quality_note?: string;
  dose_for_triglycerides?: string;
  specific_indication?: string;
  specific_for?: string;
  mechanism?: string;
  note?: string;
  retest_at?: string;
  target_level?: string;
  critical_note?: string;
  upper_limit?: string;
  ibd_specific?: string;
  liver_specific?: string;
  hair_loss_note?: string;
}

export interface ICD10Code {
  code: string;
  description: string;
}

export interface TestJustification {
  test_name: string;
  codes: ICD10Code[];
  medical_necessity: string;
  triggers: string[];
}

export interface SymptomRootCause {
  cause: string;
  probability: string;
  tests: string[];
  icd10: string;
}

export interface SymptomInfo {
  symptom: string;
  root_causes: SymptomRootCause[];
  immediate_actions?: string[];
  pattern_analysis?: Record<string, string>;
}
