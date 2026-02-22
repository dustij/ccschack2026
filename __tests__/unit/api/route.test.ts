/**
 * Tests for app/api/chat/route.ts  →  POST handler
 *
 * runAgents is mocked so the test exercises only the route layer:
 * JSON parsing, input validation, status codes, and response shape.
 *
 * Covers:
 *  - 200 with agents array for a valid request
 *  - runAgents called with trimmed message, correct mode, and history
 *  - 400 for empty / whitespace-only message
 *  - 400 for missing message field
 *  - 400 for invalid JSON body
 *  - 400 for invalid / missing mode
 *  - 500 when orchestration throws
 *  - All three valid modes accepted
 *  - History defaults to [] when omitted
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/orchestrator', () => ({ runAgents: vi.fn() }));

import { NextRequest } from 'next/server';

import { POST } from '@/app/api/chat/route';
import { runAgents } from '@/lib/orchestrator';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_AGENTS = [
  { agentName: 'GPT-5 nano', text: 'Response 1.', role: 'assistant' },
  { agentName: 'Gemma 2', text: 'Response 2.', role: 'assistant' },
];

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.mocked(runAgents).mockResolvedValue(MOCK_AGENTS as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── Happy path ────────────────────────────────────────────────────────────────

describe('POST /api/chat — happy path', () => {
  it('returns 200 for a valid request', async () => {
    const req = makeRequest({ message: 'Hello', mode: 'academic', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it('response body contains an agents array', async () => {
    const req = makeRequest({ message: 'Hello', mode: 'academic', history: [] });
    const data = await (await POST(req)).json();
    expect(Array.isArray(data.agents)).toBe(true);
    expect(data.agents).toHaveLength(2);
  });

  it('forwards trimmed message to runAgents', async () => {
    const req = makeRequest({ message: '  Hello  ', mode: 'roast', history: [] });
    await POST(req);
    expect(runAgents).toHaveBeenCalledWith('Hello', 'roast', []);
  });

  it('forwards history to runAgents', async () => {
    const history = [{ role: 'user', content: 'prev', agentName: undefined }];
    const req = makeRequest({ message: 'New', mode: 'flirt', history });
    await POST(req);
    expect(runAgents).toHaveBeenCalledWith('New', 'flirt', history);
  });

  it('defaults history to [] when not provided', async () => {
    const req = makeRequest({ message: 'Hello', mode: 'academic' });
    await POST(req);
    expect(runAgents).toHaveBeenCalledWith('Hello', 'academic', []);
  });

  it.each(['academic', 'flirt', 'roast'])(
    '"%s" is a valid mode and returns 200',
    async (mode) => {
      const req = makeRequest({ message: 'Test', mode });
      const res = await POST(req);
      expect(res.status).toBe(200);
    },
  );
});

// ── Validation — message ──────────────────────────────────────────────────────

describe('POST /api/chat — message validation', () => {
  it('returns 400 when message is an empty string', async () => {
    const req = makeRequest({ message: '', mode: 'academic', history: [] });
    expect((await POST(req)).status).toBe(400);
  });

  it('returns 400 when message is whitespace only', async () => {
    const req = makeRequest({ message: '   ', mode: 'academic', history: [] });
    expect((await POST(req)).status).toBe(400);
  });

  it('returns 400 when message field is missing', async () => {
    const req = makeRequest({ mode: 'academic', history: [] });
    expect((await POST(req)).status).toBe(400);
  });

  it('returns 400 when message is not a string', async () => {
    const req = makeRequest({ message: 42, mode: 'academic', history: [] });
    expect((await POST(req)).status).toBe(400);
  });

  it('error body contains a descriptive message field', async () => {
    const req = makeRequest({ message: '', mode: 'academic', history: [] });
    const data = await (await POST(req)).json();
    expect(typeof data.error).toBe('string');
    expect(data.error.length).toBeGreaterThan(0);
  });
});

// ── Validation — mode ─────────────────────────────────────────────────────────

describe('POST /api/chat — mode validation', () => {
  it('returns 400 for an unrecognised mode', async () => {
    const req = makeRequest({ message: 'Hi', mode: 'debate', history: [] });
    expect((await POST(req)).status).toBe(400);
  });

  it('returns 400 when mode is missing', async () => {
    const req = makeRequest({ message: 'Hi', history: [] });
    expect((await POST(req)).status).toBe(400);
  });

  it('error body mentions the valid modes', async () => {
    const req = makeRequest({ message: 'Hi', mode: 'unknown', history: [] });
    const data = await (await POST(req)).json();
    expect(data.error).toMatch(/academic|flirt|roast/);
  });
});

// ── Validation — JSON body ────────────────────────────────────────────────────

describe('POST /api/chat — JSON validation', () => {
  it('returns 400 for malformed JSON', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ broken json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/Invalid JSON/i);
  });
});

// ── Server error ──────────────────────────────────────────────────────────────

describe('POST /api/chat — server errors', () => {
  it('returns 500 when runAgents throws', async () => {
    vi.mocked(runAgents).mockRejectedValue(new Error('Model explosion'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const req = makeRequest({ message: 'Hi', mode: 'academic', history: [] });
    const res = await POST(req);

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toMatch(/internal server error/i);

    consoleSpy.mockRestore();
  });
});
