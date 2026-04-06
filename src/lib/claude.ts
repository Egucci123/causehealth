import { CAUSEHEALTH_SYSTEM_PROMPT } from '@/prompts/systemPrompt';
import { OPTIMAL_RANGES } from '@/data/optimalRanges';
import type { LabValue, LabAnalysis, ExtractedLabValue } from '@/types/lab.types';
import type { Profile, Medication, Symptom } from '@/types/user.types';
import type { MedicationInfo } from '@/types/medication.types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: 'text'; text: string }>;
}

async function callClaude(
  system: string,
  messages: ClaudeMessage[],
  maxTokens = 4096
): Promise<string> {
  if (!API_KEY || API_KEY === 'PASTE_YOUR_ANTHROPIC_API_KEY_HERE') {
    throw new Error('Anthropic API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file.');
  }

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
      messages,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errorBody}`);
  }

  const data: ClaudeResponse = await response.json();
  return data.content[0]?.text ?? '';
}

function formatLabValuesForPrompt(labValues: LabValue[]): string {
  return labValues
    .map((lv) => {
      const optRange = Object.values(OPTIMAL_RANGES).find(
        (r) => r.name.toLowerCase() === lv.marker_name.toLowerCase()
      );
      const optInfo = optRange
        ? ` | Optimal: ${optRange.optimal.low ?? '—'}–${optRange.optimal.high ?? '—'} ${optRange.unit}`
        : '';
      return `- ${lv.marker_name}: ${lv.value} ${lv.unit ?? ''} (Standard: ${lv.standard_low ?? '—'}–${lv.standard_high ?? '—'}, Flag: ${lv.standard_flag ?? 'none'}${optInfo})`;
    })
    .join('\n');
}

function formatProfileForPrompt(profile: Profile | null): string {
  if (!profile) return 'No profile information available.';
  const parts: string[] = [];
  if (profile.first_name) parts.push(`Name: ${profile.first_name} ${profile.last_name ?? ''}`);
  if (profile.sex) parts.push(`Sex: ${profile.sex}`);
  if (profile.date_of_birth) {
    const age = Math.floor(
      (Date.now() - new Date(profile.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    parts.push(`Age: ${age}`);
  }
  if (profile.height_cm) parts.push(`Height: ${profile.height_cm} cm`);
  if (profile.weight_kg) parts.push(`Weight: ${profile.weight_kg} kg`);
  return parts.join('\n') || 'No profile information available.';
}

function formatMedicationsForPrompt(medications: Medication[]): string {
  if (!medications.length) return 'No medications reported.';
  return medications
    .filter((m) => m.is_active)
    .map((m) => `- ${m.name}${m.dose ? ` ${m.dose}` : ''}${m.frequency ? ` (${m.frequency})` : ''}${m.prescribing_condition ? ` — for ${m.prescribing_condition}` : ''}`)
    .join('\n');
}

function formatSymptomsForPrompt(symptoms: Symptom[]): string {
  if (!symptoms.length) return 'No symptoms reported.';
  return symptoms
    .map((s) => `- ${s.symptom} (severity: ${s.severity}/10)${s.duration ? `, duration: ${s.duration}` : ''}`)
    .join('\n');
}

function extractJsonFromResponse(text: string): string {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Try to find raw JSON object/array
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) return jsonMatch[1].trim();

  return text;
}

// ── PUBLIC API ───────────────────────────────────────────────────────────────

export async function analyzeLabs(
  labValues: LabValue[],
  userProfile: Profile | null,
  medications: Medication[]
): Promise<LabAnalysis> {
  try {
    const userMessage = `Analyze the following lab results. Return ONLY a valid JSON object matching the lab analysis schema described in your instructions.

## Patient Profile
${formatProfileForPrompt(userProfile)}

## Active Medications
${formatMedicationsForPrompt(medications)}

## Lab Values
${formatLabValuesForPrompt(labValues)}

