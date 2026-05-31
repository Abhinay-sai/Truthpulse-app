import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useNavigate } from 'react-router';
import { CheckCircle, AlertTriangle, FileText, Share2, Image } from 'lucide-react';

export function ResultScreen() {
  const navigate = useNavigate();
  const trustScore = 92;
  const isReal = trustScore > 50;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-2">Analysis Complete</h1>
          <p className="text-gray-400">Here are your results</p>
        </div>

        <GlassCard className="p-6">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(trustScore / 100) * 351.86} 351.86`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--neon-purple)" />
                    <stop offset="100%" stopColor="var(--neon-blue)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl text-white">{trustScore}%</p>
                <p className="text-xs text-gray-400">Trust Score</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 mb-2 ${isReal ? 'text-green-400' : 'text-red-400'}`}>
              {isReal ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
              <h3 className="text-xl">{isReal ? 'Likely Real' : 'Likely AI Generated'}</h3>
            </div>
            <p className="text-sm text-gray-400 text-center">
              Based on advanced AI analysis and metadata examination
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="aspect-video bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 rounded-lg mb-3 flex items-center justify-center">
            <Image size={48} className="text-[var(--neon-purple)]" />
          </div>
          <p className="text-white text-sm">beach_sunset.jpg</p>
          <p className="text-xs text-gray-400 mt-1">Analyzed on May 12, 2026</p>
        </GlassCard>

        <GlassCard className="p-4">
          <h4 className="text-white mb-3">Key Findings</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Compression Analysis</span>
              <span className="text-green-400">Natural</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Metadata Check</span>
              <span className="text-green-400">Authentic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Texture Consistency</span>
              <span className="text-green-400">Normal</span>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-3">
          <GradientButton
            onClick={() => navigate('/report')}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <FileText size={18} />
            View Report
          </GradientButton>
          <GradientButton
            onClick={() => navigate('/share')}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share
          </GradientButton>
        </div>

        <GradientButton onClick={() => navigate('/upload')} className="w-full">
          Analyze Another
        </GradientButton>
      </div>
    </div>
  );
}
