import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Save,
  Trash2,
  Download,
  AlertTriangle,
  Moon,
  Sun,
  Check,
  Crown,
  Zap,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/store/uiStore';
import type { SubscriptionTier } from '@/types/user.types';

function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-warm dark:text-white">{label}</p>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 ${
          checked ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

const TIER_DETAILS: Record<SubscriptionTier, { name: string; price: string; icon: React.ElementType; features: string[] }> = {
  free: {
    name: 'Free',
    price: '$0/mo',
    icon: User,
    features: [
      '1 lab upload',
      'Basic supplement info',
      'Limited analysis',
    ],
  },
  core: {
    name: 'Core',
    price: '$19/mo',
    icon: Zap,
    features: [
      'Unlimited lab uploads',
      'Full wellness plans',
      'Medication checker',
      'Trend tracking',
      'Hormone & hair modules',
    ],
  },
  premium: {
    name: 'Premium',
    price: '$39/mo',
    icon: Crown,
    features: [
      'Everything in Core',
      'Doctor prep documents',
      'Genetic upload & analysis',
      'Insurance coverage guide',
      'Priority AI processing',
    ],
  },
  family: {
    name: 'Family',
    price: '$59/mo',
    icon: Users,
    features: [
      'Everything in Premium',
      'Up to 4 profiles',
      'Family health dashboard',
      'Shared wellness goals',
    ],
  },
};

