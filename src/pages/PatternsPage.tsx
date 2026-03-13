import { TrendingUp } from 'lucide-react';
import { PatternCard } from '../components/PatternCard';
import { useMemoryStore } from '../store/memoryStore';

export function PatternsPage() {
  const { patterns } = useMemoryStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">
          Patterns
        </h1>
        <p className="text-sm text-text-muted">
          Recurring themes and behaviors detected in your memories
        </p>
      </div>

      {/* Patterns List */}
      {patterns.length > 0 ? (
        <div className="grid gap-4">
          {patterns.map((pattern, index) => (
            <div
              key={pattern.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PatternCard pattern={pattern} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-muted">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No patterns detected yet</p>
          <p className="text-xs mt-1">Keep logging your memories to discover patterns</p>
        </div>
      )}
    </div>
  );
}
