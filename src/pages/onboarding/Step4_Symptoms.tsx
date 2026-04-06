import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

interface SelectedSymptom {
  name: string;
  severity: number;
  duration: string;
}

const SYMPTOM_CATEGORIES: Record<string, string[]> = {
  Energy: ['Fatigue', 'Brain Fog', 'Low Motivation'],
  'Hair & Skin': ['Hair Loss', 'Thinning Hair', 'Dry Skin', 'Acne', 'Brittle Nails'],
  Pain: ['Muscle Pain', 'Joint Pain', 'Headaches', 'Back Pain'],
  Digestive: ['Bloating', 'Constipation', 'Diarrhea', 'Acid Reflux', 'Nausea'],
  Mood: ['Anxiety', 'Depression', 'Irritability', 'Mood Swings'],
  Sleep: ['Insomnia', 'Waking at Night', 'Unrefreshing Sleep', 'Snoring'],
  Weight: ['Weight Gain', 'Difficulty Losing Weight', 'Increased Appetite'],
  Other: [
    'Frequent Illness',
    'Cold Intolerance',
    'Numbness/Tingling',
    'Heart Palpitations',
  ],
};

const DURATION_OPTIONS = [
  { value: '', label: 'How long?' },
  { value: 'less_than_1_month', label: 'Less than 1 month' },
  { value: '1_3_months', label: '1-3 months' },
  { value: '3_6_months', label: '3-6 months' },
  { value: '6_12_months', label: '6-12 months' },
  { value: 'over_1_year', label: 'Over 1 year' },
];

function severityColor(severity: number): string {
  if (severity <= 3) return 'bg-[#BEE8DC]';
  if (severity <= 6) return 'bg-amber-200';
  return 'bg-[#FFDAD6]';
}

export default function Step4Symptoms({ onNext }: StepProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Record<string, SelectedSymptom>>({});

  function toggleSymptom(symptom: string) {
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[symptom]) {
        delete copy[symptom];
      } else {
        copy[symptom] = { name: symptom, severity: 5, duration: '' };
      }
      return copy;
    });
  }

  function updateSymptom(
    symptom: string,
    field: 'severity' | 'duration',
    value: number | string
  ) {
    setSelected((prev) => ({
      ...prev,
      [symptom]: { ...prev[symptom], [field]: value },
    }));
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const symptomsToInsert = Object.values(selected).map((s) => ({
        user_id: user.id,
        symptom: s.name,
        severity: s.severity,
        duration: s.duration || null,
        notes: null,
      }));

      if (symptomsToInsert.length > 0) {
        const { error } = await supabase
          .from('symptoms')
          .insert(symptomsToInsert);
        if (error) throw error;
      }

      onNext();
    } catch {
      // Network error handled silently
    } finally {
      setSaving(false);
    }
  }

  const selectedNames = Object.keys(selected);

  return (
    <div className="space-y-6 pb-24 font-['Manrope',sans-serif]">
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#BEE8DC] text-[#3F665C]"
        >
          <Activity className="w-7 h-7" />
        </motion.div>
        <h1 className="font-['Fraunces',serif] text-2xl font-semibold text-[#012D1D]">
          What's Bothering You?
        </h1>
        <p className="text-[#414844] text-sm max-w-md mx-auto">
          Select any symptoms you are currently experiencing. We will use these
          to identify potential root causes and track improvements.
        </p>
      </div>

      {/* Symptom categories */}
      {Object.entries(SYMPTOM_CATEGORIES).map(([category, symptoms]) => (
        <div key={category} className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-3">
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
            {category}
          </h2>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => {
              const isSelected = !!selected[symptom];
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-white text-[#414844] shadow-sm hover:shadow-md'
                  }`}
                >
                  {symptom}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Detail cards for selected symptoms */}
      <AnimatePresence mode="popLayout">
        {selectedNames.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
              Tell us more about your symptoms
            </h2>
            {selectedNames.map((symptom) => {
              const data = selected[symptom];
              return (
                <motion.div
                  key={symptom}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-3">
                    <h3 className="text-sm font-medium text-[#012D1D]">
                      {symptom}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Severity slider */}
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
                          Severity: {data.severity}/10
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={data.severity}
                            onChange={(e) =>
                              updateSymptom(
                                symptom,
                                'severity',
                                Number(e.target.value)
                              )
                            }
                            className="w-full h-2 rounded-full appearance-none bg-[#C1ECD4] accent-[#1B4332]"
                          />
                          <div className={`absolute -top-1 left-0 h-4 rounded-full transition-all ${severityColor(data.severity)}`} style={{ width: `${(data.severity / 10) * 100}%`, opacity: 0.3, pointerEvents: 'none' }} />
                        </div>
                        <div className="flex justify-between text-xs text-[#414844]/60 mt-1">
                          <span>Mild</span>
                          <span>Severe</span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
                          Duration
                        </label>
                        <select
                          value={data.duration}
                          onChange={(e) =>
                            updateSymptom(symptom, 'duration', e.target.value)
                          }
                          className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30 appearance-none"
                        >
                          {DURATION_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

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
