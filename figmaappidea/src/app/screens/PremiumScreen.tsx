import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useNavigate } from 'react-router';
import { ArrowLeft, Crown, Check, Zap, Shield, Upload, BarChart } from 'lucide-react';

export function PremiumScreen() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      period: '',
      features: ['10 scans per month', 'Basic analysis', 'Standard support', 'Email reports'],
      current: true,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      features: ['Unlimited scans', 'Advanced AI analysis', 'Priority support', 'Batch upload', 'API access', 'Custom reports'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$49.99',
      period: '/month',
      features: ['Everything in Pro', 'Team collaboration', 'White-label reports', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
    },
  ];

  const benefits = [
    { icon: Zap, title: 'Faster Processing', description: 'Priority queue for instant results' },
    { icon: Shield, title: 'Advanced Detection', description: 'State-of-the-art AI models' },
    { icon: Upload, title: 'Batch Upload', description: 'Analyze multiple files at once' },
    { icon: BarChart, title: 'Detailed Analytics', description: 'Comprehensive insights dashboard' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">Go Premium</h1>
            <p className="text-gray-400 text-sm">Unlock all features</p>
          </div>
        </div>

        <GlassCard className="p-6 bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10">
          <div className="flex items-center gap-3 mb-4">
            <Crown size={32} className="text-[var(--neon-purple)]" />
            <div>
              <h2 className="text-xl text-white">Premium Benefits</h2>
              <p className="text-sm text-gray-400">Everything you need</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <Icon size={24} className="text-[var(--neon-purple)] mx-auto mb-2" />
                  <p className="text-xs text-white">{benefit.title}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {plans.map((plan, index) => (
          <GlassCard
            key={index}
            className={`p-5 ${plan.popular ? 'border-2 border-[var(--neon-purple)] shadow-lg shadow-purple-500/20' : ''}`}
          >
            {plan.popular && (
              <div className="bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white text-xs px-3 py-1 rounded-full inline-block mb-3">
                Most Popular
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-2xl text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl text-white">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
            </div>
            <ul className="space-y-2 mb-5">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-green-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.current ? (
              <button className="w-full py-3 rounded-full border border-gray-600 text-gray-400">
                Current Plan
              </button>
            ) : (
              <GradientButton className="w-full">
                {plan.popular ? 'Upgrade Now' : 'Choose Plan'}
              </GradientButton>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
