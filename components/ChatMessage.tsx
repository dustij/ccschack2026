import { AiOutlineOpenAI } from 'react-icons/ai';
import { RiGeminiLine } from 'react-icons/ri';
import { SiOllama } from 'react-icons/si';

import { cn } from '@/lib/utils';
import { Typewriter } from './Typewriter';

type ChatRole = 'system' | 'user';

interface ChatMessageProps {
  role: ChatRole;
  text: string;
  authorName?: string;
  animate?: boolean;
  onAnimationComplete?: () => void;
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
  text,
  authorName,
  animate = false,
  onAnimationComplete,
  className,
  bubbleClassName,
  avatarClassName,
}: ChatMessageProps) {
  const isSystem = role === 'system';

  let accentColorClass = 'text-white/70';
  const nameLower = authorName?.toLowerCase() || '';
  if (nameLower.includes('gpt-5')) accentColorClass = 'text-blue-400';
  else if (nameLower.includes('gemma')) accentColorClass = 'text-yellow-400';
  else if (nameLower.includes('llama')) accentColorClass = 'text-purple-400';

  const AvatarIcon = nameLower.includes('gpt-5')
    ? AiOutlineOpenAI
    : nameLower.includes('gemma')
      ? RiGeminiLine
      : nameLower.includes('llama')
        ? SiOllama
        : AiOutlineOpenAI;

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
          <div className={cn('mb-1 text-xs font-bold', accentColorClass)}>
            {authorName}
          </div>
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
          'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white/10 shadow-md',
          isSystem ? 'order-1' : 'order-2',
          avatarClassName
        )}
      >
        {isSystem ? (
          <AvatarIcon className={cn('size-5', accentColorClass)} />
        ) : (
          <span className="text-xs font-semibold text-white/80">You</span>
        )}
      </div>
    </div>
  );
}
