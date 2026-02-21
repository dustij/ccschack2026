import { Message } from '@/lib/types';
import { Theme } from '@/lib/themes';

// Static per-agent label colors — consistent regardless of mode or theme variant
const AGENT_LABEL_COLORS: Record<string, string> = {
  'Groq-1': 'text-blue-500',
  'Groq-2': 'text-violet-500',
  'Groq-3': 'text-emerald-500',
  'Groq-4': 'text-amber-500',
  'System': 'text-neutral-400',
};

interface Props {
  message: Message;
  theme: Theme;
}

export default function MessageBubble({ message, theme }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className={`max-w-[72%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed transition-colors duration-200 ${theme.userBubble}`}
        >
          {message.content}
        </div>
      </div>
    );
  }

  const agentName = message.agentName ?? 'Agent';
  const labelColor = AGENT_LABEL_COLORS[agentName] ?? 'text-neutral-400';

  return (
    <div className="flex flex-col items-start">
      <span className={`text-[11px] font-semibold tracking-wide mb-1 ml-1 uppercase ${labelColor}`}>
        {agentName}
      </span>
      <div
        className={`max-w-[72%] rounded-2xl rounded-tl-md px-4 py-2.5 text-sm leading-relaxed transition-colors duration-200 ${theme.agentBubble}`}
      >
        {message.content}
      </div>
    </div>
  );
}
