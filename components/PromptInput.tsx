import React, { useState, KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [value, setValue] = useState('');

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
      <div className="relative flex items-center">
        <div className="absolute left-4 text-indigo-400 animate-pulse-slow">
            <Sparkles size={20} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your loop (e.g., 'Dark techno rumble 130bpm')"
          disabled={isLoading}
          className="w-full bg-slate-800 text-white placeholder-slate-400 border border-slate-600 rounded-2xl py-4 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className={`absolute right-2 p-2 rounded-xl transition-all ${
            !value.trim() || isLoading
              ? 'text-slate-600 bg-transparent'
              : 'text-white bg-indigo-600 hover:bg-indigo-500 shadow-md'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
      <div className="mt-3 flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide">
        {['House Drum Loop', 'Lofi Hip Hop Beat', 'Acid Bassline', 'Cinematic Drone'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setValue(suggestion)}
            className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-full whitespace-nowrap transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
