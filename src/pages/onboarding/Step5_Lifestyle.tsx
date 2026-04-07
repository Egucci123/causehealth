import { useState } from 'react';
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
    } catch (err) {
      console.error('Failed to save lifestyle data:', err);
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
          Tell us about your{' '}
          <span className="italic text-[#1F403D]">daily life</span>
        </h1>
        <p className="text-[#A0ACAB] text-sm mt-3 leading-relaxed">
          Lifestyle factors are powerful drivers of your lab results. This data
          sharpens every analysis we run.
        </p>
      </div>

      {/* Sleep */}
      <div className="space-y-4">
        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
          Sleep
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
              Hours per Night
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="7"
              className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm placeholder:text-[#A0ACAB]/40 focus:outline-none focus:border-[#1F403D] transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
              Sleep Quality: {sleepQuality}/10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={sleepQuality}
              onChange={(e) => setSleepQuality(Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none bg-[#282D33] accent-[#1F403D] mt-4"
            />
            <div className="flex justify-between text-[10px] text-[#A0ACAB]/60 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSnoring(!snoring)}
          className={`px-4 py-3 rounded-[10px] text-sm font-medium transition-all duration-200 ${
            snoring
              ? 'bg-[#1F403D] text-white border border-[#1F403D]'
              : 'bg-transparent text-[#A0ACAB] border border-[#3F4948]/50'
          }`}
        >
          I snore or have been told I snore
        </button>
      </div>

      {/* Diet & Exercise */}
      <div className="space-y-4">
        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
          Diet & Exercise
        </h2>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
            Diet Type
          </label>
          <select
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm focus:outline-none focus:border-[#1F403D] appearance-none"
          >
            {DIET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#15181C]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
            Exercise Frequency
          </label>
          <select
            value={exerciseFreq}
            onChange={(e) => setExerciseFreq(e.target.value)}
            className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm focus:outline-none focus:border-[#1F403D] appearance-none"
          >
            {EXERCISE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#15181C]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stress */}
      <div className="space-y-4">
        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
          Stress
        </h2>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
            Stress Level: {stressLevel}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={stressLevel}
            onChange={(e) => setStressLevel(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none bg-[#282D33] accent-[#1F403D]"
          />
          <div className="flex justify-between text-[10px] text-[#A0ACAB]/60 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Substances */}
      <div className="space-y-4">
        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
          Substances
        </h2>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
            Alcohol
          </label>
          <select
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm focus:outline-none focus:border-[#1F403D] appearance-none"
          >
            {ALCOHOL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#15181C]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
            Smoking
          </label>
          <select
            value={smoking}
            onChange={(e) => setSmoking(e.target.value)}
            className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm focus:outline-none focus:border-[#1F403D] appearance-none"
          >
            {SMOKING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#15181C]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Environmental exposures */}
      <div className="space-y-4">
        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
          Environmental Exposures
        </h2>
        <p className="text-[#A0ACAB]/60 text-xs">
          Select any environmental factors you have been exposed to.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ENVIRONMENTAL_EXPOSURES.map((exposure) => {
            const isSelected = exposures.includes(exposure);
            return (
              <button
                key={exposure}
                onClick={() => toggleExposure(exposure)}
                className={`text-left px-4 py-3 rounded-[10px] text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1F403D] text-white border border-[#1F403D]'
                    : 'bg-[#15181C] text-[#A0ACAB] border border-[#2A2E36]/50 hover:border-[#3F4948]/50'
                }`}
              >
                {exposure}
              </button>
            );
          })}
        </div>
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
