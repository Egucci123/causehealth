/**
 * Unified AI lookup service for all health data types.
 * Pattern: static DB -> in-memory cache -> Supabase cache -> Claude AI -> cache result
 */

import type { SupplementInfo, SymptomInfo, TestJustification } from '@/types/medication.types';
import type { OptimalRange } from '@/types/lab.types';
import { SUPPLEMENT_DATABASE } from '@/data/supplementDatabase';
import { SYMPTOM_ROOT_CAUSES } from '@/data/symptomRootCauses';
import { ICD10_TEST_JUSTIFICATIONS } from '@/data/icd10Codes';
import { OPTIMAL_RANGES } from '@/data/optimalRanges';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// ── Generic Claude caller ────────────────────────────────────────────────────

async function callClaude(system: string, userMessage: string, maxTokens = 2048): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
  const data = await response.json();
  return data.content?.[0]?.text ?? '';
}

function extractJson(text: string): string {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  const raw = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (raw) return raw[1].trim();
  return text;
}

// ── Generic cache layer ──────────────────────────────────────────────────────

type CacheType = 'supplement' | 'symptom' | 'test' | 'lab_marker' | 'autoimmune';

const memoryCache = new Map<string, unknown>();

function cacheKey(type: CacheType, key: string): string {
  return `${type}:${key.toLowerCase().trim()}`;
}

async function getFromSupabaseCache(type: CacheType, key: string): Promise<unknown | null> {
  try {
    const { supabase } = await import('@/lib/supabase');
    const { data } = await supabase
      .from('ai_lookup_cache')
      .select('data')
      .eq('lookup_type', type)
      .eq('lookup_key', key.toLowerCase().trim())
      .single();
    return data?.data ?? null;
  } catch {
    return null;
  }
}

