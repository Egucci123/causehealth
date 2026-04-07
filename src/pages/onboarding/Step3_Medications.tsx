import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Plus } from 'lucide-react';
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
  drugClass?: string;
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

const COMMON_MEDS = [
  { name: 'Metformin', drugClass: 'BIGUANIDE' },
  { name: 'Levothyroxine', drugClass: 'THYROID' },
  { name: 'Atorvastatin', drugClass: 'STATIN' },
  { name: 'Omeprazole', drugClass: 'PPI' },
  { name: 'Lisinopril', drugClass: 'ACE INHIBITOR' },
  { name: 'Sertraline', drugClass: 'SSRI' },
];

export default function Step3Medications({ onNext }: StepProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [medications, setMedications] = useState<MedicationEntry[]>([]);

  function addMedication(name?: string, drugClass?: string) {
    const med = createEmptyMed();
    if (name) med.name = name;
    if (drugClass) med.drugClass = drugClass;
    setMedications((prev) => [...prev, med]);
    setSearchQuery('');
  }

  function removeMedication(localId: string) {
    setMedications((prev) => prev.filter((m) => m.localId !== localId));
  }

  const hasDepletions = medications.some(
    (m) => m.name && getDepletions(m.name)?.depletes?.length
  );

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
    <div className="space-y-8 font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div>
        <h1 className="font-['Newsreader',serif] text-2xl italic text-[#E2E2E6] leading-tight">
          What medications are you currently taking?
        </h1>
        <p className="text-[#A0ACAB] text-sm mt-3 leading-relaxed">
          Our intelligence engine analyzes each medication for known nutrient
          depletions, interaction risks, and downstream effects on your biomarkers.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0ACAB]/60" />
        <input
          type="text"
          placeholder="Search medications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              addMedication(searchQuery.trim());
            }
          }}
          className="w-full pl-6 bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm placeholder:text-[#A0ACAB]/40 focus:outline-none focus:border-[#1F403D] transition-colors"
        />
      </div>

      {/* Quick-add suggestions */}
      {searchQuery && (
        <div className="flex flex-wrap gap-2">
          {COMMON_MEDS.filter((m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((med) => (
            <button
              key={med.name}
              onClick={() => addMedication(med.name, med.drugClass)}
              className="bg-[#15181C] border border-[#2A2E36]/50 rounded-[10px] px-4 py-2 text-sm text-[#E2E2E6] hover:border-[#1F403D] transition-colors"
            >
              {med.name}
              <span className="text-[10px] uppercase tracking-widest text-[#A0ACAB] ml-2">
                {med.drugClass}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Added medications */}
      <AnimatePresence mode="popLayout">
        {medications.map((med) => (
          <motion.div
            key={med.localId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#15181C] rounded-[10px] p-5 border border-[#2A2E36]/50 relative"
          >
            <button
              onClick={() => removeMedication(med.localId)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#A0ACAB] hover:text-[#CF6679] transition-colors"
              aria-label="Remove medication"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="pr-8">
              {med.drugClass && (
                <p className="text-[10px] uppercase tracking-widest text-[#1F403D] mb-1">
                  {med.drugClass}
                </p>
              )}
              <p className="font-bold text-[#E2E2E6]">{med.name || 'Untitled'}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Intelligence Insight */}
      {medications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1F403D]/10 border border-[#1F403D]/30 rounded-[10px] p-6"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#1F403D] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-['Newsreader',serif] italic text-[#E2E2E6] text-sm mb-1">
                Intelligence Insight
              </h3>
              <p className="text-[#A0ACAB] text-sm leading-relaxed">
                {hasDepletions
                  ? 'We have detected potential nutrient depletions from your medications. Upload your labs and we will monitor these nutrients proactively.'
                  : 'Your medications will be cross-referenced against our depletion database. Upload labs to get a full analysis.'}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1F403D] mt-3">
                Proactive Analysis
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add supplements card */}
      <button
        onClick={() => addMedication()}
        className="w-full bg-[#15181C] border border-[#2A2E36]/50 border-dashed rounded-[10px] p-5 text-left hover:border-[#3F4948] transition-colors flex items-center gap-3"
      >
        <Plus className="w-5 h-5 text-[#A0ACAB]" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
          Add Supplements Next
        </span>
      </button>

      {/* Bottom nav */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onNext}
          className="text-[#A0ACAB] text-sm uppercase tracking-[0.15em] font-bold hover:text-[#E2E2E6] transition-colors"
        >
          Skip
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1F403D] text-white rounded-[10px] py-3 px-6 text-sm uppercase tracking-[0.15em] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Next Analysis \u2192'}
        </button>
      </div>
    </div>
  );
}
