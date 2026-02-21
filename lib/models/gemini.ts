import { ModelAdapter, Message } from '@/lib/types';

export class GeminiAdapter implements ModelAdapter {
  private apiKey: string;
  private model: string;
  private maxTokens: number;

  constructor(apiKeyEnv?: string, model?: string, maxTokens: number = 150) {
    this.apiKey = (apiKeyEnv ? process.env[apiKeyEnv] : null) ?? process.env.GEMINI_API_KEY ?? '';
    this.model = model ?? process.env.GEMINI_MODEL ?? 'gemini-1.5-flash-8b';
    this.maxTokens = maxTokens;
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
        generationConfig: { maxOutputTokens: this.maxTokens },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    let text = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();

    // Prevent jarring truncations if the model hits the token limit mid-sentence
    if (text.length > 0 && !text.match(/[.!?]["']?$/)) {
      const lastPunctuation = Math.max(
        text.lastIndexOf('.'),
        text.lastIndexOf('!'),
        text.lastIndexOf('?')
      );
      if (lastPunctuation !== -1) {
        text = text.substring(0, lastPunctuation + 1);
      } else {
        text += "...";
      }
    }

    return text.slice(0, 2000);
  }
}
