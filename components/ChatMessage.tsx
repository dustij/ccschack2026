import Image from 'next/image';

import { cn } from '@/lib/utils';

type ChatRole = 'system' | 'user';

interface ChatMessageProps {
  role: ChatRole;
  avatarImage: string;
  text: string;
  /** When true, renders a blinking cursor and (if text is empty) thinking dots. */
  isTyping?: boolean;
  avatarAlt?: string;
  className?: string;
  bubbleClassName?: string;
  avatarClassName?: string;
}

/** Three animated dots shown while the agent hasn't typed its first character yet. */
function ThinkingDots() {
  return (
    <span className="flex items-center gap-[3px] py-0.5" aria-label="Thinking…">
      <span className="thinking-dot size-1.5 rounded-full bg-white/60" />
      <span className="thinking-dot size-1.5 rounded-full bg-white/60" />
      <span className="thinking-dot size-1.5 rounded-full bg-white/60" />
    </span>
  );
}

/** A blinking I-beam cursor appended while the agent is still typing. */
function TypingCursor() {
  return (
    <span
      aria-hidden="true"
      className="ml-[1px] inline-block h-[0.9em] w-[2px] translate-y-[0.05em] rounded-[1px] bg-white/75"
      style={{ animation: 'cursor-blink 0.8s step-end infinite' }}
    />
  );
}

export default function ChatMessage({
  role,
  avatarImage,
  text,
  isTyping = false,
  avatarAlt = 'Chat avatar',
  className,
  bubbleClassName,
  avatarClassName,
}: ChatMessageProps) {
  const isSystem = role === 'system';

  return (
    <div
      className={cn(
        'flex w-full items-end gap-3',
        isSystem ? 'justify-start' : 'justify-end',
        className,
      )}
    >
      <article
        className={cn(
          'relative max-w-[85%] border bg-black/35 px-4 py-3 text-sm leading-relaxed text-white shadow-lg backdrop-blur-sm sm:max-w-xl',
          isSystem
            ? 'order-2 rounded-2xl rounded-bl-none'
            : 'order-1 rounded-2xl rounded-br-none',
          bubbleClassName,
        )}
      >
        <p className="wrap-break-word whitespace-pre-wrap">
          {/* No text yet & still typing → show thinking dots */}
          {isTyping && !text ? (
            <ThinkingDots />
          ) : (
            <>
              {text}
              {isTyping && <TypingCursor />}
            </>
          )}
        </p>
      </article>

      <div
        className={cn(
          'relative size-10 shrink-0 overflow-hidden rounded-full border bg-white/10 shadow-md',
          isSystem ? 'order-1' : 'order-2',
          avatarClassName,
        )}
      >
        <Image
          src={avatarImage}
          alt={avatarAlt}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
