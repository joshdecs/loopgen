import React from 'react';
import { Play, Pause, Download, RefreshCw } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
  isDownloading: boolean;
  hasLoop: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onTogglePlay, 
  onDownload, 
  onRegenerate,
  isDownloading,
  hasLoop
}) => {
  return (
    <div className="flex items-center justify-between w-full p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onTogglePlay}
          disabled={!hasLoop}
          className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
            !hasLoop 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30'
          }`}
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Playback</span>
          <span className="text-sm font-semibold text-slate-200">
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
         <button
          onClick={onRegenerate}
          disabled={!hasLoop}
          className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          title="Regenerate Variation"
        >
          <RefreshCw size={20} />
        </button>
        
        <button
          onClick={onDownload}
          disabled={!hasLoop || isDownloading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            !hasLoop || isDownloading
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          <Download size={18} />
          {isDownloading ? 'Exporting...' : 'Export WAV'}
        </button>
      </div>
    </div>
  );
};
