'use client';

import { KeyboardEvent } from 'react';
import { Theme } from '@/lib/themes';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
  theme: Theme;
}

export default function ChatInput({ value, onChange, onSend, disabled, theme }: Props) {
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  }

  return (
    <div className={`flex items-end gap-3 px-4 py-3 border-t flex-shrink-0 transition-colors duration-200 ${theme.inputArea}`}>
      <textarea
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Message"
        className={`flex-1 resize-none rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:border-transparent disabled:opacity-40 min-h-[42px] max-h-36 overflow-y-auto transition-colors duration-200 ${theme.textarea}`}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={`flex-shrink-0 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${theme.sendBtn}`}
      >
        Send
      </button>
    </div>
  );
}
