import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router';
import { ArrowLeft, Cpu, Zap, Brain, Activity } from 'lucide-react';

export function AIModelScreen() {
  const navigate = useNavigate();

  const models = [
    {
      name: 'VisionNet v3.2',
      type: 'Image Analysis',
      accuracy: 98.5,
      speed: 'Fast',
      icon: Brain,
      description: 'Deep learning model for detecting AI-generated images',
    },
    {
      name: 'VideoScan Pro',
      type: 'Video Analysis',
      accuracy: 96.2,
      speed: 'Medium',
      icon: Activity,
      description: 'Frame-by-frame analysis for video authenticity',
    },
    {
      name: 'MetaCheck AI',
      type: 'Metadata',
      accuracy: 99.1,
      speed: 'Instant',
      icon: Zap,
      description: 'Examines EXIF data and file properties',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/about')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">AI Models</h1>
            <p className="text-gray-400 text-sm">Detection technology</p>
          </div>
        </div>

        <GlassCard className="p-6 bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10">
          <div className="flex items-center gap-3 mb-4">
            <Cpu size={32} className="text-[var(--neon-purple)]" />
            <div>
              <h2 className="text-xl text-white">Neural Network Stack</h2>
              <p className="text-sm text-gray-400">Multi-model approach</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            TruthPulse uses an ensemble of specialized AI models, each trained on millions of samples
            to detect different aspects of media authenticity. Results are combined for maximum accuracy.
          </p>
        </GlassCard>

        <div className="space-y-3">
          {models.map((model, index) => {
            const Icon = model.icon;
            return (
              <GlassCard key={index} className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={28} className="text-[var(--neon-purple)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-lg mb-1">{model.name}</h3>
                    <p className="text-xs text-gray-400">{model.type}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4">{model.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Accuracy</p>
                    <p className="text-lg text-white">{model.accuracy}%</p>
                  </div>
                  <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Speed</p>
                    <p className="text-lg text-white">{model.speed}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <GlassCard className="p-5">
          <h3 className="text-white mb-3">Training Data</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Real Images</span>
              <span className="text-white">2.4M samples</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">AI-Generated</span>
              <span className="text-white">1.8M samples</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Video Frames</span>
              <span className="text-white">500K samples</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-white">May 2026</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
