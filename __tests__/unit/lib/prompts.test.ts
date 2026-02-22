/**
 * Tests for lib/prompts.ts
 *
 * Covers:
 *  - AGENTS_BY_MODE structure (shape, ordering, coverage)
 *  - getSystemPrompt — persona injection per agent
 *  - getSystemPrompt — mode instruction injection
 *  - getSystemPrompt — first-turn vs subsequent-turn logic
 *  - getSystemPrompt — unknown-agent fallback
 */

import { describe, expect, it } from 'vitest';

import { AGENTS_BY_MODE, getSystemPrompt } from '@/lib/prompts';
import type { ChatMode } from '@/lib/types';

const VALID_MODES: ChatMode[] = ['academic', 'flirt', 'roast'];

// ── AGENTS_BY_MODE ────────────────────────────────────────────────────────────

describe('AGENTS_BY_MODE', () => {
  it.each(VALID_MODES)('"%s" mode defines at least one agent', (mode) => {
    expect(AGENTS_BY_MODE[mode].length).toBeGreaterThan(0);
  });

  it('every mode has exactly 3 agents', () => {
    for (const mode of VALID_MODES) {
      expect(AGENTS_BY_MODE[mode]).toHaveLength(3);
    }
  });

  it('agent roles follow primary → secondary → tertiary order', () => {
    for (const mode of VALID_MODES) {
      const agents = AGENTS_BY_MODE[mode];
      expect(agents[0].role).toBe('primary');
      expect(agents[1].role).toBe('secondary');
      expect(agents[2].role).toBe('tertiary');
    }
  });

  it('all agents have non-empty agentName and model fields', () => {
    for (const mode of VALID_MODES) {
      for (const agent of AGENTS_BY_MODE[mode]) {
        expect(agent.agentName.length).toBeGreaterThan(0);
        expect(agent.model.length).toBeGreaterThan(0);
      }
    }
  });

  it('primary agents across all modes are GPT-5 nano', () => {
    for (const mode of VALID_MODES) {
      expect(AGENTS_BY_MODE[mode][0].agentName).toBe('GPT-5 nano');
    }
  });

  it('maps to correct model keys', () => {
    const academic = AGENTS_BY_MODE.academic;
    expect(academic[0].model).toBe('gpt_oss');
    expect(academic[1].model).toBe('gemma_2');
    expect(academic[2].model).toBe('llama_3');
  });
});

// ── getSystemPrompt ───────────────────────────────────────────────────────────

describe('getSystemPrompt — agent personas', () => {
  it('includes arrogant-philosopher persona for GPT-5 nano', () => {
    const prompt = getSystemPrompt('academic', 'GPT-5 nano', true);
    expect(prompt).toContain('arrogant philosopher');
  });

  it('includes pedantic fact-checker persona for Gemma 2', () => {
    const prompt = getSystemPrompt('roast', 'Gemma 2', false);
    expect(prompt).toContain('pedantic fact-checker');
  });

  it('includes sarcastic-teenager persona for LLaMA 3.3', () => {
    const prompt = getSystemPrompt('flirt', 'LLaMA 3.3', false);
    expect(prompt).toContain('sarcastic');
  });

  it('returns a non-empty string for an unknown agent', () => {
    const prompt = getSystemPrompt('academic', 'UnknownBot', true);
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(0);
  });
});

describe('getSystemPrompt — mode instructions', () => {
  it('injects flirt instruction in flirt mode', () => {
    const prompt = getSystemPrompt('flirt', 'GPT-5 nano', true);
    expect(prompt).toContain('flirtatious');
  });

  it('injects roast instruction in roast mode', () => {
    const prompt = getSystemPrompt('roast', 'Gemma 2', false);
    expect(prompt).toContain('roast');
  });

  it('injects academic/professor instruction in academic mode', () => {
    const prompt = getSystemPrompt('academic', 'LLaMA 3.3', true);
    expect(prompt).toContain('professor');
  });
});

describe('getSystemPrompt — turn logic', () => {
  it('first-turn prompt tells agent to answer the user directly', () => {
    const prompt = getSystemPrompt('academic', 'GPT-5 nano', true);
    expect(prompt).toMatch(/answer.*user/i);
  });

  it('subsequent-turn prompt tells agent to challenge the previous AI', () => {
    const prompt = getSystemPrompt('academic', 'GPT-5 nano', false);
    expect(prompt).toMatch(/logic is flawed|stupid/i);
  });

  it('first-turn and subsequent-turn prompts differ', () => {
    const firstTurn = getSystemPrompt('roast', 'Gemma 2', true);
    const laterTurn = getSystemPrompt('roast', 'Gemma 2', false);
    expect(firstTurn).not.toBe(laterTurn);
  });
});

describe('getSystemPrompt — shared constraints', () => {
  it('always includes the 30-word hard limit', () => {
    for (const mode of VALID_MODES) {
      const prompt = getSystemPrompt(mode, 'GPT-5 nano', true);
      expect(prompt).toContain('30 words');
    }
  });

  it('always returns a string (never throws)', () => {
    for (const mode of VALID_MODES) {
      for (const agent of ['GPT-5 nano', 'Gemma 2', 'LLaMA 3.3', 'Unknown']) {
        expect(() => getSystemPrompt(mode, agent, true)).not.toThrow();
        expect(() => getSystemPrompt(mode, agent, false)).not.toThrow();
      }
    }
  });
});
