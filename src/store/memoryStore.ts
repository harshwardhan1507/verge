import { create } from 'zustand';

export type MemoryType = 
  | 'COMMITMENT' 
  | 'PERSON' 
  | 'EMOTION' 
  | 'PATTERN' 
  | 'EVENT' 
  | 'UNRESOLVED' 
  | 'INSIGHT';

export type Sentiment = 'neutral' | 'tense' | 'warm';

export interface Memory {
  id: string;
  type: MemoryType;
  content: string;
  timestamp: Date;
  relatedPerson?: string;
  resolved?: boolean;
  threadId?: string;
}

export interface Person {
  id: string;
  name: string;
  lastMentioned: Date;
  sentiment: Sentiment;
  lastContext: string;
}

export interface Pattern {
  id: string;
  title: string;
  frequency: number;
  firstNoticed: Date;
  latestMention: Date;
  description: string;
  relatedMemoryIds: string[];
}

export interface UnresolvedThread {
  id: string;
  originalText: string;
  createdAt: Date;
  updates: string[];
  relatedMemoryIds: string[];
}

export interface ProactiveSurface {
  id: string;
  memoryId: string;
  title: string;
  reason: string;
}

interface MemoryStore {
  memories: Memory[];
  people: Person[];
  patterns: Pattern[];
  unresolvedThreads: UnresolvedThread[];
  proactiveSurfaces: ProactiveSurface[];
  
  // Actions
  addMemory: (content: string, type: MemoryType, relatedPerson?: string) => void;
  markResolved: (id: string) => void;
  addUpdate: (threadId: string, update: string) => void;
  getRecentMemories: (count: number) => Memory[];
  getMemoriesByType: (type: MemoryType | 'ALL') => Memory[];
  searchMemories: (query: string) => Memory[];
  getPersonMemories: (personId: string) => Memory[];
  getUnresolvedCount: () => number;
}

const initialMemories: Memory[] = [];

const initialPeople: Person[] = [];

const initialPatterns: Pattern[] = [];

const initialUnresolvedThreads: UnresolvedThread[] = [];

const initialProactiveSurfaces: ProactiveSurface[] = [];

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  memories: initialMemories,
  people: initialPeople,
  patterns: initialPatterns,
  unresolvedThreads: initialUnresolvedThreads,
  proactiveSurfaces: initialProactiveSurfaces,

  addMemory: (content: string, type: MemoryType, relatedPerson?: string) => {
    const newMemory: Memory = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      relatedPerson,
    };
    set((state) => ({
      memories: [newMemory, ...state.memories],
    }));
  },

  markResolved: (id: string) => {
    set((state) => ({
      memories: state.memories.map((m) =>
        m.id === id ? { ...m, resolved: true } : m
      ),
    }));
  },

  addUpdate: (threadId: string, update: string) => {
    set((state) => ({
      unresolvedThreads: state.unresolvedThreads.map((t) =>
        t.id === threadId
          ? { ...t, updates: [...t.updates, update] }
          : t
      ),
    }));
  },

  getRecentMemories: (count: number) => {
    return get().memories.slice(0, count);
  },

  getMemoriesByType: (type: MemoryType | 'ALL') => {
    if (type === 'ALL') return get().memories;
    return get().memories.filter((m) => m.type === type);
  },

  searchMemories: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return get().memories.filter(
      (m) =>
        m.content.toLowerCase().includes(lowerQuery) ||
        m.type.toLowerCase().includes(lowerQuery) ||
        m.relatedPerson?.toLowerCase().includes(lowerQuery)
    );
  },

  getPersonMemories: (personId: string) => {
    const person = get().people.find((p) => p.id === personId);
    if (!person) return [];
    return get().memories.filter((m) => m.relatedPerson === person.name);
  },

  getUnresolvedCount: () => {
    return get().unresolvedThreads.length;
  },
}));
