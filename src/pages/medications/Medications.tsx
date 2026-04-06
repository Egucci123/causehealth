import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Search, X, Pill, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { MEDICATION_DEPLETIONS } from '@/data/medicationDepletions';
import { lookupMedication as lookupMedicationAsync, isInStaticDB } from '@/lib/medicationLookup';
import type { Medication } from '@/types/user.types';
import type { MedicationInfo, MedicationDepletion } from '@/types/medication.types';

/* -- Helpers ---------------------------------------------------------------- */

const FREQUENCY_OPTIONS = [
  { value: 'once_daily', label: 'Once daily' },
  { value: 'twice_daily', label: 'Twice daily' },
  { value: 'three_times_daily', label: 'Three times daily' },
  { value: 'as_needed', label: 'As needed' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
];

function normalizeMedKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '');
}

function lookupMedicationSync(name: string): MedicationInfo | null {
  const key = normalizeMedKey(name);
  if (MEDICATION_DEPLETIONS[key]) return MEDICATION_DEPLETIONS[key];
  for (const [, info] of Object.entries(MEDICATION_DEPLETIONS)) {
    if (normalizeMedKey(info.generic_name) === key) return info;
    if (info.brand_names.some((b) => normalizeMedKey(b) === key)) return info;
  }
  return null;
}

function resolveMedication(
  name: string,
  resolvedMap: Map<string, MedicationInfo>,
): MedicationInfo | null {
  const cached = resolvedMap.get(name.toLowerCase().trim());
  if (cached) return cached;
  return lookupMedicationSync(name);
}

/* -- Component -------------------------------------------------------------- */

