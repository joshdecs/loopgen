export interface NoteEvent {
  time: string; // "0:0:0"
  note: string; // "C4", "C2"
  duration: string; // "8n", "16n"
  velocity: number; // 0-1
}

export type InstrumentType = 'kick' | 'snare' | 'hihat' | 'bass' | 'synth' | 'pluck';

export interface Track {
  id: string;
  type: InstrumentType;
  name: string;
  notes: NoteEvent[];
  muted?: boolean;
}

export interface LoopData {
  name: string;
  bpm: number;
  key: string;
  description: string;
  tracks: Track[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export type GenerationStatus = 'idle' | 'generating' | 'playing' | 'paused';
