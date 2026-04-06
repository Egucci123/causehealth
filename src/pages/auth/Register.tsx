import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { HeartPulse, Mail, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/app" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      navigate('/onboarding');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-primary dark:bg-bg-dark">
      <div className="hidden lg:flex lg:w-1/2 bg-teal-500 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl">CauseHealth</span>
          </div>
          <h2 className="font-display text-3xl font-semibold mb-4">Start understanding your health today.</h2>
          <p className="text-teal-100 text-lg leading-relaxed">
            Join thousands of people who are taking control of their health by understanding their labs, medications, and root causes.
          </p>
          <div className="mt-8 space-y-3">
            {['Upload labs and get optimal range analysis', 'Check medication nutrient depletions', 'Generate doctor visit prep documents'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-teal-100">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-semibold text-xl text-slate-warm dark:text-white">CauseHealth</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-slate-warm dark:text-white mb-2">Create your account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Free to start — upgrade anytime</p>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-sm text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <User className="absolute right-3 top-[38px] w-4 h-4 text-slate-400" />
              </div>
              <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>

            <div className="relative">
              <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Mail className="absolute right-3 top-[38px] w-4 h-4 text-slate-400" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                hint="Minimum 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
            CauseHealth is an educational tool and does not provide medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
