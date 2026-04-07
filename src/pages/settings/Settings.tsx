import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Sun,
  Moon,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/store/uiStore';

export default function SettingsPage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { addToast, darkMode, toggleDarkMode } = useUIStore();

  // Account form
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName] = useState(profile?.last_name || '');
  const [dob, setDob] = useState(profile?.date_of_birth || '');
  const [sex, setSex] = useState(profile?.sex || '');
  const [heightCm, setHeightCm] = useState(profile?.height_cm?.toString() || '');
  const [weightKg, setWeightKg] = useState(profile?.weight_kg?.toString() || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingAccount, setSavingAccount] = useState(false);

  const handleSaveAccount = async () => {
    setSavingAccount(true);
    try {
      await updateProfile({
        first_name: firstName || null,
        last_name: lastName || null,
        date_of_birth: dob || null,
        sex: (sex as 'male' | 'female' | 'other') || null,
        height_cm: heightCm ? parseFloat(heightCm) : null,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
      });

      // Update email if changed
      if (email !== user?.email) {
        const { error } = await supabase.auth.updateUser({ email });
        if (error) throw error;
      }

      addToast({ type: 'success', title: 'Settings saved successfully' });
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to save', message: String(err) });
    } finally {
      setSavingAccount(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) throw error;
      addToast({ type: 'success', title: 'Password reset email sent' });
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to send reset email', message: String(err) });
    }
  };

  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((n) => n.charAt(0).toUpperCase())
    .join('') || 'U';

  return (
    <div className="min-h-screen bg-[#0A0C0F] px-6 pt-8 pb-32 font-['DM_Sans',sans-serif] space-y-10">
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="p-1"
          >
            <ArrowLeft className="w-5 h-5 text-[#A0ACAB]" strokeWidth={1.5} />
          </button>
          <span className="font-['Newsreader',serif] text-xl text-[#E2E2E6]">
            CauseHealth.
          </span>
          <div className="w-10 h-10 rounded-full bg-[#1F403D] flex items-center justify-center">
            <span className="text-white text-sm font-bold">{initials}</span>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h1 className="font-['Newsreader',serif] text-4xl text-[#E2E2E6]">
            Settings
          </h1>
        </motion.div>
      </div>

      {/* PROFILE INFORMATION */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-4 h-4 text-[#A0ACAB]" strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
            Profile Information
          </span>
        </div>

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-1 block">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full bg-transparent border-b border-[#3F4948]/50 py-4 text-[#E2E2E6] text-sm outline-none focus:border-[#1F403D] placeholder:text-[#A0ACAB]/40 transition-colors"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-1 block">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-transparent border-b border-[#3F4948]/50 py-4 text-[#E2E2E6] text-sm outline-none focus:border-[#1F403D] transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Biological Sex - Segmented Control */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-3 block">
              Biological Sex
            </label>
            <div className="flex rounded-[10px] overflow-hidden border border-[#3F4948]/50">
              {['male', 'female', 'other'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSex(option)}
                  className={`flex-1 py-3 text-xs uppercase tracking-[0.15em] font-bold transition-colors ${
                    sex === option
                      ? 'bg-[#1F403D] text-white'
                      : 'bg-transparent text-[#A0ACAB] hover:text-[#E2E2E6]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-1 block">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="175"
                className="w-full bg-transparent border-b border-[#3F4948]/50 py-4 text-[#E2E2E6] text-sm outline-none focus:border-[#1F403D] placeholder:text-[#A0ACAB]/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-1 block">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="70"
                className="w-full bg-transparent border-b border-[#3F4948]/50 py-4 text-[#E2E2E6] text-sm outline-none focus:border-[#1F403D] placeholder:text-[#A0ACAB]/40 transition-colors"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ACCOUNT */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-4 h-4 text-[#A0ACAB]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
            Account
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[#3F4948]/50 py-4 text-[#E2E2E6] text-sm outline-none focus:border-[#1F403D] transition-colors"
            />
            {email !== user?.email && (
              <p className="text-xs text-[#A0ACAB]/60 mt-2">
                A confirmation email will be sent to verify the change.
              </p>
            )}
          </div>

          <button
            onClick={handleChangePassword}
            className="flex items-center justify-between w-full py-3 border-b border-[#3F4948]/50"
          >
            <span className="text-sm text-[#E2E2E6] font-medium">Change Password</span>
            <ChevronRight className="w-4 h-4 text-[#A0ACAB]/40" />
          </button>
          <p className="text-xs text-[#A0ACAB]/60 -mt-3">
            A password reset link will be sent to your email.
          </p>
        </div>
      </motion.div>

      {/* APPEARANCE */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sun className="w-4 h-4 text-[#A0ACAB]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
            Appearance
          </span>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-[#E2E2E6]" />
            ) : (
              <Sun className="w-5 h-5 text-[#E2E2E6]" />
            )}
            <div>
              <p className="text-sm font-medium text-[#E2E2E6]">
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </p>
              <p className="text-xs text-[#A0ACAB]/60 mt-0.5">
                Toggle between light and dark themes
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
              darkMode ? 'bg-[#1F403D]' : 'bg-[#282D33]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 mt-1 ${
                darkMode ? 'translate-x-6 ml-0.5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <button
          onClick={handleSaveAccount}
          disabled={savingAccount}
          className="w-full bg-[#1F403D] text-white rounded-[10px] py-4 uppercase tracking-[0.15em] font-bold text-sm disabled:opacity-50"
        >
          {savingAccount ? 'Saving...' : 'SAVE CHANGES'}
        </button>

        <button
          onClick={signOut}
          className="w-full text-center py-3"
        >
          <span className="text-[#CF6679] uppercase tracking-[0.15em] font-bold text-sm">
            SIGN OUT
          </span>
        </button>

        {/* Encryption Badge */}
        <div className="text-center pt-4">
          <span className="text-[10px] text-[#A0ACAB]/40 uppercase tracking-[0.2em]">
            ENCRYPTION: AES-256 CLINICAL GRADE
          </span>
        </div>
      </motion.div>
    </div>
  );
}
