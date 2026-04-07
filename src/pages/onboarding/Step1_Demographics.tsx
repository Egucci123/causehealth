import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step1Demographics({ onNext }: StepProps) {
  const { profile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
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
    } catch (err) {
      console.error('Failed to save demographics:', err);
      setError('Failed to save your information. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const sexOptions = ['male', 'female', 'other'] as const;

  return (
    <div className="space-y-8 font-['DM_Sans',sans-serif]">
      {/* Header */}
      <div>
        <h1 className="font-['Newsreader',serif] text-4xl text-[#E2E2E6] leading-tight">
          Build your{' '}
          <span className="italic text-[#1F403D]/80">health profile</span>
        </h1>
        <p className="text-[#A0ACAB] text-sm mt-3 leading-relaxed">
          We use this data to calibrate your longevity baseline and personalize
          every analysis to your unique biology.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#CF6679]/10 border border-[#CF6679]/30 rounded-[10px] text-sm text-[#CF6679]">
          {error}
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-6">
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
            First Name
          </label>
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => update('first_name', e.target.value)}
            placeholder="Jane"
            className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm placeholder:text-[#A0ACAB]/40 focus:outline-none focus:border-[#1F403D] transition-colors"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={form.date_of_birth}
            onChange={(e) => update('date_of_birth', e.target.value)}
            className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm focus:outline-none focus:border-[#1F403D] transition-colors [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-3">
            Biological Sex
          </label>
          <div className="flex gap-2">
            {sexOptions.map((option) => (
              <button
                key={option}
                onClick={() => update('sex', option)}
                className={`flex-1 py-3 rounded-[10px] text-xs uppercase tracking-[0.15em] font-bold transition-all duration-200 ${
                  form.sex === option
                    ? 'bg-[#1F403D] text-white'
                    : 'bg-transparent text-[#A0ACAB] border border-[#3F4948]/50 hover:border-[#3F4948]'
                }`}
              >
                {option === 'other' ? 'Other' : option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
              Height (CM)
            </label>
            <input
              type="number"
              value={form.height_cm}
              onChange={(e) => update('height_cm', e.target.value)}
              placeholder="170"
              min={50}
              max={250}
              className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm placeholder:text-[#A0ACAB]/40 focus:outline-none focus:border-[#1F403D] transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block mb-2">
              Weight (KG)
            </label>
            <input
              type="number"
              value={form.weight_kg}
              onChange={(e) => update('weight_kg', e.target.value)}
              placeholder="70"
              min={20}
              max={300}
              className="w-full bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm placeholder:text-[#A0ACAB]/40 focus:outline-none focus:border-[#1F403D] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[#1F403D] text-white rounded-[10px] py-4 uppercase tracking-[0.15em] text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Proceed to Vitals \u2192'}
      </button>

      {/* Compliance footer */}
      <p className="text-[10px] text-[#A0ACAB]/40 text-center tracking-wide leading-relaxed">
        ENCRYPTION: AES-256 CLINICAL GRADE &nbsp;/&nbsp; REGULATORY: HIPAA / GDPR COMPLIANT
      </p>
    </div>
  );
}
