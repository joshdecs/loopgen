import React from 'react';

interface VisualizerProps {
  isPlaying: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isPlaying }) => {
  return (
    <div className="flex items-end justify-center gap-1 h-32 w-full bg-slate-900/50 rounded-lg p-4 overflow-hidden border border-slate-700">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`w-2 bg-gradient-to-t from-indigo-600 to-rose-500 rounded-t-sm transition-all duration-300 ease-in-out ${
            isPlaying ? 'animate-pulse' : 'h-2 opacity-50'
          }`}
          style={{
            height: isPlaying ? `${Math.random() * 80 + 20}%` : '10%',
            animationDelay: `${i * 0.05}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};