Respond with the JSON object only, no additional text.`;

    const responseText = await callClaude(CAUSEHEALTH_SYSTEM_PROMPT, [
      { role: 'user', content: userMessage },
    ]);

    const jsonStr = extractJsonFromResponse(responseText);
    const analysis: LabAnalysis = JSON.parse(jsonStr);
    return analysis;
  } catch (error) {
    console.error('analyzeLabs error:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to analyze labs: ${error.message}`
        : 'Failed to analyze labs. Please try again.'
    );
  }
}

export async function generateWellnessPlan(
  userProfile: Profile | null,
  labHistory: LabValue[][],
  medications: Medication[],
  symptoms: Symptom[]
): Promise<Record<string, unknown>> {
  try {
    const labSections = labHistory
      .map(
        (draw, i) =>
          `### Lab Draw ${i + 1}\n${formatLabValuesForPrompt(draw)}`
      )
      .join('\n\n');

    const userMessage = `Generate a comprehensive 90-day wellness plan based on the following information. Return ONLY a valid JSON object matching the wellness plan schema described in your instructions.

## Patient Profile
${formatProfileForPrompt(userProfile)}

## Active Medications
${formatMedicationsForPrompt(medications)}

## Current Symptoms
${formatSymptomsForPrompt(symptoms)}

## Lab History
${labSections}

Create a phased 90-day plan with supplements, dietary changes, lifestyle modifications, and a monitoring schedule. Return JSON only.`;

    const responseText = await callClaude(
      CAUSEHEALTH_SYSTEM_PROMPT,
      [{ role: 'user', content: userMessage }],
      8192
    );

    const jsonStr = extractJsonFromResponse(responseText);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('generateWellnessPlan error:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to generate wellness plan: ${error.message}`
        : 'Failed to generate wellness plan. Please try again.'
    );
  }
}

export async function generateDoctorPrepDocument(
  userProfile: Profile | null,
  labHistory: LabValue[][],
  medications: Medication[],
  symptoms: Symptom[],
  appointmentInfo: { date?: string; provider?: string; reason?: string }
): Promise<Record<string, unknown>> {
  try {
    const labSections = labHistory
      .map(
        (draw, i) =>
          `### Lab Draw ${i + 1}\n${formatLabValuesForPrompt(draw)}`
      )
      .join('\n\n');

    const apptInfo = [
      appointmentInfo.date ? `Date: ${appointmentInfo.date}` : '',
      appointmentInfo.provider ? `Provider: ${appointmentInfo.provider}` : '',
      appointmentInfo.reason ? `Reason: ${appointmentInfo.reason}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const userMessage = `Generate a doctor preparation document for an upcoming appointment. Return ONLY a valid JSON object matching the doctor prep document schema described in your instructions.

## Patient Profile
${formatProfileForPrompt(userProfile)}

## Appointment Information
${apptInfo || 'No specific appointment details provided.'}

## Active Medications
${formatMedicationsForPrompt(medications)}

## Current Symptoms
${formatSymptomsForPrompt(symptoms)}

## Lab History
${labSections}

Create a comprehensive, professional document the patient can bring to their doctor. Include key findings with supporting data, requested tests with ICD-10 codes and clinical justification, medication review questions, and discussion points. Return JSON only.`;

    const responseText = await callClaude(
      CAUSEHEALTH_SYSTEM_PROMPT,
      [{ role: 'user', content: userMessage }],
      8192
    );

    const jsonStr = extractJsonFromResponse(responseText);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('generateDoctorPrepDocument error:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to generate doctor prep document: ${error.message}`
        : 'Failed to generate doctor prep document. Please try again.'
    );
  }
}

// ── MEDICATION DEPLETION AI LOOKUP ─────────────────────────────────────────

const medicationCache = new Map<string, MedicationInfo | null>();

