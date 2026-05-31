import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Scan } from 'lucide-react';

export function AnalyzingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/result');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] blur-3xl opacity-50" />
        <Scan size={100} className="text-[var(--neon-purple)] relative z-10" />
      </motion.div>

      <h2 className="text-2xl text-white mb-4">Analyzing Media...</h2>
      <p className="text-gray-400 text-center mb-8">
        Our AI is examining your file for authenticity
      </p>

      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]"
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="text-[var(--neon-purple)] mt-4"
      >
        Processing... 75%
      </motion.p>
    </div>
  );
}
