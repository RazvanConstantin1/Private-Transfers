interface CalloutProps {
  type?: 'info' | 'tip' | 'warning';
  children: React.ReactNode;
}

const styles = {
  info: {
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    icon: 'ℹ️',
    label: 'Note',
  },
  tip: {
    border: '1px solid var(--accent-volt)',
    background: 'var(--accent-volt-dim)',
    icon: '💡',
    label: 'Pro tip',
  },
  warning: {
    border: '1px solid #f59e0b',
    background: 'rgba(245,158,11,0.08)',
    icon: '⚠️',
    label: 'Watch out',
  },
};

export function Callout({ type = 'info', children }: CalloutProps) {
  const s = styles[type];
  return (
    <div
      className="rounded-xl p-4 my-6 flex gap-3"
      style={{ border: s.border, background: s.background }}
    >
      <span className="text-lg shrink-0">{s.icon}</span>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <strong style={{ color: 'var(--text-primary)' }}>{s.label}: </strong>
        {children}
      </div>
    </div>
  );
}
