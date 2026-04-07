import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function Step4Symptoms({ onNext }: StepProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    try {
      const symptomsToInsert = Object.values(selected).map((s) => ({
        user_id: user.id,
        symptom: s.name,
        severity: s.severity,
        duration: s.duration || null,
        notes: null,
      }));

      if (symptomsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('symptoms')
          .insert(symptomsToInsert);
        if (insertError) throw insertError;
      }

      onNext();
    } catch (err) {
      console.error('Failed to save symptoms:', err);
      setError('Failed to save symptoms. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const selectedNames = Object.keys(selected);

  return (
    <div className="space-y-8 font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div>
        <h1 className="font-['Newsreader',serif] text-4xl text-[#E2E2E6] leading-tight">
          What symptoms are you{' '}
          <span className="italic text-[#1F403D]">experiencing</span>?
        </h1>
        <p className="text-[#A0ACAB] text-sm mt-3 leading-relaxed">
          Select any current symptoms. We map these to biochemical root causes
          across 39 clusters to surface what conventional care overlooks.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#CF6679]/10 border border-[#CF6679]/30 rounded-[10px] text-sm text-[#CF6679]">
          {error}
        </div>
      )}

      {/* Symptom categories */}
      {Object.entries(SYMPTOM_CATEGORIES).map(([category, symptoms]) => (
        <div key={category} className="space-y-3">
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
            {category}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {symptoms.map((symptom) => {
              const isSelected = !!selected[symptom];
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`text-left px-4 py-3 rounded-[10px] text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#1F403D] text-white border border-[#1F403D]'
                      : 'bg-[#15181C] text-[#A0ACAB] border border-[#2A2E36]/50 hover:border-[#3F4948]/50'
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
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
              Symptom Details
            </h2>
            {selectedNames.map((symptom) => {
              const data = selected[symptom];
              return (
                <motion.div
                  key={symptom}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#15181C] rounded-[10px] p-5 border border-[#2A2E36]/50 space-y-3"
                >
                  <h3 className="text-sm font-bold text-[#E2E2E6]">{symptom}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-2 block">
                        Severity: {data.severity}/10
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={data.severity}
                        onChange={(e) =>
                          updateSymptom(symptom, 'severity', Number(e.target.value))
                        }
                        className="w-full h-1 rounded-full appearance-none bg-[#282D33] accent-[#1F403D]"
                      />
                      <div className="flex justify-between text-[10px] text-[#A0ACAB]/60 mt-1">
                        <span>Mild</span>
                        <span>Severe</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-2 block">
                        Duration
                      </label>
                      <select
                        value={data.duration}
                        onChange={(e) =>
                          updateSymptom(symptom, 'duration', e.target.value)
                        }
                        className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-2 text-sm focus:outline-none focus:border-[#1F403D] appearance-none"
                      >
                        {DURATION_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#15181C]">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[#1F403D] text-white rounded-[10px] py-4 uppercase tracking-[0.15em] text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Continue \u2192'}
      </button>
    </div>
  );
}
