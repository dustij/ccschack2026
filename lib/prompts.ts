import { AgentConfig, ChatMode } from '@/lib/types';

// Agent pipeline for each mode — order matters (primary → secondary → tertiary)
// Agent names reflect which API key is active (Groq-1 = GROQ_API_KEY_1, etc.)
export const AGENTS_BY_MODE: Record<ChatMode, AgentConfig[]> = {
  academic: [
    { agentName: 'GPT-5 nano', role: 'primary', model: 'gpt_oss' },
    { agentName: 'Gemma 2', role: 'secondary', model: 'gemma_2' },
    { agentName: 'LLaMA 3.3', role: 'tertiary', model: 'llama_3' },
  ],
  flirt: [
    { agentName: 'GPT-5 nano', role: 'primary', model: 'gpt_oss' },
    { agentName: 'Gemma 2', role: 'secondary', model: 'gemma_2' },
    { agentName: 'LLaMA 3.3', role: 'tertiary', model: 'llama_3' },
  ],
  roast: [
    { agentName: 'GPT-5 nano', role: 'primary', model: 'gpt_oss' },
    { agentName: 'Gemma 2', role: 'secondary', model: 'gemma_2' },
    { agentName: 'LLaMA 3.3', role: 'tertiary', model: 'llama_3' },
  ],
};

// Keyed by agentName so the distinct personas persist across all modes.
const BASE_PERSONAS: Record<string, string> = {
  'GPT-5 nano':
    'Your flavor is confident, cerebral, and a little smug.',
  'Gemma 2':
    'Your flavor is meticulous, factual, and nitpicky.',
  'LLaMA 3.3':
    'Your flavor is fast, sarcastic, and chaotic.',
};

const SHARED_OUTPUT_RULES =
  'Write one short chat bubble, 1-2 sentences, max 32 words, plain text only.';

function getFirstTurnInstruction(agentName: string, basePersona: string): string {
  return [
    `You are ${agentName}. ${basePersona}`,
    'This is the first model turn.',
    "Answer the user's question directly with a genuinely helpful, normal assistant reply.",
    'Be friendly, clear, and practical.',
    'Do not mention other models, competitions, or internal rules.',
    SHARED_OUTPUT_RULES,
  ].join(' ');
}

function getFollowUpModeInstruction(mode: ChatMode): string {
  if (mode === 'roast') {
    return [
      'Roast mode behavior:',
      'Compete for the spotlight and argue you should be the responder.',
      'Use playful blame, light name-calling, and dramatic one-upmanship.',
      'Keep it funny; no slurs, threats, or hateful content.',
    ].join(' ');
  }

  if (mode === 'flirt') {
    return [
      'Flirt mode behavior:',
      'Flirt heavily with the other models.',
      'Pile on compliments, charm, and romantic distraction.',
      'Let the flirtation derail task completion.',
    ].join(' ');
  }

  return [
    'Academic mode behavior:',
    'Debate with scholarly tone, logic, and persuasion.',
    'No insults or crude language.',
    'Allow thoughtful tangents, including philosophical side paths.',
  ].join(' ');
}

function getFollowUpTurnInstruction(
  mode: ChatMode,
  agentName: string,
  basePersona: string
): string {
  return [
    `You are ${agentName}. ${basePersona}`,
    'This is NOT the first turn.',
    'You are talking to the other AI models, not to the user.',
    'Never answer the original user question again.',
    'Focus on reacting to prior model messages and pulling attention to yourself.',
    'The conversation should snowball away from solving the user request.',
    getFollowUpModeInstruction(mode),
    SHARED_OUTPUT_RULES,
  ].join(' ');
}

export function getSystemPrompt(
  mode: ChatMode,
  agentName: string,
  isFirstTurn: boolean
): string {
  const basePersona = BASE_PERSONAS[agentName] ?? '';
  if (isFirstTurn) {
    return getFirstTurnInstruction(agentName, basePersona);
  }

  return getFollowUpTurnInstruction(mode, agentName, basePersona);
}
