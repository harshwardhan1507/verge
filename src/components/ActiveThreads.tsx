import { AlertCircle } from 'lucide-react';
import { useMemoryStore } from '../store/memoryStore';
import { cn } from '../lib/utils';
import { useMemo } from 'react';

interface ActiveThreadsProps {
  className?: string;
}

export function ActiveThreads({ className }: ActiveThreadsProps) {
  const memories = useMemoryStore((state) => state.memories);
  const isLoading = useMemoryStore((state) => state.isLoading);

  const unresolvedCount = useMemo(() => 
    memories.filter(m => 
      (m.type === 'EMOTION' || m.type === 'COMMITMENT') && 
      m.resolved !== true
    ).length
  , [memories]);

  const commitmentCount = useMemo(() =>
    memories.filter(m => m.type === 'COMMITMENT').length
  , [memories]);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-unresolved" />
        <h3 className="text-sm font-medium text-text-primary">Active Threads</h3>
      </div>

      {isLoading ? (
        <div className="flex gap-2">
          <div className="flex-1 animate-pulse h-[72px] bg-surface rounded-lg border border-white/5" />
          <div className="flex-1 animate-pulse h-[72px] bg-surface rounded-lg border border-white/5" />
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 bg-surface rounded-lg border border-unresolved/20 p-3 text-center">
            <div className="text-xl font-semibold text-unresolved">
              {unresolvedCount}
            </div>
            <div className="text-xs text-text-muted">Unresolved</div>
          </div>

          <div className="flex-1 bg-surface rounded-lg border border-commitment/20 p-3 text-center">
            <div className="text-xl font-semibold text-commitment">
              {commitmentCount}
            </div>
            <div className="text-xs text-text-muted">Commitments</div>
          </div>
        </div>
      )}
    </div>
  );
}
