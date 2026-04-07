import { useState } from 'react';
import { Search, Plus, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const CONDITIONS = [
  { name: "Hashimoto's", category: 'AUTOIMMUNE' },
  { name: "Crohn's", category: 'AUTOIMMUNE' },
  { name: 'Lupus', category: 'AUTOIMMUNE' },
  { name: 'RA', category: 'INFLAMMATORY' },
  { name: 'Type 2 Diabetes', category: 'METABOLIC' },
  { name: 'Psoriasis', category: 'DERMATOLOGY' },
  { name: 'Celiac', category: 'GASTRO' },
  { name: 'MS', category: 'NEUROLOGICAL' },
  { name: 'AS', category: 'SPINAL' },
  { name: 'PCOS', category: 'HORMONAL' },
  { name: 'IBD', category: 'GASTRO' },
  { name: 'Fibromyalgia', category: 'MUSCULAR' },
  { name: 'Hypothyroidism', category: 'ENDOCRINE' },
  { name: 'Hypertension', category: 'CARDIOVASCULAR' },
  { name: 'Depression', category: 'MENTAL HEALTH' },
  { name: 'Anxiety', category: 'MENTAL HEALTH' },
  { name: 'Sleep Apnea', category: 'SLEEP' },
  { name: 'GERD', category: 'GASTRO' },
];

export default function Step2Diagnoses({ onNext }: StepProps) {
  const { updateHealthProfile } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  function toggleCondition(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const filtered = searchQuery
    ? CONDITIONS.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : CONDITIONS;

  async function handleSave() {
    setSaving(true);
    try {
      await updateHealthProfile({ diagnoses: Array.from(selected) });
      onNext();
    } catch (err) {
      console.error('Failed to save diagnoses:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-['Newsreader',serif] text-4xl tracking-tight leading-tight mb-4 text-[#E2E2E6]">
          Do you have any <span className="italic text-[#1F403D]">diagnosed</span> conditions?
        </h1>
        <p className="text-[#A0ACAB] text-sm max-w-lg leading-relaxed">
          Our clinical engine cross-references your current status with over 12,000 biological markers to personalize your longevity protocol.
        </p>
      </div>

      {/* Search */}
      <div className="relative group mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[#3F4948] group-focus-within:text-[#1F403D] transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search conditions (e.g. Hashimoto's, Metabolic...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#12151A] border-0 border-b-[0.5px] border-[#2C3433] py-4 pl-12 pr-4 focus:ring-0 focus:border-[#1F403D] focus:bg-[#1E2226] transition-all text-[#E2E2E6] placeholder:text-[#3F4948]/50 font-['DM_Sans',sans-serif] focus:outline-none"
        />
      </div>

      {/* Conditions Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {filtered.map((condition) => {
          const isSelected = selected.has(condition.name);
          return (
            <button
              key={condition.name}
              onClick={() => toggleCondition(condition.name)}
              className={`group cursor-pointer text-left p-4 rounded-xl transition-colors flex flex-col gap-3 relative ${
                isSelected
                  ? 'bg-[#1F403D]/20 border border-[#1F403D]/30'
                  : 'bg-[#1E2226] border border-[#2A2E36]/50 hover:bg-[#282D33]'
              }`}
            >
              <span className="text-[10px] uppercase tracking-widest text-[#3F4948]">
                {isSelected ? 'SELECTED' : condition.category}
              </span>
              <span className={`font-['Newsreader',serif] text-lg ${isSelected ? 'text-[#1F403D]' : 'text-[#E2E2E6] group-hover:text-[#1F403D]'} transition-colors leading-tight`}>
                {condition.name}
              </span>
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <Check className="w-4 h-4 text-[#1F403D]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Custom */}
      <div className="pt-8 border-t border-[#3F4948]/30 mb-8">
        <button className="w-full flex items-center justify-between p-4 group text-[#3F4948] hover:text-[#E2E2E6] transition-colors">
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Add custom condition</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6">
        <button className="text-[10px] uppercase tracking-widest text-[#3F4948] hover:text-[#E2E2E6] transition-colors font-bold">
          Skip for now
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1F403D]/20 text-[#1F403D] px-10 py-3 rounded-lg text-xs uppercase tracking-[0.2em] font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 border border-[#1F403D]/20 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
