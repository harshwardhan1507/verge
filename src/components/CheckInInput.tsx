import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { cn } from '../lib/utils';
import type { MemoryType } from '../store/memoryStore';

interface CheckInInputProps {
  onSubmit: (content: string, type: MemoryType, relatedPerson?: string) => void;
}

// Label shown in the input header for each detected type
const typeLabel: Record<MemoryType, string> = {
  EMOTION:    'How are you feeling?',
  COMMITMENT: "You've made a commitment",
  EVENT:      'Something happened',
  INSIGHT:    'You had an insight',
  UNRESOLVED: 'Something on your mind',
  PATTERN:    'A pattern noticed',
  PERSON:     'Someone came up',
};

// Dot color per detected type
const dotColor: Record<MemoryType, string> = {
  EMOTION:    'bg-orange-400',
  COMMITMENT: 'bg-violet-500',
  EVENT:      'bg-blue-500',
  INSIGHT:    'bg-teal-400',
  UNRESOLVED: 'bg-yellow-400',
  PATTERN:    'bg-pink-500',
  PERSON:     'bg-sky-400',
};

// Simple keyword-based tag detection
function detectTags(content: string): { type: MemoryType; person?: string } {
  const lower = content.toLowerCase();

  const personKeywords = ['aryan', 'dad', 'mom', 'manager', 'sarah', 'john', 'mike', 'boss', 'friend'];
  let detectedPerson: string | undefined;
  for (const p of personKeywords) {
    if (lower.includes(p)) {
      detectedPerson = p.charAt(0).toUpperCase() + p.slice(1);
      break;
    }
  }

  const checks: { type: MemoryType; keywords: string[] }[] = [
    { type: 'COMMITMENT', keywords: ['promise', 'committed', 'should', 'need to', 'have to', 'will', 'must'] },
    { type: 'EMOTION',    keywords: ['feel', 'feeling', 'happy', 'sad', 'anxious', 'worried', 'excited', 'frustrated', 'angry', 'grateful', 'scared'] },
    { type: 'INSIGHT',    keywords: ['realized', 'noticed', 'learned', 'discovered', 'figured out', 'insight'] },
    { type: 'EVENT',      keywords: ['went', 'had', 'met', 'talked', 'completed', 'finished', 'started', 'bought', 'visited'] },
    { type: 'UNRESOLVED', keywords: ['wondering', 'unsure', 'confused', "can't decide", 'should i', 'whether to'] },
  ];

  for (const { type, keywords } of checks) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return { type, person: detectedPerson };
    }
  }

  return { type: 'EMOTION', person: detectedPerson };
}

export function CheckInInput({ onSubmit }: CheckInInputProps) {
  const [content, setContent] = useState('');
  const [interimContent, setInterimContent] = useState('');
  const [detectedType, setDetectedType] = useState<MemoryType>('EMOTION');
  const [detectedPerson, setDetectedPerson] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);

  // Detect type as user types
  useEffect(() => {
    const full = content + (interimContent ? ` ${interimContent}` : '');
    if (full.trim()) {
      const { type, person } = detectTags(full);
      setDetectedType(type);
      setDetectedPerson(person);
    } else {
      setDetectedType('EMOTION');
      setDetectedPerson(undefined);
    }
  }, [content, interimContent]);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content, interimContent]);

  // Detect Web Speech API support and configure recognizer
  useEffect(() => {
    const anyWindow = window as Window;

    const SpeechRecognitionImpl =
      anyWindow.SpeechRecognition || anyWindow.webkitSpeechRecognition;

    if (SpeechRecognitionImpl) {
      setMicSupported(true);
      const recognition = new SpeechRecognitionImpl();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;
    }
  }, []);

  const handleSubmit = async () => {
    const combined = (content + ' ' + interimContent).trim();
    if (!combined) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 200));
    onSubmit(combined, detectedType, detectedPerson);
    setContent('');
    setInterimContent('');
    setDetectedType('EMOTION');
    setDetectedPerson(undefined);
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) handleSubmit();
  };

  const canSubmit =
    (content.trim().length > 0 || interimContent.trim().length > 0) &&
    !isSubmitting;

  const stopListening = () => {
    const recognition = recognitionRef.current as SpeechRecognition | null;
    if (recognition) {
      recognition.stop();
    }
    if (silenceTimeoutRef.current !== null) {
      window.clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    setIsListening(false);
    if (interimContent.trim()) {
      setContent((prev) =>
        prev ? `${prev} ${interimContent}` : interimContent
      );
      setInterimContent('');
    }
  };

  const startListening = () => {
    const recognition = recognitionRef.current as SpeechRecognition | null;
    if (!recognition) return;

    setMicError(null);
    setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        setContent((prev) =>
          prev
            ? `${prev} ${finalTranscript.trim()}`
            : finalTranscript.trim()
        );
      }

      setInterimContent(interimTranscript.trim());

      if (silenceTimeoutRef.current !== null) {
        window.clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = window.setTimeout(() => {
        stopListening();
      }, 8000);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed' || event.error === 'denied') {
        setMicError(
          'Mic access denied. Please allow microphone in browser settings.'
        );
      }
      stopListening();
    };

    recognition.onend = () => {
      if (isListening) {
        stopListening();
      }
    };

    try {
      recognition.start();
    } catch {
      setMicError('Unable to start microphone.');
      setIsListening(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="bg-[#13131c] rounded-2xl border border-white/[0.06] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {/* Animated type-indicator dot */}
          <div className={`w-1.5 h-1.5 rounded-full ${dotColor[detectedType]} transition-colors duration-300`} />
          <span className="text-[13px] font-medium text-white/60 transition-all duration-200">
            {typeLabel[detectedType]}
          </span>
        </div>

        {/* Person badge — slides in when a person is detected */}
        {detectedPerson && (
          <span className="text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
            {detectedPerson}
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={content + (interimContent ? ` ${interimContent}` : '')}
        onChange={(e) => {
          setContent(e.target.value);
          setInterimContent('');
        }}
        onKeyDown={handleKeyDown}
        placeholder="Tell me anything — what happened, how you feel, what you're thinking about..."
        rows={3}
        className={cn(
          'w-full bg-transparent text-[14px] text-white/80 placeholder:text-white/15',
          'resize-none focus:outline-none leading-relaxed min-h-[80px]'
        )}
        disabled={isSubmitting}
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05]">
        <span className="text-[11px] text-white/20">
          {content.length > 0 || interimContent.length > 0
            ? '⌘ + Enter to submit'
            : ''}
        </span>

        <div className="flex items-center gap-2">
          {micSupported && (
            <button
              type="button"
              onClick={toggleMic}
              className={cn(
                'relative flex items-center justify-center w-9 h-9 rounded-full border text-[11px] transition-all duration-200',
                'border-white/10 bg-[#141418] text-white/60 hover:text-white',
                isListening && 'border-rose-500/70 text-rose-400'
              )}
              title={isListening ? 'Listening...' : 'Click to speak'}
            >
              {isListening && (
                <span className="absolute inline-flex h-9 w-9 rounded-full bg-rose-500/20 animate-ping" />
              )}
              <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0d0d0f]">
                <Mic className="w-3.5 h-3.5" />
              </span>
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200',
              canSubmit
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
            )}
          >
            <Send className="w-3.5 h-3.5" />
            Add to Memory
          </button>
        </div>
      </div>

      {micError && (
        <p className="mt-2 text-[11px] text-rose-400/80">
          {micError}
        </p>
      )}
    </div>
  );
}