import { Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AuthScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-memory-card rounded-2xl border border-memory-surface p-8 shadow-xl flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6">
          <Brain className="w-8 h-8 text-primary-500" />
        </div>
        
        <h1 className="text-3xl font-bold gradient-text mb-2">MemoryOS</h1>
        <p className="memory-muted text-center mb-8">Your personal AI second brain</p>
        
        <div className="w-full h-px bg-memory-surface mb-8" />
        
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center space-x-3 bg-white text-black py-3 px-4 rounded-xl font-medium hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
