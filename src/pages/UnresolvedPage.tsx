import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertCircle, Check, Plus, X, Clock } from 'lucide-react';
import { useMemoryStore } from '../store/memoryStore';
import { cn, getTimeSince } from '../lib/utils';

export function UnresolvedPage() {
  const { unresolvedThreads, addUpdate, markResolved, memories } = useMemoryStore();
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [updateText, setUpdateText] = useState('');

  // Sort by oldest first
  const sortedThreads = [...unresolvedThreads].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );

  const handleAddUpdate = () => {
    if (!selectedThreadId || !updateText.trim()) return;
    addUpdate(selectedThreadId, updateText.trim());
    setUpdateText('');
    setIsAddUpdateOpen(false);
    setSelectedThreadId(null);
  };

  const openAddUpdate = (threadId: string) => {
    setSelectedThreadId(threadId);
    setIsAddUpdateOpen(true);
  };

  const getRelatedMemories = (threadId: string) => {
    const thread = unresolvedThreads.find(t => t.id === threadId);
    if (!thread) return [];
    return memories.filter(m => thread.relatedMemoryIds.includes(m.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">
          Unresolved
        </h1>
        <p className="text-sm text-text-muted">
          Threads that need your attention
        </p>
      </div>

      {/* Threads List */}
      {sortedThreads.length > 0 ? (
        <div className="space-y-4">
          {sortedThreads.map((thread, index) => (
            <div
              key={thread.id}
              className={cn(
                'bg-surface rounded-lg border border-white/5 p-4 animate-fade-in',
                thread.id.startsWith('thread1') || thread.id.startsWith('thread3')
                  ? 'border-commitment/20'
                  : 'border-unresolved/20'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span className="text-xs text-text-muted">
                    {getTimeSince(thread.createdAt)}
                  </span>
                </div>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  thread.id.startsWith('thread1') || thread.id.startsWith('thread3')
                    ? 'bg-commitment/10 text-commitment'
                    : 'bg-unresolved/10 text-unresolved'
                )}>
                  {thread.id.startsWith('thread1') || thread.id.startsWith('thread3')
                    ? 'Commitment'
                    : 'Unresolved'}
                </span>
              </div>

              <p className="text-sm text-text-primary mb-3">
                {thread.originalText}
              </p>

              {/* Updates */}
              {thread.updates.length > 0 && (
                <div className="mb-3 pl-3 border-l-2 border-white/10 space-y-2">
                  {thread.updates.map((update, i) => (
                    <p key={i} className="text-xs text-text-muted">
                      • {update}
                    </p>
                  ))}
                </div>
              )}

              {/* Related Memories */}
              {getRelatedMemories(thread.id).length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-text-muted mb-2">
                    Related memories: {getRelatedMemories(thread.id).length}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openAddUpdate(thread.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Update
                </button>
                <button
                  onClick={() => {
                    const relatedMemories = getRelatedMemories(thread.id);
                    relatedMemories.forEach(m => markResolved(m.id));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-event/10 text-event hover:bg-event/20 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-muted">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-event opacity-50" />
          <p className="text-sm">No unresolved threads</p>
          <p className="text-xs mt-1">Nice work! Everything is taken care of.</p>
        </div>
      )}

      {/* Add Update Dialog */}
      <Dialog.Root open={isAddUpdateOpen} onOpenChange={setIsAddUpdateOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-surface rounded-xl border border-white/10 p-6 z-50 animate-fade-in">
            <Dialog.Title className="text-lg font-semibold text-text-primary mb-4">
              Add Update
            </Dialog.Title>

            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="What's new with this?"
              className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent/20 resize-none min-h-[100px]"
            />

            <div className="flex justify-end gap-2 mt-4">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleAddUpdate}
                disabled={!updateText.trim()}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  updateText.trim()
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-white/5 text-text-muted cursor-not-allowed'
                )}
              >
                Add Update
              </button>
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
