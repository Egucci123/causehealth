import { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Search, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { FamilyHistory } from '@/types/user.types';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const COMMON_DIAGNOSES = [
  'Ulcerative Colitis',
  "Crohn's Disease",
  'Type 2 Diabetes',
  'Hypothyroidism',
  "Hashimoto's",
  'Hypertension',
  'High Cholesterol',
  'PCOS',
  'Anxiety',
  'Depression',
  'Asthma',
  'Sleep Apnea',
  'IBS',
  'Celiac Disease',
  'Rheumatoid Arthritis',
  'Psoriasis',
  'Endometriosis',
  'GERD',
  'Migraine',
  'Fibromyalgia',
  'None',
];

const FAMILY_HISTORY_OPTIONS: { key: keyof Omit<FamilyHistory, 'notes'>; label: string }[] = [
  { key: 'cardiovascular', label: 'Cardiovascular Disease' },
  { key: 'autoimmune', label: 'Autoimmune Conditions' },
  { key: 'cancer', label: 'Cancer' },
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'thyroid', label: 'Thyroid Disorders' },
  { key: 'mental_health', label: 'Mental Health' },
];

export default function Step2Diagnoses({ onNext }: StepProps) {
  const { healthProfile, updateHealthProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customDiagnosis, setCustomDiagnosis] = useState('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>(
    healthProfile?.diagnoses || []
  );
  const [familyHistory, setFamilyHistory] = useState<FamilyHistory>(
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
  const [geneticTesting, setGeneticTesting] = useState(
    healthProfile?.genetic_testing_done || false
  );

  const filteredDiagnoses = COMMON_DIAGNOSES.filter((d) =>
    d.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function toggleDiagnosis(diagnosis: string) {
    if (diagnosis === 'None') {
      setSelectedDiagnoses((prev) =>
        prev.includes('None') ? [] : ['None']
      );
      return;
    }
    setSelectedDiagnoses((prev) => {
      const without = prev.filter((d) => d !== 'None');
      return without.includes(diagnosis)
        ? without.filter((d) => d !== diagnosis)
        : [...without, diagnosis];
    });
  }

  function addCustom() {
    const trimmed = customDiagnosis.trim();
    if (trimmed && !selectedDiagnoses.includes(trimmed)) {
      setSelectedDiagnoses((prev) => [...prev.filter((d) => d !== 'None'), trimmed]);
    }
    setCustomDiagnosis('');
  }

  function toggleFamilyHistory(key: keyof Omit<FamilyHistory, 'notes'>) {
    setFamilyHistory((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateHealthProfile({
        diagnoses: selectedDiagnoses.filter((d) => d !== 'None'),
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
    <div className="space-y-6 pb-24 font-['Manrope',sans-serif]">
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#BEE8DC] text-[#3F665C]"
        >
          <Stethoscope className="w-7 h-7" />
        </motion.div>
        <h1 className="font-['Fraunces',serif] text-2xl font-semibold text-[#012D1D]">
          Your Health History
        </h1>
        <p className="text-[#414844] text-sm max-w-md mx-auto">
          Knowing your diagnoses helps us identify nutrient depletions,
          medication interactions, and root-cause patterns.
        </p>
      </div>

      {/* Diagnoses section */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-4">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
          Current Diagnoses
        </h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#414844]/60" />
          <input
            type="text"
            placeholder="Search diagnoses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 bg-[#EFEEEB] rounded-xl py-3 px-4 border border-[#C1C8C2]/30 text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
          />
        </div>

        {/* Diagnosis chips */}
        <div className="flex flex-wrap gap-2">
          {filteredDiagnoses.map((diagnosis) => {
            const isSelected = selectedDiagnoses.includes(diagnosis);
            return (
              <button
                key={diagnosis}
                onClick={() => toggleDiagnosis(diagnosis)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-white text-[#414844] shadow-sm hover:shadow-md'
                }`}
              >
                {diagnosis}
              </button>
            );
          })}
        </div>

        {/* Custom add */}
        <div className="flex gap-2">
          <input
            placeholder="Add a diagnosis not listed..."
            value={customDiagnosis}
            onChange={(e) => setCustomDiagnosis(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            className="flex-1 bg-[#EFEEEB] rounded-xl py-3 px-4 border border-[#C1C8C2]/30 text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
          />
          <button
            onClick={addCustom}
            disabled={!customDiagnosis.trim()}
            className="flex items-center gap-1 px-4 py-3 rounded-full text-[#3F665C] text-sm font-medium hover:opacity-70 transition-opacity disabled:opacity-30"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Selected custom diagnoses */}
        {selectedDiagnoses.filter((d) => !COMMON_DIAGNOSES.includes(d)).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedDiagnoses
              .filter((d) => !COMMON_DIAGNOSES.includes(d))
              .map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-[#1B4332] text-white"
                >
                  {d}
                  <button onClick={() => toggleDiagnosis(d)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Family history */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-4">
        <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
          Family History
        </h2>
        <p className="text-xs text-[#414844]/60">
          Select any conditions that run in your immediate family.
        </p>
        <div className="flex flex-wrap gap-2">
          {FAMILY_HISTORY_OPTIONS.map(({ key, label }) => {
            const isSelected = familyHistory[key];
            return (
              <button
                key={key}
                onClick={() => toggleFamilyHistory(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-white text-[#414844] shadow-sm hover:shadow-md'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Genetic testing */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5">
        <button
          onClick={() => setGeneticTesting(!geneticTesting)}
          className={`w-full flex items-center gap-3 text-left px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            geneticTesting
              ? 'bg-[#1B4332] text-white'
              : 'bg-white text-[#414844] shadow-sm'
          }`}
        >
          <div>
            <span>I have had genetic testing done</span>
          </div>
        </button>
        <p className="text-xs text-[#414844]/60 mt-2 pl-3">
          (e.g. 23andMe, AncestryDNA, or clinical genetic testing)
        </p>
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
