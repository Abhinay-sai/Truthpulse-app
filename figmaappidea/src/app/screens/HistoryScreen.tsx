import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { BottomNav } from '../components/BottomNav';
import { Search, Filter, Image, Video } from 'lucide-react';

export function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const historyItems = [
    { id: 1, name: 'beach_sunset.jpg', type: 'image', score: 92, status: 'Real', date: '2 hours ago' },
    { id: 2, name: 'portrait_ai.png', type: 'image', score: 15, status: 'AI', date: '5 hours ago' },
    { id: 3, name: 'nature_video.mp4', type: 'video', score: 88, status: 'Real', date: 'Yesterday' },
    { id: 4, name: 'generated_art.jpg', type: 'image', score: 8, status: 'AI', date: '2 days ago' },
    { id: 5, name: 'family_photo.jpg', type: 'image', score: 95, status: 'Real', date: '3 days ago' },
    { id: 6, name: 'interview.mp4', type: 'video', score: 78, status: 'Real', date: '4 days ago' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] pb-24">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl text-white mb-1">History</h1>
          <p className="text-gray-400">Your previous scans</p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scans..."
              className="w-full pl-11 pr-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] backdrop-blur-xl transition-all"
            />
          </div>
          <button className="p-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl backdrop-blur-xl">
            <Filter size={20} className="text-[var(--neon-purple)]" />
          </button>
        </div>

        <div className="space-y-3">
          {historyItems.map((item) => (
            <GlassCard key={item.id} className="p-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.type === 'image' ? (
                    <Image size={28} className="text-[var(--neon-purple)]" />
                  ) : (
                    <Video size={28} className="text-[var(--neon-blue)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                    item.score > 50
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.score}%
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.status}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
