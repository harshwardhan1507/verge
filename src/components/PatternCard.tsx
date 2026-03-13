import { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import type { Pattern } from '../store/memoryStore';
import { useMemoryStore } from '../store/memoryStore';

interface PatternCardProps {
  pattern: Pattern;
  className?: string;
}

export function PatternCard({ pattern, className }: PatternCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { memories } = useMemoryStore();

  const relatedMemories = memories.filter(m => 
    pattern.relatedMemoryIds.includes(m.id)
  );

  return (
    <div
      className={cn(
        'bg-surface rounded-lg border border-white/5 p-4 hover:border-pattern/20 transition-all duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-pattern" />
          <h3 className="text-sm font-medium text-text-primary">
            {pattern.title}
          </h3>
        </div>
        <span className="text-xs text-pattern bg-pattern/10 px-2 py-0.5 rounded-full">
          {pattern.frequency} times
        </span>
      </div>

      <p className="text-xs text-text-muted mb-3">
        {pattern.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
        <span>First: {formatDate(pattern.firstNoticed)}</span>
        <span>Latest: {formatDate(pattern.latestMention)}</span>
      </div>

      {relatedMemories.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-secondary transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> Hide {relatedMemories.length} related memories
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> Show {relatedMemories.length} related memories
              </>
            )}
          </button>

          {expanded && (
            <div className="mt-3 space-y-2 pt-3 border-t border-white/5">
              {relatedMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="text-xs p-2 bg-white/5 rounded-lg"
                >
                  <p className="text-text-primary line-clamp-2">
                    {memory.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
