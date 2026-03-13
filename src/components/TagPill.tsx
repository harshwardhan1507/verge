import type { MemoryType } from '../store/memoryStore';

interface TagPillProps {
  type: MemoryType;
}

const typeConfig: Record<MemoryType, { label: string; className: string }> = {
  EVENT:      { label: 'Event',      className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  EMOTION:    { label: 'Emotion',    className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  COMMITMENT: { label: 'Commitment', className: 'bg-violet-500/10 text-violet-400 border border-violet-500/20' },
  UNRESOLVED: { label: 'Unresolved', className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' },
  INSIGHT:    { label: 'Insight',    className: 'bg-teal-500/10 text-teal-400 border border-teal-500/20' },
  PATTERN:    { label: 'Pattern',    className: 'bg-pink-500/10 text-pink-400 border border-pink-500/20' },
  PERSON:     { label: 'Person',     className: 'bg-sky-500/10 text-sky-400 border border-sky-500/20' },
};

export function TagPill({ type }: TagPillProps) {
  const config = typeConfig[type] ?? typeConfig.EVENT;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}