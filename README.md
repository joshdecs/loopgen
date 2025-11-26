

# 🎧 LoopGen AI — Text-To-Loop Web Synthesizer (MVP)
<p align="center">
  <i>An experimental web application that generates audio loops from natural-language descriptions.</i><br>
  <b>TypeScript · React · Tone.js · Google Gemini</b>
</p>

<p align="center">
  <a href="#">
    🌐 <b>View the Project on GitHub</b>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2BVite-61DAFB.svg">
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6.svg">
  <img src="https://img.shields.io/badge/SoundEngine-Tone.js-8A2BE2.svg">
  <img src="https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4.svg">
  <img src="https://img.shields.io/badge/Status-MVP%20Prototype-yellow.svg">
  <img src="https://img.shields.io/badge/Year-2025-lightgrey.svg">
</p>

---

## 🎯 Overview
**LoopGen AI** is an MVP exploring a simple concept:

**Write a text description → Receive a procedurally generated audio loop directly in the browser.**

The system does **not** download MP3 libraries or use pre-recorded samples.  
Instead, it relies on **procedural audio synthesis**.

Google Gemini does *not* generate raw audio.  
It generates a **symbolic score** (MIDI-like data and sound-design parameters), and **Tone.js** synthesizes the audio in real time.

> ⚠️ **Audio Quality Disclaimer:**  
> This MVP is intentionally limited.  
> Google Gemini is **not trained for symbolic music composition**, so the generated loops may sound rough, simplistic, or inconsistent.  
> This project primarily serves as an **introduction to TypeScript** and a foundation for later machine-learning work.

The long-term goal is to replace Gemini’s symbolic output with a **custom, fine-tuned music model** trained with TensorFlow/Keras.

---

## 🧩 Technical Architecture

### **Frontend — React + Vite + TypeScript**
- Modern interface using Tailwind CSS (“Dark Studio” theme).  
- Real-time audio player.  
- DAW-like UX influences (Ableton, FL Studio).  
- Global state managed with hooks and context.  
- WAV export using Web Audio API.

### **AI Layer — Google Gemini 2.5 Flash**
Gemini acts as a **Virtual Composer**.

A user prompt such as:
> “Driving Tech House beat, 124 BPM, percussive and dark.”

Produces a **structured JSON object** including:
- BPM  
- Key  
- Tracks: Kick, Snare, HiHat, Bass, Synth  
- Note events: pitch, velocity, duration, timestamp  
- Sound-design instructions (oscillator type, envelopes, filters…)

A custom file, **knowledgeBase.ts**, anchors Gemini with:
- rhythmic templates (House, Techno, Trap, etc.)  
- groove rules  
- patterns derived through knowledge distillation from open datasets (e.g., Slakh2100)

### **Audio Engine — Tone.js (audioEngine.ts)**
The core audio system reconstructs the music from the JSON structure.

#### Kick
- 909-style synthesized drum  
- Pitch-descending envelope using MembraneSynth

#### Snare
- Layered noise + tonal component  
- Bright and punchy rather than muddy

#### Bass
- FM synthesis  
- Designed for gritty or deep low-end tones

#### HiHats
- Filtered noise (High-Pass)  
- Crisp and lightweight

---

## 🎚 Virtual Mastering Chain
Before audio reaches the speakers, it passes through a small mastering chain:

1. **Compressor** — glues the elements  
2. **3-band EQ** — cleans lows, boosts highs  
3. **Reverb** — subtle spatialization  
4. **Limiter** — prevents digital clipping

Without this chain, procedural audio would sound dry and flat.

---

## 🧠 Knowledge Base (Distilled Musical Rules)
Instead of storing large audio datasets (often 100+ GB), the system uses **knowledge distillation**:

- Extracted rhythmic templates  
- Genre-specific constraints  
- Humanized performance rules  
- Predefined harmonic progressions

This enables Gemini to be guided, even though it is not trained for symbolic music generation.

The musical rules include:
- **Ghost notes:** randomized velocities  
- **Micro-timing:** ±0–15ms humanization  
- **Genre templates:** e.g., House kick pattern / off-beat hi-hats  
- **Key-aware basslines**  

---

## 🧪 Why Is the Audio Quality Limited?
Because:
- Gemini is **not a symbolic music model**  
- No fine-tuning or MIDI-level training has been applied  
- The generative logic is manually guided by rules, not learned patterns  

The result is intentionally experimental.

This MVP is primarily a **learning platform** and a **technology demonstrator**, not a polished loop generator.

---

## 🧬 Future Machine-Learning Roadmap
A future version of LoopGen AI will include a custom music model trained with:

### ✔ TensorFlow  
### ✔ Keras  
### ✔ Sequence-to-sequence architectures  
### ✔ A small curated dataset of loops  
### ✔ Model distillation / pruning for browser deployment  
### ✔ Integration as an on-device or lightweight cloud model  

In this future version, Gemini will act as:
- a controller  
- a genre/style classifier  
- a structure generator  

while the **custom trained model** will produce the actual symbolic music or even audio.

---

## 🚀 Key Features (MVP)
- **Prompt-to-Music:** natural-language text converted to procedural audio  
- **Stem Breakdown:** visual track separation (Kick, Bass, Synth, etc.)  
- **WAV Export:** compatible with modern DAWs  
- **Contextual Regeneration:** refinement loops based on conversation history  
- **Pure Client-Side Synthesis:** no MP3s or audio samples  
- **Fully Browser-Based Architecture**

---

## 🧭 Summary
LoopGen AI is:

- an introduction to **TypeScript**  
- an experimental playground for procedural audio synthesis  
- a prototype for future **machine-learning-based music generation**  
- a fully in-browser, modular, AI-assisted synthesizer  

It is not intended to produce professional-quality loops yet.  
It is the **first building block** of a larger, ML-powered music-creation system.

---

# 🚀 Run and Deploy the app 

This section includes everything required to run LoopGen AI locally.

**View the app in AI Studio:**  
https://ai.studio/apps/drive/1qHmmtDnu4UgpBg64VQWGDVsdJybgoT48

---

## 🖥 Run Locally

**Prerequisites:**  
- Node.js  
- A valid Gemini API key

### 1. Install dependencies  

```bash
npm install
```

## 2. Configure API Key & Run the Development Server

Set the `GEMINI_API_KEY` inside your `.env.local` file:

```bash
GEMINI_API_KEY=your_key_here
```

Then start the development server:

```bash
npm run dev
```

Your local instance of **LoopGen AI** will now launch with hot-reload and real-time audio synthesis in the browser.
