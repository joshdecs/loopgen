import React from 'react';
import { Play, Pause, Download, RefreshCw, Zap } from 'lucide-react';

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
    <div className="flex items-center justify-between w-full p-3 glass rounded-2xl shadow-2xl mt-4">
      <div className="flex items-center gap-4 pl-2">
        <button
          onClick={onTogglePlay}
          disabled={!hasLoop}
          className={`group flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active:scale-95 ${
            !hasLoop 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
              : isPlaying
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
          }`}
        >
          {isPlaying ? (
            <Pause size={24} fill="currentColor" className="opacity-90" />
          ) : (
             <Play size={24} fill="currentColor" className="ml-1 opacity-90" />
          )}
        </button>
        
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className={`text-sm font-semibold ${isPlaying ? 'text-white' : 'text-slate-400'}`}>
              {isPlaying ? 'Playing' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pr-1">
         <button
          onClick={onRegenerate}
          disabled={!hasLoop}
          className="group p-3 text-slate-400 hover:text-white glass-hover rounded-xl transition-all active:scale-95 border border-transparent"
          title="Regenerate Variation"
        >
          <RefreshCw size={20} className={`transition-transform duration-500 ${!hasLoop ? '' : 'group-hover:rotate-180'}`} />
        </button>
        
        <button
          onClick={onDownload}
          disabled={!hasLoop || isDownloading}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 border ${
            !hasLoop || isDownloading
              ? 'bg-slate-800 border-transparent text-slate-600 cursor-not-allowed'
              : 'glass hover:bg-white/10 text-white border-white/10 hover:border-white/20'
          }`}
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download size={18} />
          )}
          <span>Export WAV</span>
        </button>
      </div>
    </div>
  );
};