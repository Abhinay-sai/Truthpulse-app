import { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
}

export function GradientButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button'
}: GradientButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white shadow-lg shadow-purple-500/50',
    secondary: 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-cyan)] text-white shadow-lg shadow-blue-500/50',
    outline: 'border-2 border-[var(--neon-purple)] text-[var(--neon-purple)] bg-transparent hover:bg-[var(--neon-purple)]/10'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
