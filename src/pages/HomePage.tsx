import { CheckInInput } from '../components/CheckInInput';
import { MemoryCard } from '../components/MemoryCard';
import { useMemoryStore, type MemoryType } from '../store/memoryStore';

export function HomePage() {
  const { addMemory, getRecentMemories } = useMemoryStore();
  const recentMemories = getRecentMemories(5);

  const handleAddMemory = (content: string, type: MemoryType, relatedPerson?: string) => {
    addMemory(content, type, relatedPerson);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">
          {getGreeting()}, Haruto. What's on your mind today?
        </h1>
        <p className="text-sm text-text-muted">
          Take a moment to capture your thoughts
        </p>
      </div>

      {/* Check-in Input */}
      <div className="animate-fade-in stagger-1">
        <CheckInInput onSubmit={handleAddMemory} />
      </div>

      {/* Recent Entries */}
      <div className="animate-fade-in stagger-2">
        <h2 className="text-lg font-medium text-text-primary mb-4">
          Recent Entries
        </h2>
        
        {recentMemories.length > 0 ? (
          <div className="space-y-3">
            {recentMemories.map((memory, index) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                showActions={false}
                animationDelay={index * 50}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-muted">
            <p className="text-sm">No memories yet. Start by checking in above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
