/**
 * Tests for app/actions/debate.ts  →  debateAction()
 *
 * All model calls are mocked so tests run instantly and never hit the network.
 *
 * Covers:
 *  - respondingModelId determines which getModel key is used and which name is returned
 *  - First-turn vs subsequent-turn getSystemPrompt call
 *  - userMessage source: original prompt on turn 0, formatted last history item on turn > 0
 *  - History content has legacy speaker prefixes stripped
 *  - History agentName is set from the msg.name field
 *  - Return shape { content, modelName }
 *  - Errors thrown by the model are re-thrown
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the models registry BEFORE importing debateAction so its import
// of getModel is intercepted.
vi.mock('server-only', () => ({}));
vi.mock('@/lib/models', () => ({ getModel: vi.fn() }));

import { debateAction } from '@/app/actions/debate';
import { getModel } from '@/lib/models';

const mockComplete = vi.fn();

beforeEach(() => {
  vi.mocked(getModel).mockReturnValue({ complete: mockComplete });
  mockComplete.mockResolvedValue('Model response text.');
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── Model selection ────────────────────────────────────────────────────────────

describe('debateAction — model selection by respondingModelId', () => {
  it.each([
    ['gpt_oss', 'GPT-5 nano'],
    ['gemma_2', 'Gemma 2'],
    ['llama_3', 'LLaMA 3.3'],
  ] as const)(
    '"%s" → calls getModel with that id and returns name "%s"',
    async (respondingModelId, expectedName) => {
      const result = await debateAction(
        'prompt',
        [],
        0,
        'academic',
        respondingModelId,
      );

      expect(vi.mocked(getModel)).toHaveBeenCalledWith(respondingModelId);
      expect(result.modelName).toBe(expectedName);
    },
  );
});

// ── Return shape ──────────────────────────────────────────────────────────────

describe('debateAction — return value', () => {
  it('returns an object with content and modelName', async () => {
    const result = await debateAction('hello', [], 0, 'roast', 'gpt_oss');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('modelName');
  });

  it('content matches the model completion output', async () => {
    mockComplete.mockResolvedValue('Specific response.');
    const result = await debateAction('hello', [], 0, 'academic', 'gpt_oss');
    expect(result.content).toBe('Specific response.');
  });
});

// ── userMessage source ────────────────────────────────────────────────────────

describe('debateAction — userMessage selection', () => {
  it('uses the original prompt as userMessage on turn 0', async () => {
    await debateAction('Original prompt here', [], 0, 'academic', 'gpt_oss');
    // complete(systemPrompt, userMessage, history) → arg index 1
    expect(mockComplete.mock.calls[0][1]).toBe('Original prompt here');
  });

  it('uses the formatted last history item as userMessage on turn > 0', async () => {
    const history = [
      { role: 'user', content: 'first', name: undefined },
      { role: 'assistant', content: 'second response', name: 'GPT-5 nano' },
    ];
    await debateAction('original', history, 1, 'roast', 'gemma_2');

    // Named last message: 'Name said: "content"'
    const userMessage = mockComplete.mock.calls[0][1];
    expect(userMessage).toContain('second response');
    expect(userMessage).toContain('GPT-5 nano');
  });

  it('falls back to "Continue the debate." when history is empty on turn > 0', async () => {
    await debateAction('prompt', [], 2, 'flirt', 'llama_3');
    expect(mockComplete.mock.calls[0][1]).toBe('Continue the debate.');
  });
});

// ── History formatting ────────────────────────────────────────────────────────

describe('debateAction — history formatting', () => {
  it('passes content through unchanged when no legacy prefix is present', async () => {
    const history = [
      { role: 'assistant', content: 'plain reply', name: 'Gemma 2' },
    ];
    await debateAction('prompt', history, 1, 'academic', 'gemma_2');

    const adapterHistory = mockComplete.mock.calls[0][2];
    expect(adapterHistory[0].content).toBe('plain reply');
  });

  it('strips bracket speaker prefix from history content', async () => {
    const history = [
      { role: 'assistant', content: '[Gemma 2]: prefixed reply', name: 'Gemma 2' },
    ];
    await debateAction('prompt', history, 1, 'academic', 'gemma_2');

    const adapterHistory = mockComplete.mock.calls[0][2];
    expect(adapterHistory[0].content).toBe('prefixed reply');
  });

  it('sets agentName from the history item name field', async () => {
    const history = [
      { role: 'assistant', content: 'some reply', name: 'LLaMA 3.3' },
    ];
    await debateAction('prompt', history, 1, 'academic', 'llama_3');

    const adapterHistory = mockComplete.mock.calls[0][2];
    expect(adapterHistory[0].agentName).toBe('LLaMA 3.3');
  });

  it('leaves content unchanged when no name is present', async () => {
    const history = [
      { role: 'user', content: 'plain question', name: undefined },
    ];
    await debateAction('prompt', history, 1, 'academic', 'gpt_oss');

    const adapterHistory = mockComplete.mock.calls[0][2];
    expect(adapterHistory[0].content).toBe('plain question');
  });

  it('maps non-user roles to "assistant" in adapter history', async () => {
    const history = [
      { role: 'system', content: 'sys msg', name: undefined },
    ];
    await debateAction('prompt', history, 1, 'academic', 'gpt_oss');

    const adapterHistory = mockComplete.mock.calls[0][2];
    expect(adapterHistory[0].role).toBe('assistant');
  });
});

// ── Mode → system prompt ──────────────────────────────────────────────────────

describe('debateAction — system prompt', () => {
  it('passes a non-empty system prompt to the model', async () => {
    await debateAction('prompt', [], 0, 'roast', 'gpt_oss');
    const systemPrompt = mockComplete.mock.calls[0][0];
    expect(typeof systemPrompt).toBe('string');
    expect(systemPrompt.length).toBeGreaterThan(0);
  });

  it('marks turn 0 as the first turn (isFirstTurn=true)', async () => {
    await debateAction('prompt', [], 0, 'academic', 'gpt_oss');
    const systemPrompt = mockComplete.mock.calls[0][0];
    // First-turn prompt should contain the "answer the user" instruction
    expect(systemPrompt).toMatch(/answer.*user/i);
  });

  it('marks turn > 0 as NOT the first turn (isFirstTurn=false)', async () => {
    await debateAction('prompt', [], 1, 'academic', 'gemma_2');
    const systemPrompt = mockComplete.mock.calls[0][0];
    // Secondary-turn prompt should contain the "challenge" instruction
    expect(systemPrompt).toMatch(/logic is flawed|stupid/i);
  });
});

// ── Error propagation ─────────────────────────────────────────────────────────

describe('debateAction — errors', () => {
  it('throws when the model adapter throws', async () => {
    mockComplete.mockRejectedValue(new Error('Rate limited'));
    await expect(
      debateAction('prompt', [], 0, 'roast', 'gpt_oss'),
    ).rejects.toThrow();
  });
});
