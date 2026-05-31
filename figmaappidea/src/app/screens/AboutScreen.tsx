import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, Cpu, Lock, Globe } from 'lucide-react';

export function AboutScreen() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Detection',
      description: 'Advanced neural networks trained on millions of samples',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'End-to-end encryption and automatic data deletion',
    },
    {
      icon: Shield,
      title: '98% Accuracy',
      description: 'Industry-leading detection accuracy verified by third parties',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Supporting 50+ languages and regions worldwide',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">About TruthPulse</h1>
            <p className="text-gray-400 text-sm">Version 1.2.0</p>
          </div>
        </div>

        <GlassCard className="p-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] blur-2xl opacity-40" />
              <Shield size={80} className="text-[var(--neon-purple)] relative z-10" />
            </div>
          </div>
          <h2 className="text-2xl text-white text-center mb-2">TruthPulse</h2>
          <p className="text-center text-gray-400 text-sm mb-4">Detect. Analyze. Trust.</p>
          <p className="text-sm text-gray-400 leading-relaxed">
            TruthPulse is an AI-powered media authenticity analyzer that helps you determine whether
            images and videos are AI-generated or authentic. Our cutting-edge technology analyzes
            compression patterns, metadata, and visual artifacts to provide accurate authenticity scores.
          </p>
        </GlassCard>

        <div>
          <h3 className="text-white mb-3">Core Features</h3>
          <div className="space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={index} className="p-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-[var(--neon-purple)]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        <GlassCard className="p-5">
          <h3 className="text-white mb-3">Legal</h3>
          <div className="space-y-2 text-sm">
            <button className="w-full text-left text-gray-400 hover:text-white transition-colors py-2">
              Terms of Service
            </button>
            <button className="w-full text-left text-gray-400 hover:text-white transition-colors py-2">
              Privacy Policy
            </button>
            <button className="w-full text-left text-gray-400 hover:text-white transition-colors py-2">
              Open Source Licenses
            </button>
          </div>
        </GlassCard>

        <p className="text-center text-gray-500 text-xs">
          © 2026 TruthPulse. All rights reserved.
        </p>
      </div>
    </div>
  );
}
