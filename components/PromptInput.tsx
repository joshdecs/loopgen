import React, { useState, KeyboardEvent } from 'react';
import { Send, Sparkles, Command } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div 
        className={`relative flex items-center transition-all duration-300 ${
            isFocused ? 'scale-[1.02]' : 'scale-100'
        }`}
      >
        <div className={`absolute left-4 transition-colors duration-300 ${isFocused ? 'text-indigo-400' : 'text-slate-500'}`}>
            {isFocused ? <Sparkles size={20} className="animate-pulse" /> : <Command size={20} />}
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your loop (e.g., 'Dark techno rumble 130bpm')"
          disabled={isLoading}
          className={`w-full bg-slate-900/90 text-white placeholder-slate-500 border rounded-2xl py-4 pl-12 pr-14 
            focus:outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-2xl backdrop-blur-xl transition-all
            ${isFocused ? 'border-indigo-500/50 shadow-indigo-500/10' : 'border-slate-700 shadow-black/50'}
          `}
        />
        
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className={`absolute right-2 p-2.5 rounded-xl transition-all duration-300 ${
            !value.trim() || isLoading
              ? 'text-slate-600 bg-transparent'
              : 'text-white bg-gradient-to-tr from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={18} fill="currentColor" />
          )}
        </button>
      </div>

      <div className={`mt-4 flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-70'}`}>
        {['House Drum Loop', 'Lofi Hip Hop Beat', 'Acid Bassline', 'Cinematic Drone'].map((suggestion, i) => (
          <button
            key={suggestion}
            onClick={() => setValue(suggestion)}
            className="px-4 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600 rounded-full whitespace-nowrap transition-all active:scale-95 animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};