import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Memory } from '../store/memoryStore';
import { formatRelativeTime } from '../lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const QUICK_PROMPTS = [
  "Summarize my day 📋",
  "How have I been feeling lately? 💭", 
  "What patterns do you notice? 🔍",
  "Help me organize my thoughts 🧠",
  "What commitments do I have? ✅",
  "What's been on my mind most? 🌊"
];

interface AIChatProps {
  memories: Memory[];
}

export function AIChat({ memories }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [input]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([]);
      setError(null);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;
    
    setInput('');
    setError(null);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Create empty assistant message for streaming
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      // Build conversation history for context (last 10 messages)
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          memories: memories,
          conversationHistory: history,
          userName: 'Harsh' // Hardcoding name based on local directory user but API accepts dynamic
        })
      });

      if (!response.ok) {
        throw new Error('Server responded with ' + response.status);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              if (data.error) {
                // If the stream returns an error payload
                if (data.error.includes('apiKey') || data.error.includes('key')) {
                   throw new Error('Gemini API key is missing or invalid. Please add GEMINI_API_KEY to your .env file and restart the server.');
                }
                throw new Error(data.error);
              }
              if (data.text) {
                setMessages(prev => prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: m.content + data.text }
                    : m
                ));
              }
            } catch (e: any) {
               // Only format JSON parse errors silently
               if (e.message !== "Unexpected end of JSON input") {
                 throw e;
               }
            }
          }
        }
      }

      // Mark streaming as done
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, isStreaming: false } : m
      ));

    } catch (err: any) {
      let errorMessage = 'Sorry, I had trouble connecting. Please try again.';
      if (err.message.includes('fetch')) {
         errorMessage = 'Could not connect to AI server. Make sure you ran: npm run dev:all';
      } else if (err.message) {
         errorMessage = err.message;
      }
      
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: errorMessage, isStreaming: false }
          : m
      ));
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === 'Enter' && e.ctrlKey) || (e.key === 'Enter' && !e.shiftKey)) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] relative max-h-[100vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-memory-surface shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">AI Chat</h1>
          <p className="text-sm text-text-muted">Talk to Verge, your second brain</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="p-2 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pt-6 pb-24 scroll-smooth">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center px-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-purple-700/20 flex items-center justify-center mb-6 border border-primary-500/20">
              <Sparkles className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-3xl font-semibold bg-gradient-to-r from-violet-400 to-primary-500 bg-clip-text text-transparent mb-3">
              Talk to Verge
            </h2>
            <p className="text-memory-muted mb-10 max-w-md line-relaxed">
              Your AI second brain. Ask me anything about your life, thoughts, or memories. Let's explore your patterns together.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {QUICK_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-memory-surface bg-memory-card hover:border-primary-500/30 hover:bg-white/[0.03] px-4 py-3 text-sm text-white/90 cursor-pointer transition-all duration-200 shadow-sm"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto px-2">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={msg.role === 'user' ? "flex justify-end" : "flex items-start gap-3"}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
                    <div
                      className={msg.role === 'user'
                        ? "bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap"
                        : "bg-memory-card border border-memory-surface text-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap"
                      }
                    >
                      {msg.content}
                      {msg.isStreaming && (
                        <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-primary-400 translate-y-1"></span>
                      )}
                      
                      {/* Typing Indicator for Assistant when string is completely empty */}
                      {msg.role === 'assistant' && isLoading && msg.content === '' && (
                         <div className="flex gap-1 h-3 items-center py-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-memory-muted animate-bounce" style={{animationDelay: '0ms'}} />
                           <div className="w-1.5 h-1.5 rounded-full bg-memory-muted animate-bounce" style={{animationDelay: '150ms'}} />
                           <div className="w-1.5 h-1.5 rounded-full bg-memory-muted animate-bounce" style={{animationDelay: '300ms'}} />
                         </div>
                      )}
                    </div>
                    
                    <span className={msg.role === 'user'
                        ? "text-[10px] text-memory-muted text-right mt-1 px-1"
                        : "text-[10px] text-memory-muted text-left mt-1 px-1"
                      }
                    >
                      {formatRelativeTime(new Date(msg.timestamp))}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-memory-surface bg-memory-dark/95 backdrop-blur-md p-4">
        {error && !messages.length && (
           <div className="max-w-4xl mx-auto mb-3 text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 text-center">
             {error}
           </div>
        )}
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Verge anything about your life..."
            className="flex-1 bg-memory-card border border-memory-surface rounded-2xl px-4 py-3 text-sm text-white placeholder-memory-muted resize-none min-h-[48px] max-h-[120px] outline-none focus:border-primary-500/50 transition-colors shadow-sm"
            style={{ height: '48px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 shrink-0 rounded-xl bg-primary-600 hover:bg-primary-500 flex items-center justify-center transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Send className="w-5 h-5 text-white ml-0.5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-memory-muted mt-3 max-w-4xl mx-auto">
          Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for a new line. Verge may make mistakes.
        </p>
      </div>
    </div>
  );
}
