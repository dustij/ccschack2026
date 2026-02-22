'use server';

import { getModel } from '@/lib/models';
import { Message, ChatMode, DebateModelId } from '@/lib/types';
import { getSystemPrompt } from '@/lib/prompts';

const LEGACY_SPEAKER_PREFIX_RE =
  /^\s*(?:\[[^\]]+\]|[A-Za-z][\w .'-]{0,40}):\s*/;

function stripSpeakerPrefix(content: string): string {
  return content.replace(LEGACY_SPEAKER_PREFIX_RE, '').trim();
}

const MODEL_CONFIG_BY_ID: Record<
  DebateModelId,
  { name: string; getSystem: (mode: ChatMode, isFirstTurn: boolean) => string }
> = {
  gpt_oss: {
    name: 'GPT-5 nano',
    getSystem: (mode, isFirstTurn) =>
      getSystemPrompt(mode, 'GPT-5 nano', isFirstTurn),
  },
  gemma_2: {
    name: 'Gemma 2',
    getSystem: (mode, isFirstTurn) =>
      getSystemPrompt(mode, 'Gemma 2', isFirstTurn),
  },
  llama_3: {
    name: 'LLaMA 3.3',
    getSystem: (mode, isFirstTurn) =>
      getSystemPrompt(mode, 'LLaMA 3.3', isFirstTurn),
  },
};

export async function debateAction(
  prompt: string,
  history: Array<{ role: string; content: string; name?: string }>,
  turnCount: number,
  mode: ChatMode,
  respondingModelId: DebateModelId
) {
  const modelConfig = MODEL_CONFIG_BY_ID[respondingModelId];

  // Format history for the Adapter.
  const adapterHistory: Message[] = history.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: stripSpeakerPrefix(msg.content),
    agentName: msg.name,
  }));

  try {
    const adapter = getModel(respondingModelId);

    let userMessage = prompt;
    if (turnCount > 0) {
      const lastMessage = adapterHistory[adapterHistory.length - 1];
      if (lastMessage) {
        userMessage = lastMessage.agentName
          ? `${lastMessage.agentName} said: "${lastMessage.content}"`
          : lastMessage.content;
      } else {
        userMessage = 'Continue the debate.';
      }
    }

    const text = await adapter.complete(
      modelConfig.getSystem(mode, turnCount === 0),
      userMessage,
      adapterHistory
    );

    return {
      content: stripSpeakerPrefix(text),
      modelName: modelConfig.name,
    };
  } catch (error: any) {
    console.error('Debate Turn Error:', error);
    throw new Error(error.message || 'Failed to fetch next debate turn.');
  }
}
