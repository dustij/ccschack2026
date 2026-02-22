/**
 * Tests for lib/orchestrator.ts  →  runAgents()
 *
 * All external model calls are mocked so tests are fast and deterministic.
 *
 * Covers:
 *  - Correct number of agents run per mode
 *  - Sequential execution order (primary → secondary → tertiary)
 *  - Context isolation: primary sees only user message
 *  - Context accumulation: secondary/tertiary see prior responses
 *  - Graceful fallback when one agent throws
 *  - Response truncation at MAX_CHARS (1000)
 *  - All valid modes execute without error
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// vi.mock is hoisted — must appear before any import that transitively
// imports the mocked module.
vi.mock('server-only', () => ({}));
vi.mock('@/lib/models/index', () => ({ getModel: vi.fn() }));

import { getModel } from '@/lib/models/index';
import { runAgents } from '@/lib/orchestrator';

const mockComplete = vi.fn();

beforeEach(() => {
  vi.mocked(getModel).mockReturnValue({ complete: mockComplete });
  mockComplete.mockResolvedValue('Agent response.');
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── Agent count ───────────────────────────────────────────────────────────────

describe('runAgents — agent count', () => {
  it('returns 3 agent responses for academic mode', async () => {
    const results = await runAgents('Hello', 'academic', []);
    expect(results).toHaveLength(3);
  });

  it('returns 3 agent responses for flirt mode', async () => {
    const results = await runAgents('Hello', 'flirt', []);
    expect(results).toHaveLength(3);
  });

  it('returns 3 agent responses for roast mode', async () => {
    const results = await runAgents('Hello', 'roast', []);
    expect(results).toHaveLength(3);
  });
});

// ── Response shape ────────────────────────────────────────────────────────────

describe('runAgents — response shape', () => {
  it('every response has role "assistant"', async () => {
    const results = await runAgents('Hello', 'academic', []);
    for (const r of results) {
      expect(r.role).toBe('assistant');
    }
  });

  it('returns the 3 expected agent names in academic mode', async () => {
    const results = await runAgents('Hello', 'academic', []);
    const names = results.map((r) => r.agentName);
    expect(names).toContain('GPT-5 nano');
    expect(names).toContain('Gemma 2');
    expect(names).toContain('LLaMA 3.3');
  });

  it('response text matches the mock return value', async () => {
    mockComplete.mockResolvedValue('Custom text.');
    const results = await runAgents('Hello', 'roast', []);
    expect(results[0].text).toBe('Custom text.');
  });
});

// ── Context isolation / accumulation ─────────────────────────────────────────

describe('runAgents — context passing', () => {
  it('primary agent receives exactly the raw user message', async () => {
    await runAgents('Specific question', 'academic', []);
    // complete(systemPrompt, userMessage, history) → second arg is userMessage
    const firstCallUserMsg = mockComplete.mock.calls[0][1];
    expect(firstCallUserMsg).toBe('Specific question');
  });

  it('secondary agent context message includes the user message', async () => {
    mockComplete
      .mockResolvedValueOnce('Primary answer.')
      .mockResolvedValue('Other.');

    await runAgents('User input', 'academic', []);

    const secondCallUserMsg = mockComplete.mock.calls[1][1];
    expect(secondCallUserMsg).toContain('User input');
  });

  it('secondary agent context includes the primary agent response', async () => {
    mockComplete
      .mockResolvedValueOnce('Primary answer.')
      .mockResolvedValue('Other.');

    await runAgents('User input', 'academic', []);

    const secondCallUserMsg = mockComplete.mock.calls[1][1];
    expect(secondCallUserMsg).toContain('Primary answer.');
  });

  it('tertiary agent context includes both prior agent responses', async () => {
    mockComplete
      .mockResolvedValueOnce('First reply.')
      .mockResolvedValueOnce('Second reply.')
      .mockResolvedValue('Third reply.');

    await runAgents('Prompt', 'academic', []);

    const thirdCallUserMsg = mockComplete.mock.calls[2][1];
    expect(thirdCallUserMsg).toContain('First reply.');
    expect(thirdCallUserMsg).toContain('Second reply.');
  });

  it('passes conversation history to every agent', async () => {
    const history = [
      { role: 'user' as const, content: 'Previous question' },
      { role: 'assistant' as const, content: 'Previous answer' },
    ];

    await runAgents('New question', 'roast', history);

    for (const call of mockComplete.mock.calls) {
      const agentHistory = call[2]; // third argument is history
      expect(agentHistory).toEqual(history);
    }
  });
});

// ── Error handling ────────────────────────────────────────────────────────────

describe('runAgents — error handling', () => {
  it('returns fallback text when one agent throws, others still run', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockComplete
      .mockResolvedValueOnce('First agent OK.')
      .mockRejectedValueOnce(new Error('API error'))
      .mockResolvedValueOnce('Third agent OK.');

    const results = await runAgents('Hello', 'academic', []);

    expect(results).toHaveLength(3);
    expect(results[1].text).toContain('unavailable');
    expect(results[0].text).toBe('First agent OK.');
    expect(results[2].text).toBe('Third agent OK.');

    consoleSpy.mockRestore();
  });

  it('logs the error when an agent fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockComplete.mockRejectedValueOnce(new Error('Timeout')).mockResolvedValue('OK.');

    await runAgents('Hello', 'academic', []);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

// ── Truncation ────────────────────────────────────────────────────────────────

describe('runAgents — response truncation', () => {
  it('truncates long responses to MAX_CHARS (1000)', async () => {
    mockComplete.mockResolvedValue('A'.repeat(1500));

    const results = await runAgents('Hello', 'roast', []);

    for (const r of results) {
      expect(r.text.length).toBeLessThanOrEqual(1000);
    }
  });

  it('does not truncate responses that are already within limit', async () => {
    const shortText = 'Short answer.';
    mockComplete.mockResolvedValue(shortText);

    const results = await runAgents('Hello', 'flirt', []);
    expect(results[0].text).toBe(shortText);
  });
});
