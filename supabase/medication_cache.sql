-- Cache table for AI-looked-up medication depletion data
-- This avoids re-querying Claude for the same medication
CREATE TABLE IF NOT EXISTS medication_cache (
  medication_key TEXT PRIMARY KEY,
  medication_name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS needed — this is shared reference data, not user data
-- All users benefit from cached lookups
