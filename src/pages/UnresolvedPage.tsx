import { useMemo } from 'react';
import { Check, MessageSquare } from 'lucide-react';
import { useMemoryStore, type Memory } from '../store/memoryStore';
import { cn, formatRelativeTime } from '../lib/utils';
import { TagPill } from '../components/TagPill';
import { motion, AnimatePresence } from 'framer-motion';

export function UnresolvedPage() {
  const memories = useMemoryStore((state) => state.memories);
  const isLoading = useMemoryStore((state) => state.isLoading);
  const markResolved = useMemoryStore((state) => state.markResolved);

  const unresolved = useMemo(() =>
    memories.filter(m => 
      (m.type === 'EMOTION' || m.type === 'COMMITMENT') && 
      !m.resolved
    ).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  , [memories]);

  const resolvedCount = useMemo(() => 
    memories.filter(m => m.resolved).length
  , [memories]);

  const emotionCount = unresolved.filter(m => m.type === 'EMOTION').length;
  const commitmentCount = unresolved.filter(m => m.type === 'COMMITMENT').length;

  const handleResolve = async (memory: Memory) => {
    markResolved(memory.id);
  };

  const handleProcess = (memory: Memory) => {
    // Navigate to Chat or trigger a global event for the chat interface
    alert(`Help me process this: ${memory.content}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Unresolved</h1>
          <p className="text-sm text-text-muted">Loading threads...</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-32 bg-memory-surface rounded-xl border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">
            Unresolved
          </h1>
          <p className="text-sm text-text-muted">
            Memories and commitments needing attention
          </p>
        </div>

        {/* Count Badges */}
        {unresolved.length > 0 && (
          <div className="flex gap-2">
            {commitmentCount > 0 && (
              <span className="text-xs px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                {commitmentCount} Commitments pending
              </span>
            )}
            {emotionCount > 0 && (
              <span className="text-xs px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
                {emotionCount} Emotions to process
              </span>
            )}
          </div>
        )}
      </div>

      {unresolved.length === 0 && !isLoading ? (
        <div className="text-center py-16 bg-memory-surface/30 rounded-xl border border-white/5 animate-fade-in">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">All clear! Nothing unresolved.</h3>
          <p className="text-sm text-memory-muted">{resolvedCount} memories resolved so far.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {unresolved.map((memory, index) => (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.2) }}
                className={cn(
                  'bg-memory-card border border-memory-surface rounded-xl p-4',
                  'border-l-4 transition-all hover:bg-white/[0.02]',
                  memory.type === 'EMOTION' ? 'border-l-rose-500' : 'border-l-amber-500'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-sm font-medium text-white line-clamp-1">
                    {memory.content.substring(0, 40) || 'Untitled'}
                  </span>
                  <span className="text-[11px] text-text-muted shrink-0 whitespace-nowrap">
                    {formatRelativeTime(new Date(memory.timestamp))}
                  </span>
                </div>

                <p className="text-xs text-text-muted mb-4 line-clamp-2 min-h-[32px]">
                  {memory.content.length > 40 ? memory.content.substring(40, 100) + '...' : memory.content}
                </p>

                <div className="flex items-center justify-between">
                  {/* Left: Type tag */}
                  <TagPill type={memory.type} />
                  
                  {/* Right: Actions */}
                  {memory.type === 'COMMITMENT' ? (
                    <button
                      onClick={() => handleResolve(memory)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-text-muted hover:text-green-400 hover:bg-green-500/10 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark as done
                    </button>
                  ) : (
                    <button
                      onClick={() => handleProcess(memory)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Process this
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
