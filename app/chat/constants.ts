const DEFAULT_DEBATE_MIN_WAIT_MS = 900;
const DEFAULT_DEBATE_MAX_WAIT_MS = 3000;
const DEFAULT_DEBATE_MAX_TURNS = 15;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

const envMinDelay = parsePositiveInt(
  process.env.NEXT_PUBLIC_DEBATE_MIN_WAIT_MS,
  DEFAULT_DEBATE_MIN_WAIT_MS
);
const envMaxDelay = parsePositiveInt(
  process.env.NEXT_PUBLIC_DEBATE_MAX_WAIT_MS,
  DEFAULT_DEBATE_MAX_WAIT_MS
);

export const CHAT_MODES = ['roast', 'flirt', 'academic'] as const;
export const DEBATE_MIN_WAIT_MS = Math.min(envMinDelay, envMaxDelay);
export const DEBATE_MAX_WAIT_MS = Math.max(envMinDelay, envMaxDelay);
export const DEBATE_MAX_TURNS = parsePositiveInt(
  process.env.NEXT_PUBLIC_DEBATE_MAX_TURNS,
  DEFAULT_DEBATE_MAX_TURNS
);
export const THINKING_DOT_DELAYS_MS = [0, 150, 300] as const;
