import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useNavigate } from 'react-router';
import { ArrowLeft, Image, ArrowLeftRight } from 'lucide-react';

export function ComparisonScreen() {
  const navigate = useNavigate();

  const comparison = {
    fileA: { name: 'sunset_real.jpg', score: 92, status: 'Real' },
    fileB: { name: 'sunset_ai.jpg', score: 18, status: 'AI Generated' },
  };

  const metrics = [
    { name: 'Compression', fileA: 'Natural', fileB: 'Artificial' },
    { name: 'Metadata', fileA: 'Authentic', fileB: 'Missing' },
    { name: 'Texture', fileA: 'Normal', fileB: 'Synthetic' },
    { name: 'Artifacts', fileA: 'Camera-based', fileB: 'AI-based' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/history')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">Compare Results</h1>
            <p className="text-gray-400 text-sm">Side-by-side analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4">
            <div className="aspect-square bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl mb-3 flex items-center justify-center">
              <Image size={40} className="text-green-400" />
            </div>
            <p className="text-white text-sm truncate mb-1">{comparison.fileA.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-green-400 text-lg">{comparison.fileA.score}%</span>
              <span className="text-xs text-gray-400">{comparison.fileA.status}</span>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="aspect-square bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl mb-3 flex items-center justify-center">
              <Image size={40} className="text-red-400" />
            </div>
            <p className="text-white text-sm truncate mb-1">{comparison.fileB.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-red-400 text-lg">{comparison.fileB.score}%</span>
              <span className="text-xs text-gray-400">{comparison.fileB.status}</span>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeftRight size={20} className="text-[var(--neon-purple)]" />
            <h3 className="text-white">Metric Comparison</h3>
          </div>
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={index}>
                <p className="text-xs text-gray-400 mb-2">{metric.name}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 text-center">
                    <span className="text-green-400 text-sm">{metric.fileA}</span>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-center">
                    <span className="text-red-400 text-sm">{metric.fileB}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4 bg-gradient-to-r from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10">
          <p className="text-white text-sm mb-2">Key Difference</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            File A shows natural camera compression and authentic metadata, while File B exhibits
            synthetic texture patterns typical of AI-generated images.
          </p>
        </GlassCard>

        <GradientButton className="w-full">
          Export Comparison Report
        </GradientButton>
      </div>
    </div>
  );
}
