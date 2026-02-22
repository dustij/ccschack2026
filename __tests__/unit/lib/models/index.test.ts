/**
 * Tests for lib/models/index.ts  →  getModel()
 *
 * Covers:
 *  - Known keys return an adapter that has a complete() method
 *  - Unknown key falls back to MockAdapter + logs a warning
 *  - Each call returns a fresh adapter instance (factory pattern)
 */

import { describe, expect, it, vi } from 'vitest';

import { getModel } from '@/lib/models/index';
import { MockAdapter } from '@/lib/models/mock';

const KNOWN_KEYS = [
  'gpt_oss',
  'gemma_2',
  'llama_3',
  'claude',
  'openai',
  'gemini',
  'custom',
  'mock',
] as const;

describe('getModel — known keys', () => {
  it.each(KNOWN_KEYS)(
    '"%s" returns an adapter with a complete() method',
    (key) => {
      const adapter = getModel(key);
      expect(typeof adapter.complete).toBe('function');
    },
  );

  it('"mock" returns a MockAdapter instance', () => {
    expect(getModel('mock')).toBeInstanceOf(MockAdapter);
  });

  it('returns a new instance on every call (factory pattern)', () => {
    const a = getModel('mock');
    const b = getModel('mock');
    expect(a).not.toBe(b);
  });
});

describe('getModel — unknown key fallback', () => {
  it('returns a MockAdapter for an unrecognised key', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const adapter = getModel('totally_unknown_key');
    expect(adapter).toBeInstanceOf(MockAdapter);
    consoleSpy.mockRestore();
  });

  it('logs a warning that includes the unknown key', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    getModel('bad_key');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('bad_key'),
    );
    consoleSpy.mockRestore();
  });
});
