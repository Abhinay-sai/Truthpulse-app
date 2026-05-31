import { Home, Upload, History, User, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Menu, label: 'More', path: '/menu' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto backdrop-blur-xl bg-[var(--glass-bg)] border-t border-[var(--glass-border)]">
        <div className="flex justify-around items-center px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-[var(--neon-purple)] bg-[var(--neon-purple)]/10'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
