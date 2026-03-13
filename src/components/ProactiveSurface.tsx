import { Lightbulb } from 'lucide-react';
import { useMemoryStore } from '../store/memoryStore';
import { TagPill } from './TagPill';
import { formatRelativeTime, cn } from '../lib/utils';
import type { Memory } from '../store/memoryStore';

interface ProactiveSurfaceProps {
  className?: string;
}

export function ProactiveSurface({ className }: ProactiveSurfaceProps) {
  const { proactiveSurfaces, memories } = useMemoryStore();

  const getMemoryForSurface = (surfaceId: string): Memory | undefined => {
    const surface = proactiveSurfaces.find(s => s.id === surfaceId);
    return surface ? memories.find(m => m.id === surface.memoryId) : undefined;
  };

  const visibleSurfaces = proactiveSurfaces.slice(0, 3).filter((surface) =>
    Boolean(getMemoryForSurface(surface.id))
  );

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-commitment animate-pulse-soft" />
        <h3 className="text-sm font-medium text-text-primary">Worth revisiting today</h3>
      </div>

      {visibleSurfaces.length === 0 ? (
        <div className="rounded-lg border border-white/5 bg-surface/60 px-3 py-4 text-xs text-text-muted text-center">
          Add more memories to see revisits here.
        </div>
      ) : (
        <div className="space-y-3">
          {visibleSurfaces.map((surface, index) => {
            const memory = getMemoryForSurface(surface.id);
            if (!memory) return null;

            return (
              <div
                key={surface.id}
                className={cn(
                  'bg-surface rounded-lg border border-commitment/20 p-3 hover:border-commitment/40 transition-all duration-200 glow-accent',
                  'animate-fade-in',
                  `stagger-${index + 1}`
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-sm font-medium text-commitment">
                    {surface.title}
                  </span>
                  <span className="text-xs text-text-muted shrink-0">
                    {formatRelativeTime(memory.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-text-muted mb-2 line-clamp-2">
                  {memory.content}
                </p>

                <div className="flex items-center justify-between">
                  <TagPill type={memory.type} />
                  <span className="text-xs text-text-muted">
                    {surface.reason}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
