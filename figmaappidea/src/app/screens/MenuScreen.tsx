import { GlassCard } from '../components/GlassCard';
import { BottomNav } from '../components/BottomNav';
import { useNavigate } from 'react-router';
import { Crown, HelpCircle, Info, MessageSquare, BarChart, Book, Cpu, ChevronRight } from 'lucide-react';

export function MenuScreen() {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Features',
      items: [
        { icon: BarChart, label: 'Statistics', path: '/statistics', description: 'View your analytics' },
        { icon: Crown, label: 'Go Premium', path: '/premium', description: 'Unlock all features' },
      ],
    },
    {
      title: 'Learn',
      items: [
        { icon: Book, label: 'Tutorial', path: '/tutorial', description: 'How to use TruthPulse' },
        { icon: HelpCircle, label: 'Help & FAQ', path: '/help', description: 'Common questions' },
        { icon: Cpu, label: 'AI Models', path: '/ai-models', description: 'Detection technology' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: MessageSquare, label: 'Send Feedback', path: '/feedback', description: 'Help us improve' },
        { icon: Info, label: 'About', path: '/about', description: 'Learn about TruthPulse' },
      ],
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] pb-24">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl text-white mb-1">More</h1>
          <p className="text-gray-400">Explore features & support</p>
        </div>

        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-sm text-gray-400 mb-3 px-1">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <GlassCard key={itemIndex} className="p-4">
                    <button
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 rounded-lg flex items-center justify-center">
                          <Icon size={20} className="text-[var(--neon-purple)]" />
                        </div>
                        <div className="text-left">
                          <p className="text-white">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
