import { ModelAdapter } from '@/lib/types';
import { ClaudeAdapter } from './claude';
import { OpenAIAdapter } from './openai';
import { GeminiAdapter } from './gemini';
import { CustomAdapter } from './custom';
import { MockAdapter } from './mock';
import { GroqAdapter } from './groq';

import { OpenRouterAdapter } from './openrouter';

type ModelKey = 'claude' | 'openai' | 'gemini' | 'custom' | 'mock'
  | 'gpt_oss' | 'gemma_2' | 'llama_3';

const registry: Record<ModelKey, () => ModelAdapter> = {
  gpt_oss: () => new OpenAIAdapter(60), // Using purely OpenAI for GPT-5 emulation
  gemma_2: () => new GroqAdapter('GROQ_API_KEY_2', 'llama-3.3-70b-versatile', 60),
  llama_3: () => new GroqAdapter('GROQ_API_KEY', 'llama-3.3-70b-versatile', 60),
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
