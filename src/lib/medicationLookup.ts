import { MEDICATION_DEPLETIONS } from '@/data/medicationDepletions';
import { lookupMedicationDepletions } from '@/lib/claude';
import type { MedicationInfo } from '@/types/medication.types';

/**
 * Unified medication lookup:
 * 1. Check static curated database (instant, no API call)
 * 2. Fall back to Claude AI for any medication not in static DB
 * 3. Results are cached in-memory and in Supabase for future lookups
 */

function normalizeKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function findInStaticDB(medicationName: string): MedicationInfo | null {
  const normalized = normalizeKey(medicationName);
  const nameLower = medicationName.toLowerCase().trim();

  // Direct key match
  if (MEDICATION_DEPLETIONS[normalized]) {
    return MEDICATION_DEPLETIONS[normalized];
  }

  // Search by generic_name or brand_names
  for (const info of Object.values(MEDICATION_DEPLETIONS)) {
    if (info.generic_name.toLowerCase() === nameLower) return info;
    if (info.brand_names.some(b => b.toLowerCase() === nameLower)) return info;
  }

  // Partial match — user might type "atorvastatin 10mg" or "lipitor 40mg"
  const firstWord = nameLower.split(/[\s\d]/)[0];
  if (firstWord.length >= 4) {
    for (const [key, info] of Object.entries(MEDICATION_DEPLETIONS)) {
      if (key.startsWith(firstWord)) return info;
      if (info.generic_name.toLowerCase().startsWith(firstWord)) return info;
      if (info.brand_names.some(b => b.toLowerCase().startsWith(firstWord))) return info;
    }
  }

  return null;
}

export interface MedicationLookupResult {
  info: MedicationInfo;
  source: 'static' | 'ai';
}

export async function lookupMedication(
  medicationName: string
): Promise<MedicationLookupResult | null> {
  if (!medicationName?.trim()) return null;

  // 1. Check static database first (free, instant, curated)
  const staticResult = findInStaticDB(medicationName);
  if (staticResult) {
    return { info: staticResult, source: 'static' };
  }

  // 2. Fall back to Claude AI (costs tokens, but covers every medication)
  const aiResult = await lookupMedicationDepletions(medicationName);
  if (aiResult) {
    return { info: aiResult, source: 'ai' };
  }

  return null;
}

/**
 * Get all static medication names for autocomplete.
 * Returns both generic names and brand names.
 */
export function getStaticMedicationNames(): string[] {
  const names: string[] = [];
  for (const info of Object.values(MEDICATION_DEPLETIONS)) {
    names.push(info.generic_name);
    names.push(...info.brand_names);
  }
  return names.sort();
}

/**
 * Check if a medication name is in the static database.
 */
export function isInStaticDB(medicationName: string): boolean {
  return findInStaticDB(medicationName) !== null;
}
