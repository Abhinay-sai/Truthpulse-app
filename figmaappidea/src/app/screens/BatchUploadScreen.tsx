import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, X, Image, CheckCircle } from 'lucide-react';

export function BatchUploadScreen() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'photo1.jpg', size: '2.3 MB', status: 'ready' },
    { id: 2, name: 'photo2.png', size: '1.8 MB', status: 'ready' },
    { id: 3, name: 'video1.mp4', size: '15.2 MB', status: 'ready' },
  ]);

  const removeFile = (id: number) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/upload')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">Batch Upload</h1>
            <p className="text-gray-400 text-sm">Upload multiple files</p>
          </div>
        </div>

        <GlassCard className="p-6 border-2 border-dashed border-[var(--glass-border)]">
          <div className="flex flex-col items-center text-center">
            <Upload size={48} className="text-[var(--neon-purple)] mb-3" />
            <h3 className="text-white mb-2">Add More Files</h3>
            <p className="text-gray-400 text-sm mb-4">Up to 50 files at once</p>
            <GradientButton variant="outline">
              Browse Files
            </GradientButton>
          </div>
        </GlassCard>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white">Files Queue ({uploadedFiles.length})</h3>
            <button className="text-sm text-[var(--neon-purple)]">
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <GlassCard key={file.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image size={24} className="text-[var(--neon-purple)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{file.size}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-400" />
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <GlassCard className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Total Files</span>
            <span className="text-white">{uploadedFiles.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated Time</span>
            <span className="text-white">~2 minutes</span>
          </div>
        </GlassCard>

        <GradientButton onClick={() => navigate('/scan-queue')} className="w-full">
          Analyze All Files
        </GradientButton>
      </div>
    </div>
  );
}
