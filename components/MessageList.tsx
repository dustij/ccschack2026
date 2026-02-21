'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import { Theme } from '@/lib/themes';
import MessageBubble from './MessageBubble';

interface Props {
  messages: Message[];
  isLoading: boolean;
  theme: Theme;
}

export default function MessageList({ messages, isLoading, theme }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className={`flex-1 overflow-y-auto transition-colors duration-200 ${theme.list}`}>
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-1.5 px-4 text-center">
          <p className={`text-sm font-medium transition-colors duration-200 ${theme.emptyTitle}`}>
            Start a conversation
          </p>
          <p className={`text-xs leading-relaxed max-w-xs transition-colors duration-200 ${theme.emptySub}`}>
            Select a mode and type a message. Multiple AI agents will respond and
            react to each other.
          </p>
        </div>
      ) : (
        <div className="px-4 py-5 space-y-2">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} theme={theme} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 pt-1">
              <div className={`flex gap-1 px-3 py-2.5 rounded-2xl rounded-tl-sm ${theme.loadingBg}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${theme.loadingDot}`} />
                <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${theme.loadingDot}`} />
                <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${theme.loadingDot}`} />
              </div>
            </div>
          )}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
