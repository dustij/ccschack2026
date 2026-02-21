import { ModelAdapter, Message } from '@/lib/types';
import { getServerEnv } from '@/lib/server/env';

export class ClaudeAdapter implements ModelAdapter {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = getServerEnv('ANTHROPIC_API_KEY');
    this.model = getServerEnv('CLAUDE_MODEL', 'claude-opus-4-6');
  }

  async complete(systemPrompt: string, userMessage: string, history: Message[]): Promise<string> {
    const messages = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 150,
        system: systemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return (data.content?.[0]?.text ?? '').slice(0, 300);
  }
}
