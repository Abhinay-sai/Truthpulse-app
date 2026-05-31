import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router';
import { ArrowLeft, Moon, Globe, Bell, Database, Shield } from 'lucide-react';

export function SettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    dataSaver: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const settingItems = [
    { icon: Moon, label: 'Dark Mode', key: 'darkMode' as const, value: settings.darkMode },
    { icon: Bell, label: 'Notifications', key: 'notifications' as const, value: settings.notifications },
    { icon: Database, label: 'Data Saver', key: 'dataSaver' as const, value: settings.dataSaver },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">Settings</h1>
            <p className="text-gray-400 text-sm">Customize your experience</p>
          </div>
        </div>

        <div className="space-y-3">
          {settingItems.map((item) => {
            const Icon = item.icon;
            return (
              <GlassCard key={item.key} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-[var(--neon-purple)]" />
                    <span className="text-white">{item.label}</span>
                  </div>
                  <button
                    onClick={() => toggleSetting(item.key)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                      item.value
                        ? 'bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]'
                        : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${
                        item.value ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-[var(--neon-purple)]" />
              <span className="text-white">Language</span>
            </div>
            <select className="bg-[var(--input-background)] border border-[var(--border)] text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)]">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <button className="w-full flex items-center gap-3 text-left">
            <Shield size={20} className="text-[var(--neon-purple)]" />
            <div>
              <p className="text-white">Security Settings</p>
              <p className="text-xs text-gray-400 mt-1">Manage password and authentication</p>
            </div>
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
