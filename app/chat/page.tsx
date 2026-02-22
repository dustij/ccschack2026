'use client';

import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowUpIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { debateAction } from '@/app/actions/debate';
import {
  CHAT_MODES,
  DEBATE_MAX_TURNS,
  DEBATE_MAX_WAIT_MS,
  DEBATE_MIN_WAIT_MS,
  THINKING_DOT_DELAYS_MS,
} from '@/app/chat/constants';
import ChatMessage from '@/components/ChatMessage';
import { AmbientParticles } from '@/components/ui/ambient-particles';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { type DebateModelId } from '@/lib/types';
import { type ReactElement } from 'react';
type ChatMode = (typeof CHAT_MODES)[number];
type ChatEntry = {
  id: string;
  role: 'system' | 'user';
  content: string;
  name?: string;
  isTyping?: boolean;
};
type DebateModel = {
  id: DebateModelId;
  name: string;
};

const DEBATE_MODELS: DebateModel[] = [
  { id: 'gpt_oss', name: 'GPT-5 nano' },
  { id: 'gemma_2', name: 'Gemma 2' },
  { id: 'llama_3', name: 'LLaMA 3.3' },
];

function pickNextResponder(lastResponderId: DebateModelId | null): DebateModel {
  const candidates =
    lastResponderId === null
      ? DEBATE_MODELS
      : DEBATE_MODELS.filter((model) => model.id !== lastResponderId);

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function randomDelayMs(): number {
  return (
    Math.floor(Math.random() * (DEBATE_MAX_WAIT_MS - DEBATE_MIN_WAIT_MS + 1)) +
    DEBATE_MIN_WAIT_MS
  );
}

const MODE_BORDER_STYLES: Record<
  ChatMode,
  {
    panel: string;
    footer: string;
    modeTrigger: string;
    modePopup: string;
    messageBubble: string;
    messageAvatar: string;
  }
> = {
  Flirt: {
    panel: 'border-candy-pink/45 drop-shadow-[0_0_14px_rgba(255,107,157,0.28)]',
    footer:
      'border-candy-pink/45 drop-shadow-[0_0_10px_rgba(255,107,157,0.24)]',
    modeTrigger:
      'border-candy-pink/45 hover:border-candy-pink/70 drop-shadow-[0_0_8px_rgba(255,107,157,0.24)]',
    modePopup:
      'border-candy-pink/35 drop-shadow-[0_0_10px_rgba(255,107,157,0.24)]',
    messageBubble: 'border-none',
    messageAvatar: 'border-none',
  },
  Academic: {
    panel: 'border-candy-mint/45 drop-shadow-[0_0_14px_rgba(134,239,172,0.26)]',
    footer:
      'border-candy-mint/45 drop-shadow-[0_0_10px_rgba(134,239,172,0.22)]',
    modeTrigger:
      'border-candy-mint/45 hover:border-candy-mint/70 drop-shadow-[0_0_8px_rgba(134,239,172,0.22)]',
    modePopup:
      'border-candy-mint/35 drop-shadow-[0_0_10px_rgba(134,239,172,0.22)]',
    messageBubble: 'border-none',
    messageAvatar: 'border-none',
  },
  Roast: {
    panel:
      'border-candy-purple/45 drop-shadow-[0_0_14px_rgba(192,132,252,0.28)]',
    footer:
      'border-candy-purple/45 drop-shadow-[0_0_10px_rgba(192,132,252,0.24)]',
    modeTrigger:
      'border-candy-purple/45 hover:border-candy-purple/70 drop-shadow-[0_0_8px_rgba(192,132,252,0.24)]',
    modePopup:
      'border-candy-purple/35 drop-shadow-[0_0_10px_rgba(192,132,252,0.24)]',
    messageBubble: 'border-none',
    messageAvatar: 'border-none',
  },
};

function isChatMode(mode: string | null): mode is ChatMode {
  return mode !== null && CHAT_MODES.includes(mode as ChatMode);
}

const PANEL_TRANSITION = {
  type: 'spring',
  stiffness: 175,
  damping: 14,
  mass: 0.9,
} as const;

const BUTTON_TRANSITION = {
  type: 'spring',
  stiffness: 220,
  damping: 13,
  mass: 0.65,
  delay: 0.62,
} as const;

export default function ChatPage() {
  const [chatMode, setChatMode] = useState<ChatMode>(CHAT_MODES[0]);
  // Completed messages (user messages + fully-typed agent messages).
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const modeBorders = MODE_BORDER_STYLES[chatMode];

  // Debate state
  const [isDebating, setIsDebating] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [debateStatus, setDebateStatus] = useState<
    'idle' | 'fetching' | 'typing' | 'waiting'
  >('idle');
  const [pendingResponder, setPendingResponder] = useState<DebateModel | null>(
    null
  );
  const [lastResponderId, setLastResponderId] = useState<DebateModelId | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const debateSessionRef = useRef(0);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Can be used to disable button during user submission processing

  const resetDebateState = (options?: {
    clearMessages?: boolean;
    clearInput?: boolean;
  }) => {
    debateSessionRef.current += 1;
    setIsDebating(false);
    setDebateStatus('idle');
    setTurnCount(0);
    setPendingResponder(null);
    setLastResponderId(null);

    if (options?.clearMessages) {
      setMessages([]);
    }

    if (options?.clearInput) {
      setInput('');
    }
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, debateStatus]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    const runNextTurn = async (responder: DebateModel, sessionId: number) => {
      if (sessionId !== debateSessionRef.current) return;

      if (!isDebating || turnCount >= DEBATE_MAX_TURNS) {
        setIsDebating(false);
        setDebateStatus('idle');
        setPendingResponder(null);
        return;
      }

      setDebateStatus('fetching');

      try {
        const originalPrompt =
          messages.find((m) => m.role === 'user')?.content || '';
        const historyForDebate = messages.map((m) => ({
          role: m.role,
          content: m.content,
          name: m.name,
        }));

        const result = await debateAction(
          originalPrompt,
          historyForDebate,
          turnCount,
          chatMode,
          responder.id
        );

        if (sessionId !== debateSessionRef.current) return;

        setMessages((prev) => [
          ...prev,
          {
            id: `debate-${turnCount}-${Date.now()}`,
            role: 'system',
            name: result.modelName,
            content: result.content,
            isTyping: true,
          },
        ]);

        setLastResponderId(responder.id);
        setPendingResponder(null);
        setTurnCount((prev) => prev + 1);
        setDebateStatus('typing');
      } catch (err: any) {
        if (sessionId !== debateSessionRef.current) return;

        console.error('Debate loop crashed', err);
        setIsDebating(false);
        setDebateStatus('idle');
        setPendingResponder(null);
      }
    };

    if (!isDebating) return;

    if (turnCount >= DEBATE_MAX_TURNS) {
      setIsDebating(false);
      setDebateStatus('idle');
      setPendingResponder(null);
      return;
    }

    if (debateStatus === 'idle') {
      if (!pendingResponder) {
        setPendingResponder(pickNextResponder(lastResponderId));
      }
      setDebateStatus('waiting');
    } else if (debateStatus === 'waiting' && pendingResponder) {
      const sessionId = debateSessionRef.current;
      timerId = setTimeout(() => {
        void runNextTurn(pendingResponder, sessionId);
      }, randomDelayMs());
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [
    isDebating,
    debateStatus,
    turnCount,
    chatMode,
    messages,
    pendingResponder,
    lastResponderId,
  ]);

  let activeStatusMessage = null;
  if (isDebating && debateStatus === 'fetching' && pendingResponder) {
    activeStatusMessage = `${pendingResponder.name} is thinking...`;
  }

  const renderedMessages: ReactElement[] = [];
  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i];

    renderedMessages.push(
      <ChatMessage
        key={message.id}
        role={message.role}
        text={message.content}
        authorName={message.name}
        animate={message.isTyping}
        onAnimationComplete={() => {
          if (message.isTyping) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === message.id ? { ...m, isTyping: false } : m
              )
            );
            if (isDebating) setDebateStatus('idle'); // Triggers the next runNextTurn loop instantly
          }
        }}
        bubbleClassName={modeBorders.messageBubble}
        avatarClassName={modeBorders.messageAvatar}
      />
    );
  }

  // True while the API is fetching OR while agents are still animating.
  // Blocking submission during animation keeps message order correct.

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isDebating || debateStatus !== 'idle') return;

    // Put user message on screen immediately
    const userMessage: ChatEntry = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedInput,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');

    // Kick off chain-reaction loop
    debateSessionRef.current += 1;
    setTurnCount(0);
    setLastResponderId(null);
    setPendingResponder(null);
    setIsDebating(true);
    setDebateStatus('idle'); // Starting from idle immediately triggers the first AI in the loop
  };

  return (
    <div className="to-candy-purple-dark relative isolate h-dvh overflow-hidden bg-white bg-linear-60 dark:from-black">
      <AmbientParticles />
      <div
        aria-hidden="true"
        className="absolute top-6 left-[calc(50%-8rem)] z-0 transform-gpu blur-3xl sm:left-[calc(50%-20rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
          className="from-candy-blue to-candy-pink aspect-1108/632 w-277 bg-linear-to-r opacity-15"
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <header className="relative mb-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -90, rotate: -14, scale: 0.72 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            transition={BUTTON_TRANSITION}
          >
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="bg-candy-purple-dark/60 hover:bg-candy-purple-dark/80 size-10 rounded-full border border-white/12 text-white"
            >
              <Link href="/" aria-label="Back">
                <ArrowLeftIcon className="size-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -18, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.46, delay: 0.5, ease: 'easeOut' }}
            className="font-bangers pointer-events-none absolute left-1/2 -translate-x-1/2 text-4xl leading-none text-white"
          >
            MODEL MAYHEM
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: 90, rotate: 14, scale: 0.72 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            transition={BUTTON_TRANSITION}
          >
            <Combobox
              value={chatMode}
              onValueChange={(nextMode) => {
                if (isChatMode(nextMode) && nextMode !== chatMode) {
                  resetDebateState({ clearMessages: true, clearInput: true });
                  setChatMode(nextMode);
                }
              }}
              aria-label="Mode"
            >
              <ComboboxTrigger
                className={`bg-candy-purple-dark/65 flex h-10 min-w-28 items-center justify-between gap-2 rounded-full border px-4 text-sm font-medium text-white shadow-xs backdrop-blur-md transition-colors ${modeBorders.modeTrigger}`}
              >
                <ComboboxValue placeholder="Mode" />
              </ComboboxTrigger>
              <ComboboxContent
                className={`bg-candy-purple-dark/95 w-36 rounded-xl border p-1 text-white shadow-xl ${modeBorders.modePopup}`}
              >
                <ComboboxList>
                  {CHAT_MODES.map((mode) => (
                    <ComboboxItem
                      key={mode}
                      value={mode}
                      className="rounded-lg text-white data-highlighted:bg-white/10 data-highlighted:text-white"
                    >
                      {mode}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </motion.div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col gap-4">
          {/* CHAT MESSAGES */}
          <motion.section
            initial={{ opacity: 0, y: -140, rotate: -2.4, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            transition={PANEL_TRANSITION}
            className={`bg-candy-purple-dark/55 relative min-h-0 flex-1 overflow-hidden rounded-3xl border shadow-2xl shadow-black/30 backdrop-blur-md ${modeBorders.panel}`}
          >
            {/* Gradient vignette — purely decorative */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-white/5 via-transparent to-black/25"
            />

            <div
              data-mode={chatMode}
              className="chat-window-scrollbar relative z-10 h-full min-h-0 overflow-y-auto overscroll-contain p-5"
            >
              {renderedMessages.length > 0 ? (
                <div className="flex min-h-full flex-col justify-end gap-3">
                  {renderedMessages}
                  {activeStatusMessage && (
                    <div className="flex animate-pulse items-center gap-2 p-3 text-sm text-white/70 italic">
                      {THINKING_DOT_DELAYS_MS.map((delayMs) => (
                        <div
                          key={delayMs}
                          className="h-2 w-2 animate-bounce rounded-full bg-white/70"
                          style={{ animationDelay: `${delayMs}ms` }}
                        ></div>
                      ))}
                      <span className="ml-2">{activeStatusMessage}</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/50">
                  Start the chat by sending a message below.
                </div>
              )}
            </div>
          </motion.section>

          <motion.footer
            initial={{ opacity: 0, y: 130, rotate: 2.2, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            transition={PANEL_TRANSITION}
            className={`bg-candy-purple-dark/72 rounded-3xl border p-2 shadow-xl shadow-black/25 backdrop-blur-md ${modeBorders.footer}`}
          >
            {/* CHAT INPUT */}
            <form className="flex items-center gap-2" onSubmit={onSubmit}>
              {isDebating && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => resetDebateState()}
                  className="h-11 rounded-2xl bg-red-500/80 px-4 font-bold text-white shadow-lg hover:bg-red-600/90"
                >
                  Stop the Fight
                </Button>
              )}
              <Input
                disabled={isLoading}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Type your message..."
                className="h-11 rounded-2xl border-0 bg-transparent text-white shadow-none placeholder:text-white/45 focus-visible:ring-0 dark:bg-transparent"
              />
              <motion.div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="icon-xs"
                  className="text-candy-purple-dark size-10 rounded-full bg-white/30 hover:bg-white/35"
                  aria-label="Send message"
                >
                  <ArrowUpIcon className="size-5" />
                </Button>
              </motion.div>
            </form>
          </motion.footer>
        </main>
      </div>
    </div>
  );
}
