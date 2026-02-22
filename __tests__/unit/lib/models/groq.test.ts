/**
 * Tests for lib/models/groq.ts  →  GroqAdapter
 *
 * All network calls are intercepted via a mocked global.fetch.
 *
 * Covers:
 *  - Missing API key throws a descriptive error
 *  - Correct HTTP request is sent (URL, headers, body)
 *  - Successful response text is returned as-is
 *  - Non-2xx response throws with status code in message
 *  - Truncation at last sentence boundary (no mid-sentence cut-off)
 *  - Ellipsis appended when no punctuation is found
 *  - Text ending with punctuation is returned unchanged
 *  - Conversation history is forwarded in the messages array
 *  - Falls back to GROQ_API_KEY when specific env var is absent
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from 'vitest';

import { GroqAdapter } from '@/lib/models/groq';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeOkResponse(content: string) {
  return {
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({ choices: [{ message: { content } }] }),
  };
}

function makeErrorResponse(status: number, body: string) {
  return {
    ok: false,
    status,
    text: () => Promise.resolve(body),
  };
}

// ── Setup ─────────────────────────────────────────────────────────────────────

let mockFetch: MockedFunction<typeof fetch>;

beforeEach(() => {
  mockFetch = vi.fn();
  global.fetch = mockFetch as unknown as typeof fetch;
  process.env.GROQ_API_KEY = 'test-groq-key';
});

afterEach(() => {
  delete process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY_2;
  delete process.env.GROQ_MODEL;
  vi.clearAllMocks();
});

// ── API key handling ──────────────────────────────────────────────────────────

describe('GroqAdapter — API key', () => {
  it('throws a descriptive error when both specific and fallback keys are absent', async () => {
    delete process.env.GROQ_API_KEY;
    const adapter = new GroqAdapter('GROQ_API_KEY_MISSING');
    await expect(adapter.complete('system', 'hello', [])).rejects.toThrow(
      /Missing env var/,
    );
  });

  it('uses the named env var when set', async () => {
    process.env.GROQ_API_KEY_2 = 'key-two';
    mockFetch.mockResolvedValue(makeOkResponse('Response.') as Response);

    const adapter = new GroqAdapter('GROQ_API_KEY_2');
    await adapter.complete('sys', 'msg', []);

    const authHeader = (mockFetch.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
    expect(authHeader['Authorization']).toBe('Bearer key-two');
  });

  it('falls back to GROQ_API_KEY when specific key env var is absent', async () => {
    mockFetch.mockResolvedValue(makeOkResponse('Response.') as Response);

    const adapter = new GroqAdapter('GROQ_API_KEY_SPECIFIC_NOT_SET');
    await adapter.complete('sys', 'msg', []);

    const headers = (mockFetch.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer test-groq-key');
  });
});

// ── HTTP request shape ────────────────────────────────────────────────────────

describe('GroqAdapter — HTTP request', () => {
  it('calls the Groq completions endpoint', async () => {
    mockFetch.mockResolvedValue(makeOkResponse('OK.') as Response);

    await new GroqAdapter('GROQ_API_KEY').complete('sys', 'hi', []);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('sends system prompt as the first message', async () => {
    mockFetch.mockResolvedValue(makeOkResponse('OK.') as Response);

    await new GroqAdapter('GROQ_API_KEY').complete('Be helpful.', 'hi', []);

    const body = JSON.parse((mockFetch.mock.calls[0][1] as RequestInit).body as string);
    expect(body.messages[0]).toEqual({ role: 'system', content: 'Be helpful.' });
  });

  it('appends the user message as the last message', async () => {
    mockFetch.mockResolvedValue(makeOkResponse('OK.') as Response);

    await new GroqAdapter('GROQ_API_KEY').complete('sys', 'Final question?', []);

    const body = JSON.parse((mockFetch.mock.calls[0][1] as RequestInit).body as string);
    const last = body.messages.at(-1);
    expect(last).toEqual({ role: 'user', content: 'Final question?' });
  });

  it('forwards conversation history between system and user message', async () => {
    mockFetch.mockResolvedValue(makeOkResponse('OK.') as Response);

    const history = [
      { role: 'user' as const, content: 'earlier question' },
      { role: 'assistant' as const, content: 'earlier answer' },
    ];
    await new GroqAdapter('GROQ_API_KEY').complete('sys', 'now', history);

    const body = JSON.parse((mockFetch.mock.calls[0][1] as RequestInit).body as string);
    expect(body.messages).toContainEqual({ role: 'user', content: 'earlier question' });
    expect(body.messages).toContainEqual({ role: 'assistant', content: 'earlier answer' });
  });
});

// ── Response handling ─────────────────────────────────────────────────────────

describe('GroqAdapter — response handling', () => {
  it('returns the model content text', async () => {
    mockFetch.mockResolvedValue(makeOkResponse('This is the answer.') as Response);

    const result = await new GroqAdapter('GROQ_API_KEY').complete('s', 'q', []);
    expect(result).toBe('This is the answer.');
  });

  it('throws when the API returns a non-2xx status', async () => {
    mockFetch.mockResolvedValue(makeErrorResponse(429, 'Rate limit exceeded') as unknown as Response);

    await expect(
      new GroqAdapter('GROQ_API_KEY').complete('s', 'q', []),
    ).rejects.toThrow('Groq API error 429');
  });

  it('throws when the network request itself fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'));

    await expect(
      new GroqAdapter('GROQ_API_KEY').complete('s', 'q', []),
    ).rejects.toThrow('Network failure');
  });
});

// ── Truncation logic ──────────────────────────────────────────────────────────

describe('GroqAdapter — truncation', () => {
  it('returns text as-is when it ends with a period', async () => {
    mockFetch.mockResolvedValue(makeOkResponse('This is complete.') as Response);
    const result = await new GroqAdapter('GROQ_API_KEY').complete('s', 'q', []);
    expect(result).toBe('This is complete.');
  });

  it('returns text as-is when it ends with a question mark', async () => {
    mockFetch.mockResolvedValue(makeOkResponse('Is this right?') as Response);
    const result = await new GroqAdapter('GROQ_API_KEY').complete('s', 'q', []);
    expect(result).toBe('Is this right?');
  });

  it('clips at the last sentence boundary when text ends mid-sentence', async () => {
    mockFetch.mockResolvedValue(
      makeOkResponse('First sentence. Then it was cut off mid') as Response,
    );
    const result = await new GroqAdapter('GROQ_API_KEY').complete('s', 'q', []);
    expect(result).toBe('First sentence.');
  });

  it('appends ellipsis when there is no punctuation to clip at', async () => {
    mockFetch.mockResolvedValue(
      makeOkResponse('just words no punctuation truncated') as Response,
    );
    const result = await new GroqAdapter('GROQ_API_KEY').complete('s', 'q', []);
    expect(result).toContain('...');
  });

  it('caps the returned string at 2000 characters', async () => {
    mockFetch.mockResolvedValue(makeOkResponse('A'.repeat(2500) + '.') as Response);
    const result = await new GroqAdapter('GROQ_API_KEY').complete('s', 'q', []);
    expect(result.length).toBeLessThanOrEqual(2000);
  });
});
