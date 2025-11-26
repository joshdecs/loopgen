import React from 'react';
import { Track } from '../types';
import { Activity, Music2, Disc, Waves, Mic2, Hexagon } from 'lucide-react';

interface TrackListProps {
  tracks: Track[];
}

const getIcon = (type: string) => {
  switch (type) {
    case 'kick': return <Disc size={18} />;
    case 'snare': return <Hexagon size={18} />;
    case 'hihat': return <Activity size={18} className="rotate-45" />;
    case 'bass': return <Waves size={18} />;
    case 'synth': return <Music2 size={18} />;
    case 'pluck': return <Mic2 size={18} />;
    default: return <Music2 size={18} />;
  }
};

const getColor = (type: string) => {
    switch (type) {
        case 'kick': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        case 'bass': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
        case 'snare': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        case 'hihat': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
        default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
}

export const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  return (
    <div className="grid gap-3 w-full">
      {tracks.map((track, index) => (
        <div 
          key={track.id} 
          className="glass glass-hover p-3 rounded-xl flex items-center justify-between transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-lg border ${getColor(track.type)}`}>
              {getIcon(track.type)}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200 capitalize tracking-wide">{track.name}</h4>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{track.type}</p>
            </div>
          </div>
          
          <div className="flex gap-[2px]">
             {/* Visual representation of notes density */}
             {Array.from({length: 12}).map((_, i) => (
                 <div key={i} className={`w-1 rounded-full transition-all duration-500 ${
                     i < track.notes.length / 1.5 ? 'bg-slate-600 h-3' : 'bg-slate-800 h-1.5'
                 }`} />
             ))}
          </div>
        </div>
      ))}
    </div>
  );
};