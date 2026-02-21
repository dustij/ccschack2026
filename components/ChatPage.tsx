'use client';

import { useState } from 'react';
import { ChatMode, Message, ChatRequest, ChatResponse } from '@/lib/types';
import { THEMES } from '@/lib/themes';
import ModeSelector from './ModeSelector';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

// Chars revealed per tick and tick interval.
// 3 chars × 12 ms ≈ 250 chars/sec — fast enough for demo, slow enough to read.
const TYPEWRITER_CHARS = 3;
const TYPEWRITER_TICK_MS = 12;

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.5v1.25M8 13.25V14.5M1.5 8h1.25M13.25 8H14.5M3.403 3.403l.884.884M11.714 11.714l.883.883M12.598 3.403l-.884.884M4.286 11.714l-.883.883"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 10A6 6 0 015 1.5a6.5 6.5 0 100 13A6 6 0 0113.5 10z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Append a message with empty content, then reveal it character by character.
 * Uses functional state updates so stale-closure is never an issue.
 */
function typewriteMessage(
  agentMsg: Message,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): Promise<void> {
  return new Promise((resolve) => {
    // Add the message stub with empty content
    setMessages((prev) => [...prev, { ...agentMsg, content: '' }]);

    const full = agentMsg.content;
    let pos = 0;

    const timer = setInterval(() => {
      pos = Math.min(pos + TYPEWRITER_CHARS, full.length);

      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        // Guard: only update if the tail message belongs to this agent
        if (last && last.agentName === agentMsg.agentName) {
          next[next.length - 1] = { ...last, content: full.slice(0, pos) };
        }
        return next;
      });

      if (pos >= full.length) {
        clearInterval(timer);
        resolve();
      }
    }, TYPEWRITER_TICK_MS);
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<ChatMode>('academic');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const theme = THEMES[mode][isDark ? 'dark' : 'light'];
  const isBusy = isLoading || isAnimating;

  async function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed || isBusy) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const body: ChatRequest = { message: trimmed, mode, history: messages };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data: ChatResponse = await res.json();
      setIsLoading(false);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${data.error}`, agentName: 'System' },
        ]);
        return;
      }

      const agentMessages: Message[] = data.agents.map((a) => ({
        role: 'assistant',
        content: a.text,
        agentName: a.agentName,
      }));

      // Reveal each agent's response sequentially with a typewriter effect
      setIsAnimating(true);
      for (const agentMsg of agentMessages) {
        await typewriteMessage(agentMsg, setMessages);
      }
      setIsAnimating(false);
    } catch {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.', agentName: 'System' },
      ]);
    }
  }

  return (
    <div className={`flex flex-col h-screen transition-colors duration-200 ${theme.page}`}>
      {/* Header */}
      <header
        className={`flex items-center justify-between px-5 h-14 border-b flex-shrink-0 transition-colors duration-200 ${theme.header}`}
      >
        <span className={`text-sm font-semibold tracking-tight transition-colors duration-200 ${theme.titleText}`}>
          MultiAgent
        </span>

        <ModeSelector mode={mode} onChange={setMode} theme={theme} />

        <button
          onClick={() => setIsDark((d) => !d)}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-200 ${theme.toggleBtn}`}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} theme={theme} />

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isBusy}
        theme={theme}
      />
    </div>
  );
}
