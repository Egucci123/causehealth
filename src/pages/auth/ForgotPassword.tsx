import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary dark:bg-bg-dark p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-semibold text-xl text-slate-warm dark:text-white">CauseHealth</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-slate-warm dark:text-white mb-2">Check your email</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium text-sm">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-slate-warm dark:text-white mb-2">Reset your password</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your email and we'll send you a reset link</p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-sm text-rose-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" loading={loading} className="w-full" size="lg">Send Reset Link</Button>
            </form>

            <Link to="/login" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mt-6">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
