import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const GOAL_OPTIONS = [
  'Optimize lab results',
  'Reduce medications',
  'Lose weight',
  'Gain muscle',
  'Improve energy',
  'Fix hair loss',
  'Improve sleep',
  'Reduce pain',
  'Better digestion',
  'Improve mood',
  'Hormone optimization',
  'Cardiovascular health',
  'Longevity',
  'Autoimmune management',
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
    <div className="space-y-6 pb-24 font-['Manrope',sans-serif]">
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#BEE8DC] text-[#3F665C]"
        >
          <Target className="w-7 h-7" />
        </motion.div>
        <h1 className="font-['Fraunces',serif] text-2xl font-semibold text-[#012D1D]">
          What Do You Want to Achieve?
        </h1>
        <p className="text-[#414844] text-sm max-w-md mx-auto">
          Your goals shape which insights, recommendations, and lab markers we
          prioritize for you.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-4">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
          Select your goals
        </h2>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = selectedGoals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-white text-[#414844] shadow-sm hover:shadow-md'
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-3">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
          Anything specific you'd like us to know?
        </h2>
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="e.g. I've been losing hair for 6 months and my doctor can't figure out why..."
          rows={4}
          className="w-full bg-[#EFEEEB] rounded-xl py-3 px-4 border border-[#C1C8C2]/30 text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30 resize-none"
        />
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
