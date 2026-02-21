import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

// OPENROUTER_API_KEY  → Grok  (account 1 — free tier)
// OPENROUTER_API_KEY_2 → Llama (account 2 — separate free tier)
// GOOGLE_GENERATIVE_AI_API_KEY → Gemini (direct Google API)

const openrouterGrok = createOpenAI({
    name: 'openrouter-grok',
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
});

const openrouterLlama = createOpenAI({
    name: 'openrouter-llama',
    apiKey: process.env.OPENROUTER_API_KEY_2 ?? process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
});

export type FighterKey = 'grok' | 'gemini' | 'llama';

export function getFighterModel(key: FighterKey) {
    switch (key) {
        case 'grok':
            return openrouterGrok('x-ai/grok-2');
        case 'gemini':
            // Direct Google API — reads GOOGLE_GENERATIVE_AI_API_KEY automatically
            return google('gemini-2.0-flash-lite');
        case 'llama':
            return openrouterLlama('meta-llama/llama-4-maverick');
        default:
            throw new Error(`Unknown fighter: ${key}`);
    }
}