export async function lookupMedicationDepletions(
  medicationName: string
): Promise<MedicationInfo | null> {
  const key = medicationName.toLowerCase().trim();

  // Check in-memory cache
  if (medicationCache.has(key)) {
    return medicationCache.get(key)!;
  }

  // Check Supabase cache
  try {
    const { supabase } = await import('@/lib/supabase');
    const { data } = await supabase
      .from('medication_cache')
      .select('data')
      .eq('medication_key', key)
      .single();
    if (data?.data) {
      const parsed = data.data as MedicationInfo;
      medicationCache.set(key, parsed);
      return parsed;
    }
  } catch {
    // Table might not exist yet — that's fine, fall through to AI
  }

  // Query Claude
  try {
    const responseText = await callClaude(
      `You are a clinical pharmacology expert. Provide accurate drug-nutrient depletion data for medications. Only include depletions that have published clinical evidence (strong or moderate). Do not speculate or include theoretical depletions without evidence.`,
      [{
        role: 'user',
        content: `Provide nutrient depletion data for the medication: "${medicationName}"

Return ONLY a valid JSON object with this exact structure:
{
  "generic_name": "the generic drug name",
  "brand_names": ["brand name 1", "brand name 2"],
  "depletes": [
    {
      "nutrient": "nutrient name",
      "severity": "critical" | "high" | "moderate" | "low",
      "mechanism": "how the drug depletes this nutrient",
      "symptoms_of_depletion": ["symptom1", "symptom2"],
      "recommended_supplement": "specific supplement with dose and form",
      "evidence": "strong" | "moderate" | "emerging"
    }
  ],
  "liver_impact": "none" | "low" | "moderate" | "high" | null,
  "liver_notes": "string or null",
  "monitoring_required": ["test1", "test2"] or null,
  "notes": "any important clinical notes" or null,
  "drug_interactions": ["interaction1"] or null
}

If this medication has NO known nutrient depletions, return the object with an empty "depletes" array.
If this is not a real medication or you cannot identify it, return null.`
      }],
      2048
    );

    const jsonStr = extractJsonFromResponse(responseText);
    if (jsonStr === 'null' || jsonStr.trim() === '') {
      medicationCache.set(key, null);
      return null;
    }

    const info: MedicationInfo = JSON.parse(jsonStr);
    medicationCache.set(key, info);

    // Persist to Supabase cache (fire-and-forget)
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('medication_cache').upsert({
        medication_key: key,
        medication_name: medicationName,
        data: info,
        created_at: new Date().toISOString(),
      });
    } catch {
      // Cache write failure is non-critical
    }

    return info;
  } catch (error) {
    console.error('lookupMedicationDepletions error:', error);
    return null;
  }
}

export async function extractLabsWithAI(text: string): Promise<ExtractedLabValue[]> {
  try {
    const userMessage = `Extract all lab values from the following text. The text comes from a PDF lab report. Return ONLY a valid JSON array of objects with this exact structure:

[
  {
    "marker_name": "string - the common name of the lab marker",
    "value": number,
    "unit": "string",
    "standard_low": number | null,
    "standard_high": number | null,
    "flag": "normal" | "low" | "high" | "critical_low" | "critical_high",
    "category": "metabolic" | "cardiovascular" | "liver" | "kidney" | "thyroid" | "nutrients" | "hormones" | "inflammation" | "cbc" | "other",
    "draw_date": "string (YYYY-MM-DD) | null"
  }
]

Important:
- Extract ALL lab values found in the text
- Normalize marker names to common clinical names
- If a reference range is provided, use it for standard_low/standard_high
- If the lab report includes a collection date, include it as draw_date
- If a value is flagged as H, High, L, Low, etc., set the flag accordingly
- Return the JSON array only, no additional text

## Lab Report Text:
${text}`;

    const responseText = await callClaude(
      'You are a clinical lab report parser. Extract structured lab data from raw text. Be thorough and accurate. Return only valid JSON.',
      [{ role: 'user', content: userMessage }],
      4096
    );

    const jsonStr = extractJsonFromResponse(responseText);
    const extracted: ExtractedLabValue[] = JSON.parse(jsonStr);
    return extracted;
  } catch (error) {
    console.error('extractLabsWithAI error:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to extract lab values: ${error.message}`
        : 'Failed to extract lab values from PDF. Please try again or enter values manually.'
    );
  }
}
