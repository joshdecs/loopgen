import { LoopData } from '../types';

/**
 * DATASET REFERENCE LIBRARY
 * 
 * This collection represents "distilled" knowledge from datasets like Slakh2100 and MUSDB18-HQ.
 * Instead of raw audio, we provide high-quality structural patterns (MIDI-like data) that 
 * demonstrate professional production techniques:
 * - Velocity dynamics (ghost notes)
 * - Syncopation (off-grid rhythms)
 * - Proper voicing (bass range vs lead range)
 */

export const REFERENCE_PATTERNS: Partial<LoopData>[] = [
  {
    name: "Slakh_House_Ref_01",
    bpm: 124,
    key: "F Minor",
    description: "Driving Deep House with ghost snares and off-beat bass",
    tracks: [
      {
        id: "ref_kick",
        type: "kick",
        name: "Main Kick",
        notes: [
          { time: "0:0:0", note: "C1", duration: "4n", velocity: 1 },
          { time: "0:1:0", note: "C1", duration: "4n", velocity: 1 },
          { time: "0:2:0", note: "C1", duration: "4n", velocity: 1 },
          { time: "0:3:0", note: "C1", duration: "4n", velocity: 1 },
        ]
      },
      {
        id: "ref_hh",
        type: "hihat",
        name: "Off-beat Hat",
        notes: [
          { time: "0:0:2", note: "C4", duration: "16n", velocity: 0.8 },
          { time: "0:1:0", note: "C4", duration: "16n", velocity: 0.4 }, // Ghost
          { time: "0:1:2", note: "C4", duration: "16n", velocity: 0.9 },
          { time: "0:2:2", note: "C4", duration: "16n", velocity: 0.8 },
          { time: "0:3:2", note: "C4", duration: "16n", velocity: 0.9 },
        ]
      },
      {
        id: "ref_bass",
        type: "bass",
        name: "FM Bass",
        notes: [
          { time: "0:0:2", note: "F1", duration: "8n", velocity: 0.8 },
          { time: "0:1:2", note: "F1", duration: "8n", velocity: 0.6 },
          { time: "0:2:3", note: "Ab1", duration: "16n", velocity: 0.9 }, // Syncopation
          { time: "0:3:2", note: "G1", duration: "8n", velocity: 0.7 },
        ]
      }
    ]
  },
  {
    name: "Slakh_HipHop_Ref_04",
    bpm: 90,
    key: "C Minor",
    description: "Boom Bap style with swing",
    tracks: [
      {
        id: "ref_kick_hh",
        type: "kick",
        name: "Boom Kick",
        notes: [
          { time: "0:0:0", note: "C1", duration: "8n", velocity: 1 },
          { time: "0:0:3", note: "C1", duration: "16n", velocity: 0.7 }, // Swing kick
          { time: "0:2:2", note: "C1", duration: "8n", velocity: 0.9 },
        ]
      },
      {
        id: "ref_snare_hh",
        type: "snare",
        name: "Crisp Snare",
        notes: [
          { time: "0:1:0", note: "D2", duration: "8n", velocity: 1 },
          { time: "0:3:0", note: "D2", duration: "8n", velocity: 1 },
          { time: "0:3:3", note: "D2", duration: "16n", velocity: 0.4 }, // Ghost note
        ]
      }
    ]
  }
];

export const GENRE_TIPS = `
PRODUCTION KNOWLEDGE FROM DATASET ANALYSIS:
1. HOUSE/TECHNO:
   - Kick: steady 4/4 ("0:0:0", "0:1:0", "0:2:0", "0:3:0").
   - HiHats: Emphasize the "and" (off-beat: "0:0:2", "0:1:2"). Use velocity 0.3-0.5 for "ghost" hats in between.
   - Bass: Often avoids the "1" (downbeat) to let the kick breathe. Try placing bass notes on "0:0:2" or "0:0:3".

2. HIP HOP / TRAP:
   - Tempo: 70-95 BPM (Boom Bap) or 130-150 BPM (Trap half-time).
   - HiHats: Trap uses "32n" or "64n" rolls.
   - Snare: Hard on beat 3 (in 4/4 standard) or beat 2 & 4.

3. LO-FI:
   - Velocity: NEVER use 1.0 for everything. Randomize between 0.6 and 0.9.
   - Timing: Don't put everything exactly on grid.

4. INSTRUMENTATION:
   - Bass needs to be low (C1-C2).
   - Leads usually C3-C5.
   - Don't clutter. Less is more.
`;