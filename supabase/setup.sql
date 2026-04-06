-- ============================================================================
-- CauseHealth — Complete Database Setup
-- Run this ONCE in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================================

-- 1. PROFILES (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  sex TEXT CHECK (sex IN ('male', 'female', 'other')),
  height_cm NUMERIC,
  weight_kg NUMERIC,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'core', 'premium', 'family')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  primary_goals TEXT[],
  notification_preferences JSONB DEFAULT '{}'
);

-- 2. HEALTH PROFILES
CREATE TABLE IF NOT EXISTS health_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  diagnoses TEXT[],
  family_history JSONB,
  genetic_testing_done BOOLEAN DEFAULT FALSE,
  genetic_data JSONB,
  diet_type TEXT,
  exercise_frequency TEXT,
  sleep_hours NUMERIC,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  alcohol_frequency TEXT,
  smoking_status TEXT,
  snoring BOOLEAN,
  bowel_frequency TEXT,
  environmental_exposures TEXT[]
);

-- 3. MEDICATIONS
CREATE TABLE IF NOT EXISTS medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  dose TEXT,
  frequency TEXT,
  start_date DATE,
  prescribing_condition TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- 4. SUPPLEMENTS
CREATE TABLE IF NOT EXISTS supplements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  dose TEXT,
  frequency TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- 5. SYMPTOMS
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  symptom TEXT NOT NULL,
  severity INTEGER CHECK (severity BETWEEN 1 AND 10),
  duration TEXT,
  notes TEXT
);

-- 6. LAB DRAWS
CREATE TABLE IF NOT EXISTS lab_draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  draw_date DATE NOT NULL,
  lab_name TEXT,
  ordering_provider TEXT,
  raw_pdf_url TEXT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'complete', 'failed')),
  notes TEXT
);

-- 7. LAB VALUES
CREATE TABLE IF NOT EXISTS lab_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES lab_draws(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  marker_name TEXT NOT NULL,
  marker_category TEXT,
  value NUMERIC NOT NULL,
  unit TEXT,
  standard_low NUMERIC,
  standard_high NUMERIC,
  optimal_low NUMERIC,
  optimal_high NUMERIC,
  standard_flag TEXT CHECK (standard_flag IN ('normal', 'low', 'high', 'critical_low', 'critical_high')),
  optimal_flag TEXT CHECK (optimal_flag IN ('optimal', 'suboptimal_low', 'suboptimal_high', 'deficient', 'elevated')),
  draw_date DATE
);

-- 8. WELLNESS PLANS
CREATE TABLE IF NOT EXISTS wellness_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT,
  executive_summary TEXT,
  root_cause_analysis JSONB,
  priority_findings JSONB,
  nutrition_plan JSONB,
  supplement_stack JSONB,
  exercise_prescription JSONB,
  sleep_protocol JSONB,
  stress_protocol JSONB,
  testing_recommendations JSONB,
  medication_discussion_points JSONB,
  specialist_referrals JSONB,
  milestones JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  version INTEGER DEFAULT 1
);

-- 9. DOCTOR PREP DOCUMENTS
CREATE TABLE IF NOT EXISTS doctor_prep_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  appointment_date DATE,
  provider_name TEXT,
  patient_summary TEXT,
  test_requests JSONB,
  medication_discussion_points JSONB,
  specialist_referrals JSONB,
  symptom_report TEXT,
  pdf_url TEXT,
  icd10_codes_used JSONB
);

-- 10. PROGRESS ENTRIES
CREATE TABLE IF NOT EXISTS progress_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  entry_date DATE DEFAULT CURRENT_DATE,
  weight_kg NUMERIC,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  mood INTEGER CHECK (mood BETWEEN 1 AND 10),
  symptom_scores JSONB,
  supplement_compliance JSONB,
  notes TEXT
);

-- 11. SUPPLEMENT COMPLIANCE
CREATE TABLE IF NOT EXISTS supplement_compliance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  supplement_id UUID REFERENCES supplements(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  taken_date DATE DEFAULT CURRENT_DATE,
  taken BOOLEAN DEFAULT TRUE
);

-- 12. AI CONVERSATIONS
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  conversation_type TEXT,
  messages JSONB,
  analysis_result JSONB
);

-- 13. MEDICATION CACHE (shared, no RLS)
CREATE TABLE IF NOT EXISTS medication_cache (
  medication_key TEXT PRIMARY KEY,
  medication_name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AI LOOKUP CACHE (shared, no RLS)
CREATE TABLE IF NOT EXISTS ai_lookup_cache (
  lookup_type TEXT NOT NULL,
  lookup_key TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (lookup_type, lookup_key)
);

-- ============================================================================
-- ROW LEVEL SECURITY — Users can only see their own data
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_prep_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Profiles: users access own row
CREATE POLICY "Users access own profile" ON profiles FOR ALL USING (auth.uid() = id);

-- All user-data tables: users access own rows via user_id
CREATE POLICY "Users access own data" ON health_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON medications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON supplements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON symptoms FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON lab_draws FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON lab_values FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON wellness_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON doctor_prep_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON progress_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON supplement_compliance FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON ai_conversations FOR ALL USING (auth.uid() = user_id);

-- Cache tables: public read/write (shared reference data, not user data)
-- No RLS needed — these benefit all users
ALTER TABLE medication_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read/write medication cache" ON medication_cache FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE ai_lookup_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read/write AI cache" ON ai_lookup_cache FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- INDEX for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_lab_values_draw_id ON lab_values (draw_id);
CREATE INDEX IF NOT EXISTS idx_lab_values_user_id ON lab_values (user_id);
CREATE INDEX IF NOT EXISTS idx_medications_user_active ON medications (user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_symptoms_user_id ON symptoms (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_entries_user_date ON progress_entries (user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_ai_lookup_type_key ON ai_lookup_cache (lookup_type, lookup_key);
