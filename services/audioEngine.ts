import * as Tone from 'tone';
import { LoopData, Track } from '../types';

// Singleton structure to manage audio context
class AudioEngine {
  private isInitialized = false;
  private isPlaying = false;
  private sequences: Tone.Part[] = [];
  // Use 'any' to allow storage of different Tone instruments (PolySynth, MembraneSynth, MetalSynth)
  private instruments: Map<string, any> = new Map();
  private mainBus: Tone.Channel;
  private recorder: Tone.Recorder;
  
  // Master Effects
  private limiter: Tone.Limiter;
  private reverb: Tone.Reverb;

  constructor() {
    this.limiter = new Tone.Limiter(-1); // Prevent clipping
    this.reverb = new Tone.Reverb({ decay: 2, wet: 0.1 }); // Subtle glue reverb
    
    this.mainBus = new Tone.Channel(0, 0);
    this.recorder = new Tone.Recorder();

    // Chain: MainBus -> Reverb -> Limiter -> Recorder -> Destination
    this.mainBus.connect(this.reverb);
    this.reverb.connect(this.limiter);
    this.limiter.connect(this.recorder);
    this.limiter.toDestination();
  }

  async initialize() {
    if (!this.isInitialized) {
      await Tone.start();
      await this.reverb.generate(); // Pre-calculate reverb
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }
      console.log('Audio Context Initialized', Tone.context.state);
      this.isInitialized = true;
    }
  }

  // Create instruments based on track types
  private getOrCreateInstrument(track: Track) {
    if (this.instruments.has(track.id)) {
      return this.instruments.get(track.id);
    }

    let instrument;
    try {
      switch (track.type) {
        case 'kick':
          // Punchier Kick
          instrument = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 10,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
            volume: 0
          }).connect(this.mainBus);
          break;
        case 'snare':
          // Snare using Noise + Tone
          instrument = new Tone.MembraneSynth({
            pitchDecay: 0.01,
            octaves: 4,
            oscillator: { type: 'square' },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
            volume: -2
          }).connect(this.mainBus);
          break;
        case 'hihat':
          // Crisper HiHat with HighPass
          // Cast options to any to avoid strict type issues with MetalSynthOptions in some Tone versions
          instrument = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, // Shorter decay
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5,
            volume: -8
          } as any);
          
          instrument.frequency.value = 400;
          // Add a highpass to remove mud from hats
          const filter = new Tone.Filter(1500, "highpass").connect(this.mainBus);
          instrument.connect(filter);
          break;
        case 'bass':
          // FMSynth for better bass texture
          instrument = new Tone.FMSynth({
            harmonicity: 1,
            modulationIndex: 3.5,
            oscillator: { type: "custom", partials: [0, 1, 0, 2] },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.5 },
            modulation: { type: "square" },
            modulationEnvelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 0.01 },
            volume: -4
          }).connect(this.mainBus);
          break;
        case 'synth':
          instrument = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'fatsawtooth' },
            envelope: { attack: 0.05, decay: 0.3, sustain: 0.3, release: 1 },
            volume: -8
          }).connect(this.mainBus);
          break;
        case 'pluck':
          instrument = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.3 },
            volume: -6
          }).connect(this.mainBus);
          break;
        default:
          instrument = new Tone.PolySynth().connect(this.mainBus);
      }
    } catch (e) {
      console.error(`Error creating instrument for ${track.type}`, e);
      instrument = new Tone.PolySynth().connect(this.mainBus);
    }
    
    this.instruments.set(track.id, instrument);
    return instrument;
  }

  loadLoop(loopData: LoopData) {
    this.stop();
    // Cancel all scheduled events on the transport to ensure a clean slate
    Tone.Transport.cancel();
    
    this.cleanupSequences();
    this.cleanupInstruments();

    Tone.Transport.bpm.value = loopData.bpm || 120; // Default to 120 if missing

    // Create instruments and parts
    loopData.tracks.forEach(track => {
      const instrument = this.getOrCreateInstrument(track);
      
      const notes = track.notes || [];
      if (notes.length === 0) return;

      const part = new Tone.Part((time, noteEvent) => {
        if (track.muted) return;
        
        try {
          // Humanize timing slightly (0 - 15ms variations) to sound less robotic
          const humanize = (Math.random() * 0.015) - 0.0075;
          const playTime = Math.max(0, time as number + humanize);

          // Trigger sound based on instrument type
          if (instrument instanceof Tone.PolySynth || instrument instanceof Tone.FMSynth) {
             instrument.triggerAttackRelease(noteEvent.note, noteEvent.duration, playTime, noteEvent.velocity);
          } else if (instrument instanceof Tone.MembraneSynth) {
             instrument.triggerAttackRelease(noteEvent.note, noteEvent.duration, playTime, noteEvent.velocity);
          } else if (instrument instanceof Tone.MetalSynth) {
             instrument.triggerAttackRelease(noteEvent.duration, playTime, noteEvent.velocity);
          }
        } catch (err) {
          console.warn(`Error triggering note for ${track.type}`, err);
        }
      }, notes).start(0);

      part.loop = true;
      part.loopEnd = "2m"; // Assume 2 bar loops
      this.sequences.push(part);
    });
  }

  async play() {
    // Ensure context is running (sometimes browsers suspend it)
    if (Tone.context.state !== 'running') {
      await Tone.context.resume();
    }
    Tone.Transport.start();
    this.isPlaying = true;
  }

  stop() {
    Tone.Transport.stop();
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  cleanupSequences() {
    this.sequences.forEach(seq => seq.dispose());
    this.sequences = [];
  }

  cleanupInstruments() {
    this.instruments.forEach(inst => inst.dispose());
    this.instruments.clear();
  }
  
  async exportWav(): Promise<string> {
    // Stop current playback
    this.stop();
    
    // Start recording
    this.recorder.start();
    
    // Play for 4 bars (enough for a loop)
    Tone.Transport.start();
    
    const bpm = Tone.Transport.bpm.value;
    const secondsPerBar = (60 / bpm) * 4;
    const totalDuration = secondsPerBar * 2; // 2 bars export
    
    await new Promise(resolve => setTimeout(resolve, totalDuration * 1000));
    
    Tone.Transport.stop();
    const recording = await this.recorder.stop();
    
    return URL.createObjectURL(recording);
  }
}

export const audioEngine = new AudioEngine();