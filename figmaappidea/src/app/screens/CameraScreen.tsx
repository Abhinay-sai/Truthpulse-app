import { GradientButton } from '../components/GradientButton';
import { useNavigate } from 'react-router';
import { ArrowLeft, Camera, RotateCcw, Zap } from 'lucide-react';

export function CameraScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <button onClick={() => navigate('/upload')} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-white">Capture Photo</h2>
        <button className="text-white">
          <Zap size={24} />
        </button>
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 m-6 rounded-3xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <Camera size={80} className="text-gray-600" />
          </div>

          <div className="absolute inset-0 border-2 border-dashed border-[var(--neon-purple)]/30 rounded-3xl m-8">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--neon-purple)]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--neon-purple)]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--neon-purple)]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--neon-purple)]" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-center gap-8">
          <button className="w-14 h-14 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full flex items-center justify-center backdrop-blur-xl">
            <RotateCcw size={24} className="text-white" />
          </button>

          <button className="w-20 h-20 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 active:scale-95 transition-transform">
            <Camera size={32} className="text-white" />
          </button>

          <div className="w-14 h-14" />
        </div>

        <p className="text-center text-gray-400 text-sm">
          Position the subject within the frame
        </p>
      </div>
    </div>
  );
}
