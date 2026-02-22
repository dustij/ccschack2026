import { Message, ModelAdapter } from '@/lib/types';

export class OpenAIAdapter implements ModelAdapter {
  private apiKey: string;
  private model: string;
  private maxTokens: number;

  constructor(maxTokens: number = 150) {
    this.apiKey = process.env.OPENAI_API_KEY ?? '';
    this.model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
    this.maxTokens = maxTokens;
  }

  async complete(
    systemPrompt: string,
    userMessage: string,
    history: Message[]
  ): Promise<string> {
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
        max_tokens: this.maxTokens,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    let text = (data.choices?.[0]?.message?.content ?? '').trim();

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
        text += '...';
      }
    }

    return text.slice(0, 1000);
  }
}
