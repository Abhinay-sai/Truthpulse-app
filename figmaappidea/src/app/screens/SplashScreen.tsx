import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] blur-3xl opacity-50 animate-pulse" />
          <Shield size={120} className="text-[var(--neon-purple)] relative z-10" strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8 text-5xl tracking-wider bg-gradient-to-r from-[var(--neon-purple)] via-white to-[var(--neon-blue)] bg-clip-text text-transparent"
      >
        TruthPulse
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-4 text-gray-400 text-lg tracking-wide"
      >
        Detect. Analyze. Trust.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: '200px' }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-12 h-1 bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent rounded-full"
      />
    </div>
  );
}
