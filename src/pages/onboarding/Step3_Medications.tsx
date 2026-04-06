import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { MEDICATION_DEPLETIONS } from '@/data/medicationDepletions';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

interface MedicationEntry {
  localId: string;
  name: string;
  dose: string;
  frequency: string;
  start_date: string;
  prescribing_condition: string;
}

function createEmptyMed(): MedicationEntry {
  return {
    localId: crypto.randomUUID(),
    name: '',
    dose: '',
    frequency: '',
    start_date: '',
    prescribing_condition: '',
  };
}

function getDepletions(medicationName: string) {
  const key = medicationName.toLowerCase().trim();
  return MEDICATION_DEPLETIONS[key] || null;
}

const FREQUENCY_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'daily', label: 'Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'as_needed', label: 'As Needed' },
];

export default function Step3Medications({ onNext }: StepProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [medications, setMedications] = useState<MedicationEntry[]>([]);

  function addMedication() {
    setMedications((prev) => [...prev, createEmptyMed()]);
  }

  function removeMedication(localId: string) {
    setMedications((prev) => prev.filter((m) => m.localId !== localId));
  }

  function updateMedication(
    localId: string,
    field: keyof MedicationEntry,
    value: string
  ) {
    setMedications((prev) =>
      prev.map((m) => (m.localId === localId ? { ...m, [field]: value } : m))
    );
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const medsToInsert = medications
        .filter((m) => m.name.trim())
        .map((m) => ({
          user_id: user.id,
          name: m.name.trim(),
          dose: m.dose || null,
          frequency: m.frequency || null,
          start_date: m.start_date || null,
          prescribing_condition: m.prescribing_condition || null,
          is_active: true,
        }));

      if (medsToInsert.length > 0) {
        const { error } = await supabase
          .from('medications')
          .insert(medsToInsert);
        if (error) {
          console.error('Failed to save medications:', error);
          alert('Failed to save medications. Please try again.');
          setSaving(false);
          return;
        }
      }

      onNext();
    } catch (err) {
      console.error('Failed to save medications:', err);
      alert('Failed to save medications. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-24 font-['Manrope',sans-serif]">
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#BEE8DC] text-[#3F665C]"
        >
          <Pill className="w-7 h-7" />
        </motion.div>
        <h1 className="font-['Fraunces',serif] text-2xl font-semibold text-[#012D1D]">
          Your Current Medications
        </h1>
        <p className="text-[#414844] text-sm max-w-md mx-auto">
          Many medications deplete essential nutrients. We will flag these so
          you can replenish what your body needs.
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {medications.map((med) => {
          const depletionInfo = getDepletions(med.name);
          return (
            <motion.div
              key={med.localId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-4 relative">
                <button
                  onClick={() => removeMedication(med.localId)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-[#414844]/60 hover:text-[#BA1A1A] hover:bg-[#FFDAD6] transition-colors"
                  aria-label="Remove medication"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-10">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
                      Medication Name
                    </label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) =>
                        updateMedication(med.localId, 'name', e.target.value)
                      }
                      placeholder="e.g. Atorvastatin"
                      className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
                      Dose
                    </label>
                    <input
                      type="text"
                      value={med.dose}
                      onChange={(e) =>
                        updateMedication(med.localId, 'dose', e.target.value)
                      }
                      placeholder="e.g. 20mg"
                      className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
                    Frequency
                  </label>
                  <select
                    value={med.frequency}
                    onChange={(e) =>
                      updateMedication(med.localId, 'frequency', e.target.value)
                    }
                    className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30 appearance-none"
                  >
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Depletion alert */}
                {depletionInfo && depletionInfo.depletes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3 rounded-2xl bg-amber-50"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800">
                        Known Nutrient Depletions
                      </p>
                      <p className="text-amber-800 mt-1">
                        {med.name} may deplete:{' '}
                        <span className="font-medium">
                          {depletionInfo.depletes
                            .map((d: { nutrient: string }) => d.nutrient)
                            .join(', ')}
                        </span>
                        . We will monitor these in your labs.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {medications.length === 0 && (
        <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] text-center py-10 space-y-3">
          <Pill className="w-8 h-8 text-[#414844]/30 mx-auto" />
          <p className="text-sm text-[#414844]/60">
            No medications added yet. If you are not on any medications, you can
            skip this step.
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={addMedication}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[#3F665C] text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Medication
        </button>
      </div>

      {/* Continue button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[#1B4332] text-white rounded-full py-4 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 font-['Manrope',sans-serif]"
      >
        {saving ? 'Saving...' : 'Continue'}
      </button>
    </div>
  );
}
