import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { BottomNav } from '../components/BottomNav';
import { useNavigate } from 'react-router';
import { User, FileText, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';

export function ProfileScreen() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: FileText, label: 'Saved Reports', count: '24', onClick: () => {} },
    { icon: Bell, label: 'Notifications', onClick: () => navigate('/notifications') },
    { icon: Shield, label: 'Privacy & Security', onClick: () => navigate('/settings') },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] pb-24">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl text-white mb-1">Profile</h1>
          <p className="text-gray-400">Manage your account</p>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl text-white">John Doe</h2>
              <p className="text-sm text-gray-400">john.doe@example.com</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--glass-border)]">
            <div className="text-center">
              <p className="text-2xl text-white">156</p>
              <p className="text-xs text-gray-400 mt-1">Total Scans</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-white">87%</p>
              <p className="text-xs text-gray-400 mt-1">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-white">24</p>
              <p className="text-xs text-gray-400 mt-1">Reports</p>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <GlassCard key={index} className="p-4">
                <button onClick={item.onClick} className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-[var(--neon-purple)]" />
                    <span className="text-white">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.count && (
                      <span className="text-sm text-gray-400">{item.count}</span>
                    )}
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </button>
              </GlassCard>
            );
          })}
        </div>

        <GradientButton
          onClick={() => navigate('/login')}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Logout
        </GradientButton>
      </div>

      <BottomNav />
    </div>
  );
}
