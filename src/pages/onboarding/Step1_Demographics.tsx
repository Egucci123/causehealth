import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step1Demographics({ onNext }: StepProps) {
  const { profile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    date_of_birth: profile?.date_of_birth || '',
    sex: (profile?.sex as string) || '',
    height_cm: profile?.height_cm?.toString() || '',
    weight_kg: profile?.weight_kg?.toString() || '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        date_of_birth: form.date_of_birth || null,
        sex: (form.sex as 'male' | 'female' | 'other') || null,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      });
      onNext();
    } catch {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-24 font-['Manrope',sans-serif]">
      {/* Welcome header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#BEE8DC] text-[#3F665C]"
        >
          <User className="w-7 h-7" />
        </motion.div>
        <h1 className="font-['Fraunces',serif] text-2xl font-semibold text-[#012D1D]">
          Let's get to know you
        </h1>
        <p className="text-[#414844] text-sm max-w-md mx-auto">
          CauseHealth analyzes your labs, medications, and symptoms to find the
          root causes behind how you feel. We start with a few basics so we can
          personalize everything for you.
        </p>
      </div>

      {/* Privacy note */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#3F665C] mt-0.5 shrink-0" />
        <p className="text-xs text-[#414844]">
          Your data is encrypted and private. We never share your health
          information with third parties. You can delete your data at any time.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
              First Name
            </label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => update('first_name', e.target.value)}
              placeholder="Jane"
              className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
              Last Name
            </label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => update('last_name', e.target.value)}
              placeholder="Doe"
              className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
            Date of Birth
          </label>
          <input
            type="date"
            value={form.date_of_birth}
            onChange={(e) => update('date_of_birth', e.target.value)}
            className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
            Biological Sex
          </label>
          <select
            value={form.sex}
            onChange={(e) => update('sex', e.target.value)}
            className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30 appearance-none"
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
              Height (cm)
            </label>
            <input
              type="number"
              value={form.height_cm}
              onChange={(e) => update('height_cm', e.target.value)}
              placeholder="170"
              min={50}
              max={250}
              className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mb-1.5 block">
              Weight (kg)
            </label>
            <input
              type="number"
              value={form.weight_kg}
              onChange={(e) => update('weight_kg', e.target.value)}
              placeholder="70"
              min={20}
              max={300}
              className="w-full bg-white rounded-2xl py-3 px-4 shadow-[0_8px_24px_rgba(14,55,39,0.04)] text-sm text-[#012D1D] placeholder:text-[#414844]/40 focus:outline-none focus:ring-2 focus:ring-[#3F665C]/30"
            />
          </div>
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
