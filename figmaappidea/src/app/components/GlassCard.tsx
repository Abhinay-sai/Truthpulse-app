import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`backdrop-blur-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl shadow-2xl ${className}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.15)',
      }}
    >
      {children}
    </div>
  );
}
