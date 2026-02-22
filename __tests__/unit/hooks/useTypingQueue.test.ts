/**
 * Tests for hooks/useTypingQueue.ts
 *
 * All timing is controlled with Vitest fake timers so tests are
 * deterministic and instant.
 *
 * Implementation note on batching:
 *   Inside the 500 ms thinking-pause callback, tick(1) is called
 *   synchronously. React 18 batches both setTypingMessages calls
 *   (add bubble + set first char) into a single render, so the
 *   "empty displayText" intermediate state is never observable in a
 *   real render cycle. Tests are written to match the actual rendered
 *   state rather than internal intermediate values.
 *
 * Covers:
 *  - Starts with empty typingMessages
 *  - No bubble appears before the 500 ms thinking pause
 *  - Bubble appears after the pause with the first character already set
 *  - isTyping is true while animating
 *  - displayText contains the first character right after the thinking pause
 *  - onMessageComplete is called with (id, fullText) when done
 *  - Message is removed from typingMessages after completion
 *  - Second message only starts after the first finishes + 500 ms
 *  - enqueue while already processing appends to the queue correctly
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTypingQueue } from '@/hooks/useTypingQueue';

// ── Constants mirroring the hook ──────────────────────────────────────────────
// Advance timers by MORE than the max possible random delay so assertions are
// not flaky due to the 20–35 ms randomness.
const THINKING_MS = 500;
const CHAR_BUDGET_MS = 50; // safely above MAX_CHAR_DELAY_MS=35

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

// ── Initial state ─────────────────────────────────────────────────────────────

describe('useTypingQueue — initial state', () => {
  it('typingMessages starts empty', () => {
    const { result } = renderHook(() => useTypingQueue(vi.fn()));
    expect(result.current.typingMessages).toHaveLength(0);
  });
});

// ── Thinking pause ────────────────────────────────────────────────────────────

describe('useTypingQueue — thinking pause (500 ms)', () => {
  it('no bubble appears before the 500 ms delay fires', () => {
    const { result } = renderHook(() => useTypingQueue(vi.fn()));

    act(() => {
      result.current.enqueue([{ id: 'a', fullText: 'Hi' }]);
    });

    // 499 ms — still nothing
    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current.typingMessages).toHaveLength(0);
  });

  it('bubble appears after exactly 500 ms', () => {
    const { result } = renderHook(() => useTypingQueue(vi.fn()));

    act(() => {
      result.current.enqueue([{ id: 'a', fullText: 'Hi' }]);
    });

    act(() => {
      vi.advanceTimersByTime(THINKING_MS);
    });

    expect(result.current.typingMessages).toHaveLength(1);
    expect(result.current.typingMessages[0].id).toBe('a');
  });

  it('isTyping is true while the bubble is animating', () => {
    const { result } = renderHook(() => useTypingQueue(vi.fn()));

    act(() => {
      result.current.enqueue([{ id: 'a', fullText: 'Hi' }]);
    });

    act(() => {
      vi.advanceTimersByTime(THINKING_MS);
    });

    expect(result.current.typingMessages[0].isTyping).toBe(true);
  });
});

// ── Character reveal ──────────────────────────────────────────────────────────

describe('useTypingQueue — character-by-character reveal', () => {
  it('displayText has the first character right after the thinking pause', () => {
    // tick(1) is called synchronously inside the 500 ms callback so React
    // batches the "add bubble" and "set first char" updates into one render.
    // After THINKING_MS the rendered displayText is already the first character.
    const { result } = renderHook(() => useTypingQueue(vi.fn()));

    act(() => {
      result.current.enqueue([{ id: 'a', fullText: 'AB' }]);
    });

    act(() => {
      vi.advanceTimersByTime(THINKING_MS);
    });

    expect(result.current.typingMessages[0].displayText).toBe('A');
  });
});

// ── Completion ────────────────────────────────────────────────────────────────

describe('useTypingQueue — completion', () => {
  it('calls onMessageComplete with (id, fullText) when typing finishes', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTypingQueue(onComplete));

    act(() => {
      result.current.enqueue([{ id: 'msg-1', fullText: 'Hi' }]);
    });

    // Enough time for thinking + 2 chars
    act(() => {
      vi.advanceTimersByTime(THINKING_MS + CHAR_BUDGET_MS * 2 + 50);
    });

    expect(onComplete).toHaveBeenCalledWith('msg-1', 'Hi');
  });

  it('removes the message from typingMessages after completion', () => {
    const { result } = renderHook(() => useTypingQueue(vi.fn()));

    act(() => {
      result.current.enqueue([{ id: 'msg-1', fullText: 'Hi' }]);
    });

    act(() => {
      vi.advanceTimersByTime(THINKING_MS + CHAR_BUDGET_MS * 5);
    });

    expect(result.current.typingMessages).toHaveLength(0);
  });

  it('calls onMessageComplete exactly once per message', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTypingQueue(onComplete));

    act(() => {
      result.current.enqueue([{ id: 'x', fullText: 'Hey' }]);
    });

    act(() => {
      vi.advanceTimersByTime(THINKING_MS + CHAR_BUDGET_MS * 10);
    });

    expect(onComplete).toHaveBeenCalledOnce();
  });
});

// ── Sequential processing ─────────────────────────────────────────────────────

describe('useTypingQueue — sequential processing', () => {
  it('processes messages one at a time (first message first)', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTypingQueue(onComplete));

    act(() => {
      result.current.enqueue([
        { id: 'first', fullText: 'Hi' },
        { id: 'second', fullText: 'Lo' },
      ]);
    });

    // Only first message should appear after 500 ms
    act(() => {
      vi.advanceTimersByTime(THINKING_MS);
    });

    expect(result.current.typingMessages[0].id).toBe('first');
  });

  it('second message begins only after first finishes', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTypingQueue(onComplete));

    act(() => {
      result.current.enqueue([
        { id: 'first', fullText: 'Hi' },
        { id: 'second', fullText: 'Lo' },
      ]);
    });

    // Finish first message
    act(() => {
      vi.advanceTimersByTime(THINKING_MS + CHAR_BUDGET_MS * 5);
    });

    expect(onComplete).toHaveBeenCalledWith('first', 'Hi');

    // Wait for second thinking pause
    act(() => {
      vi.advanceTimersByTime(THINKING_MS);
    });

    // Now second message should be animating
    const msgs = result.current.typingMessages;
    // Either second is in typingMessages or it has already completed
    const secondCompleted = onComplete.mock.calls.some((c) => c[0] === 'second');
    const secondTyping = msgs.some((m) => m.id === 'second');
    expect(secondCompleted || secondTyping).toBe(true);
  });

  it('enqueuing while processing appends to queue correctly', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTypingQueue(onComplete));

    act(() => {
      result.current.enqueue([{ id: 'first', fullText: 'Hi' }]);
    });

    // Mid-typing, add another message
    act(() => {
      vi.advanceTimersByTime(THINKING_MS);
      result.current.enqueue([{ id: 'second', fullText: 'Lo' }]);
    });

    // Let everything finish
    act(() => {
      vi.advanceTimersByTime(THINKING_MS * 2 + CHAR_BUDGET_MS * 10);
    });

    expect(onComplete).toHaveBeenCalledTimes(2);
    const completedIds = onComplete.mock.calls.map((c) => c[0]);
    expect(completedIds).toContain('first');
    expect(completedIds).toContain('second');
  });
});
