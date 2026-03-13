import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, User } from 'lucide-react';
import { PersonCard } from '../components/PersonCard';
import { MemoryCard } from '../components/MemoryCard';
import { useMemoryStore, type Person } from '../store/memoryStore';
import { formatRelativeTime } from '../lib/utils';

export function PeoplePage() {
  const { people, getPersonMemories } = useMemoryStore();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setIsOpen(true);
  };

  const personMemories = selectedPerson
    ? getPersonMemories(selectedPerson.id)
    : [];

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
      {people.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person, index) => (
            <div
              key={person.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PersonCard
                person={person}
                onClick={() => handlePersonClick(person)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-muted">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No people mentioned yet</p>
        </div>
      )}

      {/* Person Detail Dialog */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[80vh] bg-surface rounded-xl border border-white/10 p-6 z-50 overflow-hidden animate-fade-in">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-person/30 to-person/10 flex items-center justify-center">
                  <span className="text-lg font-medium text-person">
                    {selectedPerson?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <Dialog.Title className="text-xl font-semibold text-text-primary">
                    {selectedPerson?.name}
                  </Dialog.Title>
                  <p className="text-sm text-text-muted">
                    Last mentioned: {selectedPerson && formatRelativeTime(selectedPerson.lastMentioned)}
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
              {personMemories.length > 0 ? (
                personMemories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    showActions={false}
                  />
                ))
              ) : (
                <p className="text-center text-text-muted py-8">
                  No memories about {selectedPerson?.name} yet
                </p>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
