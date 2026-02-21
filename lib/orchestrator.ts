import 'server-only';
import { ChatMode, Message, AgentResponse } from '@/lib/types';
import { AGENTS_BY_MODE, getSystemPrompt } from '@/lib/prompts';
import { getModel } from '@/lib/models/index';

const MAX_CHARS = 1000;

export async function runAgents(
  userMessage: string,
  mode: ChatMode,
  history: Message[]
): Promise<AgentResponse[]> {
  const agentConfigs = AGENTS_BY_MODE[mode];
  const results: AgentResponse[] = [];

  for (const agentConfig of agentConfigs) {
    const systemPrompt = getSystemPrompt(mode, agentConfig.agentName);
    const model = getModel(agentConfig.model);

    // Primary agent sees only the user message.
    // Secondary/tertiary agents see user message + all prior agent responses.
    let contextMessage = userMessage;
    if (results.length > 0) {
      const priorExchanges = results
        .map((r) => `${r.agentName}: ${r.text}`)
        .join('\n');
      contextMessage = `User said: "${userMessage}"\n\nConversation so far:\n${priorExchanges}\n\nNow it is your turn to respond.`;
    }

    let text: string;
    try {
      text = await model.complete(systemPrompt, contextMessage, history);
    } catch (err) {
      console.error(`Agent "${agentConfig.agentName}" failed:`, err);
      text = '[Agent temporarily unavailable]';
    }

    results.push({
      agentName: agentConfig.agentName,
      text: text.slice(0, MAX_CHARS),
      role: 'assistant',
    });
  }

  return results;
}
