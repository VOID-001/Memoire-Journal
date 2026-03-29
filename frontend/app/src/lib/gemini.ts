import { GoogleGenerativeAI } from '@google/generative-ai';
import { Persona } from './personas';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function extractEntrySemantics(content: string) {
  const model = genAI.getGenerativeModel({ 
    model: process.env.GEMINI_MODEL_EXTRACTION || "models/gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `Analyze this journal entry and return structured JSON data.
Entry:
${content}

Return ONLY valid JSON in this format:
{
  "mood_score": float from -1.0 (despair) to 1.0 (pure joy),
  "energy_level": float from 0.0 to 1.0,
  "clarity_score": float from 0.0 (chaotic) to 1.0 (focused/clear),
  "emotions": [
    { "name": "string", "valence": "positive|negative|neutral", "intensity": 0.0-1.0 }
  ],
  "topics": [
    { "name": "string (lowercase, 1-2 words)", "category": "activity|relationship|goal|place|concept" }
  ],
  "persons_mentioned": [
    { "name": "string", "relationship": "friend|family|colleague|self|other" }
  ],
  "one_sentence_summary": "string (max 20 words, third person, no pronouns)"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

export async function getPersonaResponse(
  entry: string,
  graphContext: string,
  persona: Persona
) {
  const model = genAI.getGenerativeModel({ 
    model: process.env.GEMINI_MODEL_PERSONA || "models/gemini-2.5-flash-lite" 
  });

  const prompt = `System Instructions:
${persona.system_prompt}

Context about this person's history:
${graphContext}

Today's entry:
"${entry}"

Respond as ${persona.name}. Stay in character. Make it land.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
