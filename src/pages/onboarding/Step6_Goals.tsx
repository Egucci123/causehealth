import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const GOAL_OPTIONS = [
  { label: 'Optimize Lab Results', icon: 'flask' },
  { label: 'Reduce Medications', icon: 'pill' },
  { label: 'Lose Weight', icon: 'scale' },
  { label: 'Gain Muscle', icon: 'dumbbell' },
  { label: 'Improve Energy', icon: 'zap' },
  { label: 'Fix Hair Loss', icon: 'scissors' },
  { label: 'Improve Sleep', icon: 'moon' },
  { label: 'Reduce Pain', icon: 'heart' },
  { label: 'Better Digestion', icon: 'stomach' },
  { label: 'Improve Mood', icon: 'brain' },
  { label: 'Hormone Optimization', icon: 'activity' },
  { label: 'Cardiovascular Health', icon: 'heart-pulse' },
  { label: 'Longevity', icon: 'infinity' },
  { label: 'Autoimmune Management', icon: 'shield' },
];

export default function Step6Goals({ onNext }: StepProps) {
  const { profile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    profile?.primary_goals || []
  );
  const [freeText, setFreeText] = useState('');

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const goals = freeText.trim()
        ? [...selectedGoals, `Note: ${freeText.trim()}`]
        : selectedGoals;

      await updateProfile({ primary_goals: goals });
      onNext();
    } catch (err) {
      console.error('Failed to save goals:', err);
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
          What are your{' '}
          <span className="italic text-[#1F403D]">health goals</span>?
        </h1>
        <p className="text-[#A0ACAB] text-sm mt-3 leading-relaxed">
          Your goals shape which insights, recommendations, and lab markers we
          prioritize in your analysis.
        </p>
      </div>

      {/* Goal cards grid */}
      <div className="grid grid-cols-2 gap-3">
        {GOAL_OPTIONS.map((goal) => {
          const isSelected = selectedGoals.includes(goal.label);
          return (
            <button
              key={goal.label}
              onClick={() => toggleGoal(goal.label)}
              className={`text-left p-5 rounded-[10px] transition-all duration-200 ${
                isSelected
                  ? 'bg-[#1F403D] border border-[#1F403D]'
                  : 'bg-[#15181C] border border-[#2A2E36]/50 hover:border-[#3F4948]/50'
              }`}
            >
              <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#E2E2E6]'}`}>
                {goal.label}
              </p>
              {isSelected && (
                <p className="text-[10px] uppercase tracking-widest text-white/60 mt-1">
                  Selected
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Free text */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block">
          Anything specific you'd like us to know?
        </label>
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="e.g. I've been losing hair for 6 months and my doctor can't figure out why..."
          rows={4}
          className="w-full bg-[#15181C] rounded-[10px] py-4 px-4 border border-[#2A2E36]/50 text-sm text-[#E2E2E6] placeholder:text-[#A0ACAB]/40 focus:outline-none focus:border-[#1F403D] transition-colors resize-none"
        />
      </div>

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
