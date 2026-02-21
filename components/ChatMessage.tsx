import Image from 'next/image';

import { cn } from '@/lib/utils';

type ChatRole = 'system' | 'user';

interface ChatMessageProps {
  role: ChatRole;
  avatarImage: string;
  text: string;
  avatarAlt?: string;
  className?: string;
  bubbleClassName?: string;
  bubbleTailClassName?: string;
  avatarClassName?: string;
}

export default function ChatMessage({
  role,
  avatarImage,
  text,
  avatarAlt = 'Chat avatar',
  className,
  bubbleClassName,
  bubbleTailClassName,
  avatarClassName,
}: ChatMessageProps) {
  const isSystem = role === 'system';

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
          isSystem ? 'order-2 rounded-2xl rounded-bl-none' : 'order-1 rounded-2xl rounded-br-none',
          bubbleClassName
        )}
      >
        <p className="wrap-break-word whitespace-pre-wrap">{text}</p>
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
