import { useState } from 'react';
import { TagPill } from './TagPill';
import { formatRelativeTime, cn } from '../lib/utils';
import type { Memory } from '../store/memoryStore';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { MemoryType } from '../store/memoryStore';

interface MemoryCardProps {
  memory: Memory;
  onMarkResolved?: (id: string) => void;
  showActions?: boolean;
  className?: string;
  animationDelay?: number;
}

// Left accent bar color per memory type
const accentColor: Record<MemoryType, string> = {
  EVENT:      'bg-blue-500',
  EMOTION:    'bg-orange-400',
  COMMITMENT: 'bg-violet-500',
  UNRESOLVED: 'bg-yellow-400',
  INSIGHT:    'bg-teal-400',
  PATTERN:    'bg-pink-500',
  PERSON:     'bg-sky-400',
};

// Initials avatar bg per memory type
const avatarColor: Record<MemoryType, string> = {
  EVENT:      'bg-blue-500/15 text-blue-400',
  EMOTION:    'bg-orange-500/15 text-orange-400',
  COMMITMENT: 'bg-violet-500/15 text-violet-400',
  UNRESOLVED: 'bg-yellow-500/15 text-yellow-400',
  INSIGHT:    'bg-teal-500/15 text-teal-400',
  PATTERN:    'bg-pink-500/15 text-pink-400',
  PERSON:     'bg-sky-500/15 text-sky-400',
};

export function MemoryCard({
  memory,
  onMarkResolved,
  showActions = true,
  className,
  animationDelay = 0,
}: MemoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const isLongContent = memory.content.length > 200;
  const shouldTruncate = !expanded && isLongContent;

  const handleResolve = async () => {
    if (!onMarkResolved) return;
    setIsResolving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onMarkResolved(memory.id);
  };

  const personInitial = memory.relatedPerson
    ? memory.relatedPerson.charAt(0).toUpperCase()
    : null;

  return (
    <div
      className={cn(
        'group flex overflow-hidden rounded-2xl border border-white/[0.06] bg-[#13131c] transition-all duration-200 hover:border-white/[0.10]',
        isResolving && 'opacity-0 scale-95 transition-all duration-300',
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Colored left accent bar */}
      <div className={`w-[3px] shrink-0 ${accentColor[memory.type]}`} />

      {/* Card content */}
      <div className="flex-1 px-4 py-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <TagPill type={memory.type} />
          <span className="text-[11px] text-white/25 shrink-0 tabular-nums">
            {formatRelativeTime(memory.timestamp)}
          </span>
        </div>

        {/* Content */}
        <p className="text-[13px] text-white/70 leading-relaxed mb-3">
          {shouldTruncate
            ? memory.content.slice(0, 200) + '...'
            : memory.content}
        </p>

        {/* Expand / collapse for long content */}
        {isLongContent && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/60 mb-3 transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" /> Show less</>
            ) : (
              <><ChevronDown className="w-3 h-3" /> Show more</>
            )}
          </button>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between">
          {/* Person avatar + name */}
          {memory.relatedPerson ? (
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${avatarColor[memory.type]}`}
              >
                {personInitial}
              </div>
              <span className="text-[12px] text-white/40">
                {memory.relatedPerson}
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {showActions &&
              (memory.type === 'COMMITMENT' || memory.type === 'UNRESOLVED') &&
              !memory.resolved && (
                <button
                  onClick={handleResolve}
                  className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-teal-400 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Mark resolved
                </button>
              )}

            {memory.resolved && (
              <span className="flex items-center gap-1.5 text-[11px] text-teal-500/70">
                <Check className="w-3 h-3" />
                Resolved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}