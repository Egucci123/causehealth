import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const DIET_OPTIONS = [
  { value: '', label: 'Select your diet...' },
  { value: 'standard_american', label: 'Standard American' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'keto', label: 'Keto' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'carnivore', label: 'Carnivore' },
  { value: 'no_specific', label: 'No specific diet' },
];

const EXERCISE_OPTIONS = [
  { value: '', label: 'How often do you exercise?' },
  { value: 'sedentary', label: 'Sedentary' },
  { value: '1_2_per_week', label: '1-2x per week' },
  { value: '3_4_per_week', label: '3-4x per week' },
  { value: '5_plus_per_week', label: '5+ per week' },
  { value: 'daily', label: 'Daily' },
];

const ALCOHOL_OPTIONS = [
  { value: '', label: 'How often do you drink?' },
  { value: 'never', label: 'Never' },
  { value: 'rarely', label: 'Rarely' },
  { value: '1_2_per_week', label: '1-2 per week' },
  { value: '3_5_per_week', label: '3-5 per week' },
  { value: 'daily', label: 'Daily' },
];

const SMOKING_OPTIONS = [
  { value: '', label: 'Smoking status' },
  { value: 'never', label: 'Never' },
  { value: 'former', label: 'Former' },
  { value: 'current', label: 'Current' },
];

const ENVIRONMENTAL_EXPOSURES = [
  'Mold exposure',
  'Heavy metals',
  'Pesticides',
  'Air pollution',
  'Well water',
  'None',
];

export default function Step5Lifestyle({ onNext }: StepProps) {
  const { healthProfile, updateHealthProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const [sleepHours, setSleepHours] = useState(
    healthProfile?.sleep_hours?.toString() || ''
  );
  const [sleepQuality, setSleepQuality] = useState(
    healthProfile?.sleep_quality || 5
  );
  const [snoring, setSnoring] = useState(healthProfile?.snoring || false);
  const [dietType, setDietType] = useState(healthProfile?.diet_type || '');
  const [exerciseFreq, setExerciseFreq] = useState(
    healthProfile?.exercise_frequency || ''
  );
  const [stressLevel, setStressLevel] = useState(
    healthProfile?.stress_level || 5
  );
  const [alcohol, setAlcohol] = useState(
    healthProfile?.alcohol_frequency || ''
  );
  const [smoking, setSmoking] = useState(healthProfile?.smoking_status || '');
  const [exposures, setExposures] = useState<string[]>(
    healthProfile?.environmental_exposures || []
  );

  function toggleExposure(exposure: string) {
    if (exposure === 'None') {
      setExposures((prev) => (prev.includes('None') ? [] : ['None']));
      return;
    }
    setExposures((prev) => {
      const without = prev.filter((e) => e !== 'None');
      return without.includes(exposure)
        ? without.filter((e) => e !== exposure)
        : [...without, exposure];
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateHealthProfile({
        sleep_hours: sleepHours ? Number(sleepHours) : null,
        sleep_quality: sleepQuality,
        snoring,
        diet_type: dietType || null,
        exercise_frequency: exerciseFreq || null,
        stress_level: stressLevel,
        alcohol_frequency: alcohol || null,
        smoking_status: smoking || null,
        environmental_exposures: exposures.filter((e) => e !== 'None'),
      });
      onNext();
    } catch {
      // Network error handled silently
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
          <Sun className="w-7 h-7" />
        </motion.div>
        <h1 className="font-['Fraunces',serif] text-2xl font-semibold text-[#012D1D]">
          Your Daily Life
        </h1>
        <p className="text-[#414844] text-sm max-w-md mx-auto">
          Lifestyle factors are powerful drivers of your lab results and how you
          feel. This helps us give you more accurate insights.
        </p>
      </div>

      {/* Sleep */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-4">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
          Sleep
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
              Hours per night
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="7"
              className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
              Sleep Quality: {sleepQuality}/10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={sleepQuality}
              onChange={(e) => setSleepQuality(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-[#C1ECD4] accent-[#1B4332]"
            />
            <div className="flex justify-between text-xs text-[#414844]/60 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSnoring(!snoring)}
          className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            snoring
              ? 'bg-[#1B4332] text-white'
              : 'bg-white text-[#414844] shadow-sm'
          }`}
        >
          I snore or have been told I snore
        </button>
      </div>

      {/* Diet & Exercise */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-4">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
          Diet & Exercise
        </h2>
        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
            Diet Type
          </label>
          <select
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30 appearance-none"
          >
            {DIET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
            Exercise Frequency
          </label>
          <select
            value={exerciseFreq}
            onChange={(e) => setExerciseFreq(e.target.value)}
            className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30 appearance-none"
          >
            {EXERCISE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stress */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-4">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
          Stress
        </h2>
        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
            Stress Level: {stressLevel}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={stressLevel}
            onChange={(e) => setStressLevel(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-[#C1ECD4] accent-[#1B4332]"
          />
          <div className="flex justify-between text-xs text-[#414844]/60 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Substances */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-4">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
          Substances
        </h2>
        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
            Alcohol
          </label>
          <select
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30 appearance-none"
          >
            {ALCOHOL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
            Smoking
          </label>
          <select
            value={smoking}
            onChange={(e) => setSmoking(e.target.value)}
            className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30 appearance-none"
          >
            {SMOKING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Environmental exposures */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-4">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
          Environmental Exposures
        </h2>
        <p className="text-xs text-[#414844]/60">
          Select any environmental factors you have been exposed to.
        </p>
        <div className="flex flex-wrap gap-2">
          {ENVIRONMENTAL_EXPOSURES.map((exposure) => {
            const isSelected = exposures.includes(exposure);
            return (
              <button
                key={exposure}
                onClick={() => toggleExposure(exposure)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-white text-[#414844] shadow-sm hover:shadow-md'
                }`}
              >
                {exposure}
              </button>
            );
          })}
        </div>
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
