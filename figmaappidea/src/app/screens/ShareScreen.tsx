import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useNavigate } from 'react-router';
import { ArrowLeft, Twitter, Facebook, Linkedin, Mail, Link, Download, QrCode } from 'lucide-react';

export function ShareScreen() {
  const navigate = useNavigate();

  const shareOptions = [
    { icon: Twitter, label: 'Twitter', color: 'from-blue-400 to-blue-600' },
    { icon: Facebook, label: 'Facebook', color: 'from-blue-500 to-blue-700' },
    { icon: Linkedin, label: 'LinkedIn', color: 'from-blue-600 to-blue-800' },
    { icon: Mail, label: 'Email', color: 'from-gray-500 to-gray-700' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/result')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">Share Result</h1>
            <p className="text-gray-400 text-sm">Share your analysis</p>
          </div>
        </div>

        <GlassCard className="p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-full mb-3">
              <span className="text-3xl text-white">92%</span>
            </div>
            <h3 className="text-white text-lg">Authenticity Verified</h3>
            <p className="text-sm text-gray-400 mt-1">beach_sunset.jpg</p>
          </div>

          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <QrCode size={80} className="text-[var(--neon-purple)]" />
            </div>
            <p className="text-xs text-gray-400 text-center">Scan to view full report</p>
          </div>
        </GlassCard>

        <div>
          <h3 className="text-white mb-3">Share via</h3>
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <GlassCard key={option.label} className="p-4">
                  <button className="w-full flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-full flex items-center justify-center`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-sm text-white">{option.label}</span>
                  </button>
                </GlassCard>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <GlassCard className="p-4">
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link size={20} className="text-[var(--neon-purple)]" />
                <span className="text-white">Copy Link</span>
              </div>
              <span className="text-sm text-gray-400">Copy</span>
            </button>
          </GlassCard>

          <GlassCard className="p-4">
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download size={20} className="text-[var(--neon-purple)]" />
                <span className="text-white">Download Image</span>
              </div>
              <span className="text-sm text-gray-400">PNG</span>
            </button>
          </GlassCard>
        </div>

        <GradientButton className="w-full">
          Generate Shareable Link
        </GradientButton>
      </div>
    </div>
  );
}
