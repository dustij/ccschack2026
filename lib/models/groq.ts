import { Message, ModelAdapter } from '@/lib/types';

/**
 * Groq adapter — uses the OpenAI-compatible Groq API.
 * Endpoint: https://api.groq.com/openai/v1/chat/completions
 * Auth: Bearer <gsk_...>
 *
 * keyEnvVar: the name of the environment variable holding this instance's API key
 *            (e.g. 'GROQ_API_KEY_1'). Using separate keys per agent prevents
 *            single-key rate-limit exhaustion during a live demo.
 */
export class GroqAdapter implements ModelAdapter {
  private model: string;
  private maxTokens: number;

  constructor(
    private keyEnvVar: string,
    model?: string,
    maxTokens: number = 400
  ) {
    this.model = model ?? process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';
    this.maxTokens = maxTokens;
  }

  async complete(
    systemPrompt: string,
    userMessage: string,
    history: Message[]
  ): Promise<string> {
    const apiKey =
      process.env[this.keyEnvVar] ?? process.env.GROQ_API_KEY ?? '';

    if (!apiKey) {
      throw new Error(`Missing env var: ${this.keyEnvVar} or GROQ_API_KEY`);
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.85,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq API error ${res.status}: ${err}`);
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

    return text.slice(0, 2000);
  }
}
