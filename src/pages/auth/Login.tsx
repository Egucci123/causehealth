import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/app" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/app');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border-0 border-b border-[#3F4948]/50 py-4 text-lg text-[#E2E2E6] focus:outline-none focus:border-[#1F403D] transition-colors placeholder:text-[#A0ACAB]/30";
  const labelClass = "block text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mb-1";

  return (
    <div className="min-h-screen bg-[#0A0C0F] text-[#E2E2E6] font-['DM_Sans',sans-serif] flex items-center justify-center px-6"
      style={{ background: `radial-gradient(circle at 0% 0%, rgba(31,64,61,0.1) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(31,64,61,0.05) 0%, transparent 40%), #0A0C0F` }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="font-['Newsreader',serif] text-4xl text-[#1F403D] mb-2">CauseHealth.</h1>
          <p className="text-[#A0ACAB] text-sm">Sign in to access your health intelligence</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#CF6679]/10 border border-[#CF6679]/30 rounded text-[#CF6679] text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} required />
          </div>
          <div className="relative">
            <label className={labelClass}>Password</label>
            <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-8 text-[#A0ACAB]">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-[#1F403D] hover:text-[#2D5A56]">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1F403D] text-white py-4 font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#A0ACAB] mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#1F403D] font-bold">Create one</Link>
        </p>
      </div>
    </div>
  );
}
