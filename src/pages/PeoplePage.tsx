import { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, User } from 'lucide-react';
import { MemoryCard } from '../components/MemoryCard';
import { useMemoryStore, type Memory } from '../store/memoryStore';
import { formatRelativeTime } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function PeoplePage() {
  const memories = useMemoryStore((state) => state.memories);
  const isLoading = useMemoryStore((state) => state.isLoading);
  const [selectedPerson, setSelectedPerson] = useState<{ name: string; count: number; lastSeen: string; memories: Memory[] } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Extract all unique people with their memory count and last mentioned date
  const people = useMemo(() => {
    const map = new Map<string, { name: string; count: number; lastSeen: string; memories: Memory[] }>();
    
    memories.forEach(memory => {
      // Use both relatedPerson and parsing key_people if they existed
      const namesToProcess: string[] = [];
      if (memory.relatedPerson) {
         // handle joined strings like "Sanchit, Harsh"
         const parts = memory.relatedPerson.split(',').map(p => p.trim());
         namesToProcess.push(...parts);
      }
      // Fallback extraction
      
      namesToProcess.forEach(person => {
        const name = person.trim();
        if (!name) return;
        if (map.has(name)) {
          const existing = map.get(name)!;
          existing.count++;
          existing.memories.push(memory);
          if (new Date(memory.timestamp) > new Date(existing.lastSeen)) {
            existing.lastSeen = memory.timestamp.toISOString();
          }
        } else {
          map.set(name, { 
            name, 
            count: 1, 
            lastSeen: memory.timestamp.toISOString(),
            memories: [memory]
          });
        }
      });
    });
    
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [memories]);

  const handlePersonClick = (person: any) => {
    setSelectedPerson(person);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">
          People
        </h1>
        <p className="text-sm text-text-muted">
          People you've mentioned in your memories
        </p>
      </div>

      {/* People Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse h-32 bg-memory-surface rounded-xl border border-white/5" />
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-12 text-text-muted bg-memory-surface/30 rounded-xl border border-white/5">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50 text-white/20" />
          <p className="text-sm">Add some memories first, then people you mention will appear here.</p>
        </div>
      ) : people.length === 0 ? (
        <div className="text-center py-12 text-text-muted bg-memory-surface/30 rounded-xl border border-white/5">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50 text-white/20" />
          <p className="text-sm">No names detected yet. Try mentioning people by name in your memories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {people.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handlePersonClick(person)}
              className="bg-memory-card border border-memory-surface rounded-xl p-4 cursor-pointer hover:bg-white/[0.02] transition-colors duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-violet-700 flex items-center justify-center mb-3">
                <span className="text-lg font-medium text-white">
                  {person.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1 line-clamp-1">{person.name}</h3>
              <p className="text-memory-muted text-sm mb-1">Mentioned {person.count} time{person.count !== 1 ? 's' : ''}</p>
              <p className="text-memory-muted text-xs">Last mentioned: {formatRelativeTime(new Date(person.lastSeen))}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Person Detail Dialog */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[80vh] bg-[#13131c] rounded-xl border border-white/10 p-6 z-50 overflow-hidden animate-fade-in">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-violet-700 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {selectedPerson?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <Dialog.Title className="text-xl font-semibold text-text-primary">
                    {selectedPerson?.name}
                  </Dialog.Title>
                  <p className="text-sm text-text-muted">
                    Last mentioned: {selectedPerson && formatRelativeTime(new Date(selectedPerson.lastSeen))}
                  </p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </Dialog.Close>
            </div>

            <div className="overflow-y-auto max-h-[60vh] space-y-3 pr-2">
              <AnimatePresence mode="popLayout">
                {selectedPerson?.memories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    showActions={false}
                  />
                ))}
              </AnimatePresence>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
