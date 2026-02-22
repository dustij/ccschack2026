/**
 * Tests for lib/models/mock.ts  →  MockAdapter
 *
 * The mock adapter is the safe in-test fallback — it must never throw
 * and must return a recognisable string so tests can assert on it.
 */

import { describe, expect, it } from 'vitest';

import { MockAdapter } from '@/lib/models/mock';

describe('MockAdapter', () => {
  const adapter = new MockAdapter();

  it('resolves without throwing', async () => {
    await expect(adapter.complete('sys', 'msg', [])).resolves.toBeDefined();
  });

  it('returns a string', async () => {
    const result = await adapter.complete('Be helpful', 'Hello', []);
    expect(typeof result).toBe('string');
  });

  it('response contains [MOCK] sentinel', async () => {
    const result = await adapter.complete('sys', 'msg', []);
    expect(result).toContain('[MOCK]');
  });

  it('includes a portion of the user message in the response', async () => {
    const userMessage = 'What is the meaning of life?';
    const result = await adapter.complete('sys', userMessage, []);
    // The adapter slices the first 40 chars of userMessage
    expect(result).toContain(userMessage.slice(0, 20));
  });

  it('handles an empty user message without throwing', async () => {
    await expect(adapter.complete('', '', [])).resolves.toBeDefined();
  });

  it('handles a non-empty history without throwing', async () => {
    const history = [{ role: 'user' as const, content: 'old msg' }];
    await expect(adapter.complete('sys', 'new msg', history)).resolves.toBeDefined();
  });
});
