import { ModelAdapter, Message } from '@/lib/types';
import { getServerEnv } from '@/lib/server/env';

export class OpenAIAdapter implements ModelAdapter {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = getServerEnv('OPENAI_API_KEY');
    this.model = getServerEnv('OPENAI_MODEL', 'gpt-4o-mini');
  }

  async complete(systemPrompt: string, userMessage: string, history: Message[]): Promise<string> {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 150,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return (data.choices?.[0]?.message?.content ?? '').slice(0, 300);
  }
}
