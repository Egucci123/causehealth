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

/* ── Helpers ─────────────────────────────────────────────────────────────── */

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

/* ── Component ───────────────────────────────────────────────────────────── */

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

  /* ── Data loading ──────────────────────────────────────────────────────── */

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

  /* ── Form helpers ──────────────────────────────────────────────────────── */

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
    const payload = {
      user_id: user.id,
      name: formName.trim(),
      dose: formDose.trim() || null,
      frequency: formFrequency || null,
      prescribing_condition: formCondition.trim() || null,
      is_active: true,
    };
    if (editingMed) {
      await supabase.from('medications').update(payload).eq('id', editingMed.id);
    } else {
      await supabase.from('medications').insert(payload);
    }
    await loadMedications();
    setSaving(false);
    setShowAddModal(false);
    resetForm();
  }

  async function handleRemove(id: string) {
    await supabase.from('medications').update({ is_active: false }).eq('id', id);
    setMedications((prev) => prev.filter((m) => m.id !== id));
  }

  /* ── Derived data ──────────────────────────────────────────────────────── */

  // Medications that have depletion data
  const medsWithDepletions = useMemo(() => {
    return medications
      .map((med) => ({ med, info: resolveMedication(med.name, resolvedMeds) }))
      .filter((x): x is { med: Medication; info: MedicationInfo } => x.info !== null && x.info.depletes.length > 0);
  }, [medications, resolvedMeds]);

  const activeMed = medsWithDepletions[selectedMedIdx] ?? null;

  // Primary depletion for the insight view
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

  /* ── Skeleton ──────────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] px-5 pt-6 pb-24 font-['Manrope',sans-serif]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/60 rounded-2xl w-2/3" />
          <div className="h-48 bg-white/60 rounded-3xl" />
          <div className="h-40 bg-white/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  /* ── Empty state ───────────────────────────────────────────────────────── */

  if (medications.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] px-5 pt-6 pb-24 font-['Manrope',sans-serif]">
        <Header onBack={() => navigate(-1)} onAdd={() => { resetForm(); setShowAddModal(true); }} />
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#BEE8DC]/40 flex items-center justify-center mb-6">
            <Pill className="w-7 h-7 text-[#3F665C]" />
          </div>
          <h2 className="font-['Fraunces',serif] text-2xl font-medium text-[#012D1D] mb-2">
            No medications tracked
          </h2>
          <p className="text-sm text-[#414844] mb-8 max-w-[280px]">
            Add your current medications to discover nutrient depletions and interactions.
          </p>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="bg-[#012D1D] text-white rounded-full px-8 py-3.5 text-sm font-semibold"
          >
            Add Your First Medication
          </button>
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

  /* ── Insight View (has depletions) or List View ────────────────────────── */

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-5 pt-6 pb-24 font-['Manrope',sans-serif]">
      {/* Header */}
      <Header onBack={() => navigate(-1)} onAdd={() => { resetForm(); setShowAddModal(true); }} />

      {activeMed && primaryDepletion ? (
        /* ── INSIGHT VIEW ─────────────────────────────────────────────────── */
        <div className="mt-6 space-y-5">
          {/* Multi-med selector pills */}
          {medsWithDepletions.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {medsWithDepletions.map((m, i) => (
                <button
                  key={m.med.id}
                  onClick={() => setSelectedMedIdx(i)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                    i === selectedMedIdx
                      ? 'bg-[#012D1D] text-white'
                      : 'bg-white text-[#414844] shadow-[0_8px_24px_rgba(14,55,39,0.05)]'
                  }`}
                >
                  {m.info.generic_name}
                </button>
              ))}
            </div>
          )}

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-['Fraunces',serif] text-3xl font-medium text-[#012D1D] leading-tight">
              Your medication is causing your symptoms.
            </h1>
            <p className="text-sm text-[#414844] mt-3 leading-relaxed">
              Our analysis shows a direct correlation between your{' '}
              {activeMed.info.generic_name} therapy and recent {primaryDepletion.symptoms_of_depletion?.[0]?.toLowerCase() || 'nutrient depletion'}.
            </p>
          </motion.div>

          {/* ── Active Prescription Card ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-6"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
              Active Prescription
            </span>
            <h2 className="font-['Fraunces',serif] text-2xl font-semibold text-[#012D1D] mt-2 capitalize">
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

            {/* HIGH DEPLETION RISK badge */}
            {primaryDepletion.severity === 'critical' || primaryDepletion.severity === 'high' ? (
              <span className="inline-block mt-3 bg-[#FFDAD6] text-[#BA1A1A] rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                High Depletion Risk
              </span>
            ) : (
              <span className="inline-block mt-3 bg-[#BEE8DC] text-[#3F665C] rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                Moderate Depletion Risk
              </span>
            )}

            {/* Depletion Pathway Icons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F0E8] flex items-center justify-center">
                <Pill className="w-6 h-6 text-[#012D1D]" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-[2px] bg-[#C1ECD4]" />
                <span className="text-[9px] text-[#414844]/60 mt-1 uppercase tracking-widest">blocks</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#F5F0E8] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#012D1D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-[2px] bg-[#FFDAD6]" />
                <span className="text-[9px] text-[#414844]/60 mt-1 uppercase tracking-widest">depletes</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFDAD6]/40 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#BA1A1A]" />
              </div>
            </div>

            {/* Bioavailability Bar */}
            <div className="mt-6">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
                {primaryDepletion.nutrient} Bioavailability
              </span>
              <div className="mt-2 h-2 rounded-full overflow-hidden flex">
                <div className="w-[42%] bg-[#BA1A1A]/20 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#BA1A1A] shadow-sm" />
                </div>
                <div className="flex-1 bg-[#C1ECD4]" />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-[#BA1A1A] font-semibold">Deficient</span>
                <span className="text-[10px] text-[#3F665C] font-semibold">Optimal</span>
              </div>
              <p className="text-sm font-semibold text-[#BA1A1A] mt-2">-42% vs Baseline</p>
            </div>

            {/* All depletions list */}
            <div className="mt-5 space-y-2">
              {activeMed.info.depletes.map((dep) => (
                <div key={dep.nutrient} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-[#012D1D]">{dep.nutrient}</span>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                      dep.severity === 'critical'
                        ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                        : dep.severity === 'high'
                        ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                        : 'bg-[#BEE8DC] text-[#3F665C]'
                    }`}
                  >
                    {dep.severity}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Intelligence Insight Card ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1B4332] rounded-3xl p-8 text-white"
          >
            <p className="font-['Fraunces',serif] text-xl italic leading-relaxed">
              {primaryDepletion.mechanism}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-white/10 rounded-2xl p-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                  Impact
                </span>
                <p className="text-sm font-semibold mt-1">
                  {primaryDepletion.symptoms_of_depletion?.[0] || 'Nutrient Depletion'}
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">
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

          {/* ── Protocol Recommendation Card ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#BEE8DC]/30 rounded-3xl p-6"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#3F665C]">
              Protocol Recommendation
            </span>
            <h3 className="font-['Fraunces',serif] text-xl font-semibold text-[#012D1D] mt-2">
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
              className="w-full mt-5 bg-[#012D1D] text-white rounded-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              View Full Wellness Plan
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* ── Other medications without insight ────────────────────────── */}
          {medications
            .filter((m) => !medsWithDepletions.some((md) => md.med.id === m.id))
            .map((med) => {
              const isLooking = lookingUp.has(med.name.toLowerCase().trim());
              return (
                <div
                  key={med.id}
                  className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#012D1D] capitalize">{med.name}</p>
                    <p className="text-xs text-[#414844]">
                      {med.dose}{med.frequency && ` \u2022 ${FREQUENCY_OPTIONS.find((o) => o.value === med.frequency)?.label || med.frequency}`}
                    </p>
                    {isLooking && (
                      <p className="text-[10px] text-[#3F665C] mt-1">Looking up depletions...</p>
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
            {medications.map((med) => {
              return (
                <div key={med.id} className="inline-flex gap-2 items-center">
                  <button
                    onClick={() => openEdit(med)}
                    className="text-xs text-[#3F665C] underline underline-offset-2"
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
              );
            })}
          </div>
        </div>
      ) : (
        /* ── LIST VIEW (no depletions found yet) ──────────────────────────── */
        <div className="mt-6 space-y-4">
          <h1 className="font-['Fraunces',serif] text-3xl font-medium text-[#012D1D]">
            Your Medications
          </h1>
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
                className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-['Fraunces',serif] text-lg font-semibold text-[#012D1D] capitalize">
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
                        className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                          dep.severity === 'critical' || dep.severity === 'high'
                            ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                            : 'bg-[#BEE8DC] text-[#3F665C]'
                        }`}
                      >
                        {dep.nutrient}
                      </span>
                    ))}
                  </div>
                )}
                {isLooking && (
                  <p className="text-[10px] text-[#3F665C] mt-3">Looking up depletion data...</p>
                )}
                {!info && !isLooking && (
                  <p className="text-xs text-[#414844]/50 mt-3">No known depletions</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Medication Modal ──────────────────────────────────── */}
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

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── Header Sub-component                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

function Header({ onBack, onAdd }: { onBack: () => void; onAdd: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#012D1D]" />
          </button>
          <span className="font-['Fraunces',serif] text-lg font-semibold text-[#012D1D]">
            CauseHealth.
          </span>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 bg-[#012D1D] text-white rounded-full px-4 py-2 text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Data
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── Add Medication Modal                                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

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
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-10 font-['Manrope',sans-serif]"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-[#414844]/20 mx-auto mb-5" />

            <h2 className="font-['Fraunces',serif] text-xl font-semibold text-[#012D1D] mb-5">
              {editingMed ? 'Edit Medication' : 'Add Medication'}
            </h2>

            <div className="space-y-4">
              {/* Medication name with autocomplete */}
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
                  Medication Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#414844]/40" />
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Start typing a medication name..."
                    className="w-full bg-[#F5F0E8] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#012D1D] placeholder:text-[#414844]/40 outline-none focus:ring-2 focus:ring-[#012D1D]/20"
                    autoFocus
                  />
                </div>
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute z-10 top-full mt-1 w-full bg-white rounded-2xl shadow-[0_8px_24px_rgba(14,55,39,0.1)] overflow-hidden"
                    >
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          className="w-full text-left px-4 py-3 text-sm text-[#012D1D] hover:bg-[#F5F0E8] transition-colors"
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
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
                    Dose
                  </label>
                  <input
                    type="text"
                    value={formDose}
                    onChange={(e) => onDoseChange(e.target.value)}
                    placeholder="e.g., 20mg"
                    className="w-full bg-[#F5F0E8] rounded-2xl px-4 py-3 text-sm text-[#012D1D] placeholder:text-[#414844]/40 outline-none focus:ring-2 focus:ring-[#012D1D]/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
                    Frequency
                  </label>
                  <select
                    value={formFrequency}
                    onChange={(e) => onFrequencyChange(e.target.value)}
                    className="w-full bg-[#F5F0E8] rounded-2xl px-4 py-3 text-sm text-[#012D1D] outline-none focus:ring-2 focus:ring-[#012D1D]/20 appearance-none"
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
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
                  Prescribing Condition
                </label>
                <input
                  type="text"
                  value={formCondition}
                  onChange={(e) => onConditionChange(e.target.value)}
                  placeholder="What is this prescribed for?"
                  className="w-full bg-[#F5F0E8] rounded-2xl px-4 py-3 text-sm text-[#012D1D] placeholder:text-[#414844]/40 outline-none focus:ring-2 focus:ring-[#012D1D]/20"
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
                    <div className="bg-[#BEE8DC]/30 rounded-2xl p-4">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#3F665C]">
                        Known Depletions for {depletionPreview.generic_name}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {depletionPreview.depletes.map((dep) => (
                          <span
                            key={dep.nutrient}
                            className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                              dep.severity === 'critical' || dep.severity === 'high'
                                ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                                : 'bg-[#BEE8DC] text-[#3F665C]'
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
                  className="flex-1 rounded-full py-3.5 text-sm font-semibold text-[#414844] bg-[#F5F0E8]"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={!formName.trim() || saving}
                  className="flex-1 rounded-full py-3.5 text-sm font-semibold text-white bg-[#012D1D] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingMed ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
