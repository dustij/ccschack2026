'use client';

import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowUpIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
import { useAiChat } from '@/hooks/useAiChat';
import { useTypingQueue } from '@/hooks/useTypingQueue';
import type { AgentResponse } from '@/lib/types';

const CHAT_MODES = ['Roast', 'Flirt', 'Academic', 'Story'] as const;
type ChatMode = (typeof CHAT_MODES)[number];
type ChatEntry = { id: string; role: 'system' | 'user'; content: string; isTyping?: boolean };

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
    panel: 'border-candy-pink/45',
    footer: 'border-candy-pink/45',
    modeTrigger: 'border-candy-pink/45 hover:border-candy-pink/70',
    modePopup: 'border-candy-pink/35',
    messageBubble: 'border-none',
    messageAvatar: 'border-none',
  },
  Roast: {
    panel: 'border-candy-blue/45',
    footer: 'border-candy-blue/45',
    modeTrigger: 'border-candy-blue/45 hover:border-candy-blue/70',
    modePopup: 'border-candy-blue/35',
    messageBubble: 'border-none',
    messageAvatar: 'border-none',
  },
  Academic: {
    panel: 'border-candy-mint/45',
    footer: 'border-candy-mint/45',
    modeTrigger: 'border-candy-mint/45 hover:border-candy-mint/70',
    modePopup: 'border-candy-mint/35',
    messageBubble: 'border-none',
    messageAvatar: 'border-none',
  },
  Story: {
    panel: 'border-candy-purple/45',
    footer: 'border-candy-purple/45',
    modeTrigger: 'border-candy-purple/45 hover:border-candy-purple/70',
    modePopup: 'border-candy-purple/35',
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

  // Scroll anchor — we scroll here whenever a new bubble appears.
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Called by the typing queue when an agent finishes typing.
  const handleMessageComplete = useCallback((id: string, fullText: string) => {
    setMessages((prev) => [...prev, { id, role: 'system', content: fullText }]);
  }, []);

  const { typingMessages, enqueue } = useTypingQueue(handleMessageComplete);

  // Scroll to bottom when a new bubble appears (new message or new typing entry).
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, typingMessages.length]);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useAiChat({
      mode: chatMode,
      onFinish(_prompt, agents: AgentResponse[]) {
        // Hand agents to the typing queue — do NOT add them to `messages` directly.
        const items = agents.map((a) => ({
          id: `agent-${a.agentName}-${Date.now()}-${Math.random()}`,
          fullText: `${a.agentName}: ${a.text}`,
        }));
        enqueue(items);
      },
    });

  // True while the API is fetching OR while agents are still animating.
  // Blocking submission during animation keeps message order correct.
  const isBusy = isLoading || typingMessages.length > 0;

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isBusy) return;

    const userMessage: ChatEntry = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedInput,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    void handleSubmit(undefined, trimmedInput);
  };

  // Merge completed messages with any currently-animating messages for display.
  const allDisplayMessages = [
    ...messages,
    ...typingMessages.map((m) => ({
      id: m.id,
      role: 'system' as const,
      content: m.displayText,
      isTyping: m.isTyping,
    })),
  ];

  return (
    <div className="to-candy-purple-dark relative isolate min-h-screen overflow-hidden bg-white bg-linear-60 dark:from-black">
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

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-4 flex items-center justify-between">
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

          <motion.div
            initial={{ opacity: 0, x: 90, rotate: 14, scale: 0.72 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            transition={BUTTON_TRANSITION}
          >
            <Combobox
              value={chatMode}
              onValueChange={(nextMode) => {
                if (isChatMode(nextMode)) {
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
                      className="data-highlighted:bg-candy-purple/30 rounded-lg text-white data-highlighted:text-white"
                    >
                      {mode}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </motion.div>
        </header>

        <main className="flex flex-1 flex-col gap-4">
          {/* CHAT MESSAGES */}
          <motion.section
            initial={{ opacity: 0, y: -140, rotate: -2.4, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            transition={PANEL_TRANSITION}
            className={`bg-candy-purple-dark/55 relative flex-1 overflow-hidden rounded-3xl border shadow-2xl shadow-black/30 backdrop-blur-md ${modeBorders.panel}`}
          >
            {/* Gradient vignette — purely decorative */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-white/5 via-transparent to-black/25"
            />

            {/* Scrollable message list */}
            <div className="absolute inset-0 overflow-y-auto">
              <div className="flex min-h-full flex-col justify-end gap-3 p-4">
                {allDisplayMessages.length > 0 ? (
                  allDisplayMessages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      avatarImage={
                        message.role === 'system' ? '/globe.svg' : '/window.svg'
                      }
                      text={message.content}
                      isTyping={message.isTyping}
                      bubbleClassName={modeBorders.messageBubble}
                      avatarClassName={modeBorders.messageAvatar}
                    />
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-white/50">
                    Start the chat by sending a message below.
                  </div>
                )}

                {/* Invisible anchor — scrolled into view when new bubbles appear */}
                <div ref={messagesEndRef} aria-hidden="true" />
              </div>
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
              <Input
                disabled={isBusy}
                value={input}
                onChange={handleInputChange}
                type="text"
                placeholder="Type your message..."
                className="h-11 rounded-2xl border-0 bg-transparent text-white shadow-none placeholder:text-white/45 focus-visible:ring-0 dark:bg-transparent"
              />
              <motion.div>
                <Button
                  type="submit"
                  disabled={isBusy}
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
