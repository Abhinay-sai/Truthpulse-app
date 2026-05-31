import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { BottomNav } from '../components/BottomNav';
import { useNavigate } from 'react-router';
import { Scan, Shield, TrendingUp, Clock } from 'lucide-react';

export function DashboardScreen() {
  const navigate = useNavigate();

  const recentScans = [
    { id: 1, name: 'beach_photo.jpg', score: 92, status: 'Real', date: '2 hours ago' },
    { id: 2, name: 'portrait.png', score: 15, status: 'AI Generated', date: '5 hours ago' },
    { id: 3, name: 'landscape.jpg', score: 88, status: 'Real', date: 'Yesterday' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] pb-24">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl text-white mb-1">Welcome Back</h1>
          <p className="text-gray-400">Ready to analyze media authenticity?</p>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400">Overall Trust Score</p>
              <h2 className="text-4xl text-white mt-1">87%</h2>
            </div>
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[var(--neon-purple)] flex items-center justify-center">
                <Shield size={32} className="text-[var(--neon-purple)]" />
              </div>
            </div>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-[87%] bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" />
          </div>
        </GlassCard>

        <GradientButton onClick={() => navigate('/upload')} className="w-full flex items-center justify-center gap-2">
          <Scan size={20} />
          Quick Analyze
        </GradientButton>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4">
            <TrendingUp size={24} className="text-[var(--neon-blue)] mb-2" />
            <p className="text-2xl text-white">156</p>
            <p className="text-xs text-gray-400 mt-1">Total Scans</p>
          </GlassCard>
          <GlassCard className="p-4">
            <Clock size={24} className="text-[var(--neon-purple)] mb-2" />
            <p className="text-2xl text-white">12</p>
            <p className="text-xs text-gray-400 mt-1">This Week</p>
          </GlassCard>
        </div>

        <div>
          <h3 className="text-xl text-white mb-4">Recent Analysis</h3>
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <GlassCard key={scan.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white">{scan.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{scan.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${scan.score > 50 ? 'text-green-400' : 'text-red-400'}`}>
                      {scan.score}% {scan.status}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
