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
  const [lastName, setLastName] = useState(profile?.last_name || '');
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
    <div className="min-h-screen bg-[#FAF9F5] px-6 pt-8 pb-32 font-['Manrope',sans-serif] space-y-12">
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="p-1"
          >
            <ArrowLeft className="w-5 h-5 text-[#01261F]" strokeWidth={1.5} />
          </button>
          <span className="font-['Fraunces',serif] italic text-xl text-[#1A3C34]">
            CauseHealth.
          </span>
          <div className="w-10 h-10 rounded-full bg-[#1A3C34] flex items-center justify-center">
            <span className="text-white text-sm font-bold">{initials}</span>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h1 className="font-['Fraunces',serif] italic text-4xl text-[#01261F]">
            Settings
          </h1>
          <p className="text-sm text-[#414846] mt-3 leading-relaxed max-w-sm">
            Manage your health profile and account preferences.
          </p>
        </motion.div>
      </div>

      {/* PROFILE INFORMATION */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-[#414846]" strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846]">
            Profile Information
          </span>
        </div>

        <div className="bg-[#F4F4F0] rounded-[32px] p-8 space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846] mb-2 block">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full bg-white rounded-xl border border-[#C1C8C4]/20 px-5 py-4 text-[#1B1C1A] text-sm outline-none focus:ring-2 focus:ring-[#1A3C34]/20 placeholder:text-[#414846]/40"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846] mb-2 block">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="w-full bg-white rounded-xl border border-[#C1C8C4]/20 px-5 py-4 text-[#1B1C1A] text-sm outline-none focus:ring-2 focus:ring-[#1A3C34]/20 placeholder:text-[#414846]/40"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846] mb-2 block">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-white rounded-xl border border-[#C1C8C4]/20 px-5 py-4 text-[#1B1C1A] text-sm outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846] mb-2 block">
              Sex
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full bg-white rounded-xl border border-[#C1C8C4]/20 px-5 py-4 text-[#1B1C1A] text-sm outline-none focus:ring-2 focus:ring-[#1A3C34]/20 appearance-none"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846] mb-2 block">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="175"
                className="w-full bg-white rounded-xl border border-[#C1C8C4]/20 px-5 py-4 text-[#1B1C1A] text-sm outline-none focus:ring-2 focus:ring-[#1A3C34]/20 placeholder:text-[#414846]/40"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846] mb-2 block">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="70"
                className="w-full bg-white rounded-xl border border-[#C1C8C4]/20 px-5 py-4 text-[#1B1C1A] text-sm outline-none focus:ring-2 focus:ring-[#1A3C34]/20 placeholder:text-[#414846]/40"
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
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#414846]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846]">
            Account
          </span>
        </div>

        <div className="bg-[#F4F4F0] rounded-[32px] p-8 space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846] mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded-xl border border-[#C1C8C4]/20 px-5 py-4 text-[#1B1C1A] text-sm outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
            />
            {email !== user?.email && (
              <p className="text-xs text-[#414846]/60 mt-2">
                A confirmation email will be sent to verify the change.
              </p>
            )}
          </div>

          <button
            onClick={handleChangePassword}
            className="flex items-center justify-between w-full py-3"
          >
            <span className="text-sm text-[#01261F] font-medium">Change Password</span>
            <ChevronRight className="w-4 h-4 text-[#414846]/40" />
          </button>
          <p className="text-xs text-[#414846]/60 -mt-3">
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
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-4 h-4 text-[#414846]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846]">
            Appearance
          </span>
        </div>

        <div className="bg-[#F4F4F0] rounded-[32px] p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-[#01261F]" />
              ) : (
                <Sun className="w-5 h-5 text-[#01261F]" />
              )}
              <div>
                <p className="text-sm font-medium text-[#01261F]">
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs text-[#414846]/60 mt-0.5">
                  Toggle between light and dark themes
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:ring-offset-2 ${
                darkMode ? 'bg-[#1A3C34]' : 'bg-[#E3E2DF]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 mt-1 ${
                  darkMode ? 'translate-x-6 ml-0.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
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
          className="w-full bg-[#1A3C34] text-white rounded-xl py-4 uppercase tracking-[0.15em] font-bold text-sm disabled:opacity-50"
        >
          {savingAccount ? 'Saving...' : 'SAVE CHANGES'}
        </button>

        <button
          onClick={signOut}
          className="w-full text-center py-3"
        >
          <span className="text-[#BA1A1A] uppercase tracking-[0.15em] font-bold text-sm">
            SIGN OUT
          </span>
        </button>
      </motion.div>
    </div>
  );
}
