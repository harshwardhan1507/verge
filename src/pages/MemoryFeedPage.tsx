import { useState } from 'react';
import { Search } from 'lucide-react';
import { MemoryCard } from '../components/MemoryCard';
import { useMemoryStore, type MemoryType } from '../store/memoryStore';
import { cn } from '../lib/utils';

const filterOptions: { value: MemoryType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'COMMITMENT', label: 'Commitment' },
  { value: 'PERSON', label: 'Person' },
  { value: 'EMOTION', label: 'Emotion' },
  { value: 'PATTERN', label: 'Pattern' },
  { value: 'EVENT', label: 'Event' },
  { value: 'UNRESOLVED', label: 'Unresolved' },
  { value: 'INSIGHT', label: 'Insight' },
];

export function MemoryFeedPage() {
  const { memories, markResolved } = useMemoryStore();
  const [activeFilter, setActiveFilter] = useState<MemoryType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMemories = memories.filter((memory) => {
    const matchesFilter = activeFilter === 'ALL' || memory.type === activeFilter;
    const matchesSearch =
      !searchQuery ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.relatedPerson?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">
          Memory Feed
        </h1>
        <p className="text-sm text-text-muted">
          Your complete memory timeline
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 animate-fade-in stagger-1">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent/20 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                activeFilter === option.value
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-muted hover:text-text-primary border border-white/5'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Memory List */}
      <div className="space-y-3">
        {filteredMemories.length > 0 ? (
          filteredMemories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onMarkResolved={markResolved}
              animationDelay={index * 30}
            />
          ))
        ) : (
          <div className="text-center py-12 text-text-muted">
            <p className="text-sm">
              {searchQuery
                ? `No memories found for "${searchQuery}"`
                : 'No memories yet. Start by checking in!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
