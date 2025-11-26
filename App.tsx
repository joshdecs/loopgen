import React, { useState, useEffect, useCallback } from 'react';
import { PromptInput } from './components/PromptInput';
import { Controls } from './components/Controls';
import { Visualizer } from './components/Visualizer';
import { TrackList } from './components/TrackList';
import { audioEngine } from './services/audioEngine';
import { generateLoopFromPrompt } from './services/geminiService';
import { LoopData, ChatMessage } from './types';
import { Music, AlertCircle, Info } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-rose-500 p-2 rounded-lg">
              <Music className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              LoopGen AI
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            v1.0 MVP
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-32">
        
        {/* Intro / Empty State */}
        {!currentLoop && !isGenerating && (
          <div className="text-center py-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Describe it. <span className="text-indigo-400">Hear it.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-lg mx-auto mb-8">
              Generate royalty-free music loops instantly using Gemini AI. 
              Just type a style, mood, or instrument.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Music size={20} className="text-indigo-500 animate-pulse" />
              </div>
            </div>
            <p className="text-slate-400 animate-pulse">Composing your loop...</p>
          </div>
        )}

        {/* Main Content Area */}
        {currentLoop && !isGenerating && (
          <div className="space-y-6 animate-slide-up">
            {/* Loop Info Card */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{currentLoop.name}</h2>
                  <p className="text-slate-400 text-sm">{currentLoop.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Tempo</span>
                  <span className="text-xl font-mono text-indigo-400">{currentLoop.bpm} BPM</span>
                  <span className="text-xs text-slate-600">{currentLoop.key}</span>
                </div>
              </div>

              <Visualizer isPlaying={isPlaying} />
              
              <div className="mt-6">
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
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Stem Breakdown</h3>
              <TrackList tracks={currentLoop.tracks} />
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
                <AlertCircle size={20} />
                <span>{error}</span>
            </div>
        )}

      </main>

      {/* Fixed Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 p-4 pb-8 z-40">
        <PromptInput onSubmit={handleGenerate} isLoading={isGenerating} />
        <div className="max-w-2xl mx-auto mt-2 text-center">
            <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                <Info size={10} />
                Powered by Gemini 2.5 Flash & Tone.js
            </p>
        </div>
      </div>

    </div>
  );
};

export default App;
