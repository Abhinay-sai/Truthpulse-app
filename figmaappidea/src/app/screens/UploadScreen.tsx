import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { BottomNav } from '../components/BottomNav';
import { useNavigate } from 'react-router';
import { Upload, Image, Video, FileCheck } from 'lucide-react';

export function UploadScreen() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);

  const handleAnalyze = () => {
    navigate('/analyzing');
  };

  const recentUploads = [
    { id: 1, name: 'sunset.jpg', type: 'image' },
    { id: 2, name: 'interview.mp4', type: 'video' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] pb-24">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl text-white mb-1">Upload Media</h1>
          <p className="text-gray-400">Upload image or video to analyze</p>
        </div>

        <GlassCard
          className={`p-8 border-2 border-dashed transition-all ${
            dragActive ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]/5' : 'border-[var(--glass-border)]'
          }`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] blur-2xl opacity-30" />
              <Upload size={60} className="text-[var(--neon-purple)] relative z-10" />
            </div>
            <h3 className="text-xl text-white mb-2">Drag & Drop</h3>
            <p className="text-gray-400 text-sm mb-6">or click to browse files</p>
            <GradientButton onClick={() => {}}>
              Browse Files
            </GradientButton>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <h4 className="text-white mb-3 flex items-center gap-2">
            <FileCheck size={20} className="text-[var(--neon-purple)]" />
            Supported Formats
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Image size={16} />
              JPG, PNG, WebP
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Video size={16} />
              MP4, MOV, AVI
            </div>
          </div>
        </GlassCard>

        <div>
          <h3 className="text-lg text-white mb-3">Recent Uploads</h3>
          <div className="grid grid-cols-2 gap-3">
            {recentUploads.map((upload) => (
              <GlassCard key={upload.id} className="p-4">
                <div className="aspect-square bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 rounded-lg mb-3 flex items-center justify-center">
                  {upload.type === 'image' ? (
                    <Image size={32} className="text-[var(--neon-purple)]" />
                  ) : (
                    <Video size={32} className="text-[var(--neon-blue)]" />
                  )}
                </div>
                <p className="text-sm text-white truncate">{upload.name}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <GradientButton onClick={() => navigate('/camera')} variant="outline" className="flex items-center justify-center gap-2">
            <Upload size={18} />
            Camera
          </GradientButton>
          <GradientButton onClick={() => navigate('/batch-upload')} variant="secondary" className="flex items-center justify-center gap-2">
            Batch
          </GradientButton>
        </div>

        <GradientButton onClick={handleAnalyze} className="w-full">
          Analyze Media
        </GradientButton>
      </div>

      <BottomNav />
    </div>
  );
}
