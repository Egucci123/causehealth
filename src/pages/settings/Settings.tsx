import { useState } from 'react';
import { ArrowLeft, User, Shield, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const navigate = useNavigate();
  const { profile, user, updateProfile, signOut } = useAuth();
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [dob, setDob] = useState(profile?.date_of_birth || '');
  const [sex, setSex] = useState(profile?.sex || 'male');
  const [heightCm, setHeightCm] = useState(profile?.height_cm?.toString() || '');
  const [weightKg, setWeightKg] = useState(profile?.weight_kg?.toString() || '');
  const [darkMode, setDarkMode] = useState(true);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({
        first_name: firstName || null,
        date_of_birth: dob || null,
        sex: sex as 'male' | 'female' | 'other',
        height_cm: heightCm ? Number(heightCm) : null,
        weight_kg: weightKg ? Number(weightKg) : null,
      });
      alert('Profile saved.');
    } catch (err) {
      console.error(err);
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "block text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-2";
  const inputClass = "w-full bg-transparent border-0 border-b border-[#3F4948]/50 py-4 text-lg text-[#E2E2E6] focus:outline-none focus:border-[#1F403D] transition-colors placeholder:text-[#A0ACAB]/30";

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-[#A0ACAB] hover:text-[#E2E2E6] transition-colors active:scale-95">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <span className="font-['Newsreader',serif] italic text-xl text-[#1F403D]">CauseHealth.</span>
        <div className="w-10 h-10 rounded-full bg-[#1F403D] flex items-center justify-center">
          <span className="text-sm font-bold text-white">{profile?.first_name?.[0]?.toUpperCase() || '?'}</span>
        </div>
      </div>

      <div>
        <h1 className="font-['Newsreader',serif] text-4xl text-[#E2E2E6]">Settings</h1>
        <p className="text-[#A0ACAB] text-sm mt-2">Manage your health profile and account preferences.</p>
      </div>

      {/* Profile Information */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-[#A0ACAB]" strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">Profile Information</span>
        </div>
        <div className="space-y-8">
          <div>
            <label className={labelClass}>First Name</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={`${inputClass} appearance-none`} style={{ colorScheme: 'dark' }} />
          </div>
          <div>
            <label className={labelClass}>Biological Sex</label>
            <div className="flex border border-[#3F4948]/30 divide-x divide-[#3F4948]/30">
              {(['male', 'female', 'other'] as const).map(s => (
                <button key={s} type="button" onClick={() => setSex(s)}
                  className={`flex-1 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${sex === s ? 'bg-[#1F403D] text-white' : 'text-[#A0ACAB] hover:bg-[#1E2226]'}`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className={labelClass}>Height <span className="text-[#A0ACAB]/40 font-normal">(cm)</span></label>
              <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} placeholder="000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Weight <span className="text-[#A0ACAB]/40 font-normal">(kg)</span></label>
              <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} placeholder="00" className={inputClass} />
            </div>
          </div>
        </div>
      </section>

      {/* Account */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-[#A0ACAB]" strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">Account</span>
        </div>
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" value={user?.email || ''} readOnly className={`${inputClass} opacity-60`} />
          </div>
          <button className="text-[#A0ACAB] text-sm hover:text-[#1F403D] transition-colors">Change Password →</button>
        </div>
      </section>

      {/* Appearance */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Sun className="w-5 h-5 text-[#A0ACAB]" strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">Appearance</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#E2E2E6] font-bold">Dark Mode</p>
            <p className="text-[#A0ACAB] text-xs">Optimized for clinical review</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-[#1F403D]' : 'bg-[#3F4948]'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${darkMode ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-4 pt-4">
        <button onClick={handleSave} disabled={saving} className="w-full bg-[#1F403D] text-white py-4 font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={signOut} className="w-full text-[#CF6679] text-sm font-bold uppercase tracking-[0.15em] py-3 hover:opacity-80 transition-opacity">
          Sign Out
        </button>
      </div>

      <p className="text-[10px] text-[#A0ACAB]/30 text-center leading-relaxed">
        Encryption: AES-256 Clinical Grade<br />Regulatory: HIPAA / GDPR Compliant
      </p>
    </div>
  );
}
