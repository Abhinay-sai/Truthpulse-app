import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { User, Mail, Lock, Shield } from 'lucide-react';

export function SignupScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <div className="flex flex-col items-center mb-8">
          <Shield size={60} className="text-[var(--neon-purple)] mb-4" />
          <h1 className="text-3xl text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join TruthPulse today</p>
        </div>

        <GlassCard className="p-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Full Name</label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  className="w-full pl-11 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--input-background)] text-[var(--neon-purple)] focus:ring-2 focus:ring-[var(--neon-purple)]"
              />
              <label className="text-sm text-gray-400">
                I agree to the{' '}
                <span className="text-[var(--neon-purple)]">Terms & Conditions</span>
              </label>
            </div>

            <GradientButton type="submit" className="w-full mt-6">
              Create Account
            </GradientButton>
          </form>
        </GlassCard>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[var(--neon-purple)] hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
