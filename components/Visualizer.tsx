import React from 'react';

interface VisualizerProps {
  isPlaying: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isPlaying }) => {
  return (
    <div className="relative w-full h-32 bg-slate-950/50 rounded-xl overflow-hidden border border-white/5 shadow-inner">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="absolute inset-0 flex items-end justify-center gap-[2px] px-4 pb-0">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className={`w-full max-w-[8px] rounded-t-[2px] transition-all duration-[400ms] ease-out origin-bottom ${
              isPlaying ? 'animate-pulse' : 'h-1 opacity-20'
            }`}
            style={{
              height: isPlaying ? `${Math.max(10, Math.random() * 90)}%` : '5%',
              background: `linear-gradient(to top, #4f46e5, #ec4899)`,
              boxShadow: isPlaying ? '0 0 10px 2px rgba(99, 102, 241, 0.3)' : 'none',
              animationDelay: `${i * 0.03}s`,
              animationDuration: '0.8s',
              opacity: isPlaying ? 0.9 : 0.3
            }}
          />
        ))}
      </div>
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};