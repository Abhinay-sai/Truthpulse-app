import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export function NotificationsScreen() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      title: 'Analysis Complete',
      message: 'Your scan for beach_sunset.jpg is ready',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      icon: AlertTriangle,
      title: 'Suspicious Content Detected',
      message: 'portrait_ai.png shows 85% AI generation probability',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      icon: Info,
      title: 'New Feature Available',
      message: 'Batch upload is now available for premium users',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      type: 'success',
      icon: CheckCircle,
      title: 'Report Downloaded',
      message: 'Detailed analysis report saved successfully',
      time: '2 days ago',
      read: true,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-[var(--neon-blue)]';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl text-white">Notifications</h1>
            <p className="text-gray-400 text-sm">Stay updated</p>
          </div>
          <button className="text-[var(--neon-purple)] text-sm">
            Mark all read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <GlassCard
                key={notif.id}
                className={`p-4 ${!notif.read ? 'border-l-4 border-l-[var(--neon-purple)]' : ''}`}
              >
                <div className="flex gap-3">
                  <Icon size={24} className={`${getTypeColor(notif.type)} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white">{notif.title}</h3>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-[var(--neon-purple)] rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
