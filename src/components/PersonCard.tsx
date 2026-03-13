import { cn, formatRelativeTime } from '../lib/utils';
import type { Person } from '../store/memoryStore';
import { Meh, Frown, Smile } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onClick: () => void;
  className?: string;
}

const sentimentConfig = {
  neutral: {
    icon: Meh,
    color: 'bg-text-muted',
    label: 'Neutral',
  },
  tense: {
    icon: Frown,
    color: 'bg-unresolved',
    label: 'Tense',
  },
  warm: {
    icon: Smile,
    color: 'bg-event',
    label: 'Warm',
  },
};

export function PersonCard({ person, onClick, className }: PersonCardProps) {
  const sentiment = sentimentConfig[person.sentiment];
  const SentimentIcon = sentiment.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left bg-surface rounded-lg border border-white/5 p-4 hover:border-accent/20 transition-all duration-200 group',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-person/30 to-person/10 flex items-center justify-center">
          <span className="text-sm font-medium text-person">
            {person.name.charAt(0)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <SentimentIcon className={cn('w-3.5 h-3.5', sentiment.color === 'bg-text-muted' ? 'text-text-muted' : sentiment.color.replace('bg-', 'text-'))} />
          <span className="text-xs text-text-muted">{sentiment.label}</span>
        </div>
      </div>

      <h3 className="text-sm font-medium text-text-primary mb-1 group-hover:text-accent transition-colors">
        {person.name}
      </h3>

      <p className="text-xs text-text-muted mb-2">
        Last mentioned: {formatRelativeTime(person.lastMentioned)}
      </p>

      <p className="text-xs text-text-muted line-clamp-2">
        {person.lastContext}
      </p>
    </button>
  );
}
