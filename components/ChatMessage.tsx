import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Typewriter } from './Typewriter';

type ChatRole = 'system' | 'user';

interface ChatMessageProps {
  role: ChatRole;
  avatarImage: string;
  text: string;
  authorName?: string;
  animate?: boolean;
  onAnimationComplete?: () => void;
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
  authorName,
  animate = false,
  onAnimationComplete,
  avatarAlt = 'Chat avatar',
  className,
  bubbleClassName,
  avatarClassName,
}: ChatMessageProps) {
  const isSystem = role === 'system';

  let nameColorClass = 'text-white/70';
  const nameLower = authorName?.toLowerCase() || '';
  if (nameLower.includes('gpt-5')) nameColorClass = 'text-blue-400 font-bold';
  else if (nameLower.includes('gemma'))
    nameColorClass = 'text-yellow-400 font-bold';
  else if (nameLower.includes('llama'))
    nameColorClass = 'text-purple-400 font-bold';

  return (
    <div
      className={cn(
        'flex w-full items-end gap-3',
        isSystem ? 'justify-start' : 'justify-end',
        className
      )}
    >
      <article
        className={cn(
          'relative max-w-[85%] border bg-black/35 px-4 py-3 text-sm leading-relaxed text-white shadow-lg backdrop-blur-sm sm:max-w-xl',
          isSystem
            ? 'order-2 rounded-2xl rounded-bl-none'
            : 'order-1 rounded-2xl rounded-br-none',
          bubbleClassName
        )}
      >
        {authorName && (
          <div className={cn('mb-1 text-xs', nameColorClass)}>{authorName}</div>
        )}
        <p className="wrap-break-word whitespace-pre-wrap">
          {animate ? (
            <Typewriter
              text={text}
              speed={25}
              onComplete={onAnimationComplete}
            />
          ) : (
            text
          )}
        </p>
      </article>

      <div
        className={cn(
          'relative size-10 shrink-0 overflow-hidden rounded-full border bg-white/10 shadow-md',
          isSystem ? 'order-1' : 'order-2',
          avatarClassName
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
