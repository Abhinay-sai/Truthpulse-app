import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { Mail, Lock, Shield, KeyRound, CheckCircle, X } from 'lucide-react';

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('truthpulse_user', JSON.stringify({ email }));
    }
    navigate('/dashboard');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setOtpSent(true);
      setTimeout(() => {
        setResetSuccess(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6 flex flex-col justify-center relative">
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
                  required
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
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForgotModal(true);
                setOtpSent(false);
                setResetSuccess(false);
              }}
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

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <KeyRound size={48} className="text-[var(--neon-purple)] mb-3" />
              <h3 className="text-xl text-white font-semibold mb-1">Reset Password</h3>
              <p className="text-sm text-gray-400 mb-5">
                {resetSuccess
                  ? 'Password reset OTP sent to your email!'
                  : 'Enter your registered email to receive an OTP'}
              </p>

              {resetSuccess ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <CheckCircle size={44} className="text-green-400" />
                  <p className="text-sm text-gray-300">Check your inbox for verification code.</p>
                  <GradientButton onClick={() => setShowForgotModal(false)} className="w-full mt-2">
                    Back to Login
                  </GradientButton>
                </div>
              ) : (
                <form onSubmit={handleSendOtp} className="w-full space-y-4">
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)]"
                    />
                  </div>
                  <GradientButton type="submit" className="w-full">
                    {otpSent ? 'Sending...' : 'Send Reset Code'}
                  </GradientButton>
                </form>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

