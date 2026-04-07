import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Pill, AlertTriangle, Sparkles, ChevronRight, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { MEDICATION_DEPLETIONS } from '@/data/medicationDepletions';
import { lookupMedication as lookupMedicationAsync, isInStaticDB } from '@/lib/medicationLookup';
import type { Medication } from '@/types/user.types';
import type { MedicationInfo } from '@/types/medication.types';

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

function getSeverityBadge(severity: string): { label: string; classes: string } {
  switch (severity) {
    case 'critical':
    case 'high':
      return { label: 'HIGH RISK', classes: 'bg-[#CF6679]/20 text-[#CF6679]' };
    case 'moderate':
      return { label: 'MODERATE', classes: 'bg-[#C9A84C]/20 text-[#C9A84C]' };
    default:
      return { label: 'LOW RISK', classes: 'bg-[#1F403D]/20 text-[#6DB8AF]' };
  }
}

/* -- Component -------------------------------------------------------------- */

export default function Medications() {
  const { user } = useAuth();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [selectedMedIdx] = useState(0);
  const [expandedDepletionMedId, setExpandedDepletionMedId] = useState<string | null>(null);

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

  // Symptom checklist state
  const [checkedSymptoms, setCheckedSymptoms] = useState<Set<string>>(new Set());

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

  function toggleSymptom(symptom: string) {
    setCheckedSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(symptom)) next.delete(symptom);
      else next.add(symptom);
      return next;
    });
  }

  /* -- Derived data --------------------------------------------------------- */

  const medsWithDepletions = useMemo(() => {
    return medications
      .map((med) => ({ med, info: resolveMedication(med.name, resolvedMeds) }))
      .filter((x): x is { med: Medication; info: MedicationInfo } => x.info !== null && x.info.depletes.length > 0);
  }, [medications, resolvedMeds]);

  const totalCriticalAlerts = useMemo(() => {
    return medsWithDepletions.reduce((count, m) => {
      return count + m.info.depletes.filter((d) => d.severity === 'critical' || d.severity === 'high').length;
    }, 0);
  }, [medsWithDepletions]);

  const activeMed = medsWithDepletions[selectedMedIdx] ?? null;


  const depletionPreview = useMemo(() => {
    if (formName.length < 3) return null;
    return lookupMedicationSync(formName);
  }, [formName]);

  // Collect all symptoms from all depletions for the active med
  const allSymptoms = useMemo(() => {
    if (!activeMed) return [];
    const symptoms = new Set<string>();
    for (const dep of activeMed.info.depletes) {
      for (const s of dep.symptoms_of_depletion || []) {
        symptoms.add(s);
      }
    }
    return [...symptoms];
  }, [activeMed]);

  /* -- Skeleton ------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C0F] px-6 pt-8 pb-32 font-['DM_Sans',sans-serif]">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[#15181C] rounded-[10px] w-2/3" />
          <div className="h-5 bg-[#15181C] rounded-[10px] w-full" />
          <div className="h-48 bg-[#15181C] rounded-[10px]" />
          <div className="h-40 bg-[#15181C] rounded-[10px]" />
        </div>
      </div>
    );
  }

  /* -- Header (shared across empty / populated states) ---------------------- */

  const headerBlock = (
    <>
      {/* Title */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
          PHARMACEUTICAL PORTFOLIO
        </span>
        <div className="flex items-center justify-between mt-2">
          <h1 className="font-['Newsreader',serif] text-4xl text-[#E2E2E6]">
            Your Medications
          </h1>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-1.5 bg-[#1F403D] text-white rounded-[10px] px-5 py-3 text-[10px] uppercase tracking-[0.15em] font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Med
          </button>
        </div>
      </div>
    </>
  );

  /* -- Empty state ---------------------------------------------------------- */

  if (medications.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0C0F] px-6 pt-8 pb-32 font-['DM_Sans',sans-serif] space-y-10">
        {headerBlock}

        <div className="flex flex-col items-center text-center pt-4">
          <div className="relative w-20 h-20 flex items-center justify-center mb-6">
            <Pill className="w-16 h-16 text-[#282D33]" />
            <Plus className="w-10 h-10 text-[#282D33] absolute -bottom-1 -right-1" />
          </div>
          <h2 className="font-['Newsreader',serif] italic text-2xl text-[#E2E2E6] mt-6">
            No medications tracked
          </h2>
          <p className="text-sm text-[#A0ACAB] mt-3 leading-relaxed max-w-[280px]">
            Add your current medications to discover nutrient depletions and interactions.
          </p>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="w-full mt-8 bg-[#1F403D] text-white rounded-[10px] py-4 uppercase tracking-[0.15em] font-bold text-sm"
          >
            ADD YOUR FIRST MEDICATION
          </button>
        </div>

        {/* Philosophy Card */}
        <div className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
            PHILOSOPHY
          </span>
          <h3 className="font-['Newsreader',serif] text-2xl text-[#E2E2E6] mt-3">
            Root Cause Medicine
          </h3>
          <p className="text-sm text-[#A0ACAB] mt-3 leading-relaxed">
            Every medication has downstream effects on your nutrient status. We connect your prescriptions to known nutrient depletions so you can proactively supplement what your body is losing.
          </p>
        </div>

        {/* Warning Card */}
        <div className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#CF6679]">
            WARNING
          </span>
          <h3 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mt-3">
            Drug Interaction Screening
          </h3>
          <p className="text-sm text-[#A0ACAB] mt-3 leading-relaxed">
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

  /* -- Populated View ------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#0A0C0F] px-6 pt-8 pb-32 font-['DM_Sans',sans-serif] space-y-8">
      {headerBlock}

      {/* Alert Banner - if depletions exist */}
      {totalCriticalAlerts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#CF6679]/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#CF6679]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#CF6679]">
                ACTION REQUIRED
              </span>
              <p className="text-sm font-bold text-[#E2E2E6] mt-0.5">Global Depletion Dashboard</p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5 rounded-full bg-[#CF6679]/20 text-[#CF6679] flex-shrink-0">
              {totalCriticalAlerts} Critical Alert{totalCriticalAlerts !== 1 ? 's' : ''}
            </span>
            <ChevronRight className="w-4 h-4 text-[#A0ACAB] flex-shrink-0" />
          </div>
        </motion.div>
      )}

      {/* Med Cards */}
      <div className="space-y-4">
        {medications.map((med, index) => {
          const info = resolveMedication(med.name, resolvedMeds);
          const isLooking = lookingUp.has(med.name.toLowerCase().trim());
          const hasDepletions = info && info.depletes.length > 0;
          const worstSeverity = hasDepletions
            ? info!.depletes.reduce((worst, d) => {
                const sev: Record<string, number> = { critical: 4, high: 3, moderate: 2, low: 1 };
                return (sev[d.severity] || 0) > (sev[worst.severity] || 0) ? d : worst;
              }, info!.depletes[0])
            : null;
          const isExpanded = expandedDepletionMedId === med.id;

          return (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Med Card */}
              <div className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] capitalize">
                      {med.name}
                    </h3>
                    <p className="text-sm text-[#A0ACAB] mt-1">
                      {info?.generic_name || 'Pharmaceutical'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {worstSeverity && (
                      <span className={`text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5 rounded-[24px] ${
                        worstSeverity.severity === 'critical' || worstSeverity.severity === 'high'
                          ? 'bg-[#CF6679]/20 text-[#CF6679]'
                          : 'bg-[#C9A84C]/20 text-[#C9A84C]'
                      }`}>
                        {worstSeverity.severity === 'critical' || worstSeverity.severity === 'high'
                          ? 'HIGH DEPLETION RISK'
                          : 'MODERATE RISK'}
                      </span>
                    )}
                    <button onClick={() => openEdit(med)} className="p-1 text-[#A0ACAB]/60">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button onClick={() => handleRemove(med.id)} className="p-1 text-[#CF6679]/60">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dosage / Schedule rows */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#A0ACAB]">Dosage</span>
                    <p className="text-sm font-bold text-[#E2E2E6] mt-1">{med.dose || '--'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#A0ACAB]">Schedule</span>
                    <p className="text-sm font-bold text-[#E2E2E6] mt-1">
                      {med.frequency
                        ? FREQUENCY_OPTIONS.find((o) => o.value === med.frequency)?.label || med.frequency
                        : '--'}
                    </p>
                  </div>
                </div>

                {isLooking && (
                  <p className="text-[10px] text-[#A0ACAB] mt-3">Looking up depletions...</p>
                )}

                {hasDepletions && (
                  <button
                    onClick={() => setExpandedDepletionMedId(isExpanded ? null : med.id)}
                    className="flex items-center gap-1 mt-4 text-sm text-[#A0ACAB] hover:text-[#E2E2E6] transition-colors"
                  >
                    View Depletions {isExpanded ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}

                {!info && !isLooking && (
                  <p className="text-xs text-[#A0ACAB]/50 mt-3">No known depletions</p>
                )}
              </div>

              {/* Depletion Analysis Card - expanded */}
              <AnimatePresence>
                {isExpanded && hasDepletions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8 mt-2">
                      <div className="flex items-center gap-3 mb-1">
                        <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
                          DEPLETION ANALYSIS
                        </span>
                      </div>
                      <h3 className="font-['Newsreader',serif] text-2xl text-[#E2E2E6] mt-2">
                        Nutrient Depletion Analysis: {med.name}
                      </h3>

                      {/* Mechanism */}
                      {info!.depletes[0]?.mechanism && (
                        <p className="text-sm text-[#A0ACAB] mt-4 leading-relaxed">
                          {info!.depletes[0].mechanism}
                        </p>
                      )}

                      {/* Nutrient rows */}
                      <div className="mt-5 space-y-3">
                        {info!.depletes.map((dep) => {
                          const badge = getSeverityBadge(dep.severity);
                          return (
                            <div key={dep.nutrient} className="flex items-center justify-between py-2 border-b border-[#2C3433]/50 last:border-0">
                              <span className="text-sm font-medium text-[#E2E2E6]">{dep.nutrient}</span>
                              <span className={`text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1 rounded-[24px] ${badge.classes}`}>
                                {badge.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Clinical Surveillance section */}
                    {allSymptoms.length > 0 && activeMed?.med.id === med.id && (
                      <div className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8 mt-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
                          CLINICAL SURVEILLANCE
                        </span>
                        <h4 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mt-2">
                          Reported Depletion Symptoms
                        </h4>
                        <div className="mt-4 space-y-3">
                          {allSymptoms.map((symptom) => (
                            <label key={symptom} className="flex items-center gap-3 cursor-pointer">
                              <div
                                onClick={() => toggleSymptom(symptom)}
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                  checkedSymptoms.has(symptom)
                                    ? 'bg-[#1F403D] border-[#1F403D]'
                                    : 'border-[#3F4948]/50 bg-transparent'
                                }`}
                              >
                                {checkedSymptoms.has(symptom) && (
                                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-[#E2E2E6]">{symptom}</span>
                            </label>
                          ))}
                        </div>
                        <button className="mt-5 text-sm font-bold text-[#1F403D] hover:text-[#2D5A56] transition-colors">
                          Generate Physician Summary
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Philosophy Card */}
      <div className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
          PHILOSOPHY
        </span>
        <h3 className="font-['Newsreader',serif] text-2xl text-[#E2E2E6] mt-3">
          Root Cause Medicine
        </h3>
        <p className="text-sm text-[#A0ACAB] mt-3 leading-relaxed">
          Every medication has downstream effects on your nutrient status. We connect your prescriptions to known nutrient depletions so you can proactively supplement what your body is losing.
        </p>
      </div>

      {/* Warning Card */}
      <div className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#CF6679]">
          WARNING
        </span>
        <h3 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mt-3">
          Drug Interaction Screening
        </h3>
        <p className="text-sm text-[#A0ACAB] mt-3 leading-relaxed">
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
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#15181C] rounded-t-[10px] p-6 pb-28 max-h-[85vh] overflow-y-auto font-['DM_Sans',sans-serif]"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-[#3F4948]/40 mx-auto mb-5" />

        <h2 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mb-5">
          {editingMed ? 'Edit Medication' : 'Add Medication'}
        </h2>

        <div className="space-y-5">
          {/* Medication name with autocomplete */}
          <div className="relative">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-2 block">
              Medication Name
            </label>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0ACAB]/40" />
              <input
                type="text"
                value={formName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Start typing a medication name..."
                className="w-full bg-transparent border-b border-[#3F4948]/50 pl-6 pr-4 py-4 text-sm text-[#E2E2E6] placeholder:text-[#A0ACAB]/40 outline-none focus:border-[#1F403D]"
                autoFocus
              />
            </div>
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-10 top-full mt-1 w-full bg-[#1E2226] rounded-[10px] border border-[#2C3433] overflow-hidden"
                >
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      className="w-full text-left px-4 py-3 text-sm text-[#E2E2E6] hover:bg-[#282D33] transition-colors"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-2 block">
                Dose
              </label>
              <input
                type="text"
                value={formDose}
                onChange={(e) => onDoseChange(e.target.value)}
                placeholder="e.g., 20mg"
                className="w-full bg-transparent border-b border-[#3F4948]/50 py-4 text-sm text-[#E2E2E6] placeholder:text-[#A0ACAB]/40 outline-none focus:border-[#1F403D]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-2 block">
                Frequency
              </label>
              <select
                value={formFrequency}
                onChange={(e) => onFrequencyChange(e.target.value)}
                className="w-full bg-transparent border-b border-[#3F4948]/50 py-4 text-sm text-[#E2E2E6] outline-none focus:border-[#1F403D] appearance-none"
              >
                <option value="" className="bg-[#15181C]">Select...</option>
                {FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-[#15181C]">{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-2 block">
              Prescribing Condition
            </label>
            <input
              type="text"
              value={formCondition}
              onChange={(e) => onConditionChange(e.target.value)}
              placeholder="What is this prescribed for?"
              className="w-full bg-transparent border-b border-[#3F4948]/50 py-4 text-sm text-[#E2E2E6] placeholder:text-[#A0ACAB]/40 outline-none focus:border-[#1F403D]"
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
                <div className="bg-[#1E2226] rounded-[10px] border border-[#2C3433] p-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
                    Known Depletions for {depletionPreview.generic_name}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {depletionPreview.depletes.map((dep) => {
                      const badge = getSeverityBadge(dep.severity);
                      return (
                        <span
                          key={dep.nutrient}
                          className={`text-[10px] uppercase tracking-[0.15em] font-bold px-2.5 py-1 rounded-[24px] ${badge.classes}`}
                        >
                          {dep.nutrient} ({dep.severity})
                        </span>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-[10px] py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#A0ACAB] bg-[#1E2226] border border-[rgba(63,73,72,0.2)]"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!formName.trim() || saving}
              className="flex-1 rounded-[10px] py-4 text-sm font-bold uppercase tracking-[0.15em] text-white bg-[#1F403D] disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingMed ? 'Save Changes' : 'Add Medication'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
