import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader, CheckCircle, Clock } from 'lucide-react';

export function ScanQueueScreen() {
  const navigate = useNavigate();

  const queueItems = [
    { id: 1, name: 'photo1.jpg', status: 'completed', progress: 100, result: '92% Real' },
    { id: 2, name: 'photo2.png', status: 'processing', progress: 65, result: null },
    { id: 3, name: 'video1.mp4', status: 'pending', progress: 0, result: null },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/batch-upload')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">Processing Queue</h1>
            <p className="text-gray-400 text-sm">2 of 3 complete</p>
          </div>
        </div>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-400">Overall Progress</p>
              <p className="text-2xl text-white mt-1">67%</p>
            </div>
            <Loader size={40} className="text-[var(--neon-purple)] animate-spin" />
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-[67%] bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] transition-all duration-500" />
          </div>
        </GlassCard>

        <div className="space-y-3">
          {queueItems.map((item) => (
            <GlassCard key={item.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-white">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.status === 'completed' && item.result}
                    {item.status === 'processing' && 'Analyzing...'}
                    {item.status === 'pending' && 'Waiting in queue'}
                  </p>
                </div>
                {item.status === 'completed' && (
                  <CheckCircle size={20} className="text-green-400" />
                )}
                {item.status === 'processing' && (
                  <Loader size={20} className="text-[var(--neon-purple)] animate-spin" />
                )}
                {item.status === 'pending' && (
                  <Clock size={20} className="text-gray-400" />
                )}
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] transition-all duration-500 ${
                    item.status === 'processing' ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
