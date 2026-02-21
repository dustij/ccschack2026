import { ModelAdapter, Message } from '@/lib/types';

export class MockAdapter implements ModelAdapter {
  async complete(systemPrompt: string, userMessage: string, _history: Message[]): Promise<string> {
    const agentHint = systemPrompt.split('.')[0];
    return `[MOCK] ${agentHint}. Responding to: "${userMessage.slice(0, 40)}..."`;
  }
}
