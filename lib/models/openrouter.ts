import { ModelAdapter, Message } from '@/lib/types';

export class OpenRouterAdapter implements ModelAdapter {
    private model: string;

    constructor(model: string = 'openai/gpt-oss-120b:free') {
        this.model = model;
    }

    async complete(systemPrompt: string, userMessage: string, history: Message[]): Promise<string> {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            throw new Error(`Missing env var: OPENROUTER_API_KEY`);
        }

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage },
        ];

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                'X-Title': 'Fighting AI Demo',
            },
            body: JSON.stringify({
                model: this.model,
                messages,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`OpenRouter API error ${res.status}: ${err}`);
        }

        const data = await res.json();
        return (data.choices?.[0]?.message?.content ?? '').slice(0, 1000);
    }
}
