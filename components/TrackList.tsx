import React from 'react';
import { Track } from '../types';
import { Activity, Music2, Disc, Waves } from 'lucide-react';

interface TrackListProps {
  tracks: Track[];
}

const getIcon = (type: string) => {
  switch (type) {
    case 'kick': return <Disc size={18} />;
    case 'snare': return <Activity size={18} />;
    case 'hihat': return <Activity size={18} className="rotate-45" />;
    case 'bass': return <Waves size={18} />;
    default: return <Music2 size={18} />;
  }
};

export const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  return (
    <div className="grid gap-3 w-full">
      {tracks.map((track) => (
        <div 
          key={track.id} 
          className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-800 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${
              track.type === 'kick' ? 'bg-rose-500/20 text-rose-400' :
              track.type === 'bass' ? 'bg-indigo-500/20 text-indigo-400' :
              'bg-slate-700/50 text-slate-400'
            }`}>
              {getIcon(track.type)}
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-200 capitalize">{track.name}</h4>
              <p className="text-xs text-slate-500 capitalize">{track.type}</p>
            </div>
          </div>
          <div className="flex gap-1">
             {/* Visual representation of notes density */}
             {Array.from({length: 8}).map((_, i) => (
                 <div key={i} className={`w-1 h-4 rounded-full ${
                     i < track.notes.length / 2 ? 'bg-slate-600 group-hover:bg-slate-500' : 'bg-slate-800'
                 }`} />
             ))}
          </div>
        </div>
      ))}
    </div>
  );
};
