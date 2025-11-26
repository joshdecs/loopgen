import { GoogleGenAI, Type } from "@google/genai";
import { LoopData } from "../types";
import { REFERENCE_PATTERNS, GENRE_TIPS } from "./knowledgeBase";

// NOTE: API Key is injected from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an AI Music Producer with access to the Slakh2100 and MUSDB18-HQ datasets.
Your goal is to generate professional-quality audio loops (JSON parameters for Tone.js).

CRITICAL INSTRUCTIONS:
1. USE DATASET KNOWLEDGE: Do not generate generic, robotic MIDI. Use the provided "GENRE_TIPS" to apply syncopation, ghost notes, and proper velocity dynamics.
2. VELOCITY DYNAMICS: Real drummers do not hit every drum at velocity 1.0. Use range 0.3 to 1.0 to create groove.
3. SOUND SELECTION:
   - 'kick': Deep, punchy (C1).
   - 'bass': Monophonic, rhythmic, low register (C1-C2).
   - 'snare': Sharp, often layered.
   - 'hihat': vary velocity significantly.
4. DO NOT BE BORING. If the user asks for "Techno", give them a driving, rumbling bassline, not just quarter notes.

${GENRE_TIPS}

The Audio Engine uses Tone.js.
Time format: "bar:quarter:sixteenth" (e.g., "0:0:0", "0:0:2").
Duration: "8n", "16n", "4n", "32n".

Here are High-Quality Reference Patterns from the dataset to guide your structure (you can adapt these):
${JSON.stringify(REFERENCE_PATTERNS.slice(0, 2))}
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Creative name for the loop" },
    description: { type: Type.STRING, description: "Short description of the vibe and production techniques used" },
    bpm: { type: Type.NUMBER, description: "Tempo in BPM" },
    key: { type: Type.STRING, description: "Musical Key (e.g. C Minor)" },
    tracks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['kick', 'snare', 'hihat', 'bass', 'synth', 'pluck'] },
          name: { type: Type.STRING },
          notes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                note: { type: Type.STRING },
                duration: { type: Type.STRING },
                velocity: { type: Type.NUMBER }
              },
              required: ["time", "note", "duration", "velocity"]
            }
          }
        },
        required: ["id", "type", "name", "notes"]
      }
    }
  },
  required: ["name", "bpm", "key", "tracks"]
};

export const generateLoopFromPrompt = async (prompt: string, history: string[] = []): Promise<LoopData> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const contextPrompt = `
      History of refinement:
      ${history.join('\n')}
      
      Current Request: ${prompt}
      
      Based on the Slakh2100 dataset patterns, generate a high-quality loop.
      Return strictly valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.65, // slightly lower to adhere to good patterns
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const loopData = JSON.parse(response.text) as LoopData;
    
    // Post-processing to ensure IDs are unique if Gemini forgets
    loopData.tracks = loopData.tracks.map((t, i) => ({
      ...t,
      id: t.id || `track-${i}-${Date.now()}`
    }));

    return loopData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};