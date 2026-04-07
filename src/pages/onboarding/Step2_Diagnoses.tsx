import { useState } from 'react';
import { Search, Plus, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { FamilyHistory } from '@/types/user.types';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const CONDITIONS = [
  { name: "Hashimoto's", category: 'AUTOIMMUNE' },
  { name: "Crohn's", category: 'AUTOIMMUNE' },
  { name: 'Lupus', category: 'AUTOIMMUNE' },
  { name: 'Rheumatoid Arthritis', category: 'INFLAMMATORY' },
  { name: 'Type 2 Diabetes', category: 'METABOLIC' },
  { name: 'Psoriasis', category: 'DERMATOLOGY' },
  { name: 'Celiac Disease', category: 'GASTRO' },
  { name: 'MS', category: 'NEUROLOGICAL' },
  { name: 'Ankylosing Spondylitis', category: 'SPINAL' },
  { name: 'PCOS', category: 'HORMONAL' },
  { name: 'IBD', category: 'GASTRO' },
  { name: 'Fibromyalgia', category: 'MUSCULAR' },
];

export default function Step2Diagnoses({ onNext }: StepProps) {
  const { healthProfile, updateHealthProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>(
    healthProfile?.diagnoses || []
  );
  const [familyHistory] = useState<FamilyHistory>(
    healthProfile?.family_history || {
      cardiovascular: false,
      autoimmune: false,
      cancer: false,
      diabetes: false,
      thyroid: false,
      mental_health: false,
      notes: '',
    }
  );
  const [geneticTesting] = useState(
    healthProfile?.genetic_testing_done || false
  );

  const filteredConditions = CONDITIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function toggleDiagnosis(diagnosis: string) {
    setSelectedDiagnoses((prev) =>
      prev.includes(diagnosis)
        ? prev.filter((d) => d !== diagnosis)
        : [...prev, diagnosis]
    );
  }


  async function handleSave() {
    setSaving(true);
    try {
      await updateHealthProfile({
        diagnoses: selectedDiagnoses,
        family_history: familyHistory,
        genetic_testing_done: geneticTesting,
      });
      onNext();
    } catch (err) {
      console.error('Failed to save diagnoses:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div>
        <h1 className="font-['Newsreader',serif] text-4xl text-[#E2E2E6] leading-tight">
          Do you have any{' '}
          <span className="italic text-[#1F403D]">diagnosed</span>{' '}
          conditions?
        </h1>
        <p className="text-[#A0ACAB] text-sm mt-3 leading-relaxed">
          Our engine cross-references your conditions against 200+ nutrient
          depletion pathways and drug interaction matrices.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0ACAB]/60" />
        <input
          type="text"
          placeholder="Search conditions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 bg-[#15181C] rounded-[10px] py-3.5 text-sm text-[#E2E2E6] placeholder:text-[#A0ACAB]/40 focus:outline-none focus:ring-1 focus:ring-[#1F403D]/50 border border-[#2A2E36]/50"
        />
      </div>

      {/* Conditions grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredConditions.map((condition) => {
          const isSelected = selectedDiagnoses.includes(condition.name);
          return (
            <button
              key={condition.name}
              onClick={() => toggleDiagnosis(condition.name)}
              className={`text-left p-5 rounded-[10px] transition-all duration-200 ${
                isSelected
                  ? 'bg-[#1F403D] border border-[#1F403D]'
                  : 'bg-[#15181C] border border-[#2A2E36]/50 hover:border-[#3F4948]/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-[#A0ACAB]">
                  {condition.category}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
              <p className="font-bold text-[#E2E2E6] text-sm">{condition.name}</p>
              {isSelected && (
                <p className="text-[10px] uppercase tracking-widest text-white/60 mt-1">
                  Selected
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom diagnoses shown as removable cards */}
      {selectedDiagnoses.filter((d) => !CONDITIONS.some((c) => c.name === d)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDiagnoses
            .filter((d) => !CONDITIONS.some((c) => c.name === d))
            .map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-sm font-medium bg-[#1F403D] text-white"
              >
                {d}
                <button onClick={() => toggleDiagnosis(d)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Add custom */}
      <button
        onClick={() => {
          const input = prompt('Enter a custom condition:');
          if (input?.trim()) {
            if (!selectedDiagnoses.includes(input.trim())) {
              setSelectedDiagnoses((prev) => [...prev, input.trim()]);
            }
          }
        }}
        className="flex items-center gap-2 text-[#A0ACAB] text-sm hover:text-[#E2E2E6] transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="uppercase tracking-[0.15em] text-[10px] font-bold">Add Custom Condition</span>
      </button>

      {/* Bottom actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onNext}
          className="text-[#A0ACAB] text-sm uppercase tracking-[0.15em] font-bold hover:text-[#E2E2E6] transition-colors"
        >
          Skip for Now
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1F403D] text-white rounded-[10px] py-3 px-6 text-sm uppercase tracking-[0.15em] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Continue \u2192'}
        </button>
      </div>
    </div>
  );
}
