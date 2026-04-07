import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChevronRight } from 'lucide-react';

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
    date_of_birth: profile?.date_of_birth || '',
    sex: (profile?.sex as string) || 'male',
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
        date_of_birth: form.date_of_birth || null,
        sex: (form.sex as 'male' | 'female' | 'other') || null,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      });
      onNext();
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "block text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-1 group-focus-within:text-[#1F403D] transition-colors";
  const inputClass = "w-full bg-transparent border-0 border-b border-[#3F4948] py-3 px-0 text-lg font-medium text-[#E2E2E6] focus:ring-0 focus:border-[#1F403D] focus:outline-none transition-all placeholder:text-[#A0ACAB]/30";

  return (
    <div>
      <div className="mb-16">
        <h1 className="font-['Newsreader',serif] text-5xl text-[#E2E2E6] tracking-tight leading-[1.1] mb-6">
          Build your <span className="italic font-light">health profile</span>
        </h1>
        <p className="text-[#A0ACAB]/80 text-lg font-light leading-relaxed max-w-md">
          Accurate biometric data allows our algorithms to calibrate your specific longevity baseline.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#CF6679]/10 border border-[#CF6679]/30 rounded text-[#CF6679] text-sm">{error}</div>
      )}

      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="group relative">
            <label className={labelClass}>First Name</label>
            <input type="text" placeholder="Enter name" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} className={inputClass} />
          </div>
          <div className="group relative">
            <label className={labelClass}>Date of Birth</label>
            <input type="date" value={form.date_of_birth} onChange={(e) => update('date_of_birth', e.target.value)} className={`${inputClass} appearance-none`} style={{ colorScheme: 'dark' }} />
          </div>
          <div className="md:col-span-2 space-y-4">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">Biological Sex</label>
            <div className="flex border border-[#3F4948]/30 divide-x divide-[#3F4948]/30">
              {(['male', 'female', 'other'] as const).map((sex) => (
                <button key={sex} type="button" onClick={() => update('sex', sex)}
                  className={`flex-1 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${form.sex === sex ? 'bg-[#1F403D] text-white' : 'text-[#A0ACAB] hover:bg-[#1E2226]'}`}
                >{sex}</button>
              ))}
            </div>
          </div>
          <div className="group relative">
            <label className={labelClass}>Height <span className="text-[#A0ACAB]/40 font-normal tracking-normal">(cm)</span></label>
            <input type="number" placeholder="000" value={form.height_cm} onChange={(e) => update('height_cm', e.target.value)} className={inputClass} />
          </div>
          <div className="group relative">
            <label className={labelClass}>Weight <span className="text-[#A0ACAB]/40 font-normal tracking-normal">(kg)</span></label>
            <input type="number" placeholder="00" value={form.weight_kg} onChange={(e) => update('weight_kg', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-center justify-between border-t border-[#3F4948]/20 pt-10 gap-8">
          <div className="order-2 md:order-1">
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#A0ACAB]/40 leading-relaxed font-medium">
              Encryption: AES-256 Clinical Grade<br />Regulatory: HIPAA / GDPR Compliant
            </p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="order-1 md:order-2 group flex items-center justify-between gap-8 bg-[#1F403D] text-white px-8 py-5 font-bold tracking-[0.2em] uppercase text-xs active:opacity-90 transition-all w-full md:w-auto disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Proceed to vitals'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
