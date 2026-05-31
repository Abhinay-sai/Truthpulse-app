import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { Mail, Lock, Shield } from 'lucide-react';

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <div className="flex flex-col items-center mb-8">
          <Shield size={60} className="text-[var(--neon-purple)] mb-4" />
          <h1 className="text-3xl text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue</p>
        </div>

        <GlassCard className="p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all"
                />
              </div>
            </div>

            <button
              type="button"
              className="text-sm text-[var(--neon-purple)] hover:underline"
            >
              Forgot Password?
            </button>

            <GradientButton type="submit" className="w-full mt-6">
              Sign In
            </GradientButton>
          </form>
        </GlassCard>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-[var(--neon-purple)] hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
