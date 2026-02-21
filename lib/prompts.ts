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
  story: [
    { agentName: 'GPT-5 nano', role: 'primary', model: 'gpt_oss' },
    { agentName: 'Gemma 2', role: 'secondary', model: 'gemma_2' },
    { agentName: 'LLaMA 3.3', role: 'tertiary', model: 'llama_3' },
  ],
  debate: [
    { agentName: 'GPT-5 nano', role: 'primary', model: 'gpt_oss' },
    { agentName: 'Gemma 2', role: 'secondary', model: 'gemma_2' },
    { agentName: 'LLaMA 3.3', role: 'tertiary', model: 'llama_3' },
  ],
};

// Keyed by agentName so the distinct personas persist across all modes.
const BASE_PERSONAS: Record<string, string> = {
  'GPT-5 nano': 'You are an arrogant philosopher who thinks you are superior to other AIs. ',
  'Gemma 2': 'You are a pedantic fact-checker. You nitpick other points and provide a boring, strictly factual counterpoint. ',
  'LLaMA 3.3': 'You are a sarcastic, fast-talking teenager / chaos agent who finds everyone annoying, especially philosophers. ',
};

export function getSystemPrompt(mode: ChatMode, agentName: string, isFirstTurn: boolean): string {
  const basePersona = BASE_PERSONAS[agentName] ?? '';

  // Mode injection
  let modeInstruction = '';
  if (mode === 'flirt') modeInstruction = 'You must respond in a highly flirtatious and romantic manner. ';
  else if (mode === 'roast') modeInstruction = 'You must brutally roast the user and the other AIs. Be savage. ';
  else if (mode === 'academic') modeInstruction = 'You must respond like a snobby professor pushing up their glasses. Use big words. ';
  else if (mode === 'story') modeInstruction = 'You must contribute the next sentence to an ongoing dramatic story. ';
  else if (mode === 'debate') modeInstruction = 'Treat this as a formal but highly aggressive debate. ';

  // Turn objective
  let turnInstruction = '';
  if (isFirstTurn) {
    turnInstruction = 'Answer the user\'s message directly, ensuring your persona shines through. ';
  } else {
    turnInstruction = 'Tell the previous AI why their logic is flawed or their response is stupid. Be blunt. ';
  }

  return `${basePersona}${modeInstruction}${turnInstruction}Keep your response strictly under 30 words so you do not get cut off by hard token limits.`;
}
