import React, { useState, useEffect, useCallback } from 'react';
import { PromptInput } from './components/PromptInput';
import { Controls } from './components/Controls';
import { Visualizer } from './components/Visualizer';
import { TrackList } from './components/TrackList';
import { audioEngine } from './services/audioEngine';
import { generateLoopFromPrompt } from './services/geminiService';
import { LoopData, ChatMessage } from './types';
import { Music, AlertCircle, Info, AudioWaveform } from 'lucide-react';

const App: React.FC = () => {
  const [currentLoop, setCurrentLoop] = useState<LoopData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);

  // Initialize audio engine on user interaction
  const handleInteraction = useCallback(async () => {
    await audioEngine.initialize();
  }, []);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    await handleInteraction(); // Ensure audio context is ready
    
    // Stop playback if playing
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    }

    try {
      const promptHistory = history.map(h => h.text);
      const loopData = await generateLoopFromPrompt(prompt, promptHistory);
      
      setCurrentLoop(loopData);
      audioEngine.loadLoop(loopData);
      
      // Auto play after generation
      audioEngine.play();
      setIsPlaying(true);

      setHistory(prev => [
        ...prev, 
        { role: 'user', text: prompt },
        { role: 'model', text: `Generated: ${loopData.name} (${loopData.bpm} BPM)` }
      ]);
      
    } catch (err) {
      console.error(err);
      setError("Failed to generate loop. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePlay = () => {
    const playing = audioEngine.toggle();
    setIsPlaying(playing);
  };

  const handleDownload = async () => {
    if (!currentLoop) return;
    setIsDownloading(true);
    try {
      const url = await audioEngine.exportWav();
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentLoop.name.replace(/\s+/g, '-')}.wav`;
      a.click();
    } catch (err) {
      console.error("Download failed", err);
      setError("Download failed. Try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRegenerate = () => {
     if(history.length > 0) {
         // Re-use last user prompt with a "variation" instruction implicitly via the history mechanism
         const lastUserPrompt = [...history].reverse().find(m => m.role === 'user');
         if(lastUserPrompt) {
             handleGenerate(lastUserPrompt.text + " (make a variation)");
         }
     }
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-tr from-slate-800 to-slate-900 p-2 rounded-lg border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                    <AudioWaveform className="text-indigo-400 group-hover:text-white transition-colors" size={20} />
                </div>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white group-hover:tracking-wide transition-all duration-300">
              LoopGen <span className="text-indigo-400">AI</span>
            </h1>
          </div>
          <div className="text-[10px] font-mono font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            v1.0 MVP
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-40">
        
        {/* Intro / Empty State */}
        {!currentLoop && !isGenerating && (
          <div className="text-center py-24 animate-fade-in">
             <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-900/50 mb-8 animate-float">
                <Music size={40} className="text-indigo-500 opacity-80" />
             </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Describe it. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Hear it.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-lg mx-auto mb-8 font-light leading-relaxed">
              Generate studio-quality royalty-free loops instantly. <br/>
              Powered by <span className="text-slate-300 font-medium">Gemini 2.5</span> & <span className="text-slate-300 font-medium">Procedural Synthesis</span>.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-fade-in">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
                <p className="text-white font-medium text-lg">Synthesizing Audio...</p>
                <p className="text-slate-500 text-sm">Applying effects & mastering</p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {currentLoop && !isGenerating && (
          <div className="space-y-6 animate-slide-up">
            {/* Loop Info Card */}
            <div className="glass rounded-3xl p-1 shadow-2xl overflow-hidden">
                <div className="bg-slate-900/40 rounded-[22px] p-6 border border-white/5">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{currentLoop.name}</h2>
                        <p className="text-slate-400 text-sm font-light max-w-md leading-relaxed">{currentLoop.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5 flex flex-col items-end">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Tempo</span>
                                <span className="text-xl font-mono text-indigo-400">{currentLoop.bpm} <span className="text-xs text-slate-600">BPM</span></span>
                            </div>
                            <span className="text-xs text-slate-600 font-mono mt-1 px-2">{currentLoop.key}</span>
                        </div>
                    </div>

                    <Visualizer isPlaying={isPlaying} />
                    <Controls 
                        isPlaying={isPlaying} 
                        onTogglePlay={handleTogglePlay} 
                        onDownload={handleDownload}
                        onRegenerate={handleRegenerate}
                        isDownloading={isDownloading}
                        hasLoop={!!currentLoop}
                    />
                </div>
            </div>

            {/* Track Breakdown */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-4 bg-rose-500 rounded-full"></div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stem Breakdown</h3>
              </div>
              <TrackList tracks={currentLoop.tracks} />
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 animate-scale-in">
                <AlertCircle size={20} />
                <span>{error}</span>
            </div>
        )}

      </main>

      {/* Fixed Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/60 backdrop-blur-xl border-t border-white/5 p-4 pb-8 z-40 transition-all duration-300">
        <PromptInput onSubmit={handleGenerate} isLoading={isGenerating} />
        <div className="max-w-2xl mx-auto mt-4 text-center opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
                <Info size={10} />
                Gemini 2.5 Flash • Tone.js • Web Audio API
            </p>
        </div>
      </div>

    </div>
  );
};

export default App;