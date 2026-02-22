/**
 * Tests for components/Typewriter.tsx
 *
 * Uses fake timers to control animation timing deterministically.
 *
 * Why separate act() calls per character?
 * ----------------------------------------
 * The Typewriter component chains: timer fires → setState → React renders →
 * useEffect runs → schedules next timer.
 *
 * vi.advanceTimersByTimeAsync advances time and awaits microtasks, but React's
 * passive effects (useEffect) are flushed AFTER act() resolves — not during
 * the async callback. This means a single advanceTimersByTimeAsync(N*speed)
 * fires the first timer but finds no second timer scheduled yet, because the
 * useEffect for the re-rendered component hasn't run yet.
 *
 * The solution: one act() per character step. After each act(), React flushes
 * the effect, schedules the next timer, and the subsequent act() can fire it.
 *
 * Covers:
 *  - Starts with empty display
 *  - Reveals one character per tick
 *  - Fully reveals all text in exactly text.length ticks
 *  - Respects the speed prop (ms per character)
 *  - Calls onComplete exactly once after all characters are shown
 *  - Does NOT call onComplete before typing is done
 *  - Handles an empty string without crashing
 */

import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Typewriter } from '@/components/Typewriter';

/**
 * Advance fake time enough to trigger exactly one character timer, then let
 * React flush effects before returning. Repeat n times to reveal n characters.
 */
async function advanceChars(n: number, speedMs: number) {
  for (let i = 0; i < n; i++) {
    // +1 ms so the timer at exactly `speedMs` fires
    await act(async () => {
      await vi.advanceTimersByTimeAsync(speedMs + 1);
    });
  }
}

/**
 * Advance fake time without triggering any character timer (used to assert
 * that a slow-speed timer has NOT fired yet).
 */
async function advanceMs(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── Rendering ─────────────────────────────────────────────────────────────────

describe('Typewriter — initial state', () => {
  it('renders nothing before any timer fires', () => {
    const { container } = render(<Typewriter text="Hello" speed={25} />);
    expect(container.textContent).toBe('');
  });

  it('renders an empty string gracefully', () => {
    expect(() => render(<Typewriter text="" speed={25} />)).not.toThrow();
  });
});

// ── Character-by-character reveal ─────────────────────────────────────────────

describe('Typewriter — character reveal', () => {
  it('shows the first character after one speed interval', async () => {
    const { container } = render(<Typewriter text="Hi" speed={50} />);

    await advanceChars(1, 50);

    expect(container.textContent).toBe('H');
  });

  it('shows two characters after two speed intervals', async () => {
    const { container } = render(<Typewriter text="Hi" speed={50} />);

    await advanceChars(2, 50);

    expect(container.textContent).toBe('Hi');
  });

  it('fully reveals all text after text.length steps', async () => {
    const text = 'Hello';
    const speed = 30;
    const { container } = render(<Typewriter text={text} speed={speed} />);

    await advanceChars(text.length, speed);

    expect(container.textContent).toBe(text);
  });
});

// ── Speed prop ────────────────────────────────────────────────────────────────

describe('Typewriter — speed prop', () => {
  it('a slow speed (100ms) shows no text after 50ms', async () => {
    const { container } = render(<Typewriter text="AB" speed={100} />);

    await advanceMs(50);

    expect(container.textContent).toBe('');
  });

  it('a fast speed (10ms) reveals all chars quickly', async () => {
    const { container } = render(<Typewriter text="ABC" speed={10} />);

    await advanceChars(3, 10);

    expect(container.textContent).toBe('ABC');
  });
});

// ── onComplete callback ───────────────────────────────────────────────────────

describe('Typewriter — onComplete', () => {
  it('calls onComplete exactly once after all characters are revealed', async () => {
    const onComplete = vi.fn();
    const text = 'Hi';
    render(<Typewriter text={text} speed={25} onComplete={onComplete} />);

    // Reveal all chars; the final act() also flushes the completion effect
    await advanceChars(text.length, 25);

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('does not call onComplete before typing finishes', async () => {
    const onComplete = vi.fn();
    render(<Typewriter text="Hello" speed={50} onComplete={onComplete} />);

    // Advance only 2 of 5 characters
    await advanceChars(2, 50);

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('works correctly when onComplete is undefined', async () => {
    const { container } = render(<Typewriter text="OK" speed={25} />);

    await advanceChars(2, 25);

    expect(container.textContent).toBe('OK');
  });
});
