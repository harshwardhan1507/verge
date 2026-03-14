import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { cn } from '../lib/utils';
import type { MemoryType } from '../store/memoryStore';

interface CheckInInputProps {
  onSubmit: (content: string, type: MemoryType, relatedPerson?: string) => void;
}

// Removed unused auto-detection constants and functions

export function CheckInInput({ onSubmit }: CheckInInputProps) {
  const [content, setContent] = useState('');
  const [interimContent, setInterimContent] = useState('');
  const [selectedType, setSelectedType] = useState<MemoryType>('EVENT');
  const [detectedPerson, setDetectedPerson] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);

  const typeButtons: { type: MemoryType; label: string; activeClass: string; inactiveClass: string }[] = [
    { type: 'EVENT', label: 'Event', activeClass: 'bg-teal-500 text-white border-teal-500', inactiveClass: 'text-teal-500/70 border-teal-500/30 hover:bg-teal-500/10' },
    { type: 'EMOTION', label: 'Emotion', activeClass: 'bg-rose-500 text-white border-rose-500', inactiveClass: 'text-rose-500/70 border-rose-500/30 hover:bg-rose-500/10' },
    { type: 'COMMITMENT', label: 'Commitment', activeClass: 'bg-amber-500 text-white border-amber-500', inactiveClass: 'text-amber-500/70 border-amber-500/30 hover:bg-amber-500/10' },
    { type: 'INSIGHT', label: 'Thought', activeClass: 'bg-violet-500 text-white border-violet-500', inactiveClass: 'text-violet-500/70 border-violet-500/30 hover:bg-violet-500/10' },
  ];

  // Detect person only
  useEffect(() => {
    const full = content + (interimContent ? ` ${interimContent}` : '');
    const lower = full.toLowerCase();
    const personKeywords = ['aryan', 'dad', 'mom', 'manager', 'sarah', 'john', 'mike', 'boss', 'friend'];
    let foundPerson: string | undefined;
    
    for (const p of personKeywords) {
      if (lower.includes(p)) {
        foundPerson = p.charAt(0).toUpperCase() + p.slice(1);
        break;
      }
    }
    setDetectedPerson(foundPerson);
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
    onSubmit(combined, selectedType, detectedPerson);
    setContent('');
    setInterimContent('');
    setSelectedType('EVENT');
    setDetectedPerson(undefined);
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
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
      {/* Type Selectors */}
      <div className="flex flex-wrap gap-2 mb-4">
        {typeButtons.map(({ type, label, activeClass, inactiveClass }) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={cn(
              'px-3 py-1 text-[12px] font-medium rounded-full border transition-all duration-200',
              selectedType === type ? activeClass : inactiveClass
            )}
          >
            {label}
          </button>
        ))}
        {/* Person badge — slides in when a person is detected */}
        {detectedPerson && (
          <span className="ml-auto text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full flex items-center">
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
            ? 'Ctrl + Enter to submit'
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