export default function Medications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [selectedMedIdx, setSelectedMedIdx] = useState(0);

  // Add / Edit form
  const [formName, setFormName] = useState('');
  const [formDose, setFormDose] = useState('');
  const [formFrequency, setFormFrequency] = useState('');
  const [formCondition, setFormCondition] = useState('');
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Async resolution cache
  const [resolvedMeds, setResolvedMeds] = useState<Map<string, MedicationInfo>>(new Map());
  const [lookingUp, setLookingUp] = useState<Set<string>>(new Set());

  /* -- Data loading --------------------------------------------------------- */

  useEffect(() => {
    if (user) loadMedications();
  }, [user]);

  useEffect(() => {
    for (const med of medications) {
      const key = med.name.toLowerCase().trim();
      if (resolvedMeds.has(key) || lookingUp.has(key) || isInStaticDB(med.name)) continue;
      setLookingUp((prev) => new Set(prev).add(key));
      lookupMedicationAsync(med.name).then((result) => {
        if (result) {
          setResolvedMeds((prev) => {
            const next = new Map(prev);
            next.set(key, result.info);
            return next;
          });
        }
        setLookingUp((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      });
    }
  }, [medications]);

  async function loadMedications() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (!error && data) setMedications(data as Medication[]);
    setLoading(false);
  }

  /* -- Form helpers --------------------------------------------------------- */

  const handleNameChange = useCallback((value: string) => {
    setFormName(value);
    if (value.length >= 2) {
      const normalized = normalizeMedKey(value);
      const matches = Object.entries(MEDICATION_DEPLETIONS)
        .filter(
          ([key, info]) =>
            key.includes(normalized) ||
            info.generic_name.toLowerCase().includes(normalized) ||
            info.brand_names.some((b) => b.toLowerCase().includes(normalized)),
        )
        .map(([, info]) => {
          const brands = info.brand_names.length ? ` (${info.brand_names.join(', ')})` : '';
          return `${info.generic_name}${brands}`;
        })
        .slice(0, 6);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  function selectSuggestion(suggestion: string) {
    setFormName(suggestion.split(' (')[0]);
    setShowSuggestions(false);
  }

  function resetForm() {
    setFormName('');
    setFormDose('');
    setFormFrequency('');
    setFormCondition('');
    setEditingMed(null);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function openEdit(med: Medication) {
    setFormName(med.name);
    setFormDose(med.dose || '');
    setFormFrequency(med.frequency || '');
    setFormCondition(med.prescribing_condition || '');
    setEditingMed(med);
    setShowAddModal(true);
  }

  async function handleSave() {
    if (!user || !formName.trim()) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        name: formName.trim(),
        dose: formDose.trim() || null,
        frequency: formFrequency || null,
        prescribing_condition: formCondition.trim() || null,
        is_active: true,
      };
      if (editingMed) {
        const { error } = await supabase.from('medications').update(payload).eq('id', editingMed.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('medications').insert(payload);
        if (error) throw error;
      }
      await loadMedications();
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save medication:', err);
      alert('Failed to save medication. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    const { error } = await supabase.from('medications').update({ is_active: false }).eq('id', id);
    if (error) {
      console.error('Failed to remove medication:', error);
      alert('Failed to remove medication. Please try again.');
      return;
    }
    setMedications((prev) => prev.filter((m) => m.id !== id));
  }

  /* -- Derived data --------------------------------------------------------- */

  const medsWithDepletions = useMemo(() => {
    return medications
      .map((med) => ({ med, info: resolveMedication(med.name, resolvedMeds) }))
      .filter((x): x is { med: Medication; info: MedicationInfo } => x.info !== null && x.info.depletes.length > 0);
  }, [medications, resolvedMeds]);

  const activeMed = medsWithDepletions[selectedMedIdx] ?? null;

  const primaryDepletion: MedicationDepletion | null = activeMed
    ? activeMed.info.depletes.reduce((worst, d) => {
        const sev = { critical: 4, high: 3, moderate: 2, low: 1 };
        return (sev[d.severity] || 0) > (sev[worst.severity] || 0) ? d : worst;
      }, activeMed.info.depletes[0])
    : null;

  const depletionPreview = useMemo(() => {
    if (formName.length < 3) return null;
    return lookupMedicationSync(formName);
  }, [formName]);

  /* -- Skeleton ------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] px-5 pt-6 pb-24 font-['Manrope',sans-serif]">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[#F5F3F0] rounded-2xl w-2/3" />
          <div className="h-5 bg-[#F5F3F0] rounded-xl w-full" />
          <div className="h-48 bg-[#F5F3F0] rounded-[32px]" />
          <div className="h-40 bg-[#F5F3F0] rounded-[32px]" />
        </div>
      </div>
    );
  }

  /* -- Empty state ---------------------------------------------------------- */

  if (medications.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] px-5 pt-6 pb-24 font-['Manrope',sans-serif]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-5 h-5 text-[#1A3C34]" />
            </button>
            <span className="font-['Fraunces',serif] text-lg font-semibold text-[#1A3C34]">
              CauseHealth.
            </span>
          </div>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-1.5 bg-[#F5F3F0] rounded-xl px-5 py-3 text-[#1A3C34] uppercase tracking-[0.15em] font-bold text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Data
          </button>
        </div>

        <div className="mt-4">
          <h1 className="font-['Fraunces',serif] italic text-4xl text-[#1A3C34]">
            Medications
          </h1>
          <p className="text-sm text-[#414844] mt-3 leading-relaxed max-w-sm">
            Track your prescriptions and discover hidden nutrient depletions.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center text-center">
          <div className="relative w-20 h-20 flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#EAE8E5] flex items-center justify-center">
              <Pill className="w-7 h-7 text-[#414844]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#F5F3F0] flex items-center justify-center border-2 border-[#FAF9F5]">
              <Plus className="w-4 h-4 text-[#414844]" />
            </div>
          </div>
          <h2 className="font-['Fraunces',serif] italic text-2xl text-[#1A3C34]">
            No medications tracked
          </h2>
          <p className="text-sm text-[#414844] mt-3 leading-relaxed max-w-[280px]">
            Add your current medications to discover nutrient depletions and interactions.
          </p>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="w-full mt-8 bg-[#1A3C34] text-white rounded-xl py-4 uppercase tracking-[0.15em] font-bold text-sm"
          >
            Add Your First Medication
          </button>
        </div>

        {/* Philosophy Card */}
        <div className="mt-8 bg-[#F5F3F0] rounded-[32px] p-8">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A3C34]">
            Philosophy
          </span>
          <h3 className="font-['Fraunces',serif] italic text-2xl text-[#1A3C34] mt-3">
            Root Cause Medicine
          </h3>
          <p className="text-sm text-[#414844] mt-3 leading-relaxed">
            Every medication has downstream effects on your nutrient status. We connect your prescriptions to known nutrient depletions so you can proactively supplement what your body is losing.
          </p>
        </div>

        {/* Warning Card */}
        <div className="mt-4 bg-[#F5F3F0] rounded-[32px] p-8">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#BA1A1A]">
            Warning
          </span>
          <h3 className="font-['Fraunces',serif] italic text-xl text-[#1A3C34] mt-3">
            Drug Interaction Screening
          </h3>
          <p className="text-sm text-[#414844] mt-3 leading-relaxed">
            Our automated screening cross-references your medications against known interactions and contraindications. Always consult your prescribing physician before making changes.
          </p>
        </div>

        <AddMedicationModal
          open={showAddModal}
          onClose={() => { setShowAddModal(false); resetForm(); }}
          formName={formName}
          formDose={formDose}
          formFrequency={formFrequency}
          formCondition={formCondition}
          onNameChange={handleNameChange}
          onDoseChange={setFormDose}
          onFrequencyChange={setFormFrequency}
          onConditionChange={setFormCondition}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSelectSuggestion={selectSuggestion}
          onSave={handleSave}
          saving={saving}
          depletionPreview={depletionPreview}
          editingMed={editingMed}
        />
      </div>
    );
  }

  /* -- Insight / List View -------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#FAF9F5] px-5 pt-6 pb-24 font-['Manrope',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#1A3C34]" />
          </button>
          <span className="font-['Fraunces',serif] text-lg font-semibold text-[#1A3C34]">
            CauseHealth.
          </span>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center gap-1.5 bg-[#F5F3F0] rounded-xl px-5 py-3 text-[#1A3C34] uppercase tracking-[0.15em] font-bold text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Data
        </button>
      </div>

      <div className="mt-4">
        <h1 className="font-['Fraunces',serif] italic text-4xl text-[#1A3C34]">
          Medications
        </h1>
        <p className="text-sm text-[#414844] mt-3 leading-relaxed max-w-sm">
          Track your prescriptions and discover hidden nutrient depletions.
        </p>
      </div>

      {activeMed && primaryDepletion ? (
        /* -- INSIGHT VIEW ----------------------------------------------------- */
        <div className="mt-6 space-y-5">
          {/* Multi-med selector pills */}
          {medsWithDepletions.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {medsWithDepletions.map((m, i) => (
                <button
                  key={m.med.id}
                  onClick={() => setSelectedMedIdx(i)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                    i === selectedMedIdx
                      ? 'bg-[#1A3C34] text-white'
                      : 'bg-white text-[#414844] shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)]'
                  }`}
                >
                  {m.info.generic_name}
                </button>
              ))}
            </div>
          )}

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-['Fraunces',serif] italic text-3xl text-[#1A3C34] leading-tight">
              Your medication is causing your symptoms.
            </h2>
            <p className="text-sm text-[#414844] mt-3 leading-relaxed">
              Our analysis shows a direct correlation between your{' '}
              {activeMed.info.generic_name} therapy and recent {primaryDepletion.symptoms_of_depletion?.[0]?.toLowerCase() || 'nutrient depletion'}.
            </p>
          </motion.div>

          {/* Active Prescription Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-[32px] shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] p-8"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844]/60">
              Active Prescription
            </span>
            <h2 className="font-['Fraunces',serif] italic text-2xl text-[#1A3C34] mt-2 capitalize">
              {activeMed.info.generic_name}
            </h2>
            <p className="text-xs text-[#414844] mt-1">
              {activeMed.info.brand_names.length > 0 && (
                <span className="mr-3">{activeMed.info.brand_names[0]}</span>
              )}
              {activeMed.med.dose && <span>{activeMed.med.dose}</span>}
              {activeMed.med.frequency && (
                <span className="ml-2">
                  {FREQUENCY_OPTIONS.find((o) => o.value === activeMed.med.frequency)?.label}
                </span>
              )}
            </p>

            {primaryDepletion.severity === 'critical' || primaryDepletion.severity === 'high' ? (
              <span className="inline-block mt-3 bg-[#FFDAD6] text-[#BA1A1A] rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold">
                High Depletion Risk
              </span>
            ) : (
              <span className="inline-block mt-3 bg-[#D4EDDA] text-[#1A3C34] rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold">
                Moderate Depletion Risk
              </span>
            )}

            {/* Depletion Pathway */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F3F0] flex items-center justify-center">
                <Pill className="w-6 h-6 text-[#1A3C34]" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-[2px] bg-[#86AF99]" />
                <span className="text-[9px] text-[#414844]/60 mt-1 uppercase tracking-[0.2em]">blocks</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#F5F3F0] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1A3C34]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-[2px] bg-[#FFDAD6]" />
                <span className="text-[9px] text-[#414844]/60 mt-1 uppercase tracking-[0.2em]">depletes</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFDAD6]/40 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#BA1A1A]" />
              </div>
            </div>

            {/* Bioavailability Bar */}
            <div className="mt-6">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844]/60">
                {primaryDepletion.nutrient} Bioavailability
              </span>
              <div className="mt-2 h-2 rounded-full overflow-hidden flex">
                <div className="w-[42%] bg-[#BA1A1A]/20 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#BA1A1A] shadow-sm" />
                </div>
                <div className="flex-1 bg-[#86AF99]/30" />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-[#BA1A1A] font-semibold">Deficient</span>
                <span className="text-[10px] text-[#1A3C34] font-semibold">Optimal</span>
              </div>
              <p className="text-sm font-semibold text-[#BA1A1A] mt-2">-42% vs Baseline</p>
            </div>

            {/* All depletions list */}
            <div className="mt-5 space-y-2">
              {activeMed.info.depletes.map((dep) => (
                <div key={dep.nutrient} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-[#1A3C34]">{dep.nutrient}</span>
                  <span
                    className={`text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full ${
                      dep.severity === 'critical' || dep.severity === 'high'
                        ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                        : 'bg-[#D4EDDA] text-[#1A3C34]'
                    }`}
                  >
                    {dep.severity}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Intelligence Insight Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A3C34] rounded-[32px] p-8 text-white"
          >
            <p className="font-['Fraunces',serif] italic text-xl leading-relaxed">
              {primaryDepletion.mechanism}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-white/10 rounded-2xl p-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">
                  Impact
                </span>
                <p className="text-sm font-semibold mt-1">
                  {primaryDepletion.symptoms_of_depletion?.[0] || 'Nutrient Depletion'}
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">
                  Risk
                </span>
                <p className="text-sm font-semibold mt-1">
                  {activeMed.info.muscle_pain_risk
                    ? 'Statin Myopathy'
                    : primaryDepletion.severity === 'critical'
                    ? 'Severe Deficiency'
                    : 'Ongoing Depletion'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Protocol Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#F5F3F0] rounded-[32px] p-8"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A3C34]">
              Protocol Recommendation
            </span>
            <h3 className="font-['Fraunces',serif] italic text-xl text-[#1A3C34] mt-2">
              {primaryDepletion.recommended_supplement.split('(')[0].trim()}
            </h3>
            <p className="text-sm text-[#414844] mt-2 leading-relaxed">
              {primaryDepletion.recommended_supplement.includes('(')
                ? primaryDepletion.recommended_supplement.split('(')[1]?.replace(')', '') + '.'
                : 'Taken with food for maximum absorption.'}
            </p>

            {primaryDepletion.important_note && (
              <p className="text-xs text-[#414844]/70 mt-3 italic">
                {primaryDepletion.important_note}
              </p>
            )}

            <Link
              to="/app/wellness"
              className="w-full mt-5 bg-[#1A3C34] text-white rounded-xl py-4 text-sm font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2"
            >
              View Full Wellness Plan
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* Other medications without insight */}
          {medications
            .filter((m) => !medsWithDepletions.some((md) => md.med.id === m.id))
            .map((med) => {
              const isLooking = lookingUp.has(med.name.toLowerCase().trim());
              return (
                <div
                  key={med.id}
                  className="bg-white rounded-[32px] shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] p-8 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#1A3C34] capitalize">{med.name}</p>
                    <p className="text-xs text-[#414844]">
                      {med.dose}{med.frequency && ` \u2022 ${FREQUENCY_OPTIONS.find((o) => o.value === med.frequency)?.label || med.frequency}`}
                    </p>
                    {isLooking && (
                      <p className="text-[10px] text-[#1A3C34] mt-1">Looking up depletions...</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(med.id)}
                    className="text-[#BA1A1A]/60 hover:text-[#BA1A1A] p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

          {/* Manage medications link */}
          <div className="text-center pt-2">
            {medications.map((med) => (
              <div key={med.id} className="inline-flex gap-2 items-center">
                <button
                  onClick={() => openEdit(med)}
                  className="text-xs text-[#1A3C34] underline underline-offset-2"
                >
                  Edit {med.name}
                </button>
                <button
                  onClick={() => handleRemove(med.id)}
                  className="text-xs text-[#BA1A1A]/60"
                >
                  Remove
                </button>
                <span className="text-[#414844]/30 mx-1">|</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* -- LIST VIEW (no depletions found yet) ------------------------------ */
        <div className="mt-6 space-y-4">
          <p className="text-sm text-[#414844]">
            {medications.length} active medication{medications.length !== 1 ? 's' : ''} tracked.
          </p>
          {medications.map((med) => {
            const info = resolveMedication(med.name, resolvedMeds);
            const isLooking = lookingUp.has(med.name.toLowerCase().trim());
            return (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] p-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-['Fraunces',serif] italic text-lg text-[#1A3C34] capitalize">
                      {med.name}
                    </h3>
                    <p className="text-xs text-[#414844] mt-1">
                      {med.dose}
                      {med.frequency && ` \u2022 ${FREQUENCY_OPTIONS.find((o) => o.value === med.frequency)?.label || med.frequency}`}
                      {med.prescribing_condition && ` \u2022 for ${med.prescribing_condition}`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(med)} className="p-2 text-[#414844]/60">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button onClick={() => handleRemove(med.id)} className="p-2 text-[#BA1A1A]/60">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {info && info.depletes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {info.depletes.map((dep) => (
                      <span
                        key={dep.nutrient}
                        className={`text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full ${
                          dep.severity === 'critical' || dep.severity === 'high'
                            ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                            : 'bg-[#D4EDDA] text-[#1A3C34]'
                        }`}
                      >
                        {dep.nutrient}
                      </span>
                    ))}
                  </div>
                )}
                {isLooking && (
                  <p className="text-[10px] text-[#1A3C34] mt-3">Looking up depletion data...</p>
                )}
                {!info && !isLooking && (
                  <p className="text-xs text-[#414844]/50 mt-3">No known depletions</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Philosophy Card - always shown when meds exist */}
      <div className="mt-8 bg-[#F5F3F0] rounded-[32px] p-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A3C34]">
          Philosophy
        </span>
        <h3 className="font-['Fraunces',serif] italic text-2xl text-[#1A3C34] mt-3">
          Root Cause Medicine
        </h3>
        <p className="text-sm text-[#414844] mt-3 leading-relaxed">
          Every medication has downstream effects on your nutrient status. We connect your prescriptions to known nutrient depletions so you can proactively supplement what your body is losing.
        </p>
      </div>

      {/* Warning Card */}
      <div className="mt-4 bg-[#F5F3F0] rounded-[32px] p-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#BA1A1A]">
          Warning
        </span>
        <h3 className="font-['Fraunces',serif] italic text-xl text-[#1A3C34] mt-3">
          Drug Interaction Screening
        </h3>
        <p className="text-sm text-[#414844] mt-3 leading-relaxed">
          Our automated screening cross-references your medications against known interactions and contraindications. Always consult your prescribing physician before making changes.
        </p>
      </div>

      {/* Add / Edit Medication Modal */}
      <AddMedicationModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); resetForm(); }}
        formName={formName}
        formDose={formDose}
        formFrequency={formFrequency}
        formCondition={formCondition}
        onNameChange={handleNameChange}
        onDoseChange={setFormDose}
        onFrequencyChange={setFormFrequency}
        onConditionChange={setFormCondition}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onSelectSuggestion={selectSuggestion}
        onSave={handleSave}
        saving={saving}
        depletionPreview={depletionPreview}
        editingMed={editingMed}
      />
    </div>
  );
}

/* ========================================================================== */
/* -- Add Medication Modal                                                     */
/* ========================================================================== */

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  formName: string;
  formDose: string;
  formFrequency: string;
  formCondition: string;
  onNameChange: (v: string) => void;
  onDoseChange: (v: string) => void;
  onFrequencyChange: (v: string) => void;
  onConditionChange: (v: string) => void;
  suggestions: string[];
  showSuggestions: boolean;
  onSelectSuggestion: (s: string) => void;
  onSave: () => void;
  saving: boolean;
  depletionPreview: MedicationInfo | null;
  editingMed: Medication | null;
}

function AddMedicationModal({
  open,
  onClose,
  formName,
  formDose,
  formFrequency,
  formCondition,
  onNameChange,
  onDoseChange,
  onFrequencyChange,
  onConditionChange,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  onSave,
  saving,
  depletionPreview,
  editingMed,
}: AddModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-t-[32px] p-6 pb-28 max-h-[85vh] overflow-y-auto font-['Manrope',sans-serif]"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-[#414844]/20 mx-auto mb-5" />

        <h2 className="font-['Fraunces',serif] italic text-xl text-[#1A3C34] mb-5">
          {editingMed ? 'Edit Medication' : 'Add Medication'}
        </h2>

        <div className="space-y-4">
          {/* Medication name with autocomplete */}
          <div className="relative">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844] mb-2 block">
              Medication Name
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#414844]/40" />
              <input
                type="text"
                value={formName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Start typing a medication name..."
                className="w-full bg-[#F5F3F0] rounded-xl border border-[#C1C8C2]/20 pl-11 pr-4 py-3.5 text-sm text-[#1A3C34] placeholder:text-[#414844]/40 outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
                autoFocus
              />
            </div>
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-10 top-full mt-1 w-full bg-white rounded-2xl shadow-[0_8px_32px_-4px_rgba(27,28,26,0.12)] overflow-hidden"
                >
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      className="w-full text-left px-4 py-3 text-sm text-[#1A3C34] hover:bg-[#F5F3F0] transition-colors"
                      onClick={() => onSelectSuggestion(s)}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dose & Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844] mb-2 block">
                Dose
              </label>
              <input
                type="text"
                value={formDose}
                onChange={(e) => onDoseChange(e.target.value)}
                placeholder="e.g., 20mg"
                className="w-full bg-[#F5F3F0] rounded-xl border border-[#C1C8C2]/20 px-4 py-3.5 text-sm text-[#1A3C34] placeholder:text-[#414844]/40 outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844] mb-2 block">
                Frequency
              </label>
              <select
                value={formFrequency}
                onChange={(e) => onFrequencyChange(e.target.value)}
                className="w-full bg-[#F5F3F0] rounded-xl border border-[#C1C8C2]/20 px-4 py-3.5 text-sm text-[#1A3C34] outline-none focus:ring-2 focus:ring-[#1A3C34]/20 appearance-none"
              >
                <option value="">Select...</option>
                {FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844] mb-2 block">
              Prescribing Condition
            </label>
            <input
              type="text"
              value={formCondition}
              onChange={(e) => onConditionChange(e.target.value)}
              placeholder="What is this prescribed for?"
              className="w-full bg-[#F5F3F0] rounded-xl border border-[#C1C8C2]/20 px-4 py-3.5 text-sm text-[#1A3C34] placeholder:text-[#414844]/40 outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
            />
          </div>

          {/* Depletion preview */}
          <AnimatePresence>
            {depletionPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#F5F3F0] rounded-2xl p-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1A3C34]">
                    Known Depletions for {depletionPreview.generic_name}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {depletionPreview.depletes.map((dep) => (
                      <span
                        key={dep.nutrient}
                        className={`text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full ${
                          dep.severity === 'critical' || dep.severity === 'high'
                            ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                            : 'bg-[#D4EDDA] text-[#1A3C34]'
                        }`}
                      >
                        {dep.nutrient} ({dep.severity})
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#414844] bg-[#F5F3F0]"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!formName.trim() || saving}
              className="flex-1 rounded-xl py-4 text-sm font-bold uppercase tracking-[0.15em] text-white bg-[#1A3C34] disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingMed ? 'Save Changes' : 'Add Medication'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
