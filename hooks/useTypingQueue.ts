'use client';

import { useCallback, useRef, useState } from 'react';

export interface TypingMessage {
  id: string;
  displayText: string;
  isTyping: boolean;
}

interface QueueItem {
  id: string;
  fullText: string;
}

/** How long to pause before each agent starts typing (ms). */
const AGENT_START_DELAY_MS = 500;

/** Per-character typing speed range (ms). Realistic human-like cadence. */
const MIN_CHAR_DELAY_MS = 20;
const MAX_CHAR_DELAY_MS = 35;

function randomCharDelay(): number {
  return (
    MIN_CHAR_DELAY_MS + Math.random() * (MAX_CHAR_DELAY_MS - MIN_CHAR_DELAY_MS)
  );
}

/**
 * Manages a sequential queue of AI agent responses, revealing each one
 * character-by-character with a natural typing rhythm.
 *
 * Timing contract:
 *   - 500 ms thinking pause before the first character of every agent
 *   - 25–45 ms per character (randomised for realism)
 *   - The next agent waits until the current one finishes, then waits 500 ms
 *
 * @param onMessageComplete  Called when each agent finishes typing.
 *                           Use this to persist the message to your main list.
 */
export function useTypingQueue(
  onMessageComplete: (id: string, fullText: string) => void
) {
  const [typingMessages, setTypingMessages] = useState<TypingMessage[]>([]);

  // Internal pending queue — a ref so mutations never trigger renders.
  const queue = useRef<QueueItem[]>([]);
  const isProcessing = useRef(false);

  // Always call the latest version of the callback without recreating processNext.
  const onCompleteRef = useRef(onMessageComplete);
  onCompleteRef.current = onMessageComplete;

  /**
   * Pull the next item off the queue and animate it.
   * Stable identity (useCallback with empty deps) so it can safely be called
   * from nested setTimeout chains without stale-closure issues.
   */
  const processNext = useCallback((): void => {
    const item = queue.current.shift();

    if (!item) {
      isProcessing.current = false;
      return;
    }

    // --- Thinking pause / inter-agent gap ---
    setTimeout(() => {
      // Reveal the bubble with empty text so the cursor appears immediately.
      setTypingMessages((prev) => [
        ...prev,
        { id: item.id, displayText: '', isTyping: true },
      ]);

      // --- Character-by-character animation ---
      const tick = (index: number): void => {
        if (index > item.fullText.length) {
          // Done — notify parent, remove from active list, start next agent.
          onCompleteRef.current(item.id, item.fullText);
          setTypingMessages((prev) => prev.filter((m) => m.id !== item.id));
          processNext(); // immediately calls itself; delay lives at the top
          return;
        }

        setTypingMessages((prev) =>
          prev.map((m) =>
            m.id === item.id
              ? { ...m, displayText: item.fullText.slice(0, index) }
              : m
          )
        );

        setTimeout(() => tick(index + 1), randomCharDelay());
      };

      tick(1);
    }, AGENT_START_DELAY_MS);
  }, []); // intentionally empty — uses only stable refs + state setters

  /**
   * Add one or more agents to the typing queue.
   * Safe to call while a previous batch is still animating.
   */
  const enqueue = useCallback(
    (items: QueueItem[]): void => {
      queue.current.push(...items);
      if (!isProcessing.current) {
        isProcessing.current = true;
        processNext();
      }
    },
    [processNext]
  );

  return { typingMessages, enqueue };
}