const SETTINGS_TABS = [
  { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'privacy', label: 'Privacy', icon: <Lock className="w-4 h-4" /> },
  { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
];

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

  // Notification preferences
  const [emailNotifs, setEmailNotifs] = useState(profile?.notification_preferences?.email ?? true);
  const [labReminders, setLabReminders] = useState(profile?.notification_preferences?.lab_reminders ?? true);
  const [suppReminders, setSuppReminders] = useState(profile?.notification_preferences?.supplement_reminders ?? true);
  const [planUpdates, setPlanUpdates] = useState(profile?.notification_preferences?.plan_updates ?? true);
  const [savingNotifs, setSavingNotifs] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

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

      addToast({ type: 'success', title: 'Account settings saved' });
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to save', message: String(err) });
    } finally {
      setSavingAccount(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifs(true);
    try {
      await updateProfile({
        notification_preferences: {
          email: emailNotifs,
          lab_reminders: labReminders,
          supplement_reminders: suppReminders,
          plan_updates: planUpdates,
        },
      });
      addToast({ type: 'success', title: 'Notification preferences saved' });
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to save', message: String(err) });
    } finally {
      setSavingNotifs(false);
    }
  };

  const handleExportData = () => {
    alert('Data export coming soon! This feature is under development.');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    try {
      // In production, this would call a server function to fully delete the account
      addToast({ type: 'info', title: 'Account deletion requested. You will receive a confirmation email.' });
      setShowDeleteModal(false);
      await signOut();
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to delete account', message: String(err) });
    }
  };

  const handleClearHealthData = async () => {
    if (!user) return;
    try {
      await Promise.all([
        supabase.from('wellness_plans').delete().eq('user_id', user.id),
        supabase.from('progress_entries').delete().eq('user_id', user.id),
        supabase.from('doctor_prep_documents').delete().eq('user_id', user.id),
      ]);
      addToast({ type: 'success', title: 'Health data cleared' });
      setShowClearDataModal(false);
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to clear data', message: String(err) });
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

  const currentTier = profile?.subscription_tier || 'free';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader title="Settings" />

      <Tabs tabs={SETTINGS_TABS} defaultTab="account">
        {(activeTab) => (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-base font-semibold text-slate-warm dark:text-white mb-4">
                    Profile Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <Input
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                      <Select
                        label="Sex"
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        options={[
                          { value: 'male', label: 'Male' },
                          { value: 'female', label: 'Female' },
                          { value: 'other', label: 'Other' },
                        ]}
                        placeholder="Select..."
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Height (cm)"
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                      />
                      <Input
                        label="Weight (kg)"
                        type="number"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                      />
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-slate-warm dark:text-white mb-4">
                    Account
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      hint={email !== user?.email ? 'A confirmation email will be sent to verify the change.' : undefined}
                    />
                    <div>
                      <Button variant="outline" size="sm" onClick={handleChangePassword}>
                        Change Password
                      </Button>
                      <p className="text-xs text-slate-400 mt-1">
                        A password reset link will be sent to your email.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-slate-warm dark:text-white mb-4">
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {darkMode ? (
                        <Moon className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-amber-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-warm dark:text-white">
                          {darkMode ? 'Dark Mode' : 'Light Mode'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Toggle between light and dark themes
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 ${
                        darkMode ? 'bg-teal-500' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                          darkMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </Card>

                <Button onClick={handleSaveAccount} loading={savingAccount}>
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-base font-semibold text-slate-warm dark:text-white mb-2">
                    Notification Preferences
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    <ToggleSwitch
                      label="Email Notifications"
                      description="Receive important updates and reminders via email"
                      checked={emailNotifs}
                      onChange={setEmailNotifs}
                    />
                    <ToggleSwitch
                      label="Lab Reminders"
                      description="Get notified when it's time to retest based on your plan"
                      checked={labReminders}
                      onChange={setLabReminders}
                    />
                    <ToggleSwitch
                      label="Supplement Reminders"
                      description="Daily reminders to take your supplements"
                      checked={suppReminders}
                      onChange={setSuppReminders}
                    />
                    <ToggleSwitch
                      label="Wellness Plan Updates"
                      description="Notify when new research affects your plan recommendations"
                      checked={planUpdates}
                      onChange={setPlanUpdates}
                    />
                  </div>
                </Card>

                <Button onClick={handleSaveNotifications} loading={savingNotifs}>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-base font-semibold text-slate-warm dark:text-white mb-4">
                    Your Data
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div>
                        <p className="text-sm font-medium text-slate-warm dark:text-white">Export Your Data</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Download a copy of all your health data, lab results, and wellness plans.
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleExportData}>
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </div>

                    <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                      <div>
                        <p className="text-sm font-medium text-slate-warm dark:text-white">Clear Health Data</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Remove all wellness plans, progress entries, and doctor prep documents. Your account and profile will remain.
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowClearDataModal(true)}>
                        <Trash2 className="w-4 h-4" />
                        Clear
                      </Button>
                    </div>

                    <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-rose-50 dark:bg-rose-900/10">
                      <div>
                        <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Delete Account</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-slate-warm dark:text-white mb-3">
                    Privacy Policy
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your health data is encrypted and stored securely. We never share your personal
                    health information with third parties. CauseHealth uses your data solely to
                    generate personalized wellness insights.
                  </p>
                  <button className="text-sm text-teal-500 hover:text-teal-600 font-medium mt-2">
                    Read Full Privacy Policy
                  </button>
                </Card>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-warm dark:text-white">
                      Current Plan
                    </h3>
                    <Badge variant={currentTier === 'free' ? 'default' : 'success'} size="md">
                      {TIER_DETAILS[currentTier].name}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {currentTier === 'free'
                      ? 'You are on the free plan. Upgrade to unlock more features.'
                      : `You are on the ${TIER_DETAILS[currentTier].name} plan at ${TIER_DETAILS[currentTier].price}.`}
                  </p>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(Object.entries(TIER_DETAILS) as [SubscriptionTier, typeof TIER_DETAILS[SubscriptionTier]][]).map(
                    ([tier, details]) => {
                      const TierIcon = details.icon;
                      const isCurrent = tier === currentTier;

                      return (
                        <Card
                          key={tier}
                          className={`relative ${
                            isCurrent ? 'ring-2 ring-teal-500' : ''
                          } ${tier === 'premium' ? 'border-teal-200 dark:border-teal-800' : ''}`}
                        >
                          {tier === 'premium' && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                              <Badge variant="success" size="sm">Most Popular</Badge>
                            </div>
                          )}
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 mb-3">
                              <TierIcon className="w-5 h-5 text-teal-500" />
                            </div>
                            <h4 className="text-sm font-semibold text-slate-warm dark:text-white">
                              {details.name}
                            </h4>
                            <p className="text-lg font-display font-bold text-teal-600 dark:text-teal-400 mt-1">
                              {details.price}
                            </p>
                          </div>
                          <ul className="mt-4 space-y-2">
                            {details.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <Check className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4">
                            {isCurrent ? (
                              <Button variant="secondary" size="sm" className="w-full" disabled>
                                Current Plan
                              </Button>
                            ) : (
                              <Button
                                variant={tier === 'premium' ? 'primary' : 'outline'}
                                size="sm"
                                className="w-full"
                                onClick={() =>
                                  addToast({
                                    type: 'info',
                                    title: 'Payment integration coming soon!',
                                  })
                                }
                              >
                                {tier === 'free' ? 'Downgrade' : 'Upgrade'}
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </Tabs>

      {/* Delete Account Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account" size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20">
            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700 dark:text-rose-300">
              This will permanently delete your account and all associated data including lab results,
              wellness plans, and progress history. This action cannot be undone.
            </p>
          </div>
          <Input
            label='Type "DELETE" to confirm'
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="DELETE"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deleteConfirm !== 'DELETE'}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear Data Modal */}
      <Modal open={showClearDataModal} onClose={() => setShowClearDataModal(false)} title="Clear Health Data" size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This will remove all wellness plans, progress entries, and doctor prep documents.
              Your account, profile, and lab results will remain. This cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowClearDataModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleClearHealthData}>
              Clear Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