async function saveToSupabaseCache(type: CacheType, key: string, data: unknown): Promise<void> {
  try {
    const { supabase } = await import('@/lib/supabase');
    await supabase.from('ai_lookup_cache').upsert({
      lookup_type: type,
      lookup_key: key.toLowerCase().trim(),
      data,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Non-critical
  }
}

async function cachedLookup<T>(
  type: CacheType,
  key: string,
  staticLookup: () => T | null,
  aiLookup: () => Promise<T | null>
): Promise<{ data: T; source: 'static' | 'cache' | 'ai' } | null> {
  // 1. Static DB
  const staticResult = staticLookup();
  if (staticResult) return { data: staticResult, source: 'static' };

  // 2. Memory cache
  const memKey = cacheKey(type, key);
  if (memoryCache.has(memKey)) {
    const cached = memoryCache.get(memKey) as T | null;
    if (cached) return { data: cached, source: 'cache' };
    return null; // Previously looked up, nothing found
  }

  // 3. Supabase cache
  const dbCached = await getFromSupabaseCache(type, key);
  if (dbCached) {
    memoryCache.set(memKey, dbCached);
    return { data: dbCached as T, source: 'cache' };
  }

  // 4. AI lookup
  try {
    const aiResult = await aiLookup();
    memoryCache.set(memKey, aiResult);
    if (aiResult) {
      await saveToSupabaseCache(type, key, aiResult);
      return { data: aiResult, source: 'ai' };
    }
    return null;
  } catch {
    return null;
  }
}

// ── SUPPLEMENT LOOKUP ────────────────────────────────────────────────────────

function findSupplementStatic(name: string): SupplementInfo | null {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
  if (SUPPLEMENT_DATABASE[normalized]) return SUPPLEMENT_DATABASE[normalized];
  for (const info of Object.values(SUPPLEMENT_DATABASE)) {
    if (info.name.toLowerCase() === name.toLowerCase()) return info;
  }
  return null;
}

async function lookupSupplementAI(name: string): Promise<SupplementInfo | null> {
  const text = await callClaude(
    'You are a clinical nutrition and supplement expert. Provide evidence-based supplement data. Only include benefits and dosing backed by clinical studies.',
    `Provide comprehensive data for the supplement: "${name}"

Return ONLY a valid JSON object:
{
  "name": "full supplement name",
  "category": "category (vitamins, minerals, amino_acids, adaptogens, etc.)",
  "evidence_rating": 1-5,
  "primary_uses": ["use1", "use2"],
  "dose_standard": "standard dose",
  "timing": "when to take",
  "timing_notes": "detailed timing guidance",
  "form_matters": true/false,
  "best_form": "best bioavailable form if form matters",
  "drug_interactions": ["interaction1"] or [],
  "contraindications": ["contraindication1"] or [],
  "time_to_benefit": "expected timeline",
  "cost_monthly": "estimated monthly cost range",
  "mechanism": "how it works (optional)",
  "specific_for": "specific conditions it's best for (optional)",
  "notes": "important clinical notes (optional)"
}

If this is not a real supplement or you cannot identify it, return null.`
  );
  const json = extractJson(text);
  if (json === 'null') return null;
  return JSON.parse(json);
}

export async function lookupSupplement(name: string) {
  return cachedLookup<SupplementInfo>('supplement', name, () => findSupplementStatic(name), () => lookupSupplementAI(name));
}

// ── SYMPTOM ROOT CAUSE LOOKUP ────────────────────────────────────────────────

function findSymptomStatic(symptom: string): SymptomInfo | null {
  const normalized = symptom.toLowerCase().replace(/[\s/]+/g, '_').replace(/[^a-z0-9_]/g, '');
  if (SYMPTOM_ROOT_CAUSES[normalized]) return SYMPTOM_ROOT_CAUSES[normalized];
  for (const [key, info] of Object.entries(SYMPTOM_ROOT_CAUSES)) {
    if (info.symptom.toLowerCase() === symptom.toLowerCase()) return info;
    if (key.includes(normalized) || normalized.includes(key)) return info;
  }
  return null;
}

async function lookupSymptomAI(symptom: string): Promise<SymptomInfo | null> {
  const text = await callClaude(
    'You are a functional medicine physician. Identify root causes of symptoms using a root-cause medicine approach. Focus on nutrient deficiencies, hormonal imbalances, medication side effects, and metabolic dysfunction. Always include ICD-10 codes and recommended lab tests.',
    `Provide a comprehensive root cause analysis for the symptom: "${symptom}"

Return ONLY a valid JSON object:
{
  "symptom": "symptom name",
  "root_causes": [
    {
      "cause": "root cause description",
      "probability": "high" | "moderate" | "low",
      "tests": ["test_key_1"],
      "icd10": "ICD-10 code"
    }
  ],
  "immediate_actions": ["action 1", "action 2"],
  "pattern_analysis": { "pattern_name": "description" } or null
}

Include 8-15 root causes ranked by probability. Include ICD-10 codes for each. For tests, use descriptive keys like "full_thyroid_panel", "iron_panel_complete", etc.
If this is not a recognizable symptom, return null.`
  );
  const json = extractJson(text);
  if (json === 'null') return null;
  return JSON.parse(json);
}

export async function lookupSymptom(symptom: string) {
  return cachedLookup<SymptomInfo>('symptom', symptom, () => findSymptomStatic(symptom), () => lookupSymptomAI(symptom));
}

// ── ICD-10 TEST JUSTIFICATION LOOKUP ─────────────────────────────────────────

function findTestStatic(testName: string): TestJustification | null {
  const normalized = testName.toLowerCase().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
  if (ICD10_TEST_JUSTIFICATIONS[normalized]) return ICD10_TEST_JUSTIFICATIONS[normalized];
  for (const [key, info] of Object.entries(ICD10_TEST_JUSTIFICATIONS)) {
    if (info.test_name.toLowerCase().includes(testName.toLowerCase())) return info;
    if (key.includes(normalized) || normalized.includes(key)) return info;
  }
  return null;
}

async function lookupTestAI(testName: string): Promise<TestJustification | null> {
  const text = await callClaude(
    'You are a medical billing and clinical documentation expert. Provide ICD-10 codes and medical necessity statements for lab test orders. Your justifications must be clinically accurate and formatted for insurance submission.',
    `Provide ICD-10 justification data for ordering: "${testName}"

Return ONLY a valid JSON object:
{
  "test_name": "full test name",
  "codes": [
    { "code": "ICD-10 code", "description": "code description" }
  ],
  "medical_necessity": "professional clinical justification statement for insurance (2-4 sentences)",
  "triggers": ["condition1", "symptom1"]
}

Include 3-6 ICD-10 codes that commonly justify this test. The medical necessity statement should be written in professional clinical language suitable for insurance pre-authorization.
If this is not a real lab test, return null.`
  );
  const json = extractJson(text);
  if (json === 'null') return null;
  return JSON.parse(json);
}

export async function lookupTest(testName: string) {
  return cachedLookup<TestJustification>('test', testName, () => findTestStatic(testName), () => lookupTestAI(testName));
}

// ── LAB MARKER LOOKUP ────────────────────────────────────────────────────────

function findLabMarkerStatic(markerName: string): OptimalRange | null {
  const normalized = markerName.toLowerCase().replace(/[\s-()]+/g, '_').replace(/[^a-z0-9_]/g, '');
  if (OPTIMAL_RANGES[normalized]) return OPTIMAL_RANGES[normalized];
  for (const info of Object.values(OPTIMAL_RANGES)) {
    if (info.name.toLowerCase() === markerName.toLowerCase()) return info;
  }
  return null;
}

async function lookupLabMarkerAI(markerName: string): Promise<OptimalRange | null> {
  const text = await callClaude(
    'You are a functional medicine lab interpretation expert. Provide optimal (not just standard) reference ranges for lab markers. Optimal ranges are based on the ranges associated with the best health outcomes, NOT the standard ranges based on sick populations.',
    `Provide optimal range data for the lab marker: "${markerName}"

Return ONLY a valid JSON object:
{
  "name": "marker name",
  "unit": "unit of measurement",
  "standard": { "low": number|null, "high": number|null },
  "optimal": { "low": number|null, "high": number|null },
  "category": "metabolic|cardiovascular|liver|kidney|thyroid|nutrients|hormones|inflammation|cbc|other",
  "priority": "critical|high|medium|low",
  "description": "clinical significance description",
  "root_causes_high": ["cause1"] or null,
  "root_causes_low": ["cause1"] or null,
  "symptoms_of_low": ["symptom1"] or null,
  "low_symptoms": ["symptom1"] or null,
  "high_symptoms": ["symptom1"] or null
}

Use null for unbounded ranges (e.g., markers with only an upper or lower limit).
If this is not a recognizable lab marker, return null.`
  );
  const json = extractJson(text);
  if (json === 'null') return null;
  return JSON.parse(json);
}

export async function lookupLabMarker(markerName: string) {
  return cachedLookup<OptimalRange>('lab_marker', markerName, () => findLabMarkerStatic(markerName), () => lookupLabMarkerAI(markerName));
}

// ── AUTOIMMUNE CASCADE LOOKUP ────────────────────────────────────────────────

export interface AutoimmuneAssociation {
  condition: string;
  probability: string;
  screening: string;
  symptoms_to_watch: string[];
}

export interface AutoimmuneCascade {
  condition: string;
  associated_conditions: AutoimmuneAssociation[];
  nutrient_concerns: string[];
  monitoring_schedule: Record<string, string>;
}

async function lookupAutoimmuneCascadeAI(condition: string): Promise<AutoimmuneCascade | null> {
  // Check static DB first
  try {
    const { AUTOIMMUNE_CASCADES } = await import('@/data/autoimmuneCascades');
    const normalized = condition.toLowerCase().replace(/[^a-z0-9]/g, '_');
    for (const [key, cascade] of Object.entries(AUTOIMMUNE_CASCADES)) {
      const c = JSON.parse(JSON.stringify(cascade)) as AutoimmuneCascade;
      if (key.includes(normalized) || c.condition.toLowerCase().includes(condition.toLowerCase())) {
        return c;
      }
    }
  } catch {
    // continue to AI
  }

  const text = await callClaude(
    'You are a clinical immunologist and autoimmune disease specialist. Provide comprehensive autoimmune cascade data — which autoimmune conditions are associated with elevated risk when a patient has a given autoimmune disorder. Include evidence-based probability estimates, screening recommendations, and monitoring schedules.',
    `Provide autoimmune cascade/association data for: "${condition}"

Return ONLY a valid JSON object:
{
  "condition": "primary condition name",
  "associated_conditions": [
    {
      "condition": "associated autoimmune condition",
      "probability": "risk description (e.g., '3-5x elevated risk', '10-15% of patients')",
      "screening": "recommended screening tests",
      "symptoms_to_watch": ["symptom1", "symptom2"]
    }
  ],
  "nutrient_concerns": ["nutrient1", "nutrient2"],
  "monitoring_schedule": {
    "test_name": "frequency (e.g., 'Every 6 months')"
  }
}

Include ALL known autoimmune associations. Be comprehensive — include even rare but clinically significant associations. Include 5-15 associated conditions with accurate probability data.
If this is not an autoimmune condition, return null.`
  );
  const json = extractJson(text);
  if (json === 'null') return null;
  return JSON.parse(json);
}

export async function lookupAutoimmuneCascade(condition: string) {
  return cachedLookup<AutoimmuneCascade>(
    'autoimmune',
    condition,
    () => null, // Static check is inside the AI function
    () => lookupAutoimmuneCascadeAI(condition)
  );
}

// ── Utility: check if something is in static DB ──────────────────────────────

export function isSupplementInStaticDB(name: string): boolean { return findSupplementStatic(name) !== null; }
export function isSymptomInStaticDB(symptom: string): boolean { return findSymptomStatic(symptom) !== null; }
export function isTestInStaticDB(testName: string): boolean { return findTestStatic(testName) !== null; }
export function isLabMarkerInStaticDB(markerName: string): boolean { return findLabMarkerStatic(markerName) !== null; }
