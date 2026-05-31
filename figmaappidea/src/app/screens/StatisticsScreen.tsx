import { GlassCard } from '../components/GlassCard';
import { BottomNav } from '../components/BottomNav';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function StatisticsScreen() {
  const stats = {
    totalScans: 156,
    thisWeek: 12,
    avgScore: 87,
    realDetected: 134,
    aiDetected: 22,
  };

  const weeklyData = [
    { day: 'Mon', scans: 5 },
    { day: 'Tue', scans: 8 },
    { day: 'Wed', scans: 3 },
    { day: 'Thu', scans: 12 },
    { day: 'Fri', scans: 7 },
    { day: 'Sat', scans: 4 },
    { day: 'Sun', scans: 6 },
  ];

  const maxScans = Math.max(...weeklyData.map(d => d.scans));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] pb-24">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl text-white mb-1">Statistics</h1>
          <p className="text-gray-400">Your analysis insights</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4">
            <Activity size={24} className="text-[var(--neon-purple)] mb-2" />
            <p className="text-3xl text-white mb-1">{stats.totalScans}</p>
            <p className="text-xs text-gray-400">Total Scans</p>
            <div className="flex items-center gap-1 mt-2 text-green-400">
              <TrendingUp size={14} />
              <span className="text-xs">+24%</span>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <Activity size={24} className="text-[var(--neon-blue)] mb-2" />
            <p className="text-3xl text-white mb-1">{stats.avgScore}%</p>
            <p className="text-xs text-gray-400">Avg Trust Score</p>
            <div className="flex items-center gap-1 mt-2 text-green-400">
              <TrendingUp size={14} />
              <span className="text-xs">+5%</span>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-5">
          <h3 className="text-white mb-4">Weekly Activity</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-800 rounded-lg overflow-hidden flex items-end" style={{ height: '100px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-t-lg transition-all duration-500"
                    style={{ height: `${(data.scans / maxScans) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{data.day}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-white mb-4">Detection Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Real Content</span>
                <span className="text-green-400">{stats.realDetected} ({Math.round((stats.realDetected / stats.totalScans) * 100)}%)</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{ width: `${(stats.realDetected / stats.totalScans) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">AI Generated</span>
                <span className="text-red-400">{stats.aiDetected} ({Math.round((stats.aiDetected / stats.totalScans) * 100)}%)</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-400"
                  style={{ width: `${(stats.aiDetected / stats.totalScans) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="p-3 text-center">
            <p className="text-xl text-white mb-1">{stats.thisWeek}</p>
            <p className="text-xs text-gray-400">This Week</p>
          </GlassCard>
          <GlassCard className="p-3 text-center">
            <p className="text-xl text-white mb-1">3.2</p>
            <p className="text-xs text-gray-400">Avg/Day</p>
          </GlassCard>
          <GlassCard className="p-3 text-center">
            <p className="text-xl text-white mb-1">98%</p>
            <p className="text-xs text-gray-400">Accuracy</p>
          </GlassCard>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
