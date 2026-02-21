import 'server-only';
import { ModelAdapter } from '@/lib/types';
import { ClaudeAdapter } from './claude';
import { OpenAIAdapter } from './openai';
import { GeminiAdapter } from './gemini';
import { CustomAdapter } from './custom';
import { MockAdapter } from './mock';
import { GroqAdapter } from './groq';

type ModelKey = 'claude' | 'openai' | 'gemini' | 'custom' | 'mock'
  | 'groq1' | 'groq2' | 'groq3' | 'groq4';

const registry: Record<ModelKey, () => ModelAdapter> = {
  // Groq — 4 separate keys to distribute load and avoid rate limits during demo
  groq1: () => new GroqAdapter('GROQ_API_KEY_1'),
  groq2: () => new GroqAdapter('GROQ_API_KEY_2'),
  groq3: () => new GroqAdapter('GROQ_API_KEY_3'),
  groq4: () => new GroqAdapter('GROQ_API_KEY_4'),
  // Other providers (require their own credentials)
  claude: () => new ClaudeAdapter(),
  openai: () => new OpenAIAdapter(),
  gemini: () => new GeminiAdapter(),
  custom: () => new CustomAdapter(),
  mock: () => new MockAdapter(),
};

export function getModel(key: string): ModelAdapter {
  const factory = registry[key as ModelKey];
  if (!factory) {
    console.warn(`Unknown model key "${key}", falling back to mock`);
    return new MockAdapter();
  }
  return factory();
}
