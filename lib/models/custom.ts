import { ModelAdapter, Message } from '@/lib/types';

/**
 * Generic adapter for any OpenAI-compatible REST endpoint.
 * Set CUSTOM_API_URL, CUSTOM_API_KEY, and CUSTOM_MODEL in .env.local.
 */
export class CustomAdapter implements ModelAdapter {
  private apiUrl: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiUrl = process.env.CUSTOM_API_URL ?? '';
    this.apiKey = process.env.CUSTOM_API_KEY ?? '';
    this.model = process.env.CUSTOM_MODEL ?? 'custom-model';
  }

  async complete(systemPrompt: string, userMessage: string, history: Message[]): Promise<string> {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.model,
        max_tokens: 150,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Custom API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return (data.choices?.[0]?.message?.content ?? '').slice(0, 300);
  }
}
