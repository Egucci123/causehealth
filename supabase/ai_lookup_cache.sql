-- Unified cache table for all AI-looked-up health data
-- Shared across all users — once any user looks up a supplement, symptom, etc.,
-- all future users get it instantly without another API call
CREATE TABLE IF NOT EXISTS ai_lookup_cache (
  lookup_type TEXT NOT NULL,  -- 'supplement', 'symptom', 'test', 'lab_marker', 'autoimmune'
  lookup_key TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (lookup_type, lookup_key)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ai_lookup_type_key ON ai_lookup_cache (lookup_type, lookup_key);

-- Can drop the old medication_cache table if it exists
-- (medication lookups now use this unified table via medicationLookup.ts)
