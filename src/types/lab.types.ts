export interface LabDraw {
  id: string;
  user_id: string;
  created_at: string;
  draw_date: string;
  lab_name: string | null;
  ordering_provider: string | null;
  raw_pdf_url: string | null;
  processing_status: 'pending' | 'processing' | 'complete' | 'failed';
  notes: string | null;
}

export interface LabValue {
  id: string;
  draw_id: string;
  user_id: string;
  created_at: string;
  marker_name: string;
  marker_category: string | null;
  value: number;
  unit: string | null;
  standard_low: number | null;
  standard_high: number | null;
  optimal_low: number | null;
  optimal_high: number | null;
  standard_flag: 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high' | null;
  optimal_flag: 'optimal' | 'suboptimal_low' | 'suboptimal_high' | 'deficient' | 'elevated' | null;
  draw_date: string | null;
}

export interface ExtractedLabValue {
  marker_name: string;
  value: number;
  unit: string;
  standard_low: number | null;
  standard_high: number | null;
  flag: string;
  category: string;
  draw_date: string | null;
}

export interface LabAnalysis {
  priority_findings: PriorityFinding[];
  patterns_identified: Pattern[];
  medication_connections: MedicationConnection[];
  missing_tests: MissingTest[];
  root_causes: RootCause[];
  immediate_actions: string[];
}

export interface PriorityFinding {
  marker_name: string;
  value: number;
  unit: string;
  priority: 'critical' | 'monitor' | 'optimal';
  standard_flag: string;
  optimal_flag: string;
  explanation: string;
}

export interface Pattern {
  pattern_name: string;
  markers_involved: string[];
  clinical_significance: string;
  recommended_action: string;
}

export interface MedicationConnection {
  medication: string;
  affected_markers: string[];
  mechanism: string;
  recommended_action: string;
}

export interface MissingTest {
  test_name: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  icd10_codes: string[];
}

export interface RootCause {
  cause: string;
  probability: string;
  supporting_evidence: string[];
  recommended_tests: string[];
}

export interface OptimalRange {
  name: string;
  unit: string;
  standard: { low: number | null; high: number | null };
  optimal: { low: number | null; high: number | null };
  category: string;
  priority: string;
  description?: string;
  low_symptoms?: string[];
  high_symptoms?: string[];
  root_causes_high?: string[];
  root_causes_low?: string[];
  symptoms_of_low?: string[];
}
