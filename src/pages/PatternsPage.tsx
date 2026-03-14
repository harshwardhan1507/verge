import { TrendingUp } from 'lucide-react';
import { useMemoryStore } from '../store/memoryStore';
import { useMemo } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function PatternsPage() {
  const memories = useMemoryStore((state) => state.memories);
  const isLoading = useMemoryStore((state) => state.isLoading);

  const patterns = useMemo(() => {
    if (memories.length < 2) return null;

    // 1. Emotion frequency (Defaults to neutral since we removed complex tagging)
    const emotionCounts = memories.reduce((acc, m) => {
      const e = (m as any).dominant_emotion || 'neutral';
      acc[e] = (acc[e] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 2. Most active type
    const typeCounts = memories.reduce((acc, m) => {
      const t = m.type || 'EVENT';
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate total for percentages
    const totalMemories = memories.length;

    // 3. Most mentioned people
    const peopleCounts: Record<string, number> = {};
    memories.forEach(m => {
      const namesToProcess: string[] = [];
      if (m.relatedPerson) {
         const parts = m.relatedPerson.split(',').map(p => p.trim());
         namesToProcess.push(...parts);
      }
      namesToProcess.forEach(p => {
        peopleCounts[p] = (peopleCounts[p] || 0) + 1;
      });
    });
    const topPeople = Object.entries(peopleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // 4. Memories per day of week
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dayCounts = new Array(7).fill(0);
    memories.forEach(m => {
      const day = new Date(m.timestamp).getDay();
      dayCounts[day]++;
    });
    const maxDayObj = dayCounts.reduce((max, count, idx) => count > max.count ? { count, idx } : max, { count: -1, idx: 0 });
    const mostActiveDay = dayNames[maxDayObj.idx];

    // 5. Total dates
    const dates = [...new Set(memories.map(m => 
      new Date(m.timestamp).toDateString()
    ))].sort();
    
    return { emotionCounts, typeCounts, topPeople, mostActiveDay, totalMemories, dates };
  }, [memories]);

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-rose-500';
      case 'anxious': return 'bg-amber-500';
      case 'excited': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'EVENT': return 'bg-teal-500';
      case 'EMOTION': return 'bg-rose-500';
      case 'COMMITMENT': return 'bg-amber-500';
      case 'INSIGHT': return 'bg-violet-500';
      case 'PATTERN': return 'bg-pink-500';
      case 'UNRESOLVED': return 'bg-yellow-400';
      case 'PERSON': return 'bg-sky-400';
      default: return 'bg-white/20';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Patterns</h1>
          <p className="text-sm text-text-muted">Analyzing your memories...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse h-48 bg-memory-surface rounded-xl border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

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

      {/* Patterns Insight Cards */}
      {patterns ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Emotion Breakdown */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-memory-card border border-memory-surface rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-4 text-white">Emotional Landscape</h3>
            <div className="space-y-3">
              {Object.entries(patterns.emotionCounts).map(([emotion, count]) => {
                const percentage = Math.round((count / patterns.totalMemories) * 100);
                return (
                  <div key={emotion} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80 capitalize">{emotion}</span>
                      <span className="text-memory-muted">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", getEmotionColor(emotion))} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Card 2: Memory Types */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-memory-card border border-memory-surface rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-4 text-white">What You Track Most</h3>
            <div className="space-y-3">
              {Object.entries(patterns.typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                const percentage = Math.round((count / patterns.totalMemories) * 100);
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80 capitalize">{type.toLowerCase()}</span>
                      <span className="text-memory-muted">{count} items</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", getTypeColor(type))} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Card 3: Most Mentioned People */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-memory-card border border-memory-surface rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-4 text-white">People in Your Life</h3>
            {patterns.topPeople.length > 0 ? (
              <div className="space-y-3">
                {patterns.topPeople.map(([person, count]) => (
                  <div key={person} className="flex items-center gap-3 bg-white/[0.02] p-2 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-violet-700 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{person.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{person}</p>
                      <p className="text-xs text-memory-muted">{count} mentions</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-memory-muted py-4 text-center">No people mentioned yet.</p>
            )}
          </motion.div>

          {/* Card 4: Activity Pattern */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-memory-card border border-memory-surface rounded-xl p-4 flex flex-col justify-center">
            <h3 className="font-semibold text-lg mb-2 text-white">Your Most Active Day</h3>
            <div className="text-center py-4">
              <p className="font-bold text-4xl bg-gradient-to-r from-teal-400 to-violet-500 bg-clip-text text-transparent mb-2">
                {patterns.mostActiveDay}
              </p>
              <p className="text-sm text-memory-muted">You tend to reflect most on {patterns.mostActiveDay}s.</p>
            </div>
          </motion.div>

          {/* Card 5: Total Insights */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-memory-card border border-memory-surface rounded-xl p-4 md:col-span-2">
            <h3 className="font-semibold text-lg mb-4 text-white">Memory Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-white mb-1">{patterns.totalMemories}</p>
                <p className="text-xs text-memory-muted">Total Memories</p>
              </div>
              <div className="bg-surface p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-white mb-1">{patterns.dates.length}</p>
                <p className="text-xs text-memory-muted">Days Tracked</p>
              </div>
              <div className="bg-surface p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-white mb-1">
                  {patterns.dates.length ? (patterns.totalMemories / patterns.dates.length).toFixed(1) : 0}
                </p>
                <p className="text-xs text-memory-muted">Avg per Day</p>
              </div>
              <div className="bg-surface p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-white mb-1">{patterns.topPeople.length}</p>
                <p className="text-xs text-memory-muted">People Mentioned</p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-12 text-text-muted bg-memory-surface/30 rounded-xl border border-white/5">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50 text-white/20" />
          <p className="text-sm">Log at least 2 memories to start seeing patterns.</p>
          <p className="text-xs mt-1">{2 - memories.length} more to go</p>
        </div>
      )}
    </div>
  );
}
