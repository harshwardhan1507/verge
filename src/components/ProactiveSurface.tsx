import { Lightbulb } from 'lucide-react';
import { useMemoryStore } from '../store/memoryStore';
import { TagPill } from './TagPill';
import { formatRelativeTime, cn } from '../lib/utils';
import { useMemo } from 'react';

interface ProactiveSurfaceProps {
  className?: string;
}

export function ProactiveSurface({ className }: ProactiveSurfaceProps) {
  const memories = useMemoryStore((state) => state.memories);
  const isLoading = useMemoryStore((state) => state.isLoading);

  const revisitMemories = useMemo(() => {
    if (memories.length === 0) return [];
    
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const older = memories.filter(m => 
      new Date(m.timestamp) < oneDayAgo
    );
    
    // If no old memories, show most recent ones anyway
    const pool = older.length > 0 ? older : memories;
    
    // Shuffle and pick up to 3
    return [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [memories]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-commitment animate-pulse-soft" />
        <h3 className="text-sm font-medium text-text-primary">Worth revisiting today</h3>
      </div>

      {isLoading && revisitMemories.length === 0 ? (
        <div className="animate-pulse space-y-3">
          <div className="h-[104px] bg-surface rounded-lg border border-white/5" />
          <div className="h-[104px] bg-surface rounded-lg border border-white/5" />
        </div>
      ) : revisitMemories.length === 0 && !isLoading ? (
        <div className="rounded-lg border border-white/5 bg-surface/60 px-3 py-4 text-xs text-text-muted text-center">
          Add more memories to see revisits here.
        </div>
      ) : (
        <div className="space-y-3">
          {revisitMemories.map((memory, index) => (
            <div
              key={memory.id}
              className={cn(
                'bg-surface rounded-lg border border-white/5 p-3 hover:bg-white/[0.02] transition-colors duration-200',
                'animate-fade-in',
                `stagger-${index + 1}`
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-medium text-white line-clamp-1">
                  {memory.content.substring(0, 40) || 'Untitled Memory'}
                </span>
                <span className="text-[11px] text-text-muted shrink-0 whitespace-nowrap">
                  {formatRelativeTime(memory.timestamp)}
                </span>
              </div>

              <p className="text-xs text-text-muted mb-3 line-clamp-2">
                {memory.content.length > 40 ? memory.content.substring(40, 100) + '...' : memory.content}
              </p>

              <div className="flex items-center justify-between">
                <TagPill type={memory.type} />
                <span className="text-[11px] text-text-muted">
                  Revisit
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
