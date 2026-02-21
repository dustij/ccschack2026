import { ModelAdapter, Message } from '@/lib/types';
import { getServerEnv } from '@/lib/server/env';

export class GeminiAdapter implements ModelAdapter {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = getServerEnv('GEMINI_API_KEY');
    this.model = getServerEnv('GEMINI_MODEL', 'gemini-2.0-flash');
  }

  async complete(systemPrompt: string, userMessage: string, history: Message[]): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    // Build Gemini-format contents array
    const contents = [
      ...history.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 150 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return text.slice(0, 300);
  }
}
